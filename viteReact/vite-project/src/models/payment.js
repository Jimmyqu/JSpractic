import { PaymentModel } from '@/commons/lib/models';
import { queryPayMeanList, fetchQRcodeForScan, queryReceiptInfo } from '@/services/api';
import { postBarCodePay } from '@/services/deal';

export default {
  // 支付
  namespace: 'payment',

  state: {
    payMeanlistCache: {}, // 营销中心编号为key
    ...PaymentModel,
    payMeanlist: undefined,
  },

  effects: {
    *fetchPayMeans({ payload }, { call, put, select }) {
      yield put({
        type: 'flushViewList',
        payload: [],
      });
      const { salesId } = payload;
      let response = yield select(state => state.payment.payMeanlistCache[salesId]);
      if (response == null) {
        response = yield call(queryPayMeanList, payload);
        response = response || [];
        yield put({
          type: 'saveCache',
          payload: {
            key: salesId,
            value: response,
          },
        });
      }
      yield put({
        type: 'flushViewList',
        payload: response,
      });
    },
    *fetchQRcode({ payload }, { call }) {
      return yield call(fetchQRcodeForScan, payload);
    },
    *barCodePay({ payload }, { call }) {
      return yield call(postBarCodePay, payload);
    },
    *fetchReceiptInfo(_, { call, select }) {
      const salesId = yield select(state => (state.venue.currentVenue || {}).id);
      return yield call(queryReceiptInfo, {
        salesId,
      });
    },
  },

  reducers: {
    saveCache(state, { payload: { key, value } }) {
      const clean = Object.keys(state.payMeanlistCache).length > 1000;
      return {
        ...state,
        payMeanlistCache: {
          ...(clean ? {} : state.payMeanlistCache),
          [key]: value,
        },
      };
    },
    flushViewList(state, { payload }) {
      return {
        ...state,
        payMeanlist: payload,
      };
    },
  },
};
