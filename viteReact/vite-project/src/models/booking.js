import omit from 'omit.js';
import { message } from 'antd';
import {
  querySportPlatformInfo,
  querySportOrder,
  updateTicketNumber,
  lockeSomePlatform,
  changeLockeSomePlatform,
  queryPlatformTicketVisitors,
  querySportPlatformVisitors,
  queryServiceUser,
} from '@/services/booking';
import { queryDealMiniInfo, postDealSign } from '@/services/deal';
import { sessionStore } from '@/commons/lib/store';
import { changeDayForTimeSlot } from '@/utils/utils';
import { formatDate } from '@/utils/format';

const DATE_KEY = '__current-date__';
const GROUP_KEY = '__current-group__';

const calcCachedView = (config, cachedSelectPlatform, hasOrder, isOwnOrder) => {
  if (config == null) {
    return;
  }
  const finalCell = {
    ...config,
  };
  // 回填，不跨，拆开
  if (cachedSelectPlatform) {
    finalCell.gridStatus = {
      // 如果选择的时候没有订单，回填时被其他人下单定了，回填则不能选中
      selected: !hasOrder || isOwnOrder,
      isEditMode: isOwnOrder,
      // 支持回填时从编辑模式恢复
      rowSpan: finalCell.rowSpan,
      colSpan: finalCell.colSpan,
    };
    finalCell.colSpan = 1;
    finalCell.rowSpan = 1;
  }
  return finalCell;
};

export default {
  // 订场
  namespace: 'booking',

  state: {
    sportPlatformInfo: undefined,
    orderInfoList: undefined,
    gridDataRows: [], // // 用platformId作为列取值索引，行索引mappingplatformId对象的二维数组来存储状态
    queryStringMD5: undefined,
    currentDate: sessionStore.get(DATE_KEY),
    currentGroupId: sessionStore.get(GROUP_KEY) || '',

    dealSignIds: [], // 刷新前签到的dealid

    dataConflicted: false,
    LockedDealIdPrefix: 'Locked-',
  },

  effects: {
    *dealSignWithoutCode({ payload }, { call, put }) {
      const dealId = payload;
      if (dealId == null) {
        return;
      }
      yield call(postDealSign, {
        dealId,
      });
      yield put({
        type: 'addDealSign',
        payload: dealId,
      });
    },
    *dealSign({ payload }, { put, putResolve }) {
      const result = yield putResolve({
        type: 'global/verifyTicket',
        payload,
      });
      if (result && result.success) {
        yield put({
          type: 'addDealSign',
          payload: payload.dataId,
        });
      }
      return result;
    },
    *dealSignDirectly({ payload }, { put, putResolve }) {
      const { dealId } = payload;
      const result = yield putResolve({
        type: 'global/wxScan',
        payload,
      });
      if (result && result.success) {
        yield put({
          type: 'addDealSign',
          payload: dealId,
        });
      }
      return result;
    },
    // eslint-disable-next-line require-yield
    *buildQueryStringMD5({ payload }) {
      // md5改为btoa计算，省掉一个包依赖
      return window.btoa(JSON.stringify(omit(payload, ['t'])));
    },
    *switchBookingEnv({ payload }, { putResolve }) {
      const { curDate, salesId, itemId } = payload;
      yield putResolve({
        type: 'orderprocessing/switchEnv',
        payload: {
          salesId,
          itemId,
        },
      });
      if (curDate) {
        yield putResolve({
          type: 'changeCurDate',
          payload: curDate,
        });
      }
      yield putResolve({
        type: 'changeCurGroup',
        payload: '',
      });
    },
    *changeCurDate({ payload }, { put }) {
      if (payload) {
        const currentDate = +payload;
        sessionStore.put(DATE_KEY, currentDate);
        yield put({
          type: 'saveData',
          payload: {
            currentDate,
          },
        });
      }
    },
    *changeCurGroup({ payload }, { put }) {
      const currentGroupId = payload;
      sessionStore.put(GROUP_KEY, currentGroupId);
      yield put({
        type: 'saveData',
        payload: {
          currentGroupId,
        },
      });
    },
    fetch: [
      function* fetch({ payload }, { select, all, call, put, putResolve }) {
        let { curDate, platformGroupId } = payload || {};
        if (curDate) {
          yield put({
            type: 'changeCurDate',
            payload: curDate,
          });
        } else {
          curDate = yield select(state => state.booking.currentDate);
        }
        // currentVenue 是BasicLayout确保的
        const currentVenue = yield select(state => state.venue.currentVenue);

        const currentPlatformItem = yield select(state => state.venue.currentPlatformItem);
        if (platformGroupId != null) {
          yield put({
            type: 'changeCurGroup',
            payload: platformGroupId,
          });
        } else {
          const cacheGroupId = yield select(state => state.booking.currentGroupId);
          if (
            currentPlatformItem?.sportPlatformGroupList?.some(
              ({ platformGroupId: groupId }) => groupId === cacheGroupId
            )
          ) {
            platformGroupId = cacheGroupId;
          }
        }

        const lockedDealIdPrefix = yield select(state => state.booking.LockedDealIdPrefix);
        if (currentPlatformItem == null) {
          return;
        }
        const params = {
          salesId: currentVenue.id,
          itemId: currentPlatformItem.itemId,
          salesItemId: currentPlatformItem.salesItemId,
          ...payload,
          curDate,
          platformGroupId,
        };
        // eslint-disable-next-line no-console
        console.log(formatDate(params.curDate));
        const isTicket = currentPlatformItem.itemType === 2;

        let response;
        try {
          response = yield all({
            sportPlatformInfo: call(querySportPlatformInfo, params),
            orderInfoList: call(isTicket ? querySportOrder : queryDealMiniInfo, params),
          });
        } catch {
          response = {};
        }
        response.sportPlatformInfo = response.sportPlatformInfo || {};
        response.orderInfoList = response.orderInfoList || [];

        const queryStringMD5 = yield putResolve({
          type: 'buildQueryStringMD5',
          payload: params,
        });

        const { sportPlatformInfo, orderInfoList: responseOrderInfoList } = response;

        const originSportPlatformList = sportPlatformInfo.sportPlatformList || [];

        const dealInfo = yield select(state => state.orderprocessing.dealInfo || {});

        let cachedDealInfo = {};
        if (queryStringMD5 === dealInfo.queryStringMD5) {
          cachedDealInfo = dealInfo;
        }

        const level1Ids = [];
        const level2Ids = [];

        // 筛选id的同时，过滤一下找不到父场地的子场地
        const sportPlatformList = [];
        originSportPlatformList.forEach(item => {
          if (item.parentId === 0) {
            sportPlatformList.push(item);
            level1Ids.push(item.id);
            return;
          }
          const parentPlatform = originSportPlatformList.find(it => it.id === item.parentId);
          if (parentPlatform == null) {
            message.error(`${item.platformName}作为子场地，找不到匹配的父场地：${item.parentId}`);
            return;
          }
          sportPlatformList.push(item);
          level2Ids.push(item.id);
        });

        const filterDealStateList = yield select(state => [
          state.pubplatform.DealStatus.DEAL_WAIT.key,
          state.pubplatform.DealStatus.DEAL_PASS.key,
          state.pubplatform.DealStatus.DEAL_COMPLETE.key,
        ]);

        const PlatformDealTypes = yield select(state => state.pubplatform.PlatformDealTypes);

        // 场地票务没有锁场的概念
        const orderInfoList = isTicket
          ? responseOrderInfoList
          : responseOrderInfoList
              .map(item => {
                // 锁场的模拟订单
                if (item.dealPlatformType === PlatformDealTypes.Locked.key) {
                  return {
                    ...item,
                    // 包装一下id 避免与正常订单重复
                    dealId: `${lockedDealIdPrefix}${item.lockId}`,
                  };
                }
                return item;
              })
              .filter(
                item =>
                  filterDealStateList.includes(item.dealState) || item.dealPlatformType === PlatformDealTypes.Locked.key
              ); // 过滤掉不需要的

        const commonTimeSlotList = sportPlatformInfo.commonTimeSlotList || [];
        const priceList = sportPlatformInfo.sportPlatformPriceList || [];

        if (
          commonTimeSlotList.some(timeSlot =>
            commonTimeSlotList.some(ts => {
              if (timeSlot === ts) {
                return false;
              }
              return ts.startTime <= timeSlot.startTime && ts.endTime >= timeSlot.endTime;
            })
          )
        ) {
          yield put({
            type: 'saveData',
            payload: {
              sportPlatformInfo: null,
              orderInfoList: null,
              gridDataRows: null,
              queryStringMD5: null,
              dataConflicted: true,
            },
          });
          return;
        }

        const rows = [];

        const calcSpan = config => {
          if (config == null) {
            return;
          }
          const slotIndex = rows.length;
          const newObj = { ...config };
          const { orderInfo, colSpan, platform } = newObj;
          let { rowSpan } = newObj;
          // 从第一行开始查找前面行的跨行数据
          if (
            // 过滤一下是因为，避免逻辑调整导致本行整行完成前有可能本行已经添加到rows里了
            rows
              .filter((row, i) => i < slotIndex)
              .some((row, i) => {
                // 遍历到的目标行的此列跨行数量+距离本行的行数大于1，说明本行此列被合并了
                const col = row[platform.id];
                if (col == null) {
                  return false;
                }
                const { rowSpan: gsRowSpan } = col.gridStatus || {}; // 兼容回显模式
                return (gsRowSpan == null ? col.rowSpan : gsRowSpan) + i - slotIndex > 0;
              })
          ) {
            // 此行此列被合并了
            return {
              ...newObj,
              colSpan: 0,
            };
          }

          // 按照目前的单元格合并方式:
          // 场地有半场的概念的，可能存在横向合并，没有半场概念的只有纵向合并，因为不跨场地合并；
          // 存在横向合并时，有限横向合并，既，是这样的话会打断条件成立的纵向合并；
          // 基于以上两条，不存在同时需要两个方向合并第一个；
          if (colSpan < 2 && orderInfo) {
            let currentIndex = slotIndex;
            // 先只处理跨行
            while (commonTimeSlotList[currentIndex + 1]) {
              const nextSlot = commonTimeSlotList[currentIndex + 1];
              if (nextSlot.endTime <= orderInfo.endTime) {
                // 跨行
                rowSpan += 1;
              }
              currentIndex += 1;
            }
          }

          return {
            ...newObj,
            rowSpan,
          };
        };

        commonTimeSlotList.forEach((timeSlot, rowIndex) => {
          const isLastSlot = rowIndex === commonTimeSlotList.length - 1;
          const row = {
            id: timeSlot.startTime, // rowKey
          };
          // 价格逐层过滤，先按时间
          const findedTimeSlotPriceList = priceList.filter(item => {
            return item.startTime <= timeSlot.startTime && item.endTime >= timeSlot.endTime;
          });
          // 订单逐层过滤，先按时间
          // 先找出当前时段的
          const findedOrderList = orderInfoList.filter(order => {
            // 一个order的最小时间区间就是一个slot的区间，所以只会是order的范围大于等于一个slot
            // return slot.startTime <= order.endTime && slot.endTime >= order.startTime;
            return order.startTime <= timeSlot.startTime && order.endTime >= timeSlot.endTime;
          });

          // 准备列
          // 先参考第一层
          level1Ids.forEach(platformId => {
            // columns用platformId作为列取值索引, 所以值用id作key
            const platform = sportPlatformList.find(item => item.id === platformId);

            // 符合当前第一层列头的订单
            // 先找到上层(包括其所有子层的数据,后面每层再顾虑来使用)
            const findedOrders = findedOrderList.filter(order => {
              // 指向第一层时，可能只有一层，也可能是基于第一层依靠platformSubIds指向第二层
              // 订单的数据指向的platformId可能是第一层也可能是第二层
              if (order.platformId === platform.id) {
                return true;
              }
              // 订单的数据有可能是platformId就直接指向具体成，此时的order.platformId不等于platform.id
              // 订单的数据指向的platformId可能是第一层也可能是第二层
              if (order.platformSubIds == null || order.platformSubIds.length === 0) {
                // 去下层找
                return level2Ids.some(l2PlatformId => {
                  const l2Platform = sportPlatformList.find(item => item.id === l2PlatformId);
                  return l2Platform.parentId === platform.id && l2Platform.id === order.platformId;
                });
              }
              return false;
            });

            // 有子层
            if (
              level2Ids.some(l2PlatformId => {
                const l2Platform = sportPlatformList.find(item => item.id === l2PlatformId);
                return l2Platform.parentId === platform.id;
              })
            ) {
              // 第一层的在后面处理跨行，第二层在这里处理跨列
              // 需要跳过的子id
              const skipSubIds = [];
              level2Ids
                .filter(l2PlatformId => {
                  const l2Platform = sportPlatformList.find(item => item.id === l2PlatformId);
                  return l2Platform.parentId === platform.id;
                })
                .forEach((l2PlatformId, i, list) => {
                  const l2Platform = sportPlatformList.find(item => item.id === l2PlatformId);
                  const priceInfo = findedTimeSlotPriceList.find(
                    item => item.priceTagId === l2Platform.platformPriceId
                  );

                  // 再基于子层过滤, 只使用了查找的第一个
                  // 场馆类型的时候通常是互斥的，所以ods最多是1个;
                  const order = findedOrders.find(od => {
                    if (od.platformId === l2Platform.id) {
                      return true;
                    }
                    if (isTicket) {
                      // isTicket没有按platformSubIds的方式指定
                      return true;
                    }
                    if (od.platformSubIds) {
                      return od.platformSubIds.split(',').includes(l2Platform.id.toString());
                    }
                    return false;
                  });

                  const cachedSelectPlatform = (cachedDealInfo.dealPlatformList || []).find(
                    item =>
                      (item.platformId === l2Platform.id || item.platformId === l2Platform.parentId) &&
                      item.startTime <= timeSlot.startTime &&
                      item.endTime >= timeSlot.endTime
                  );

                  const originNoBook = timeSlot.isSharedIds && timeSlot.isSharedIds.includes(l2Platform.id);

                  const cell = {
                    dataIndex: l2Platform.id, // 放置dataIndex字段只是模仿antd的table组件而已
                    actualStartTime: changeDayForTimeSlot(params.curDate, timeSlot.startTime),
                    actualEndTime: changeDayForTimeSlot(params.curDate, timeSlot.endTime, isLastSlot),
                    timeSlot,
                    platform: l2Platform,
                    priceInfo: priceInfo || {
                      price: timeSlot.price,
                      endTime: timeSlot.endTime,
                      // endTimeValue: '22:00',
                      // fee: 0,
                      // feeValue: '',
                      // priceTagId: 101441,
                      // priceValue: '0.01',
                      startTime: timeSlot.startTime,
                      // startTimeValue: '08:00',
                    },
                    gridStatus: {
                      noBook: originNoBook,
                      originNoBook,
                    },
                    orderInfo: order,
                    rowSpan: 1,
                    colSpan: 0,
                    rowIndex,
                    colIndex: Object.keys(row).length - 1, // rowKey在最前面占一个
                    brotherSize: list.length, // 兄弟姐妹数量(含自己)
                  };

                  // 没有被合并处理
                  if (!skipSubIds.includes(l2Platform.id.toString())) {
                    const oldLength = skipSubIds.length;
                    if (order) {
                      if (order.platformSubIds) {
                        skipSubIds.push(...order.platformSubIds.split(','));
                      } else {
                        skipSubIds.push(order.platformId.toString());
                      }
                    }
                    cell.colSpan = skipSubIds.length - oldLength || 1;
                  }

                  row[l2Platform.id] = calcCachedView(
                    calcSpan(cell),
                    cachedSelectPlatform,
                    order != null,
                    cachedDealInfo.deal && order && cachedDealInfo.deal.id === order.dealId
                  );
                });
            } else {
              const order = findedOrders[0];
              const cachedSelectPlatform = (cachedDealInfo.dealPlatformList || []).find(
                item =>
                  item.platformId === platformId &&
                  item.startTime <= timeSlot.startTime &&
                  item.endTime >= timeSlot.endTime
              );

              const originNoBook = timeSlot.isSharedIds && timeSlot.isSharedIds.includes(platformId);

              const cell = {
                dataIndex: platformId, // 放置dataIndex字段只是模仿antd的table组件而已
                actualStartTime: changeDayForTimeSlot(params.curDate, timeSlot.startTime),
                actualEndTime: changeDayForTimeSlot(params.curDate, timeSlot.endTime, isLastSlot),
                timeSlot,
                platform,
                priceInfo: findedTimeSlotPriceList.find(item => item.priceTagId === platform.platformPriceId) || {
                  price: timeSlot.price,
                  endTime: timeSlot.endTime,
                  // endTimeValue: '22:00',
                  // fee: 0,
                  // feeValue: '',
                  // priceTagId: 101441,
                  // priceValue: '0.01',
                  startTime: timeSlot.startTime,
                  // startTimeValue: '08:00',
                },
                gridStatus: {
                  noBook: originNoBook,
                  originNoBook,
                },
                orderInfo: order,
                rowSpan: 1,
                colSpan: 1,
                rowIndex,
                colIndex: Object.keys(row).length - 1, // rowKey在最前面占一个
                brotherSize: 1, // 兄弟姐妹数量(含自己)
              };

              row[platformId] = calcCachedView(
                calcSpan(cell),
                cachedSelectPlatform,
                order != null,
                cachedDealInfo.deal && order && cachedDealInfo.deal.id === order.dealId
              );
            }
          });
          rows.push(row);
        });
        yield put({
          type: 'saveData',
          payload: {
            sportPlatformInfo: {
              ...sportPlatformInfo,
              // 使用过滤后的数组
              sportPlatformList,
            },
            orderInfoList,
            gridDataRows: rows,
            queryStringMD5,
            dataConflicted: false,
          },
        });
      },
      {
        type: 'takeLatest',
      },
    ],
    *dealedit({ payload }, { select, put }) {
      const dealInfo = payload;
      const dealId = dealInfo.deal.id;
      const gridDataRows = yield select(state => state.booking.gridDataRows);
      const newGridDataRows = gridDataRows.map(row => {
        const newRow = { ...row };
        Object.entries(row).forEach(([key, value]) => {
          // rowKey
          if (key === 'id') {
            return;
          }
          const { orderInfo, gridStatus = {}, rowSpan, colSpan } = value;
          if (orderInfo && orderInfo.dealId === dealId) {
            newRow[key] = {
              ...value,
              rowSpan: 1,
              colSpan: 1,
              gridStatus: {
                ...gridStatus,
                rowSpan, // 存储旧值
                colSpan, // 存储旧值
                isEditMode: true,
                selected: true,
              },
            };
          } else {
            newRow[key] = {
              ...value,
              rowSpan: gridStatus.rowSpan == null ? rowSpan : gridStatus.rowSpan,
              colSpan: gridStatus.colSpan == null ? colSpan : gridStatus.colSpan,
              gridStatus: {
                ...gridStatus,
                rowSpan: null, // 删除旧值
                colSpan: null, // 删除旧值
                isEditMode: false,
                selected: false,
              },
            };
          }
        });
        return newRow;
      });
      yield put({
        type: 'saveData',
        payload: {
          gridDataRows: newGridDataRows,
        },
      });
      yield put({
        type: 'orderprocessing/fillback',
        payload: {
          dealInfo,
        },
      });
    },
    *columnSelect({ payload }, { put, select, all }) {
      const currentPlatformItem = yield select(state => state.venue.currentPlatformItem);
      const { platform, selected } = payload;
      const { commonTimeSlotList = [] } = yield select(state => state.booking.sportPlatformInfo || {});
      const isTicket = currentPlatformItem.itemType === 2;
      yield all(
        commonTimeSlotList.map((timeSlot, i) =>
          put({
            type: 'select',
            payload: {
              rowIndex: i,
              platform,
              selected,
              isTicket,
              isGroup: true,
            },
          })
        )
      );
    },
    *headerSelect({ payload }, { put, all, select }) {
      const currentPlatformItem = yield select(state => state.venue.currentPlatformItem);
      const isTicket = currentPlatformItem.itemType === 2;
      const platform = payload;
      const { sportPlatformList = [] } = yield select(state => state.booking.sportPlatformInfo || {});
      const someoneSelectedCallback = (row, id) => {
        const cellData = row[id];
        // 如果是被跨的则不处理选中
        if (cellData == null || cellData.rowSpan <= 0 || cellData.colSpan <= 0) {
          return false;
        }
        const { gridStatus = {}, orderInfo } = cellData;
        // 如果有订单数据且非编辑模式则不处理选中
        if (gridStatus.isEditMode || orderInfo == null || isTicket) {
          return gridStatus.selected;
        }
        return false;
      };
      // 直接是目标场地
      if (platform.parentId) {
        yield put({
          type: 'columnSelect',
          payload: {
            platform,
            selected: !(yield select(state =>
              state.booking.gridDataRows.some(row => someoneSelectedCallback(row, platform.id))
            )),
          },
        });
      } else {
        // 是父层
        // 找到所有子层
        const l2Platforms = sportPlatformList.filter(item => item.parentId === platform.id);
        // 是独立顶层，没有子层
        if (l2Platforms.length === 0) {
          yield put({
            type: 'columnSelect',
            payload: {
              platform,
              selected: !(yield select(state =>
                state.booking.gridDataRows.some(row => someoneSelectedCallback(row, platform.id))
              )),
            },
          });
        } else {
          const sm = yield all(
            l2Platforms.map(l2Platform =>
              select(state => state.booking.gridDataRows.some(row => someoneSelectedCallback(row, l2Platform.id)))
            )
          );
          yield all(
            l2Platforms.map(l2Platform =>
              put({
                type: 'columnSelect',
                payload: {
                  platform: l2Platform,
                  selected: !sm.includes(true),
                },
              })
            )
          );
        }
      }
    },
    *ticketUpdate({ payload }, { call }) {
      yield call(updateTicketNumber, payload);
    },
    *bookingNextStep({ payload, summary, isIndividual }, { putResolve, select }) {
      const currentPlatformItem = yield select(state => state.venue.currentPlatformItem);
      const isTicket = currentPlatformItem.itemType === 2;
      yield putResolve({
        type: 'orderprocessing/newOrder',
        payload: {
          queryStringMD5: yield select(state => state.booking.queryStringMD5),
          [isTicket ? 'dealSportPlatformTicketList' : 'dealPlatformList']: payload,
          [isTicket ? 'dealPlatformList' : 'dealSportPlatformTicketList']: null, // 交叉置空
        },
      });
      if (isIndividual) {
        yield putResolve({
          type: 'orderprocessing/updateUser',
          payload: {
            isIndividual: true,
          },
        });
      }
      if (summary) {
        return yield putResolve({
          type: 'saveOrder',
        });
      }
    },
    *userNextStep({ payload, summary }, { put, putResolve }) {
      yield put({
        type: 'orderprocessing/updateUser',
        payload,
      });
      if (summary) {
        return yield putResolve({
          type: 'saveOrder',
        });
      }
    },
    *serviceUserNextStep({ payload, summary }, { put, putResolve }) {
      const { dealServiceUserList, dealPlatformTeamInfoList } = payload;
      yield put({
        type: 'orderprocessing/updateTeamInfo',
        payload: dealPlatformTeamInfoList,
      });
      yield put({
        type: 'orderprocessing/updateServiceUser',
        payload: dealServiceUserList,
      });
      if (summary) {
        return yield putResolve({
          type: 'saveOrder',
        });
      }
    },
    *mallNextStep({ payload, summary }, { put, putResolve }) {
      yield put({
        type: 'orderprocessing/updateGoods',
        payload,
      });
      if (summary) {
        return yield putResolve({
          type: 'saveOrder',
        });
      }
    },
    *fillNextStep({ payload }, { put, select, putResolve }) {
      const dealPlatformStudyList = payload || [];
      const dealInfo = yield select(state => state.orderprocessing.dealInfo || {});
      const studyList = (dealPlatformStudyList || []).map(item => ({
        pubStudyId: item.pubStudyId,
      }));
      const currentPlatformItem = yield select(state => state.venue.currentPlatformItem);
      const isTicket = currentPlatformItem.itemType === 2;
      yield isTicket
        ? put({
            type: 'orderprocessing/flushOrder',
            payload: {
              ...dealInfo,
              dealSportPlatformTicketList: (dealInfo.dealSportPlatformTicketList || []).map((ticket, i) => {
                if (ticket.selectPubStudy) {
                  const start = dealInfo.dealSportPlatformTicketList.slice(0, i).reduce((prev, current) => {
                    if (current.selectPubStudy) {
                      return prev;
                    }
                    return prev + current.salesNum;
                  }, 0);
                  return {
                    ...ticket,
                    // 顺序放置，之前的人脸采集页面可以自由选择, 不用再用开始时间、结束时间、场地ID匹配
                    dealSportTicketStudyList: studyList.slice(start, start + ticket.salesNum).filter(Boolean),
                  };
                }
                return ticket;
              }),
            },
          })
        : put({
            type: 'orderprocessing/flushOrder',
            payload: {
              ...dealInfo,
              dealPlatformStudyList: studyList,
            },
          });
      return yield putResolve({
        type: 'saveOrder',
      });
    },
    *saveOrder(_, { putResolve }) {
      return yield putResolve({
        type: 'orderprocessing/saveOrder',
      });
    },
    *fastSaveOrder({ payload }, { putResolve, select }) {
      const { list, ...rest } = payload;
      const currentPlatformItem = yield select(state => state.venue.currentPlatformItem);
      const dealInfo = yield select(state => state.orderprocessing.dealInfo || {});
      const isTicket = currentPlatformItem.itemType === 2;
      const data = list
        ? {
            queryStringMD5: yield select(state => state.booking.queryStringMD5),
            [isTicket ? 'dealSportPlatformTicketList' : 'dealPlatformList']: list,
            [isTicket ? 'dealPlatformList' : 'dealSportPlatformTicketList']: null, // 交叉置空
          }
        : dealInfo;
      return yield putResolve({
        type: 'orderprocessing/genericFastSaveOrder',
        payload: {
          ...data,
          ...rest,
        },
      });
    },
    *clearOrder(_, { put }) {
      yield put({
        type: 'orderprocessing/clearOrder',
      });
    },
    *bookingLock({ payload }, { call, select }) {
      // currentVenue 是BasicLayout确保的
      const currentVenue = yield select(state => state.venue.currentVenue);
      yield call(lockeSomePlatform, {
        salesId: currentVenue.id,
        ...payload,
      });
    },
    *changeBookingLock({ payload }, { call, select }) {
      // currentVenue 是BasicLayout确保的
      const currentVenue = yield select(state => state.venue.currentVenue);
      yield call(changeLockeSomePlatform, {
        salesId: currentVenue.id,
        ...payload,
      });
    },
    *fetchServiceUser(_, { select, call }) {
      const dealInfo = yield select(state => state.orderprocessing.dealInfo || {});
      const { dealPlatformList, deal } = dealInfo;
      return yield call(queryServiceUser, {
        dealPlatformList,
        deal,
      });
    },
    // 场地票务
    *fetchSportTicketVisitorNumbers(_, { call, select }) {
      // currentVenue 是BasicLayout确保的
      const currentVenue = yield select(state => state.venue.currentVenue);
      const curDate = yield select(state => state.booking.currentDate);
      const currentPlatformItem = yield select(state => state.venue.currentPlatformItem);
      return yield call(queryPlatformTicketVisitors, {
        salesId: currentVenue.id,
        curDate,
        itemId: currentPlatformItem.itemId,
        salesItemId: currentPlatformItem.salesItemId,
      });
    },
    // 体育场地
    *fetchSportVisitorNumbers(_, { call, select }) {
      // currentVenue 是BasicLayout确保的
      const currentVenue = yield select(state => state.venue.currentVenue);
      const curDate = yield select(state => state.booking.currentDate);
      const currentPlatformItem = yield select(state => state.venue.currentPlatformItem);
      return yield call(querySportPlatformVisitors, {
        salesId: currentVenue.id,
        curDate,
        itemId: currentPlatformItem.itemId,
        salesItemId: currentPlatformItem.salesItemId,
      });
    },
  },

  reducers: {
    saveData(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clearBookingTableData(state) {
      return {
        ...state,
        sportPlatformInfo: undefined,
        orderInfoList: undefined,
        gridDataRows: [],
      };
    },
    select(state, { payload }) {
      // isGroup 是否批量的，批量的通常要统一设置
      const { rowIndex, platform, selected, isGroup, isTicket } = payload;
      const platformId = platform.id;
      const gridRow = state.gridDataRows[rowIndex] || {};
      const cellData = gridRow[platformId] || {};
      const gridStatus = cellData.gridStatus || {};
      // 已占用的不给点击
      if (gridStatus.noBook) {
        return state;
      }
      // 如果是被跨的则不处理选中
      if (cellData.rowSpan <= 0 || cellData.colSpan <= 0) {
        return state;
      }
      // 如果有订单数据且非编辑模式则不处理选中
      if (!(gridStatus.isEditMode || cellData.orderInfo == null || isTicket)) {
        return state;
      }
      // 将要设置为选中还是未选中
      const willDoSelected = typeof selected === 'boolean' || isGroup ? selected : !gridStatus.selected;
      const gridDataRows = [...state.gridDataRows];
      const newGridRow = {
        ...gridRow,
        [platformId]: {
          ...cellData,
          gridStatus: {
            ...gridStatus,
            // 如果指定了状态则使用指定的状态，否则toggle
            selected: willDoSelected,
          },
        },
      };
      const { platformShareIds } = cellData.platform;
      // 只处理选择时，去除选中时不处理
      if (Array.isArray(platformShareIds) && platformShareIds.length > 0) {
        Object.keys(newGridRow).forEach(key => {
          if (key === 'id' || key === platformId.toString()) {
            return;
          }
          const targetCell = newGridRow[key];
          const { gridStatus: st = {}, platform: p } = targetCell;
          if (platformShareIds.includes(p.id)) {
            newGridRow[key] = {
              ...targetCell,
              gridStatus: {
                ...st,
                noBook: st.originNoBook || willDoSelected,
                selected: false,
              },
            };
          }
        });
      }
      gridDataRows[rowIndex] = newGridRow;
      return {
        ...state,
        gridDataRows,
      };
    },
    addDealSign(state, { payload }) {
      return {
        ...state,
        dealSignIds: [...state.dealSignIds, payload],
      };
    },
    clean(state) {
      return {
        ...state,
        dealSignIds: [],
      };
    },
  },
};
