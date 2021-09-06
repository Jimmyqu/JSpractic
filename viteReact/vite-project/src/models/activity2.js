import {
  queryReqCfg,
  queryReqFields,
  queryReqFieldsValue,
  postReqFieldsValue,
  postAddNewReviewer,
  postModifySmsConfig,
  postDelReviewer,
  queryAllNodes,
  postReqAudit,
  queryBasicFields,
  queryNodeDetail,
  queryAuditLog,
  queryActivityLog,
  postBasicInfo,
  postDataInfo,
  postDeleteActivity,
  postSubmitToAudit,
  postAudit,
  queryExportDetailFieldsConfig,
} from '@/services/activity2';
import { Activity2Model } from '@/commons/lib/models';

export default {
  // 新版活动(申报)
  namespace: 'activity2',

  state: {
    ...Activity2Model,
    // 根据配置查询的字段列表缓存
    fieldCfgCache: {},
  },

  effects: {
    *fetchReqCfgList(_, { call }) {
      return yield call(queryReqCfg);
    },
    *fetchReqValue({ payload }, { call }) {
      return yield call(queryReqFieldsValue, payload);
    },
    *saveReqValue({ payload }, { call }) {
      yield call(postReqFieldsValue, payload);
    },
    *addReviewer({ payload }, { call }) {
      yield call(postAddNewReviewer, payload);
    },
    *modifySmsConfig({ payload }, { call }) {
      yield call(postModifySmsConfig, payload);
    },
    *delReviewer({ payload }, { call }) {
      yield call(postDelReviewer, payload);
    },
    *fetchAllNodes({ payload }, { call }) {
      return yield call(queryAllNodes, payload);
    },
    *fetchNodeDetail({ payload }, { call }) {
      return yield call(queryNodeDetail, payload);
    },
    *fetchAuditLog({ payload }, { call }) {
      return yield call(queryAuditLog, payload);
    },
    *fetchActivityLog({ payload }, { call }) {
      return yield call(queryActivityLog, payload);
    },
    *saveBasicInfo({ payload }, { call }) {
      return yield call(postBasicInfo, payload);
    },
    *saveDataInfo({ payload }, { call }) {
      yield call(postDataInfo, payload);
    },
    *delActivity({ payload }, { call }) {
      yield call(postDeleteActivity, {
        exerciseId: payload,
      });
    },
    *submitToAudit({ payload }, { call }) {
      yield call(postSubmitToAudit, payload);
    },
    *audit({ payload }, { call }) {
      yield call(postAudit, payload);
    },
    *auditReq({ payload }, { call, select }) {
      const { ProjectAuditStates } = yield select(state => state.activity2);
      yield call(postReqAudit, {
        ...payload,
        auditState: payload.ok ? ProjectAuditStates.Approved.key : ProjectAuditStates.Rejected.key,
      });
    },
    *cancelReq({ payload }, { call, select }) {
      const { ProjectAuditStates } = yield select(state => state.activity2);
      yield call(postReqAudit, {
        ...payload,
        auditState: ProjectAuditStates.Cancel.key,
      });
    },
    *fetchReqFields({ payload }, { call, select, put }) {
      const configId = payload;
      if (!configId) {
        return;
      }
      const fields = yield select(state => state.activity2.fieldCfgCache[configId]);
      if (fields) {
        return;
      }
      const list = yield call(queryReqFields, {
        configId,
      });
      yield put({
        type: 'saveFieldCache',
        payload: {
          key: configId,
          value: list || [],
        },
      });
    },
    *fetchBasicFields({ payload }, { call }) {
      return yield call(queryBasicFields, payload);
    },
    *fetchExportDetailFieldsConfig({ payload }, { call }) {
      return yield call(queryExportDetailFieldsConfig, payload);
    },
  },

  reducers: {
    saveFieldCache(state, { payload }) {
      const { key, value } = payload;
      return {
        ...state,
        fieldCfgCache: {
          ...state.fieldCfgCache,
          [key]: value,
        },
      };
    },
  },
};
