import {
  queryDigitalMediaList,
  postEditOrNewPaper,
  deletePaper,
  postEditOrNewPaperConfig,
  deletePaperConfig,
  queryMediaTemplateData,
  postEditOrAddNewspaper,
  deleteNewspaper,
  queryLayoutList,
  postEditOrAddNewspaperLayout,
  queryNewspaperLayoutDetail,
  deleteNewspaperLayout,
  editTemplate,
  postEditPublishState,
  queryNewspaperNewsData,
  queryNewspaperNewsDetail,
  postEditOrAddNewspaperNews,
  deleteNewspaperNews,
  postImgFileWithAliOcr,
} from '@/services/digital';
import { DigitalModel } from '@/commons/lib/models';

export default {
  // 数字媒体
  namespace: 'digital',

  state: {
    ...DigitalModel,
    mediaList: [], // 媒体列表
    pageIds: [], // 版面id列表
    musicTemplates: [], // 背景音乐
  },

  effects: {
    *fetchDigitalMediaList(_, { call, put, select }) {
      const list = yield select(state => state.digital.mediaList);
      if (list.length > 0) {
        return list;
      }
      const response = yield call(queryDigitalMediaList);
      if (response == null || response.length === 0) {
        return;
      }
      const result = response.map(item => {
        return {
          mediaName: item.mediaName,
          mediaId: item.id,
          mediaType: item.mediaType,
        };
      });
      yield put({
        type: 'saveMediaList',
        payload: result,
      });
      return result;
    },
    *editOrAddPaper({ payload }, { call }) {
      return yield call(postEditOrNewPaper, payload);
    },
    *deletePaper({ payload }, { call }) {
      return yield call(deletePaper, payload);
    },
    *editOrAddPaperConfig({ payload }, { call }) {
      return yield call(postEditOrNewPaperConfig, payload);
    },
    *deletePaperConfig({ payload }, { call }) {
      return yield call(deletePaperConfig, payload);
    },
    *fetchMediaTemplateData({ payload }, { call, select, put }) {
      const { PaperConfigurations } = DigitalModel;
      const { templateType } = payload;
      if (templateType === PaperConfigurations.BG_MUSIC.key) {
        const list = yield select(state => state.digital.musicTemplates);
        if (list.length > 0) {
          return list;
        }
        const response = yield call(queryMediaTemplateData, payload);
        if (response == null || response.length === 0) {
          return;
        }
        yield put({
          type: 'saveMusicTemplates',
          payload: response,
        });
        return response;
      }
      return yield call(queryMediaTemplateData, payload);
    },
    *postEditOrAddNewspaper({ payload }, { call }) {
      return yield call(postEditOrAddNewspaper, payload);
    },
    *deleteNewspaper({ payload }, { call }) {
      return yield call(deleteNewspaper, payload);
    },
    *fetchNewspaperLayoutIds({ payload }, { put }) {
      const ids = payload.map(item => item.id);
      yield put({
        type: 'saveLayoutIds',
        payload: ids,
      });
    },
    *fetchLayoutList({ payload }, { call }) {
      return yield call(queryLayoutList, payload);
    },
    *postEditOrAddNewspaperLayout({ payload }, { call }) {
      return yield call(postEditOrAddNewspaperLayout, payload);
    },
    *fetchNewspaperLayoutDetail({ payload }, { call }) {
      return yield call(queryNewspaperLayoutDetail, payload);
    },
    *deleteNewspaperLayout({ payload }, { call }) {
      return yield call(deleteNewspaperLayout, payload);
    },
    *editTemplate({ payload }, { call }) {
      return yield call(editTemplate, payload);
    },
    *postEditPublishState({ payload }, { call }) {
      return yield call(postEditPublishState, payload);
    },
    *queryMediaTemplateData({ payload }, { call }) {
      return yield call(queryMediaTemplateData, payload);
    },
    *fetchNewspaperNewsData({ payload }, { call }) {
      return yield call(queryNewspaperNewsData, payload);
    },
    *fetchNewspaperNewsDetail({ payload }, { call }) {
      return yield call(queryNewspaperNewsDetail, payload);
    },
    *postEditOrAddNewspaperNews({ payload }, { call }) {
      return yield call(postEditOrAddNewspaperNews, payload);
    },
    *deleteNewspaperNews({ payload }, { call }) {
      return yield call(deleteNewspaperNews, payload);
    },
    *postImgFileWithAliOcr({ payload }, { call }) {
      return yield call(postImgFileWithAliOcr, payload);
    },
  },

  reducers: {
    saveMediaList(state, { payload }) {
      return {
        ...state,
        mediaList: payload,
      };
    },
    saveLayoutIds(state, { payload }) {
      return {
        ...state,
        pageIds: payload,
      };
    },
    saveMusicTemplates(state, { payload }) {
      return {
        ...state,
        musicTemplates: payload,
      };
    },
  },
};
