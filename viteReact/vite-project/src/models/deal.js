/* eslint-disable max-classes-per-file */
import omit from 'omit.js';
import { message as msg } from 'antd';
import { DealModel } from '@/commons/lib/models';
import {
  queryDealDetailInfo,
  postDealCancel,
  postDealCancelMulti,
  queryUnpaidGoodsDealList,
  getQuickPayWay,
  queryPayStatus,
  queryDealDetailInfoByProjectNumber,
} from '@/services/deal';
import { uuid } from '@/utils/utils';

class PollingBrokenError extends Error {
  constructor(message = 'Polling broken') {
    super(message);
    this.name = 'PollingBrokenError';
  }
}

class FailedBrokenError extends Error {
  constructor(message = 'Failed broken') {
    super(message);
    this.name = 'FailedBrokenError';
  }
}

const { PayWayTypes } = DealModel;
export default {
  // 订单
  namespace: 'deal',

  state: {
    pollingFlag: uuid(),
    isCancelLoading: false,
    ...DealModel,
    PayModeTypesWithOutGroup: omit(PayWayTypes, ['GROUP']),
    PayModesCacheMapping: {}, // 以salesId为key，存储一个数组表示支持的第三方支付方式
    failedCache: {},
  },

  effects: {
    *fetchUnpaidGoodsDealList({ payload }, { call, select }) {
      const salesId = yield select(state => (state.venue.currentVenue || {}).id);
      return yield call(queryUnpaidGoodsDealList, {
        salesId,
        ...payload,
      });
    },
    *fetch({ payload }, { call }) {
      return yield call(queryDealDetailInfo, {
        dealId: payload,
      });
    },
    *fetchByProjectNumber({ payload }, { call }) {
      return yield call(queryDealDetailInfoByProjectNumber, {
        projectNumber: payload,
      });
    },
    *delete({ payload }, { call, put, select }) {
      const { dealId } = payload;
      const res = yield call(postDealCancel, payload);
      // 直接成功了
      if (res > 0) {
        return res;
      }
      yield put({
        type: 'changeCancelLoading',
        payload: true,
      });
      const { PayStatus } = yield select(state => state.deal);
      yield put({
        type: 'queryPayStatusPolling',
        payload: {
          dealId,
          expect: PayStatus.REFUNDED.key,
        },
      });
      return dealId;
    },
    *deleteMulti({ payload }, { call }) {
      return yield call(postDealCancelMulti, payload);
    },
    *queryPayStatusPolling({ payload }, { call, select, delay, put, putResolve }) {
      const { expect, ...params } = payload;
      const flag = yield select(state => state.deal.pollingFlag);
      while (true) {
        const flag2 = yield select(state => state.deal.pollingFlag);
        if (flag !== flag2) {
          throw new PollingBrokenError();
        }
        let data;
        let error;
        try {
          data = yield call(queryPayStatus, params);
        } catch (e) {
          error = e;
        }
        if (data) {
          const { dealPayState, payFailMsg, payFailCode, paySign } = data;
          const { dealId } = params;
          const failedCache = yield select(state => state.deal.failedCache);
          if (payFailMsg && failedCache[dealId] !== paySign) {
            yield putResolve({
              type: 'addFailedCache',
              payload: {
                key: dealId,
                value: paySign,
              },
            });
            if (payFailCode === 'USERPAYING') {
              msg.info('请提醒用户在付款app中输入密码以完成支付！', 5);
            } else {
              throw new FailedBrokenError(payFailMsg);
            }
          }
          // PayStatus
          if (dealPayState === expect) {
            // 主动更新
            yield put({
              type: 'breakPolling',
            });
            return data;
          }
        }
        // sleep 异常的话轮询间隔长一点
        yield delay(1000 * (error == null ? 2 : 5));
      }
    },
    *breakPolling(_, { put }) {
      yield put({
        type: 'updatePollingFlag',
      });
      yield put({
        type: 'changeCancelLoading',
        payload: false,
      });
    },
    fetchSupportPayModes: [
      function* fetchSupportPayModes(_, { call, select, put }) {
        const salesId = yield select(state => state.venue.currentVenue?.id);
        const list = yield select(state => state.deal.PayModesCacheMapping[salesId]);
        if (list) {
          return;
        }
        const result = yield call(getQuickPayWay, {
          salesId,
        });
        yield put({
          type: 'savePayModesCache',
          payload: {
            key: salesId,
            value: result || [],
          },
        });
      },
      {
        type: 'takeLatest',
      },
    ],
  },

  reducers: {
    updatePollingFlag(state) {
      return {
        ...state,
        pollingFlag: uuid(),
      };
    },
    changeCancelLoading(state, { payload }) {
      return {
        ...state,
        isCancelLoading: payload,
      };
    },
    savePayModesCache(state, { payload }) {
      const { PayModesCacheMapping } = state;
      const { key, value } = payload;
      const list = [...new Set(value)].filter(
        mode =>
          mode === PayWayTypes.ZFB.key ||
          mode === PayWayTypes.WECHAT.key ||
          mode === PayWayTypes.GROUP.key || // 3方支付
          mode === PayWayTypes.CASH.key
      );
      return {
        ...state,
        PayModesCacheMapping: {
          ...PayModesCacheMapping,
          [key]: list,
        },
      };
    },
    addFailedCache(state, { payload }) {
      const { failedCache } = state;
      const { key, value } = payload;
      return {
        ...state,
        failedCache: {
          ...failedCache,
          [key]: value,
        },
      };
    },
  },
};
