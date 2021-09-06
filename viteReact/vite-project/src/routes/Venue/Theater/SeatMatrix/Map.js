import { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import throttle from 'lodash/throttle';
import { Spin, Tooltip } from 'antd';
import omit from 'omit.js';
import { isMacOS } from '@/utils/utils';
import { blackOrWhite, rgb } from '@/utils/color';
import { formatSeatData } from '@/utils/format';
import Toolbar from './Toolbar';
import styles from './index.less';

const colStyle = {
  width: 20,
  minWidth: 20,
};

let idIndex = 1;

@connect(({ pubticket }) => ({
  pubticket,
}))
class SeatMatrixMap extends Component {
  state = {
    areaSelectionStart: null,
    // 以id为key，选择区域对象为value的map结构
    selectedAreaMap: {},
    // 当前在操作的areakey
    targetAreaKey: null,
    // 当前在移动的area快照，移动变更前的信息
    targetMovingAreaSnapshot: null,
    // 当前在移动的上一个位置
    targetMovingOldPosition: null,
  };

  tdMouseMove = throttle((x, y) => {
    const {
      data: {
        theaterRecord: { seatMatrixWidth, seatMatrixHeight },
      },
    } = this.props;
    const { areaSelectionStart, targetMovingAreaSnapshot, selectedAreaMap, targetMovingOldPosition } = this.state;
    if (areaSelectionStart?.key) {
      const areaSelectionEnd = {
        x,
        y,
      };
      // 组合出四个位置
      const td4 = [
        areaSelectionStart,
        areaSelectionEnd,
        { x: areaSelectionStart.x, y: areaSelectionEnd.y },
        { x: areaSelectionEnd.x, y: areaSelectionStart.y },
      ];
      // 按x排序
      td4.sort((a, b) => {
        return a.x - b.x;
      });
      // 前俩的x肯定一样，y更小的是左上角，后俩的x肯定一样，y更大的是右下角
      const topLeft = td4[0].y <= td4[1].y ? td4[0] : td4[1];
      const bottomRight = td4[2].y <= td4[3].y ? td4[3] : td4[2];
      this.setState({
        selectedAreaMap: {
          ...selectedAreaMap,
          [areaSelectionStart.key]: {
            key: areaSelectionStart.key,
            x: topLeft.x,
            y: topLeft.y,
            rowspan: bottomRight.y - topLeft.y + 1,
            colspan: bottomRight.x - topLeft.x + 1,
          },
        },
      });
      return;
    }
    if (targetMovingAreaSnapshot) {
      // console.log(targetMovingAreaSnapshot);
      const newState = {
        targetMovingOldPosition: { x, y },
      };
      if (targetMovingOldPosition) {
        const old = selectedAreaMap[targetMovingAreaSnapshot.key];
        const { x: oX, y: oY, rowspan: oRows, colspan: oCols } = old;
        const { x: pX, y: pY } = targetMovingOldPosition;
        Object.assign(newState, {
          selectedAreaMap: {
            ...selectedAreaMap,
            [targetMovingAreaSnapshot.key]: {
              ...old,
              x: Math.min(Math.max(0, oX + (x - pX)), seatMatrixWidth - oCols),
              y: Math.min(Math.max(0, oY + (y - pY)), seatMatrixHeight - oRows),
            },
          },
        });
      }
      this.setState(newState);
    }
  }, 200);

  tdMouseDown = (x, y, tdWithSelectedAreaKeys, additionalKey) => {
    if (tdWithSelectedAreaKeys.length > 0 && !additionalKey) {
      this.setState(({ selectedAreaMap }) => ({
        targetMovingAreaSnapshot: selectedAreaMap[tdWithSelectedAreaKeys[tdWithSelectedAreaKeys.length - 1]],
      }));
      return;
    }
    const areaSelectionStart = {
      key: idIndex,
      x,
      y,
      rowspan: 1,
      colspan: 1,
    };
    idIndex += 1;
    this.setState(({ selectedAreaMap }) => ({
      areaSelectionStart,
      targetAreaKey: areaSelectionStart.key,
      selectedAreaMap: {
        ...(additionalKey ? selectedAreaMap : {}),
        [areaSelectionStart.key]: areaSelectionStart,
      },
    }));
  };

  tdMouseUp = (x, y, tdWithSelectedAreaKeys) => {
    const { updateSeats } = this.props;
    this.setState(({ areaSelectionStart, targetAreaKey, targetMovingAreaSnapshot, selectedAreaMap }) => {
      const newState = {
        targetMovingAreaSnapshot: null,
        targetMovingOldPosition: null,
        areaSelectionStart: null,
      };
      if (targetMovingAreaSnapshot) {
        // 已经在移动时处理边界，不在结束移动这里做裁剪了
        //
        // 移动的那个
        // const movingArea = selectedAreaMap[targetMovingAreaSnapshot.key];
        // const { x: mX, y: mY, rowspan: mRows, colspan: mCols } = movingArea;
        // const newArea = {
        //   ...movingArea,
        // };
        // // 左侧需要裁剪, 右侧就一定不需要
        // if (mX < 0) {
        //   // 左
        //   Object.assign(newArea, {
        //     x: 0,
        //     colspan: mCols - Math.abs(mX),
        //   });
        // } else if (mX + mCols > seatMatrixWidth) {
        //   // 右
        //   Object.assign(newArea, {
        //     colspan: seatMatrixWidth - mX,
        //   });
        // }
        // // 上侧需要裁剪, 下侧就一定不需要
        // if (mY < 0) {
        //   // 上
        //   Object.assign(newArea, {
        //     mY: 0,
        //     rowspan: mRows - Math.abs(mY),
        //   });
        // } else if (mY + mRows > seatMatrixHeight) {
        //   // 下
        //   Object.assign(newArea, {
        //     rowspan: seatMatrixHeight - mY,
        //   });
        // }
        // // 回写
        // Object.assign(newState, {
        //   selectedAreaMap: {
        //     ...selectedAreaMap,
        //     [targetMovingAreaSnapshot.key]: newArea,
        //   },
        // });
        if (this.isMovable(targetMovingAreaSnapshot)) {
          const moveSeats = this.findInnerSeats(targetMovingAreaSnapshot);
          // 移动的那个
          const movingArea = selectedAreaMap[targetMovingAreaSnapshot.key];
          if (this.isLandable(movingArea, moveSeats)) {
            const { x: oX, y: oY } = targetMovingAreaSnapshot;
            const { x: mX, y: mY } = movingArea;
            const offsetX = mX - oX;
            const offsetY = mY - oY;
            const seats = moveSeats.map(item => {
              const { seatLeft, seatTop, isNew } = item;
              return {
                ...item,
                seatLeft: seatLeft + offsetX,
                seatTop: seatTop + offsetY,
                isChanged: !isNew,
              };
            });
            updateSeats(seats);
          }
        }
      } else {
        // 非移动
        let newTargetAreakey = targetAreaKey;
        let newSelectedAreaMap = selectedAreaMap;
        // 是remove行为
        if (areaSelectionStart == null && tdWithSelectedAreaKeys.length > 0) {
          // 如果在重叠区，后加入的先去掉
          newSelectedAreaMap = omit(selectedAreaMap, [tdWithSelectedAreaKeys[tdWithSelectedAreaKeys.length - 1]]);
          newTargetAreakey =
            tdWithSelectedAreaKeys.length > 1
              ? tdWithSelectedAreaKeys[tdWithSelectedAreaKeys.length - 2]
              : Object.keys(newSelectedAreaMap).pop();
        }
        Object.assign(newState, {
          selectedAreaMap: newSelectedAreaMap,
          targetAreaKey: newTargetAreakey,
        });
      }
      return newState;
    });
  };

  /**
   * 是否可从某个位置移走
   * 注意：由于目前只支持单个格子站位和跨一列(or一行)两个格子的情侣座，只判断到最多两个位置，否则此方法逻辑需要修改
   * @param {*} area
   * @returns boolean
   */
  isMovable = area => {
    const {
      pubticket: { SeatTypes },
      data: { seats2DArray },
    } = this.props;
    const { x, y, rowspan, colspan } = area;
    // 先判断旧的选中区域位置能不能被整体移动
    // 循环行
    for (let r = 0; r < rowspan; r += 1) {
      const uY = y + r;
      // 循环列
      for (let c = 0; c < colspan; c += 1) {
        const uX = x + c;
        if (c === 0) {
          // 第一列, 往左检查一下是否情侣座的左半部分
          const seat = seats2DArray[uY]?.[uX - 1];
          if (seat) {
            const { seatType, seatRowspan, seatColspan } = seat;
            // 是情侣座, seatColspan 和 seatRowspan 的判断是为了确保是横向的情侣座
            if (seatType === SeatTypes.COUPLE.key && seatColspan === 2 && seatRowspan === 1) {
              // 不可移动
              return false;
            }
          }
        }
        // 不使用esle if，因为可能是第一列也同时是最后一列（纵向单列）
        if (c === colspan - 1) {
          // 最后一列, 往右检查一下是否情侣座的右半部分
          const seat = seats2DArray[uY]?.[uX];
          if (seat) {
            const { seatType, seatRowspan, seatColspan } = seat;
            // 是情侣座, seatColspan 和 seatRowspan 的判断是为了确保是横向的情侣座
            if (seatType === SeatTypes.COUPLE.key && seatColspan === 2 && seatRowspan === 1) {
              // 不可移动
              return false;
            }
          }
        }
        if (r === 0) {
          // 如果是第一行, 这行的每一列往上检查一下是否情侣座的上半部分
          for (let index = 0; index < colspan; index += 1) {
            const seat = seats2DArray[uY - 1]?.[uX];
            if (seat) {
              const { seatType, seatRowspan, seatColspan } = seat;
              // 是情侣座, seatColspan 和 seatRowspan 的判断是为了确保是纵向的情侣座
              if (seatType === SeatTypes.COUPLE.key && seatColspan === 1 && seatRowspan === 2) {
                // 不可移动
                return false;
              }
            }
          }
        }
        // 不使用esle if，因为可能是第一行也同时是最后一行（横向单行）
        if (r === rowspan - 1) {
          // 如果是最后一行, 这行的每一列往下检查一下是否情侣座的下半部分
          for (let index = 0; index < colspan; index += 1) {
            const seat = seats2DArray[uY]?.[uX];
            if (seat) {
              const { seatType, seatRowspan, seatColspan } = seat;
              // 是情侣座, seatColspan 和 seatRowspan 的判断是为了确保是纵向的情侣座
              if (seatType === SeatTypes.COUPLE.key && seatColspan === 1 && seatRowspan === 2) {
                // 不可移动
                return false;
              }
            }
          }
        }
      }
    }
    return true;
  };

  /**
   * 找出某个位置范围内所有的座位
   * @param {*} area
   * @returns seats
   */
  findInnerSeats = area => {
    const {
      data: { seats2DArray },
    } = this.props;
    const array = [];
    const { x, y, rowspan, colspan } = area;
    // 循环行
    for (let r = 0; r < rowspan; r += 1) {
      const uY = y + r;
      // 循环列
      for (let c = 0; c < colspan; c += 1) {
        const uX = x + c;
        const seat = seats2DArray[uY][uX];
        if (seat) {
          array.push(seat);
        }
      }
    }
    return array;
  };

  /**
   * 是否可从某个位置落地
   * 注意：由于目前只支持单个格子站位和跨一列(or一行)两个格子的情侣座，只判断到最多两个位置，否则此方法逻辑需要修改
   * @param {*} area
   * @param {*} seats 旧区域包含的座位(完全包含在区域内的)
   * @returns
   */
  isLandable = (area, seats) => {
    // 新位置包含的座位
    const seatList = this.findInnerSeats(area);
    // 新旧区域可能有一部分重叠，从新区域范围里排除掉旧区域范围里相同的座位，
    const aboriginalSeatList = seatList.filter(item => {
      return !seats.some(seat => {
        // isNew 存的uuid
        if (item.isNew && seat.isNew) {
          return item.isNew === seat.isNew;
        }
        return item.id === seat.id;
      });
    });
    // 剩下的没有了，才可以落地
    return aboriginalSeatList.length === 0;
  };

  tdContextMenu = () => {
    // console.log('右键菜单');
  };

  clearSelectArea = () => {
    this.setState({
      areaSelectionStart: null,
      // 以id为key，选择区域对象为value的map结构
      selectedAreaMap: {},
    });
  };

  resetAnyCaseName = newSeat => {
    if (newSeat == null) {
      return;
    }
    const { floorList, areaList, levelList } = this.props;
    Object.assign(newSeat, {
      rowsName: `${newSeat.rowsNum}排`,
      seatName: `${newSeat.seatValue}座`,
      floorCategoryName: newSeat.floorCategoryId
        ? floorList.find(item => item.id === newSeat.floorCategoryId).categoryName
        : null,
      areaCategoryName: newSeat.areaCategoryId
        ? areaList.find(item => item.id === newSeat.areaCategoryId).categoryName
        : null,
      levelCategoryName: newSeat.levelCategoryId
        ? levelList.find(item => item.id === newSeat.levelCategoryId).categoryName
        : null,
    });
  };

  render() {
    const {
      settingSaving,
      fetching,
      saving,
      data: {
        theaterRecord: { seatMatrixWidth, seatMatrixHeight, screenColspan, screenLeft, screenRowspan, screenTop },
        seats2DArray,
      },
      ready,
      floorList,
      areaList,
      levelList,
      save,
      updateScreenPosition,
      ...resetProps
    } = this.props;
    const { areaSelectionStart, selectedAreaMap, targetMovingAreaSnapshot, targetAreaKey } = this.state;

    const rows = Array.from({ length: seatMatrixHeight }).fill(null);
    const cols = Array.from({ length: seatMatrixWidth }).fill(null);

    const selectedAreaKeys = Object.keys(selectedAreaMap);

    // 正在选择中
    const selectHoldOn = areaSelectionStart != null;

    // 模仿一个seat数据的屏幕位置数据
    const screenLikeASeat = {
      x: screenLeft,
      y: screenTop,
      colspan: screenColspan,
      rowspan: screenRowspan,
    };
    return (
      <Spin spinning={!ready} tip="努力加载中">
        <div className={styles.wrapper}>
          <Toolbar
            width={seatMatrixWidth}
            height={seatMatrixHeight}
            disabled={fetching || !ready}
            loading={settingSaving || saving}
            {...resetProps}
            floorList={floorList}
            areaList={areaList}
            levelList={levelList}
            seats2DArray={seats2DArray}
            selectedAreaMap={selectedAreaMap}
            targetAreaKey={targetMovingAreaSnapshot?.key || targetAreaKey}
            selectHoldOn={selectHoldOn}
            resetAnyCaseName={this.resetAnyCaseName}
            updateScreenPosition={(...args) => {
              this.clearSelectArea();
              updateScreenPosition(...args);
            }}
            save={(...args) => {
              this.clearSelectArea();
              save(...args);
            }}
          />
          <div
            className={classNames(styles.map, {
              [styles.mapMoving]: targetMovingAreaSnapshot != null,
            })}
          >
            <table cellPadding="0" cellSpacing="0">
              <colgroup>
                {cols.map((c, j) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <col key={j} style={colStyle} />
                ))}
              </colgroup>
              <tbody>
                {rows.map((r, rowIdx) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <tr key={rowIdx}>
                    {cols.map((c, colIdx) => {
                      const seat = seats2DArray?.[rowIdx]?.[colIdx];
                      // undefined的是未赋值或者无座位，有值是座位，null是跨行跨列占用的
                      if (seat === null) {
                        return null;
                      }
                      if (
                        colIdx >= screenLikeASeat.x &&
                        colIdx <= screenLikeASeat.x + screenLikeASeat.colspan - 1 &&
                        rowIdx >= screenLikeASeat.y &&
                        rowIdx <= screenLikeASeat.y + screenLikeASeat.rowspan - 1
                      ) {
                        if (colIdx === screenLikeASeat.x && rowIdx === screenLikeASeat.y) {
                          return (
                            <td
                              // eslint-disable-next-line react/no-array-index-key
                              key={colIdx}
                              rowSpan={screenLikeASeat.rowspan || 1}
                              colSpan={screenLikeASeat.colspan || 1}
                              className={styles.screen}
                            />
                          );
                        }
                        // 其他全部跨掉
                        return null;
                      }
                      // 当前td属于哪几个已选区域
                      const tdWithSelectedAreaKeys = [];

                      const clsObj = {};

                      selectedAreaKeys.forEach(key => {
                        const selectedArea = selectedAreaMap[key];

                        const selected =
                          colIdx >= selectedArea.x &&
                          colIdx <= selectedArea.x + selectedArea.colspan - 1 &&
                          rowIdx >= selectedArea.y &&
                          rowIdx <= selectedArea.y + selectedArea.rowspan - 1;

                        const top = selected && rowIdx === selectedArea.y;
                        const right = selected && colIdx === selectedArea.x + selectedArea.colspan - 1;
                        const bottom = selected && rowIdx === selectedArea.y + selectedArea.rowspan - 1;
                        const left = selected && colIdx === selectedArea.x;

                        if (selected) {
                          tdWithSelectedAreaKeys.push(key);
                        }

                        // 下面的上下左右，处理的是选中区域样式

                        // 上方
                        if (top) {
                          clsObj[styles.selectedTop] = true;
                        }
                        // 右方
                        if (right) {
                          clsObj[styles.selectedRight] = true;
                        }
                        // 下方
                        if (bottom) {
                          clsObj[styles.selectedBottom] = true;
                        }
                        // 左方
                        if (left) {
                          clsObj[styles.selectedLeft] = true;
                        }
                      });

                      const isSelectedTd = tdWithSelectedAreaKeys.length > 0;

                      let color;
                      if (seat) {
                        const level = levelList.find(item => item.id === seat.levelCategoryId);
                        color = level?.categoryColor;
                        if (color == null) {
                          const area = areaList.find(item => item.id === seat.areaCategoryId);
                          color = area?.categoryColor;
                          if (color == null) {
                            const floor = floorList.find(item => item.id === seat.floorCategoryId);
                            color = floor?.categoryColor;
                          }
                        }
                      }
                      // 暂时去掉已有座位的边界颜色
                      // else {
                      //   // 表格是按right和bottom显示的边框的，对于有座位和没座位接壤的地方，还需要处理left和top边框
                      //   // TODO: 座位有跨行跨列的，待完善
                      //   const rightSeat = seats2DArray?.[rowIdx]?.[colIdx + 1];
                      //   if (rightSeat && !rightSeat.isDeleted) {
                      //     clsObj[styles.seatRight] = true;
                      //   }
                      //   const bottomSeat = seats2DArray?.[rowIdx + 1]?.[colIdx];
                      //   if (bottomSeat && !bottomSeat.isDeleted) {
                      //     clsObj[styles.seatBottom] = true;
                      //   }
                      // }
                      return (
                        <td
                          key={seat?.id || colIdx}
                          rowSpan={seat?.seatRowspan || 1}
                          colSpan={seat?.seatColspan || 1}
                          className={classNames(clsObj, {
                            [styles.selected]: isSelectedTd,
                            [styles.seat]: seat != null,
                          })}
                          style={
                            color
                              ? {
                                  background: isSelectedTd ? rgb(color, 0.75) : color,
                                  color: blackOrWhite(color),
                                }
                              : null
                          }
                          onContextMenu={e => {
                            if (!ready) {
                              return;
                            }
                            if (!isSelectedTd) {
                              return;
                            }
                            e.preventDefault();
                            this.tdContextMenu();
                          }}
                          onMouseDown={e => {
                            if (!ready) {
                              return;
                            }
                            const btn = e.button;
                            // 非主按键和次按键
                            if (!(btn === 0 || btn === 2)) {
                              return;
                            }
                            this.tdMouseDown(colIdx, rowIdx, tdWithSelectedAreaKeys, isMacOS() ? e.metaKey : e.ctrlKey);
                          }}
                          onMouseMove={() => this.tdMouseMove(colIdx, rowIdx)}
                          onMouseUp={() => this.tdMouseUp(colIdx, rowIdx, tdWithSelectedAreaKeys)}
                        >
                          {seat && (
                            <Tooltip title={formatSeatData(seat)}>
                              <div className={styles.tip}>{seat.seatValue}</div>
                            </Tooltip>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Spin>
    );
  }
}

export default SeatMatrixMap;
