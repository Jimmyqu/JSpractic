import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import uniqWith from 'lodash/uniqWith';
import { Card, message } from 'antd';
import { useHistoryData, useSeatCategory } from '@/utils/hooks';
import Map from './Map';

const mapMin = 50;

// 设置或者清理正确的跨行跨列
function resetSpan(seats2DArray, seat, isClear) {
  if (seats2DArray == null || seat == null) {
    return;
  }
  // undefined 为清理，null为占用
  const value = isClear ? undefined : null;
  const { seatLeft: x, seatTop: y, seatColspan, seatRowspan } = seat;
  if (seatColspan > 1) {
    for (let increment = 1; increment < seatColspan; increment += 1) {
      // eslint-disable-next-line no-param-reassign
      seats2DArray[y][x + increment] = value;
    }
  }
  if (seatRowspan > 1) {
    for (let increment = 1; increment < seatRowspan; increment += 1) {
      if (seats2DArray[y + increment] == null) {
        // eslint-disable-next-line no-param-reassign
        seats2DArray[y + increment] = [];
      }
      // eslint-disable-next-line no-param-reassign
      seats2DArray[y + increment][x] = value;
    }
  }
}

// 放置座位时，设置正确的跨行跨列
function setSpan(seats2DArray, seat) {
  resetSpan(seats2DArray, seat);
}

// 移除座位时，清理跨行跨列
function clearSpan(seats2DArray, seat) {
  resetSpan(seats2DArray, seat, true);
}

// 从 seats2DArray 批量删除座位，产生新的数组
function removeSeats(seats2DArray, seats, removeIds) {
  const newArray = [...seats2DArray];
  // 先干掉
  seats.forEach(seat => {
    newArray.some((row, rowIdx) => {
      const idx = row.findIndex(item => {
        // isNew 存的uuid
        if (item == null) {
          return false;
        }
        if (item.isNew && seat.isNew) {
          return item.isNew === seat.isNew;
        }
        return item.id === seat.id;
      });
      if (idx >= 0) {
        const oldSeat = row[idx];
        const newRows = [...row];
        // undefined的是未赋值或者无座位，有值是座位，null是跨行跨列占用的
        newRows[idx] = undefined;
        if (Array.isArray(removeIds) && !oldSeat.isNew) {
          removeIds.push(oldSeat.id);
        }
        newArray[rowIdx] = newRows;
        clearSpan(newArray, oldSeat);
        return true;
      }
      return false;
    });
  });
  return newArray;
}

export default ({
  salesId,
  data: { id: dataId, screenColspan, screenLeft, screenRowspan, screenTop, seatMatrixHeight, seatMatrixWidth },
}) => {
  const dispatch = useDispatch();
  const settingSaving = useSelector(state => state.loading.effects['venue/updateTheaterMatrixCfg']);
  const seatFetching = useSelector(state => state.loading.effects['pubticket/fetchAllSeats']);
  const saving = useSelector(state => state.loading.effects['pubticket/batchSaveSeats']);
  const [ready, setReady] = useState();
  const [floorList, areaList, levelList, fetching] = useSeatCategory(salesId, dataId);
  const [data, dataIndex, historyLength, historyDispatch] = useHistoryData({
    // 影视厅设置数据
    theaterRecord: {
      screenColspan,
      screenLeft,
      screenRowspan,
      screenTop,
      seatMatrixHeight,
      seatMatrixWidth,
    },
    // 以坐标为基准的所有物理座位的二维数组，先行，行里放列
    seats2DArray: [],
    // 单独记录删除的id，因为一个座位删除后又新增，删除前可能跨行跨列，新增后可能跨或者不垮，往返操作几次特别复杂，不好记录状态，一旦删除就记录进来
    deleteIds: [],
  });

  // 更新影视厅配置，主要是屏幕位置和矩阵大小
  const updateCfg = useCallback(
    async record => {
      if (record == null) {
        return;
      }
      await dispatch({
        type: 'venue/updateTheaterMatrixCfg',
        payload: {
          ...record,
          id: dataId,
        },
      });
      const newTheaterRecord = {
        ...data.theaterRecord,
        ...record,
      };
      historyDispatch({
        type: useHistoryData.INIT,
        payload: {
          ...data,
          theaterRecord: newTheaterRecord,
        },
      });
      return newTheaterRecord;
    },
    [data]
  );
  // 影视厅配置旧数据处理
  useEffect(() => {
    Promise.all([
      dispatch({
        type: 'pubticket/fetchAllSeats',
        payload: {
          salesId,
          dataId,
        },
      }),
      seatMatrixWidth > 0 && seatMatrixHeight > 0
        ? Promise.resolve(data.theaterRecord)
        : updateCfg({
            seatMatrixWidth: mapMin,
            seatMatrixHeight: mapMin,
            // 舞台默认初始化为第一行的一整行，第一行已经在座位处让出来了
            screenLeft: 0,
            screenTop: 0,
            screenColspan: mapMin,
            screenRowspan: 1,
          }),
    ]).then(async ([list, theaterRecord]) => {
      const { seatMatrixWidth: width, seatMatrixHeight: height } = theaterRecord;
      // 二维数组
      const seats2DArray = [];
      if (
        uniqWith(list || [], (a, b) => a.seatLeft === b.seatLeft && a.seatTop === b.seatTop).length <
        (list?.length || 0)
      ) {
        // 需要保存一遍的数据
        const saveList = [];
        // 有重复坐标的，当作首次矩阵式配置，从第一行挨个排列，然后换行
        list.forEach((item, idx) => {
          const x = idx % width;
          const y = Math.floor(idx / width) % height;
          if (seats2DArray[y] == null) {
            seats2DArray[y] = [];
          }
          saveList.push({
            id: item.id,
            seatLeft: x,
            seatTop: y + 1, // 加1，第一行留给舞台
            // 数据库有默认值
            // seatRowspan: 1,
            // seatColspan: 1,
          });
          seats2DArray[y][x] = {
            ...item,
            seatLeft: x,
            seatTop: y + 1, // 加1，第一行留给舞台
            seatRowspan: 1,
            seatColspan: 1,
          };
        });
        await dispatch({
          type: 'pubticket/batchSaveSeats',
          payload: {
            dataId,
            salesId,
            // addList: [],
            // delList: [],
            // 只修改
            updateList: saveList,
          },
        });
      } else {
        for (let y = 0; y < height; y += 1) {
          if (seats2DArray[y] == null) {
            seats2DArray[y] = [];
          }
          for (let x = 0; x < width; x += 1) {
            // undefined的是未赋值或者无座位，有值是座位，null是跨行跨列占用的
            if (seats2DArray[y][x] === undefined) {
              const seat = list?.find(item => item.seatTop === y && item.seatLeft === x);
              if (seat) {
                seats2DArray[y][x] = seat;
                setSpan(seats2DArray, seat);
              }
            }
          }
        }
      }
      historyDispatch({
        type: useHistoryData.INIT,
        payload: {
          ...data,
          seats2DArray,
          // 补充theaterRecord解决这个effect由于不监听data(只调用一次)造成的，前面修正了初始宽高又被重置回去的问题
          theaterRecord: {
            ...theaterRecord,
            seatMatrixWidth: width,
            seatMatrixHeight: height,
          },
        },
      });
      setReady(true);
    });
  }, []);

  return (
    <Card bordered={false}>
      <Map
        min={mapMin}
        ready={ready}
        settingSaving={settingSaving}
        fetching={seatFetching || fetching}
        saving={saving}
        mapMin={mapMin}
        data={data}
        floorList={floorList}
        areaList={areaList}
        levelList={levelList}
        // 修改矩阵大小
        setMatrixSize={(w, h) => {
          historyDispatch({
            type: useHistoryData.PUSH,
            payload: {
              ...data,
              theaterRecord: {
                ...data.theaterRecord,
                seatMatrixWidth: Math.max(mapMin, w || 0),
                seatMatrixHeight: Math.max(mapMin, h || 0),
              },
            },
          });
        }}
        // 可后退
        canBack={dataIndex > 0}
        // 可前进
        canForward={dataIndex < historyLength - 1}
        // 撤销一个操作
        goBack={() => {
          historyDispatch({
            type: useHistoryData.BACK,
          });
        }}
        // 前进一个操作
        goForward={() => {
          historyDispatch({
            type: useHistoryData.FORWARD,
          });
        }}
        // 重置到最后一次服务端保存
        reset={() => {
          historyDispatch({
            type: useHistoryData.RESET,
          });
        }}
        // 删除座位
        deleteSeats={seats => {
          const removeIds = [];
          const newArray = removeSeats(data.seats2DArray, seats, removeIds);
          historyDispatch({
            type: useHistoryData.PUSH,
            payload: {
              ...data,
              seats2DArray: newArray,
              deleteIds: [...data.deleteIds, ...removeIds],
            },
          });
        }}
        // 更新屏幕位置
        updateScreenPosition={record => {
          // 上层逻辑来保证不冲突, 这里只负责刷新到数据
          // 屏幕位置设置为只能一个区域
          historyDispatch({
            type: useHistoryData.PUSH,
            payload: {
              ...data,
              theaterRecord: {
                ...data.theaterRecord,
                ...record,
              },
            },
          });
        }}
        // 批量条件新座位
        addNewSeats={seats => {
          // 上层逻辑来保证不冲突, 这里只负责刷新到数据
          // const newArray = [...data.seats2DArray];
          // 由于setSpan会操作其他行的数据，所以光对需要添加的行做复制不能保证不会错误的修改到历史记录，这里需要深拷贝
          // data.seats2DArray是纯数据对象，可以安全的使用JSON转化方法来深拷贝
          const newArray = JSON.parse(JSON.stringify(data.seats2DArray));
          seats.forEach(seat => {
            const newRow = [...(newArray[seat.seatTop] || [])];
            newRow[seat.seatLeft] = seat;
            newArray[seat.seatTop] = newRow;
            setSpan(newArray, seat);
          });
          historyDispatch({
            type: useHistoryData.PUSH,
            payload: {
              ...data,
              seats2DArray: newArray,
            },
          });
        }}
        // 更新座位
        updateSeats={seats => {
          // 上层逻辑来保证不冲突, 这里只负责刷新到数据
          // 为了支持单独和批量更新位置以及新的跨行跨列，这里先采用移除旧的
          // const newArray = removeSeats(data.seats2DArray, seats);
          // 由于setSpan会操作其他行的数据，所以光对需要添加的行做复制不能保证不会错误的修改到历史记录，这里需要深拷贝
          // removeSeats(data.seats2DArray, seats)返回的是纯数据对象，可以安全的使用JSON转化方法来深拷贝
          const newArray = JSON.parse(JSON.stringify(removeSeats(data.seats2DArray, seats)));
          // 再补充新的的方式
          seats.forEach(seat => {
            const newRow = [...(newArray[seat.seatTop] || [])];
            newRow[seat.seatLeft] = seat;
            newArray[seat.seatTop] = newRow;
            setSpan(newArray, seat);
          });
          historyDispatch({
            type: useHistoryData.PUSH,
            payload: {
              ...data,
              seats2DArray: newArray,
            },
          });
        }}
        // 同步多个操作到服务端
        save={async () => {
          const addList = [];
          const updateList = [];
          data.seats2DArray.forEach(cols => {
            cols.forEach(seat => {
              if (seat == null) {
                return;
              }
              const {
                seatTop,
                seatLeft,
                seatColspan,
                seatRowspan,
                rowsNum,
                seatValue,
                seatType,
                seatProperty,
                seatDesc,
                descr,
                ranks,
                areaCategoryId,
                floorCategoryId,
                levelCategoryId,
                rowsName,
                seatName,
                id,
                isNew,
                isChanged,
              } = seat;
              if (isNew || isChanged) {
                // 只保存和修改这些字段
                const s = {
                  seatTop,
                  seatLeft,
                  seatColspan,
                  seatRowspan,
                  rowsNum,
                  seatValue,
                  seatType,
                  seatProperty,
                  seatDesc,
                  descr,
                  ranks,
                  areaCategoryId,
                  floorCategoryId,
                  levelCategoryId,
                  // 楼层、区域、等级的name后台负责根据id同步
                  // 排名和座名需要提交
                  rowsName,
                  seatName,
                };
                if (isNew) {
                  // 补字段
                  Object.assign(s, {
                    // isNew 存的uuid, 把它提交给后台，关联返回的数据库id更新到界面
                    id: isNew,
                  });
                  addList.push(s);
                  return;
                }
                if (isChanged) {
                  // 补字段
                  s.id = id;
                  updateList.push(s);
                }
              }
            });
          });
          // 顺序执行
          const map = await dispatch({
            type: 'pubticket/batchSaveSeats',
            payload: {
              dataId,
              salesId,
              addList,
              delList: data.deleteIds,
              updateList,
            },
          });
          // 顺序执行
          await dispatch({
            type: 'venue/updateTheaterMatrixCfg',
            payload: {
              ...data.theaterRecord,
              id: dataId,
            },
          });
          let { seats2DArray } = data;
          // seats2DArray 此时已经是新的，
          // 保存成功后抹掉操作痕迹，isNew, isChanged, 更新ID
          if (addList.length > 0 || updateList.length > 0) {
            seats2DArray = [...seats2DArray];
            addList.forEach(seat => {
              const st = seats2DArray[seat.seatTop][seat.seatLeft];
              // isNew 存的uuid
              if (st && st.isNew && st.isNew === seat.id) {
                const dbId = map[seat.id];
                if (dbId) {
                  seats2DArray[seat.seatTop][seat.seatLeft].id = dbId;
                  delete seats2DArray[seat.seatTop][seat.seatLeft].isNew;
                  delete seats2DArray[seat.seatTop][seat.seatLeft].isChanged;
                  return;
                }
              }
              message.warn('数据保存成功，但数据ID更新失败');
            });
            updateList.forEach(seat => {
              const st = seats2DArray[seat.seatTop][seat.seatLeft];
              if (st && st.isChanged && st.id === seat.id) {
                delete seats2DArray[seat.seatTop][seat.seatLeft].isChanged;
                return;
              }
              message.warn('数据保存成功，但数据更新失败');
            });
          }
          historyDispatch({
            type: useHistoryData.INIT,
            payload: {
              ...data,
              seats2DArray,
              deleteIds: [],
            },
          });
          message.success('保存成功');
        }}
      />
    </Card>
  );
};
