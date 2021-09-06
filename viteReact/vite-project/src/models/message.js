import { MessageModel } from '@/commons/lib/models';
import {
  fetchCategoryList,
  fetchTemplateCode,
  getSrvList,
  saveMessagePushConfig,
  delMessage,
  excelLoad,
  mobileLoad,
  runSend,
  messageConfigInfo,
  addUser,
  delByIds,
  applyPushConfig,
} from '@/services/message';

export default {
  // 消息
  namespace: 'message',

  state: {
    ...MessageModel,
    categoryList: undefined,
    list: [],
    pagination: {
      total: 0,
      pageSize: 0,
      current: 0,
    },
  },

  effects: {
    *fetchCategoryList(_, { call, put, select }) {
      // 使用页面缓存
      let response = yield select(state => state.message.categoryList);
      if (response) {
        return;
      }
      response = yield call(fetchCategoryList);
      yield put({
        type: 'saveCategoryList',
        payload: response || [], // 空集合识别为已加载
      });
    },
    *fetchTemplateCode({ payload }, { call }) {
      return yield call(fetchTemplateCode, payload);
    },
    *delMessage({ payload }, { call }) {
      return yield call(delMessage, payload);
    },
    *excelLoad({ payload }, { call }) {
      return yield call(excelLoad, payload);
    },
    *mobileLoad({ payload }, { call }) {
      return yield call(mobileLoad, payload);
    },
    *runSend({ payload }, { call }) {
      return yield call(runSend, payload);
    },
    *addUser({ payload }, { call }) {
      return yield call(addUser, payload);
    },
    *delByIds({ payload }, { call }) {
      return yield call(delByIds, payload);
    },
    *messageConfigInfo({ payload }, { call }) {
      return yield call(messageConfigInfo, payload);
    },
    *fetchSrvList({ payload }, { call }) {
      return yield call(getSrvList, payload);
    },
    *saveMessagePushConfig({ payload }, { call }) {
      return yield call(saveMessagePushConfig, payload);
    },
    *applyPushConfig({ payload }, { call }) {
      return yield call(applyPushConfig, payload);
    },
    // *pagingQuery({ payload }, { call }) {
    //   let response = yield call(messageListPagingQuery, payload);
    // },
  },

  reducers: {
    saveCategoryList(state, action) {
      return {
        ...state,
        categoryList: action.payload,
      };
    },
  },
};
