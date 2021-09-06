import {
  queryDeclareFixedFields,
  queryDeclareTypes,
  queryDeclareFields,
  deleteActivity,
  queryActivityDeclareLog,
  queryActivityNodeDetail,
  queryActivityNodeList,
  queryActivityDeclareCompanyList,
  saveActivity,
  saveActivityNode,
  submitActivityNode,
  auditActivityNode,
  saveActivityExtensions,
  queryProjectGroupList,
  queryExerciseDeclareFillList,
} from '@/services/activity';
import { ActivityModel } from '@/commons/lib/models';
import { getPageQuery } from '@/utils/utils';

export default {
  // 活动(申报)
  namespace: 'activity',

  state: {
    PathReg: /^\/basic\/activity\/([\w|-]+)\//m,
    ...ActivityModel,

    categoryDataListMapping: {}, // key:industry 配置项的自定义字段

    dynamicDeclareFieldsMapping: {}, // key:configId 配置项的自定义字段
    nodeListMapping: {}, // key:configId 配置项的节点列表
  },

  effects: {
    *fetchExerciseDeclareFillList({ payload }, { call }) {
      if (payload == null) {
        return null;
      }
      return yield call(queryExerciseDeclareFillList, {
        exerciseProjectId: payload,
      });
    },
    *fetchProjectGroupList({ payload }, { call }) {
      if (payload == null) {
        return null;
      }
      return yield call(queryProjectGroupList, {
        declareConfigId: payload,
      });
    },
    *audit({ payload }, { call }) {
      yield call(auditActivityNode, payload);
    },
    *saveExtensions({ payload }, { call }) {
      yield call(saveActivityExtensions, payload);
    },
    *saveTabData({ payload }, { call }) {
      yield call(saveActivityNode, payload);
    },
    *submitNode({ payload }, { call }) {
      yield call(submitActivityNode, payload);
    },
    *save({ payload }, { call }) {
      return yield call(saveActivity, payload);
    },
    *fetchDeclareCompany({ payload }, { call }) {
      const response = yield call(queryActivityDeclareCompanyList, {
        companyName: payload,
      });
      return response || [];
    },
    *fetchDeclareFixedFields({ payload }, { call }) {
      const response = yield call(queryDeclareFixedFields, payload);
      return response || [];
    },
    *fetchDeclareTypes({ payload }, { put, call }) {
      const { industry } = payload;
      let response;
      // if (!override) {
      //   response = yield select(state => state.activity.categoryDataListMapping[industry]);
      //   if (response) {
      //     return response;
      //   }
      // }
      // yield put({
      //   type: 'saveCategoryDataList',
      //   payload: {
      //     key: industry,
      //     value: [],
      //   },
      // });
      response = yield call(queryDeclareTypes, payload);
      response = response || [];
      yield put({
        type: 'saveCategoryDataList',
        payload: {
          key: industry,
          value: response,
        },
      });
      return response;
    },
    *fetchDeclareFields({ payload }, { put, call, select }) {
      const configId = payload;
      if (configId == null) {
        return;
      }
      let response = yield select(state => state.activity.dynamicDeclareFieldsMapping[configId]);
      if (response) {
        return response;
      }
      response = yield call(queryDeclareFields, {
        configId,
      });
      response = response || [];
      yield put({
        type: 'saveConfigDeclareFields',
        payload: {
          key: configId,
          value: response,
        },
      });
      return response;
    },
    *delete({ payload }, { call }) {
      yield call(deleteActivity, {
        ids: payload,
      });
    },
    *fetchLog({ payload }, { call }) {
      const exerciseId = payload;
      if (exerciseId == null) {
        return;
      }
      const response = yield call(queryActivityDeclareLog, {
        exerciseId,
      });
      return response;
    },
    *fetchNodeDetail({ payload }, { call }) {
      const { step: specStep } = payload || {};
      const query = getPageQuery();
      const { id: exerciseId, step } = query;
      const nodeStep = specStep || step;
      if (exerciseId == null) {
        return;
      }
      let response = yield call(queryActivityNodeDetail, {
        exerciseId,
        nodeStep,
      });
      response = response || {};
      response.declareCurrentNode = response.declareCurrentNode || {};
      response.declareCurrentNode.fromServer = true;
      return response;
    },
    *fetchNodeList({ payload }, { put, call, select }) {
      const configId = payload;
      if (configId == null) {
        return;
      }
      let response = yield select(state => state.activity.nodeListMapping[configId]);
      if (response) {
        return;
      }
      yield put({
        type: 'saveConfigNodeList',
        payload: {
          key: configId,
          value: [], // 先占位
        },
      });
      response = yield call(queryActivityNodeList, {
        configId,
      });
      response = response || [];
      yield put({
        type: 'saveConfigNodeList',
        payload: {
          key: configId,
          value: response,
        },
      });
    },
  },

  reducers: {
    saveCategoryDataList(state, { payload }) {
      const { key, value } = payload;
      return {
        ...state,
        categoryDataListMapping: {
          ...state.categoryDataListMapping,
          [key]: value,
        },
      };
    },
    saveConfigDeclareFields(state, { payload }) {
      const { key, value } = payload;
      return {
        ...state,
        dynamicDeclareFieldsMapping: {
          ...state.dynamicDeclareFieldsMapping,
          [key]: value,
        },
      };
    },
    saveConfigNodeList(state, { payload }) {
      const { key, value } = payload;
      return {
        ...state,
        nodeListMapping: {
          ...state.nodeListMapping,
          [key]: value,
        },
      };
    },
    clean(state) {
      return {
        ...state,
        categoryDataListMapping: {},
        dynamicDeclareFieldsMapping: {},
        nodeListMapping: {},
      };
    },
  },
};
