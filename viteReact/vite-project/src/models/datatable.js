import { queryPersonalizationByPage, queryPersonalizationByKey, postPersonalization } from '@/services/api';

export default {
  // 查询表单
  namespace: 'datatable',

  state: {
    // form: {},
    tablePersonalizationMapping: {},
  },

  effects: {
    // *formValuesChange({ payload }, { put }) {
    //   yield put({
    //     type: 'flushCurrentForm',
    //     payload,
    //   });
    // },
    *fetchPagePersonalization(_, { call, put }) {
      const list = yield call(queryPersonalizationByPage, {
        pageUrl: window.location.pathname,
      });
      const mapping = {};
      (list || []).forEach(({ tableKey, personalizeConfig }) => {
        try {
          mapping[tableKey] = JSON.parse(personalizeConfig);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn(e);
          mapping[tableKey] = null;
        }
      });
      yield put({
        type: 'flushPagePersonalizationData',
        payload: mapping,
      });
    },
    *fetchTablePersonalization({ payload }, { call, put }) {
      const { key } = payload || {};
      if (key == null) {
        return null;
      }
      const data = yield call(queryPersonalizationByKey, {
        pageUrl: window.location.pathname,
        tableKey: key,
      });
      const { personalizeConfig } = data || {};
      let config;
      try {
        config = JSON.parse(personalizeConfig);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(e);
      }
      yield put({
        type: 'flushTablePersonalizationData',
        payload: {
          key,
          value: config,
        },
      });
    },
    *saveTablePersonalization({ payload }, { call, put }) {
      const { key, config } = payload || {};
      if (key == null) {
        return;
      }
      yield call(postPersonalization, {
        pageUrl: window.location.pathname,
        tableKey: key,
        personalizeConfig: JSON.stringify(config),
      });
      yield put({
        type: 'flushTablePersonalizationData',
        payload: {
          key,
          value: config,
        },
      });
    },
  },

  reducers: {
    // flushCurrentForm(state, { payload }) {
    //   return {
    //     ...state,
    //     form: payload || {},
    //   };
    // },
    flushPagePersonalizationData(state, { payload }) {
      return {
        ...state,
        tablePersonalizationMapping: payload,
      };
    },
    flushTablePersonalizationData(state, { payload }) {
      const { key, value } = payload;
      return {
        ...state,
        tablePersonalizationMapping: {
          ...state.tablePersonalizationMapping,
          [key]: value,
        },
      };
    },
  },
};
