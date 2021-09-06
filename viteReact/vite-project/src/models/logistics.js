import {
  queryExpressCompanyList,
  queryDeliverInfo,
  updateConsignee,
  toDeliver,
  toBatchDeliver,
  queryShippingSalesInfo,
  postBatchShipping,
} from '@/services/logistics';
import { LogisticsModel } from '@/commons/lib/models';

export default {
  // 物流
  namespace: 'logistics',

  state: {
    ...LogisticsModel,
  },

  effects: {
    *postBatchDeliver({ payload }, { call }) {
      return yield call(postBatchShipping, payload);
    },
    *fetchShippingSalesInfo(_, { call }) {
      return yield call(queryShippingSalesInfo);
    },
    *fetchExpressCompanyList(_, { call, put }) {
      const list = yield call(queryExpressCompanyList);
      const obj = {};
      (list || []).forEach(({ id, companyName }) => {
        obj[id] = {
          key: id,
          value: companyName,
        };
      });
      yield put({
        type: 'saveExpressCompanyList',
        payload: obj,
      });
    },
    *fetchDeliverInfo({ payload }, { call }) {
      const dealShippingId = payload;
      if (dealShippingId == null) {
        return null;
      }
      return yield call(queryDeliverInfo, {
        dealShippingId,
      });
    },
    *editConsignee({ payload }, { call }) {
      yield call(updateConsignee, payload);
    },
    // 发货
    *deliver({ payload }, { call }) {
      yield call(toDeliver, payload);
    },
    // 确认批量发货
    *deliverBatch({ payload }, { call }) {
      yield call(toBatchDeliver, {
        codeDynamic: payload,
      });
    },
  },

  reducers: {
    saveExpressCompanyList(state, { payload }) {
      return {
        ...state,
        ExpressCompanys: payload,
      };
    },
  },
};
