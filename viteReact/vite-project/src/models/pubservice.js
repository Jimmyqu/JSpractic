import {
  queryPubServiceInfo,
  changePeriod,
  withdrawAmount,
  analysisCheckoutForList,
  analysisCheckoutForSold,
  fetchByUser,
  postBatchDelayPeriod,
  postBatchFreeze,
  postUnFreeze,
  postLinkPubServiceAndStudy,
  postSurePrintCard,
  queryServiceCategoryList,
  updatePubServiceState,
  updateServiceRecovery,
  updatePubServiceRank,
  withdrawAmountToAccount,
} from '@/services/pubservice';
import { PubServiceModel } from '@/commons/lib/models';

export default {
  // 会员服务(销售前原型`)
  namespace: 'pubservice',

  state: {
    ...PubServiceModel,
    cacheMapping: {}, // id为Key的缓存
    // 服务分类
    categoryList: null,
  },

  effects: {
    *changePubServiceRank({ payload }, { call }) {
      yield call(updatePubServiceRank, payload);
    },
    *pubServiceRecovery({ payload }, { call }) {
      yield call(updateServiceRecovery, payload);
    },
    *analysisCheckout({ payload }, { call }) {
      yield call(analysisCheckoutForList, {
        ids: payload,
      });
    },
    *analysisCheckoutForSold({ payload }, { call }) {
      yield call(analysisCheckoutForSold, {
        ids: payload,
      });
    },
    *flushData({ payload }, { put }) {
      if (Array.isArray(payload)) {
        const mapping = {};
        payload.forEach(item => {
          const {
            pubService: { id },
          } = item;
          mapping[id] = item;
        });

        yield put({
          type: 'flushMapping',
          payload: mapping,
        });
      }
    },
    *fetchOne({ payload }, { call, select, put }) {
      const pubServiceId = payload;
      let info = yield select(state => state.pubservice.cacheMapping[pubServiceId]);
      if (info) {
        return info;
      }
      info = yield call(queryPubServiceInfo, {
        pubServiceId,
      });
      yield put({
        type: 'flushMapping',
        payload: {
          [pubServiceId]: info,
        },
      });
    },
    *changePublicServiceAccountPeriod({ payload }, { call }) {
      yield call(changePeriod, payload);
    },
    *withdraw({ payload }, { call }) {
      return yield call(withdrawAmount, payload);
    },
    *withdrawToAccount({ payload }, { call }) {
      return yield call(withdrawAmountToAccount, payload);
    },
    fetchPubServiceByUser: [
      function* fetchPubServiceByUser({ payload }, { call }) {
        const pubAccountId = payload;
        if (pubAccountId == null) {
          return null;
        }
        return yield call(fetchByUser, {
          pubAccountId,
        });
      },
      {
        type: 'takeLatest',
      },
    ],
    *batchDelayPeriod({ payload }, { call }) {
      yield call(postBatchDelayPeriod, payload);
    },
    *batchFreeze({ payload }, { call }) {
      yield call(postBatchFreeze, payload);
    },
    *removeFreeze({ payload }, { call }) {
      yield call(postUnFreeze, payload);
    },
    *linkStudy({ payload }, { call }) {
      yield call(postLinkPubServiceAndStudy, payload);
    },
    *surePrintCard({ payload }, { call }) {
      const pubServiceAccountId = payload;
      if (!pubServiceAccountId) {
        throw new Error('pubServiceAccountId can not be null');
      }
      yield call(postSurePrintCard, {
        pubServiceAccountId,
      });
    },
    *fetchServiceCategory(_, { call, put, select }) {
      const cache = yield select(state => state.pubservice.categoryList);
      if (cache) {
        return cache;
      }
      const list = yield call(queryServiceCategoryList);
      // 转换成model的结构
      const categoryList = (list || []).map(({ id, categoryName }) => ({
        key: id,
        value: categoryName,
      }));
      yield put({
        type: 'saveCategoryList',
        payload: categoryList,
      });
      return categoryList;
    },
    *disableOrEnableService({ payload }, { call, select }) {
      const { enable, ...rest } = payload;
      const { ServiceStatus } = yield select(state => state.pubservice);
      yield call(updatePubServiceState, {
        ...rest,
        serviceState: enable ? ServiceStatus.Enable.key : ServiceStatus.Disable.key,
      });
    },
  },

  reducers: {
    flushMapping(state, { payload }) {
      return {
        ...state,
        cacheMapping: {
          ...state.cacheMapping,
          ...payload,
        },
      };
    },
    saveCategoryList(state, { payload }) {
      return {
        ...state,
        categoryList: payload,
      };
    },
  },
};
