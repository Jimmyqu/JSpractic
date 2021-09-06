import omit from 'omit.js';
import {
  saveOrder,
  saveOrderMessage,
  toDealPay,
  checkoutOrderJustUpdate,
  queryOrderSummary,
  calcPubServicePrice,
  postBarCodePay,
  fastSaveOrder,
  getPaymentInfo,
} from '@/services/deal';
import { queryPlatformLockedInfo } from '@/services/booking';
import { getPageQuery } from '@/utils/utils';

export default {
  // 下单流程
  namespace: 'orderprocessing',

  state: {
    dealInfo: undefined,
  },

  effects: {
    *switchEnv({ payload }, { putResolve, select }) {
      const { salesId, itemId } = payload;
      const currentVenue = yield select(state => state.venue.currentVenue);
      if (salesId && currentVenue.id !== salesId) {
        yield putResolve({
          type: 'venue/changeVenueId',
          payload: salesId,
        });
      }
      const currentItem = yield select(state => state.venue.currentItem);
      if (itemId && currentItem.itemId !== itemId) {
        yield putResolve({
          type: 'venue/changeItemId',
          payload: itemId,
        });
      }
    },
    *fetchOrder({ payload }, { call, putResolve, select }) {
      const { switchEnv, id } = payload || {};
      const { id: queryId, lock } = getPageQuery();
      const dealId = queryId || id;
      // FIXME 未知原因, 跳到到下一步或者goback时组件会额外创建再销毁一次
      if (!dealId) {
        return false;
      }
      let mainData;
      if (lock) {
        const lockedDealIdPrefix = yield select(state => state.booking.LockedDealIdPrefix);
        const info = yield call(queryPlatformLockedInfo, {
          lockId: dealId,
        });
        const {
          gmtCreate,
          createRealName,
          id: lockId,
          lockMessage,
          gmtModified,
          sportPlatformLockDataList,
          salesId,
          salesName,
        } = info || {};
        mainData = {
          dealInfo: {
            deal: {
              // 包装一下id 避免与正常订单重复
              id: `${lockedDealIdPrefix}${lockId}`,
              lockId,
              createTime: gmtCreate,
              updateTime: gmtModified,
              createRealName,
              sellerMessage: lockMessage,
              salesId,
              salesName,
            },
            dealPlatformList: sportPlatformLockDataList,
          },
        };
      } else {
        mainData = yield call(queryOrderSummary, {
          dealId,
        });
      }
      if (switchEnv) {
        const { dealInfo: mainDataDealInfo } = mainData;
        const { salesId } = mainDataDealInfo.deal;
        const itemId =
          mainDataDealInfo.dealPlatformList && mainDataDealInfo.dealPlatformList.length > 0
            ? mainDataDealInfo.dealPlatformList[0].professionalId
            : null;
        yield putResolve({
          type: 'switchEnv',
          payload: { salesId, itemId },
        });
      }
      return yield putResolve({
        type: 'fillback',
        payload: mainData,
      });
    },
    *fillback({ payload }, { select, put, putResolve }) {
      const mainData = payload || {};
      const { dealInfo: mainDataDealInfo } = mainData;
      if (mainDataDealInfo) {
        const dealInfo = yield select(state => state.orderprocessing.dealInfo);
        const mainDataDeal = mainDataDealInfo.deal || {};
        if (dealInfo == null || dealInfo.deal == null || dealInfo.deal.id !== mainDataDeal.id) {
          // 订单流程之外，如id查询
          mainData.flush = true;
          if (mainDataDealInfo.dealPlatformList && mainDataDealInfo.dealPlatformList.length > 0) {
            mainDataDealInfo.queryStringMD5 = yield putResolve({
              type: 'booking/buildQueryStringMD5',
              payload: {
                salesId: mainDataDeal.salesId,
                itemId: mainDataDealInfo.dealPlatformList[0].professionalId,
                platformGroupId: '', // 按全部分组回显
                curDate: mainDataDealInfo.dealPlatformList[0].orderDate,
              },
            });
          }
          // 刷缓存
          yield put({
            type: 'flushOrder',
            payload: {
              ...omit(mainDataDealInfo, ['payInfo', 'commonSales']),
            },
          });
        }
      }
      return mainData;
    },
    *fetchContentInfo(_, { call }) {
      const { content } = getPageQuery();
      return yield call(getPaymentInfo, { content });
    },
    *barCodePay({ payload }, { call }) {
      return yield call(postBarCodePay, payload);
    },
    *calcPubServicePrice({ payload }, { call, select }) {
      const dealInfo = yield select(state => state.orderprocessing.dealInfo || {});
      const { id } = dealInfo.deal || {};
      return yield call(calcPubServicePrice, {
        dealId: id,
        pubServiceAccountId: payload,
      });
    },
    *newOrder({ payload }, { put, select }) {
      const dealInfo = yield select(state => state.orderprocessing.dealInfo || {});
      yield put({
        type: 'flushOrder',
        payload: {
          ...omit(dealInfo, ['payInfo', 'commonSales']),
          ...payload,
        },
      });
    },
    *updateUser({ payload }, { put, select }) {
      const dealInfo = yield select(state => state.orderprocessing.dealInfo);
      if (dealInfo == null) {
        return;
      }
      let newDealInfo = {
        ...dealInfo,
        deal: {
          ...dealInfo.deal,
          ...payload,
        },
      };
      const { deal } = newDealInfo;
      // 散客结算用当前登陆信息
      if (deal == null || deal.pubAccountId == null) {
        newDealInfo = { ...newDealInfo };
        const {
          publicAccount: { id, mobile, realName },
        } = yield select(state => state.user.currentUser || {});
        newDealInfo.deal = {
          ...deal,
          pubAccountId: id,
          pubMobile: mobile,
          pubRealName: realName,
        };
      }
      // eslint-disable-next-line unicorn/consistent-destructuring
      const { pubAccountId, pubMobile, pubRealName } = newDealInfo.deal;
      yield put({
        type: 'flushOrder',
        payload: newDealInfo,
      });
      return { pubAccountId, pubMobile, pubRealName };
    },
    // 更新dealinfo上的其他内容
    *updateAnythingExceptUser({ payload }, { put, select }) {
      const dealInfo = yield select(state => state.orderprocessing.dealInfo || {});
      yield put({
        type: 'flushOrder',
        payload: {
          ...dealInfo,
          ...payload,
          deal: dealInfo.deal,
        },
      });
    },
    *updateTeamInfo({ payload }, { put, select }) {
      const dealInfo = yield select(state => state.orderprocessing.dealInfo || {});
      const dealPlatformList = [...(dealInfo.dealPlatformList || [])];
      const dealPlatformTeamInfoList = payload || [];
      dealPlatformTeamInfoList.forEach((item, i) => {
        const platform = dealPlatformList.find(
          it => it.platformId === item.platformId && it.startTime === item.startTime && it.endTime === item.endTime
        );
        if (platform) {
          dealPlatformList[i] = {
            ...platform,
            ...item,
          };
        }
      });
      yield put({
        type: 'flushOrder',
        payload: {
          ...dealInfo,
          dealPlatformList,
        },
      });
    },
    *updateServiceUser({ payload }, { put, select }) {
      const dealInfo = yield select(state => state.orderprocessing.dealInfo || {});
      yield put({
        type: 'flushOrder',
        payload: {
          ...dealInfo,
          dealServiceUserList: payload,
        },
      });
    },
    *updateGoods({ payload }, { put, select }) {
      const dealInfo = yield select(state => state.orderprocessing.dealInfo || {});
      yield put({
        type: 'flushOrder',
        payload: {
          ...dealInfo,
          dealItemList: payload,
        },
      });
    },
    *updateId({ payload }, { put, select }) {
      const dealInfo = yield select(state => state.orderprocessing.dealInfo || {});
      yield put({
        type: 'flushOrder',
        payload: {
          ...dealInfo,
          deal: {
            ...dealInfo.deal,
            id: payload,
          },
        },
      });
    },
    *saveOrder(_, { call, put, select, putResolve }) {
      yield putResolve({
        type: 'updateUser',
      });
      const dealInfo = yield select(state => state.orderprocessing.dealInfo || {});
      const copyDealInfo = {
        ...dealInfo,
      };
      // copyDealInfo是纯数据对象，可以安全的使用JSON转化方法来深拷贝
      const cloneInfo = JSON.parse(JSON.stringify(copyDealInfo));
      if (copyDealInfo.deal) {
        // deal.selectPubStudy、deal.validPubStudy字段数据在保存订单时不提供给后台，本身接口也不要求该字段，避免后台误用。订单是否开启人脸应该由后台数据决定。
        delete copyDealInfo.deal.selectPubStudy;
        delete copyDealInfo.deal.validPubStudy;
        delete copyDealInfo.deal.validFace;
        delete copyDealInfo.deal.isIndividual;
        // 选座标记
        delete copyDealInfo.deal.pushSeat;
      }
      try {
        const id = yield call(saveOrder, omit(copyDealInfo, ['queryStringMD5']));
        yield put({
          type: 'updateId',
          payload: id,
        });
        return id;
      } catch {
        // 保存失败时 恢复订单状态;
        yield put({
          type: 'flushOrder',
          payload: cloneInfo,
        });
      }
    },
    *genericFastSaveOrder({ payload }, { put, call, select }) {
      const { payMode, changePaidPrice, ...someListProps } = payload;
      yield put({
        type: 'newOrder',
        payload: {
          ...someListProps,
          changePaidPrice, // 冗余字段, 现金结算时在结果中使用
        },
      });
      const params = {
        dealInfo: { ...someListProps },
        payWay: payMode,
      };
      const { deal } = yield select(state => state.orderprocessing.dealInfo || {});
      if (deal && deal.id) {
        params.dealInfo = {
          id: deal.id,
          ...params.dealInfo,
        };
      }
      const response = yield call(fastSaveOrder, params);
      const { dealId } = response;
      yield put({
        type: 'updateId',
        payload: dealId,
      });
      return response;
    },
    *saveMessage({ payload }, { call, select }) {
      const dealInfo = yield select(state => state.orderprocessing.dealInfo || {});
      const { id } = dealInfo.deal || {};
      yield call(saveOrderMessage, {
        dealId: id,
        ...payload,
      });
    },
    *fetchDealPay({ payload }, { call, select }) {
      const dealInfo = yield select(state => state.orderprocessing.dealInfo || {});
      const { id } = dealInfo.deal || {};
      return yield call(toDealPay, {
        dealId: id,
        ...payload,
      });
    },
    *checkOutOrderJustUpdate({ payload }, { call, select }) {
      const dealInfo = yield select(state => state.orderprocessing.dealInfo || {});
      const { id } = dealInfo.deal || {};
      return yield call(checkoutOrderJustUpdate, {
        dealId: id,
        ...payload,
      });
    },
    *clearOrder(_, { put }) {
      yield put({
        type: 'clear',
      });
    },
  },

  reducers: {
    flushOrder(state, { payload }) {
      const {
        deal,
        dealPlatformList,
        dealSportPlatformTicketList,
        dealServicePubList,
        dealTicketList,
        dealCourseList,
      } = payload || {};
      let newDealInfo = payload;
      if (deal == null || !('selectPubStudy' in deal) || !('validPubStudy' in deal) || !('validFace' in deal)) {
        const allList = [
          ...(dealPlatformList || []), // 场地
          ...(dealSportPlatformTicketList || []), // 场地票务
          ...(dealServicePubList || []), // 会员服务
          ...(dealTicketList || []), // 活动票务
          ...(dealCourseList || []), // 课程
        ];
        newDealInfo = {
          ...payload,
          deal: {
            ...deal,
            // 新下单时根据下单数据标记 可以选人
            selectPubStudy: allList.some(item => item.selectPubStudy),
            // 新下单时根据下单数据标记 需要选人并核验人员
            validPubStudy: allList.some(item => item.validPubStudy),
            // 新下单时根据下单数据标记 所选人员需要核验人脸有效
            validFace: allList.some(item => item.validFace),
          },
        };
      }
      return {
        ...state,
        dealInfo: newDealInfo,
      };
    },
    clear(state) {
      return {
        ...state,
        dealInfo: undefined,
      };
    },
  },
};
