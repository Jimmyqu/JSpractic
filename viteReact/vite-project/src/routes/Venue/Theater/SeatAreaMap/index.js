import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import omit from 'omit.js';
import { Button, Card, Col, Form, message, Row } from 'antd';
import MarginBar from '@/components/MarginBar';
import { useHistoryData, useSeatCategory } from '@/utils/hooks';
import { uuid } from '@/utils/utils';
import { modal } from '@/utils/feedback';
import AreaMap from './AreaMap';
import AttrForm from './AttrForm';

/**
 * 对服务端的数据用在浏览器之前做字段整理
 * @param {*} polygon
 */
function toClient(polygon) {
  if (polygon == null) {
    return null;
  }
  return {
    ...polygon,
    areaExtSettings: JSON.parse(polygon.areaExtSettings),
  };
}

/**
 * 对提交到服务端的数据做字段整理
 * @param {*} polygon
 */
function toServer(polygon) {
  if (polygon == null) {
    return null;
  }
  return {
    ...omit(polygon, ['isNew', 'isChanged', 'isDeleted', 'selected']),
    areaExtSettings: JSON.stringify(polygon.areaExtSettings),
    // areaExtSettings: JSON.stringify({
    //   dots: [
    //     { x: 100, y: 40 },
    //     { x: 220, y: 40 },
    //     { x: 220, y: 90 },
    //     { x: 100, y: 90 },
    //     { x: 100, y: 40 },
    //   ],
    // }),
  };
}

/**
 * 是完全闭合的polygon
 * @param {*} dots
 */
function isEnClosed(polygon) {
  // 目前闭合多边形采用的是把第一个dot实例在列表最后再放一次的方式
  const dots = polygon?.areaExtSettings?.dots;
  return (
    dots?.length > 2 &&
    (dots[0] === dots[dots.length - 1] ||
      (dots[0].x === dots[dots.length - 1].x && dots[0].y === dots[dots.length - 1].y))
  );
}

/**
 * 判断a、b组成的线段与c、d组成的线段是否相交，如果有返回这个点
 * @param {*} a
 * @param {*} b
 * @param {*} c
 * @param {*} d
 */
function getIntersectionDot(a, b, c, d) {
  // 三角形abc 面积的2倍
  const areaAbc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);

  // 三角形abd 面积的2倍
  const areaAbd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x);

  // 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理);
  if (areaAbc * areaAbd >= 0) {
    return false;
  }

  // 三角形cda 面积的2倍
  const areaCda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x);
  // 三角形cdb 面积的2倍

  const areaCdb = areaCda + areaAbc - areaAbd;
  if (areaCda * areaCdb >= 0) {
    return false;
  }

  // 计算交点坐标
  const t = areaCda / (areaAbd - areaAbc);
  const dx = t * (b.x - a.x);
  const dy = t * (b.y - a.y);
  return { x: a.x + dx, y: a.y + dy };
}

/**
 * 判断dot与prevDot组成的线段与dots(非闭合)里逐个点组成的所有线段是否有相交，如果有返回这个点
 * @param {*} dot
 * @param {*} prevDot
 * @param {*} dots
 */
function getSelfCrossIntersectionDot(dot, prevDot, dots) {
  // 不判断闭合线即第1个点和最后一个点组成的线，因为不是闭合多边形
  for (let i = 0; i < dots.length - 1; i += 1) {
    const idot = getIntersectionDot(dot, prevDot, dots[i], dots[i + 1]);
    if (idot) {
      return {
        index: i + 1,
        dot: idot,
      };
    }
  }
  return false;
}

/**
 * 判断一个点是否在一个已闭合区间内
 * @param {*} dot
 * @param {*} polygon
 */
function isInEnClosed(dot, polygon) {
  if (polygon.isDeleted || !isEnClosed(polygon)) {
    return false;
  }
  // 射线法判断，不支持交叉重叠排除重叠区域后计算面积的多边形
  const dots = [...polygon.areaExtSettings.dots]; // new array
  // 闭合的多边形冗余了一个点，它和第一个点的数据相同
  dots.pop();
  let flag = false;

  for (let i = 0, l = dots.length, j = l - 1; i < l; j = i, i += 1) {
    const sx = dots[i].x;
    const sy = dots[i].y;
    const tx = dots[j].x;
    const ty = dots[j].y;

    // 点与多边形顶点重合
    if ((sx === dot.x && sy === dot.y) || (tx === dot.x && ty === dot.y)) {
      return true;
    }

    // 判断线段两端点是否在射线两侧
    if ((sy < dot.y && ty >= dot.y) || (sy >= dot.y && ty < dot.y)) {
      // 线段上与射线 Y 坐标相同的点的 X 坐标
      const x = sx + ((dot.y - sy) * (tx - sx)) / (ty - sy);

      // 点在多边形的边上
      if (x === dot.x) {
        return true;
      }

      // 射线穿过多边形的边界
      if (x > dot.x) {
        flag = !flag;
      }
    }
  }

  // 射线穿过多边形边界的次数为奇数时点在多边形内
  return flag;
}

function SeatAreaMap({ form, salesId, dataId }, { isMobile }) {
  const dispatch = useDispatch();

  const [floorList, areaList, levelList, fetching] = useSeatCategory(salesId, dataId);
  const [file, setFile] = useState();
  const [allPolygons, setAllPolygons] = useState();
  const [editAreaData, dataIndex, historyLength, historyDispatch] = useHistoryData();
  const [editFormData, setEditFormData] = useState();
  const dataFetching = useSelector(state => state.loading.effects['pubticket/fetchAreaData']);
  const imgFileUploading = useSelector(
    state => state.loading.effects['global/uploadImgFile'] || state.loading.effects['pubticket/updateSeatAreaImg']
  );
  const dataSaving = useSelector(state => state.loading.effects['pubticket/updateSeatAreaData']);

  const fetchData = useCallback(platformId => {
    dispatch({
      type: 'pubticket/fetchAreaData',
      payload: {
        platformId,
      },
    }).then(data => {
      const { fileItem, seatAreaDataListList } = data || {};
      setFile(fileItem);
      setAllPolygons((seatAreaDataListList || []).map(toClient));
    });
  }, []);

  useEffect(() => {
    fetchData(dataId);
  }, [dataId]);

  useEffect(() => {
    // 按条件过滤的，应该只有一个（同一个条件下不相接的多个区域存到内部字段数组的，所以不会多个）
    historyDispatch({
      type: useHistoryData.INIT,
      payload: editFormData
        ? {
            polygons: allPolygons.filter(
              ({ floorCategoryId, areaCategoryId, levelCategoryId }) =>
                floorCategoryId === editFormData.floorCategoryId &&
                areaCategoryId === editFormData.areaCategoryId &&
                levelCategoryId === editFormData.levelCategoryId
            ),
          }
        : null,
    });
  }, [file, editFormData]);

  // 退出编辑
  const exitEditing = useCallback(() => {
    setEditFormData();
    // 退出后或者重新编辑时 会 useHistoryData.INIT, 默认editPolygonId没有值，所以不清理也没关系
  }, []);

  // 判断一个点是否尝试落入一个已封闭的区域内, 如果是，返回这个polygon
  const findPolygonIfDotHasIntoEnClosed = useCallback(
    dot => {
      const enClosedList = [...(editAreaData.polygons || [])]; // new array
      // editAreaData.polygons 里可能有正在编辑的、来自allPolygons的数据
      allPolygons.forEach(p => {
        if (enClosedList.some(ep => ep.id === p.id)) {
          return;
        }
        enClosedList.push(p);
      });
      return enClosedList.find(polygon => isInEnClosed(dot, polygon));
    },
    [allPolygons, editAreaData]
  );

  // 一个点落下后与它上一个点组成的线段是否与已闭合的多边形的某个线段相交了
  const hasCrossEnClosed = useCallback(
    // ignorePolygonIds表示忽略判断哪些id的polygon
    (dot, prevDot, ignorePolygonIds = []) => {
      const enClosedList = [...(editAreaData.polygons || []).filter(isEnClosed)]; // new array
      // editAreaData.polygons 里可能有正在编辑的、来自allPolygons的数据
      allPolygons.forEach(p => {
        if (!isEnClosed(p)) {
          return;
        }
        if (enClosedList.some(ep => ep.id === p.id)) {
          return;
        }
        enClosedList.push(p);
      });

      return enClosedList.some(polygon => {
        if (polygon.isDeleted || ignorePolygonIds.includes(polygon.id)) {
          return false;
        }
        // 不支持交叉重叠排除重叠区域后计算面积的多边形
        const dots = [...polygon.areaExtSettings.dots]; // new array
        // 闭合的多边形冗余了一个点，它和第一个点的数据相同
        dots.pop();
        for (let i = 0, l = dots.length, j = l - 1; i < l; j = i, i += 1) {
          const idot = getIntersectionDot(dot, prevDot, dots[i], dots[j]);
          if (idot) {
            return true;
          }
        }
        return false;
      });
    },
    [allPolygons, editAreaData]
  );

  // 判断一个闭合多边形内部是否包含了有点
  const hasInnerPolygon = useCallback(
    polygon => {
      // 首先它必须是闭合的
      if (isEnClosed(polygon)) {
        const all = [...(editAreaData.polygons || []).filter(p => !p.isDeleted && p.id !== polygon.id)]; // new array
        // editAreaData.polygons 里可能有正在编辑的、来自allPolygons的数据
        allPolygons.forEach(p => {
          if (all.some(ep => ep.id === p.id)) {
            return;
          }
          all.push(p);
        });

        return all.some(p => {
          return p.areaExtSettings.dots.some(d => isInEnClosed(d, polygon));
        });
      }
      return false;
    },
    [allPolygons, editAreaData]
  );

  // 点击添加一个点
  const addDot = useCallback(
    dot => {
      let { editPolygonId } = editAreaData;
      const { polygons } = editAreaData;
      const oldPolygons = polygons || [];
      const polygonIndex = editPolygonId ? oldPolygons.findIndex(item => item.id === editPolygonId) : -1;
      const enClosedPolygon = findPolygonIfDotHasIntoEnClosed(dot);
      if (enClosedPolygon) {
        // 是本次数据条件类型下的多边形
        const foundIdx = oldPolygons.findIndex(item => item.id === enClosedPolygon.id);
        // 如果不是，啥也不能干
        if (foundIdx < 0) {
          return;
        }
        // 如果是，处理为selected
        historyDispatch({
          type: useHistoryData.PUSH,
          payload: {
            ...editAreaData,
            polygons: oldPolygons.map((p, i) => {
              return {
                ...p,
                // 切换选择
                selected: i === foundIdx ? !oldPolygons[foundIdx].selected : false,
              };
            }),
          },
        });
        return;
      }
      const newPolygons = oldPolygons.map(p => {
        return {
          ...p,
          // 切换选择
          selected: false,
        };
      });
      let newDotsInThisPolygon;
      if (polygonIndex < 0) {
        newDotsInThisPolygon = [dot];
        const newPolygon = {
          ...editFormData,
          platformId: dataId,
          isNew: true,
          id: uuid(),
          areaExtSettings: {
            dots: newDotsInThisPolygon,
          },
        };
        newPolygons.push(newPolygon);
        editPolygonId = newPolygon.id;
      } else {
        const { areaExtSettings, isNew } = newPolygons[polygonIndex];
        const oldDots = areaExtSettings?.dots;
        if (hasCrossEnClosed(dot, oldDots[oldDots.length - 1])) {
          message.warn('不能与已有区域重叠');
          return;
        }
        const crossToEnClosedDot = getSelfCrossIntersectionDot(dot, oldDots[oldDots.length - 1], oldDots);

        // 与当前多边形已有的某条线交叉了的话，以交叉点作为闭合点(以相同数据点作为闭合形式)
        if (crossToEnClosedDot) {
          const { dot: d, index } = crossToEnClosedDot;
          newDotsInThisPolygon = [d, ...oldDots.slice(index), d];
        } else {
          newDotsInThisPolygon = [...oldDots, dot];
        }

        newPolygons[polygonIndex] = {
          ...newPolygons[polygonIndex],
          isChanged: !isNew,
          areaExtSettings: {
            ...areaExtSettings,
            dots: newDotsInThisPolygon,
          },
        };
        // 闭合
        if (isEnClosed(newPolygons[polygonIndex])) {
          // 如果闭合后内部包含了有点，则不允许闭合，这里不用判断被别人包含，是因为前面已经处理了，已闭合的点不进去
          if (hasInnerPolygon(newPolygons[polygonIndex])) {
            message.warn('不能与已有区域重叠');
            return;
          }
          editPolygonId = null;
        }
      }
      historyDispatch({
        type: useHistoryData.PUSH,
        payload: {
          ...editAreaData,
          editPolygonId,
          polygons: newPolygons,
        },
      });
    },
    [editAreaData, findPolygonIfDotHasIntoEnClosed, hasCrossEnClosed, hasInnerPolygon]
  );

  // 拖拽一个点，松手后更新位置
  const moveDot = useCallback(
    (movingDot, cursorX, cursorY) => {
      const { x, y, polygonId, prevDot, nextDot } = movingDot;
      const newDot = {
        x: cursorX,
        y: cursorY,
      };
      const enClosedPolygon = findPolygonIfDotHasIntoEnClosed(newDot);
      // 如果新位置在已闭合的多边形(不含当前移动dot的这个多边形)内，则不允许
      if (enClosedPolygon && enClosedPolygon.id !== polygonId) {
        return;
      }
      // 新的位置的点与它相邻两个点组成的两条线段是否与已闭合的多边形的某个线段相交了
      const ignoreIds = [polygonId];
      // 这里忽略掉自己正在拖拽的这个多边形，因为往外扩时实际不相交，应该是允许的情况
      if (hasCrossEnClosed(prevDot, newDot, ignoreIds) || hasCrossEnClosed(newDot, nextDot, ignoreIds)) {
        return;
      }
      // 然后单独判断自己正在拖拽的这个多边形
      const polygonIndex = editAreaData.polygons.findIndex(item => item.id === polygonId);
      const polygon = editAreaData.polygons[polygonIndex]; // 一定不会为null
      const { isNew, areaExtSettings } = polygon;
      const dots = [...areaExtSettings.dots];
      // 删掉最后一个冗余，因为它是闭合的才能触发拖拽
      dots.splice(-1, 1);
      // 找到原来的点
      const idx = dots.findIndex(d => d.x === x && d.y === y);
      // 去掉这个点，断开形成的未封闭多边形(就是多个点组成的多条线)，重新放置顺序，使其符合这条线的顺序
      const unClosedDots = [...dots.slice(0, idx).reverse(), ...dots.slice(idx + 1).reverse()];
      if (
        getSelfCrossIntersectionDot(newDot, prevDot, unClosedDots) ||
        getSelfCrossIntersectionDot(nextDot, newDot, unClosedDots)
      ) {
        // 有相交
        return;
      }
      // 可以更新
      // 把新点替换旧的点
      dots.splice(idx, 1, newDot);

      // 新顺序加一个冗余点，恢复闭合，原来每个顺序的值是什么已经不重要了
      dots.push(dots[0]);

      const newPolygons = [...editAreaData.polygons];
      newPolygons[polygonIndex] = {
        ...polygon,
        isChanged: !isNew,
        areaExtSettings: {
          ...areaExtSettings,
          dots,
        },
      };
      historyDispatch({
        type: useHistoryData.PUSH,
        payload: {
          ...editAreaData,
          polygons: newPolygons,
        },
      });
    },
    [findPolygonIfDotHasIntoEnClosed, hasCrossEnClosed]
  );

  // 已封闭多边形删除一个点，前面已经判断了是闭合的并且删除后至少还剩余3个实际的点，能形成平面的点的数量
  const removeDot = useCallback(
    (dot, polygonId) => {
      // 已经闭合, 处理成删除，仍然保持闭合
      const polygonIndex = editAreaData.polygons.findIndex(item => item.id === polygonId);
      const polygon = editAreaData.polygons[polygonIndex]; // 一定不会为null
      const { isNew, areaExtSettings } = polygon;
      const dots = [...areaExtSettings.dots];
      const dotIndex = dots.findIndex(d => d.x === dot.x && d.y === dot.y);
      // 这个即将删除的点的前置点
      const prevDot =
        // 如果删除的点是第一个或者最后一个冗余点(其实冗余点点不会被渲染，这种情况应该不会出现), 则前置点应该是倒数第二个，否则是上一个
        dotIndex === 0 || dotIndex === dots.length - 1 ? dots[dots.length - 2] : dots[dotIndex - 1];
      // 这个即将删除的点的后置点
      const nextDot =
        // 如果删除的点是第一个或者最后一个冗余点(其实冗余点点不会被渲染，这种情况应该不会出现), 则后置点应该是第二个，否则是下一个
        dotIndex === 0 || dotIndex === dots.length - 1 ? dots[1] : dots[dotIndex + 1];
      // 去掉一个点后产生的新线段是否与已闭合的多边形的某个线段相交了
      // 这里忽略掉自己正在拖拽的这个多边形，因为往外扩时实际不相交，应该是允许的情况
      if (hasCrossEnClosed(prevDot, nextDot, [polygonId])) {
        message.warn('不可删除，新区域与已有区域重叠');
        return;
      }
      // 然后单独判断自己正在删除的这个多边形
      // 删掉最后一个冗余，因为它是闭合的才能删除
      dots.splice(-1, 1);
      // 去掉这个点，断开形成的未封闭多边形(就是多个点组成的多条线)，重新放置顺序，使其符合这条线的顺序
      const unClosedDots = [...dots.slice(0, dotIndex).reverse(), ...dots.slice(dotIndex + 1).reverse()];
      if (getSelfCrossIntersectionDot(prevDot, nextDot, unClosedDots)) {
        message.warn('不可删除，当前区域重叠');
        return;
      }
      // 可以删除
      const newDots = [...areaExtSettings.dots];
      newDots.splice(dotIndex, 1);
      // 目前闭合多边形采用的是把第一个dot实例在列表最后再放一次的方式
      // 如果删掉的是第一个
      const [newFirst] = newDots;
      if (dotIndex === 0) {
        // 原来的第二个现在是第一个
        newDots[newDots.length - 1] = newFirst;
      }
      // 如果删掉的是最后一个
      else if (dotIndex === newDots.length) {
        // newDots此时的长度变小一个，不减1
        // 也当删除第一个处理，再丢弃第一个
        newDots.splice(0, 1);
        // 最后补一个来闭合
        newDots.push(newFirst);
      }
      const newPolygons = [...editAreaData.polygons];
      newPolygons[polygonIndex] = {
        ...newPolygons[polygonIndex],
        isChanged: !isNew,
        areaExtSettings: {
          ...areaExtSettings,
          dots: newDots,
        },
      };
      historyDispatch({
        type: useHistoryData.PUSH,
        payload: {
          ...editAreaData,
          polygons: newPolygons,
        },
      });
    },
    [editAreaData]
  );

  const editing = editAreaData != null;

  return (
    <Card bordered={false}>
      <Row gutter={10}>
        <Col md={isMobile ? 10 : 17}>
          {/* AreaMap里面有Card */}
          <AreaMap
            dataId={dataId}
            file={file}
            editAreaData={editAreaData}
            allPolygons={allPolygons}
            loading={dataFetching}
            dataSaving={dataSaving}
            imgFileUploading={imgFileUploading}
            canBack={dataIndex > 0}
            goBack={() => {
              historyDispatch({
                type: useHistoryData.BACK,
              });
            }}
            canForward={dataIndex < historyLength - 1}
            goForward={() => {
              historyDispatch({
                type: useHistoryData.FORWARD,
              });
            }}
            updateFile={fileItem => {
              setFile(fileItem);
              form.setFieldsValue({
                floorCategoryId: 0,
                areaCategoryId: 0,
                levelCategoryId: 0,
              });
              setAllPolygons([]);
            }}
            isInEnClosed={isInEnClosed}
            isEnClosed={isEnClosed}
            addDot={addDot}
            moveDot={moveDot}
            insertDot={(dot, polygonId, insertIndex) => {
              const newPolygons = [...editAreaData.polygons];
              // polygonIndex一定找得到
              const polygonIndex = newPolygons.findIndex(item => item.id === polygonId);
              const { areaExtSettings, isNew } = newPolygons[polygonIndex];
              const newDots = [...areaExtSettings.dots];
              // 最后一个冗余的点与第一个点之间没有实际连线，dot最后一个冗余的点没渲染
              // 新点一定在线段上，一定合法，不需要判断直接插入
              // 插入新点
              newDots.splice(insertIndex + 1, 0, dot);
              newPolygons[polygonIndex] = {
                ...newPolygons[polygonIndex],
                isChanged: !isNew,
                areaExtSettings: {
                  ...areaExtSettings,
                  dots: newDots,
                },
              };
              historyDispatch({
                type: useHistoryData.PUSH,
                payload: {
                  ...editAreaData,
                  polygons: newPolygons,
                },
              });
            }}
            removeDot={removeDot}
            removePolygon={removeIdx => {
              const newPolygons = [...editAreaData.polygons];
              if (newPolygons[removeIdx].isNew) {
                newPolygons.splice(removeIdx, 1);
              } else {
                newPolygons[removeIdx].isDeleted = true;
              }
              historyDispatch({
                type: useHistoryData.PUSH,
                payload: {
                  ...editAreaData,
                  polygons: newPolygons,
                },
              });
            }}
          />
        </Col>
        <Col md={7}>
          <Card bordered={false} title="平面图对应区域" loading={fetching}>
            <AttrForm
              floorList={floorList}
              areaList={areaList}
              levelList={levelList}
              imgFileUploading={imgFileUploading}
              editing={editing}
              form={form}
              disabled={file == null}
            />
            <Row>
              <Col md={18} offset={6}>
                {editing ? (
                  <>
                    <Button
                      disabled={dataSaving}
                      onClick={() => {
                        if (
                          editAreaData.polygons
                            // 丢弃只有一个新dot的polygon
                            ?.filter(polygon => !(polygon.isNew && polygon.areaExtSettings?.dots.length === 1))
                            .some(polygon => polygon.isNew || polygon.isChanged || polygon.isDeleted)
                        ) {
                          modal.confirm('你有未保存的修改，确认丢弃吗？', {
                            onOk: () => {
                              exitEditing();
                            },
                          });
                          return;
                        }
                        exitEditing();
                      }}
                    >
                      取消
                    </Button>
                    <MarginBar inline left>
                      <Button
                        type="primary"
                        loading={dataSaving}
                        onClick={async () => {
                          const addList = [];
                          const delList = [];
                          const updateList = [];
                          for (let idx = 0; idx < editAreaData.polygons?.length || 0; idx += 1) {
                            const polygon = editAreaData.polygons[idx];
                            if (polygon.isDeleted) {
                              delList.push(polygon.id);
                            }
                            if (!isEnClosed(polygon)) {
                              message.warn('有未闭合的区域，请继续完善');
                              return;
                            }
                            if (polygon.isNew && polygon.areaExtSettings?.dots.length > 1) {
                              // 丢弃只有一个新dot的polygon
                              addList.push(toServer(omit(polygon, ['id']))); // 提交时移除id,避免服务端误会
                            } else if (polygon.isChanged) {
                              updateList.push(toServer(polygon));
                            }
                          }
                          if (addList.length > 0 || delList.length > 0 || updateList.length > 0) {
                            await dispatch({
                              type: 'pubticket/updateSeatAreaData',
                              payload: {
                                addList,
                                delList,
                                updateList,
                              },
                            });
                          }
                          // 退出编辑
                          exitEditing();
                          // 重新查询
                          fetchData(dataId);
                        }}
                      >
                        保存
                      </Button>
                    </MarginBar>
                  </>
                ) : (
                  <MarginBar inline left>
                    <Button
                      type="primary"
                      disabled={file == null}
                      onClick={() => setEditFormData(form.getFieldsValue())}
                    >
                      编辑
                    </Button>
                  </MarginBar>
                )}
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Card>
  );
}

SeatAreaMap.contextTypes = {
  isMobile: PropTypes.bool,
};

export default Form.create()(SeatAreaMap);
