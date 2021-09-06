import {
  queryCategoryTreeListBySales,
  queryCategoryTreeListByParent,
  deleteSomeItemByIds,
  inboundItem,
  transferItem,
  breakItem,
  purchaseItem,
  editItem,
  editItemRank,
  queryStateResult,
  updateItemPrice,
  queryInfoByCode,
  postAnInventory,
  correctStock,
} from '@/services/store';
import { StoreModel } from '@/commons/lib/models';

export default {
  // 商城商品
  namespace: 'store',

  state: {
    ...StoreModel,

    categoryListForSalesMapping: {},
    categoryListForSales: undefined,

    categoryListByParentMapping: {},
    categoryListByParent: undefined,
  },

  effects: {
    fetchCategoryListBySales: [
      function* fetchCategoryListBySales(_, { call, put, select }) {
        const currentVenue = yield select(state => state.venue.currentVenue);
        const salesId = currentVenue.id;
        let response = yield select(state => state.store.categoryListForSalesMapping[salesId]);
        yield put({
          type: 'saveCategoryListSalesView',
          payload: response,
        });
        if (response) {
          return response;
        }
        response = yield call(queryCategoryTreeListBySales, {
          salesId,
        }) || [];
        response = response || [];
        yield put({
          type: 'saveCategoryListSalesView',
          payload: response,
        });
        yield put({
          type: 'saveCategoryListSalesMapping',
          payload: {
            key: salesId,
            list: response,
          },
        });
        return response;
      },
      {
        type: 'takeLatest',
      },
    ],
    fetchcategoryListByParent: [
      function* fetchCategoryListBySales({ payload }, { call, put, select }) {
        const parentId = payload || 102_150;
        let response = yield select(state => state.store.categoryListByParentMapping[parentId]);
        yield put({
          type: 'saveCategoryListParentView',
          payload: response,
        });
        if (response) {
          return response;
        }
        response = yield call(queryCategoryTreeListByParent, {
          parentId,
        }) || [];
        response = response || [];
        yield put({
          type: 'saveCategoryListParentView',
          payload: response,
        });
        yield put({
          type: 'saveCategoryListParentMapping',
          payload: {
            key: parentId,
            list: response,
          },
        });
        return response;
      },
      {
        type: 'takeLatest',
      },
    ],
    // 编辑
    *edit({ payload }, { call }) {
      yield call(editItem, payload);
    },
    // 扫码查询
    *queryByCode({ payload }, { call }) {
      return yield call(queryInfoByCode, payload);
    },
    *delete({ payload }, { call }) {
      yield call(deleteSomeItemByIds, payload);
    },
    // 入库数量
    *addNum({ payload }, { call }) {
      yield call(inboundItem, payload);
    },
    // 调拨
    *moveNum({ payload }, { call }) {
      yield call(transferItem, payload);
    },
    // 调价
    *updatePrice({ payload }, { call }) {
      yield call(updateItemPrice, payload);
    },
    // 报损
    *breakNum({ payload }, { call }) {
      yield call(breakItem, payload);
    },
    // 进货
    *purchaseNum({ payload }, { call }) {
      yield call(purchaseItem, payload);
    },
    *editRank({ payload }, { call }) {
      yield call(editItemRank, payload);
    },
    *fetchStateResult(_, { call, select }) {
      const salesId = yield select(state => (state.venue.currentVenue || {}).id);
      return yield call(queryStateResult, {
        salesId,
      });
    },
    *makeAnInventory({ payload }, { call }) {
      yield call(postAnInventory, payload);
    },
    *correctStock({ payload }, { call }) {
      yield call(correctStock, payload);
    },
  },

  reducers: {
    saveCategoryListSalesMapping(state, { payload }) {
      const { key, list } = payload;
      return {
        ...state,
        categoryListForSalesMapping: {
          ...state.categoryListForSalesMapping,
          [key]: list,
        },
      };
    },
    saveCategoryListSalesView(state, { payload }) {
      return {
        ...state,
        categoryListForSales: payload,
      };
    },

    saveCategoryListParentMapping(state, { payload }) {
      const { key, list } = payload;
      return {
        ...state,
        categoryListByParentMapping: {
          ...state.categoryListByParentMapping,
          [key]: list,
        },
      };
    },
    saveCategoryListParentView(state, { payload }) {
      return {
        ...state,
        categoryListByParent: payload,
      };
    },
  },
};
