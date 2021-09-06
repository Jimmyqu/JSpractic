import { PubServiceUserModel } from '@/commons/lib/models';
import {
  postSaveCertCfg,
  queryCertCfgById,
  postSaveAuditCfg,
  queryCertCfgListForSelect,
  removeCertCfgByIds,
  removeAuditCfgByIds,
  queryAuditNodeGroupListForSelect,
  postSaveAuditNode,
  removeAuditNodeByIds,
  postBatchSaveAuditNodeGroup,
  postEditAuditNodeGroupById,
  removeAuditNodeGroupByIds,
  postAddAuditNodeGroupUser,
  removeAuditNodeGroupUserByIds,
  postEditAuditNodeGroupUserById,
  removeCertInfoByIds,
  postEditCertInfoById,
  postAddCertInfoById,
  queryExtFieldCategoryList,
  queryCertUserCareerList,
  queryCertUserExtConfigSearch,
  postAddCertUser,
  queryCertUserInfo,
  certUserlinkPubAccountUser,
  postAuditCertUser,
  postUpdateCertUser,
  postDeleteCertUsers,
  postUpdateCertUserDetailInfo,
  queryCertAvailableAuditState,
  queryCertDataList,
  postCertDataDetailInfo,
  postCancelCert,
  querySysUserCertExtConfigSearch,
  querySysUserCertCareerList,
  auditKeySave,
  auditKeyDelete,
  updateCertNo,
  saveExportTemplate,
  postDeleteCertTemplate,
  postEditCertTemplate,
  queryCertDataListByRelType,
  queryKeyListByRelTypeAndImg,
  queryKeyListByRelTypeAndExcel,
  postSaveImageKeys,
  queryImageKeysByTemplateId,
  postExportExcel,
  postExportImage,
  postToZipImage,
} from '@/services/pubserviceuser';

export default {
  // 场地
  namespace: 'pubserviceuser',

  state: {
    ...PubServiceUserModel,

    ExtFieldCategoryList: undefined,
  },

  effects: {
    *getCertCfgById({ payload }, { call }) {
      return yield call(queryCertCfgById, {
        id: payload,
      });
    },
    *editCertCfg({ payload }, { call }) {
      yield call(postSaveCertCfg, payload);
    },
    *cancelCert({ payload }, { call }) {
      yield call(postCancelCert, payload);
    },
    *delCertCfg({ payload }, { call }) {
      yield call(removeCertCfgByIds, {
        ids: payload,
      });
    },
    *fetchCertCfgListForSelect(_, { call }) {
      return yield call(queryCertCfgListForSelect);
    },
    *editAuditCfg({ payload }, { call }) {
      yield call(postSaveAuditCfg, payload);
    },
    *delAuditCfg({ payload }, { call }) {
      yield call(removeAuditCfgByIds, {
        ids: payload,
      });
    },
    *fetchAuditNodeGroupListForSelect({ payload }, { call }) {
      const configId = payload;
      if (!configId) {
        return null;
      }
      return yield call(queryAuditNodeGroupListForSelect, {
        configId,
      });
    },
    *editAuditNode({ payload }, { call }) {
      yield call(postSaveAuditNode, payload);
    },
    *delAuditNode({ payload }, { call }) {
      yield call(removeAuditNodeByIds, {
        ids: payload,
      });
    },
    *batchSaveAuditNodeGroup({ payload }, { call }) {
      yield call(postBatchSaveAuditNodeGroup, payload);
    },
    *editAuditNodeGroup({ payload }, { call }) {
      yield call(postEditAuditNodeGroupById, payload);
    },
    *delAuditNodeGroup({ payload }, { call }) {
      yield call(removeAuditNodeGroupByIds, {
        ids: payload,
      });
    },
    *addAuditNodeGroupUser({ payload }, { call }) {
      yield call(postAddAuditNodeGroupUser, payload);
    },
    *delAuditNodeGroupUserByIds({ payload }, { call }) {
      yield call(removeAuditNodeGroupUserByIds, {
        ids: payload,
      });
    },
    *editAuditNodeGroupUser({ payload }, { call }) {
      yield call(postEditAuditNodeGroupUserById, payload);
    },
    *delCertInfoByIds({ payload }, { call }) {
      yield call(removeCertInfoByIds, {
        ids: payload,
      });
    },
    *addTemplateInfo({ payload }, { call }) {
      yield call(saveExportTemplate, payload);
    },
    *delCertTemplate({ payload }, { call }) {
      yield call(postDeleteCertTemplate, {
        ids: payload,
      });
    },
    *editCertTemplate({ payload }, { call }) {
      yield call(postEditCertTemplate, payload);
    },
    *addCertInfo({ payload }, { call }) {
      yield call(postAddCertInfoById, payload);
    },
    *editCertInfo({ payload }, { call }) {
      yield call(postEditCertInfoById, payload);
    },
    *saveCertTemplate({ payload }, { call }) {
      return yield call(postSaveImageKeys, payload);
    },
    *fetchtImageKeysByTemplateId({ payload }, { call }) {
      const { templateId } = payload;
      if (!templateId) {
        return null;
      }
      return yield call(queryImageKeysByTemplateId, {
        templateId,
      });
    },
    *fetchExtFieldCategoryList(_, { call, put, select }) {
      const list = yield select(state => state.pubserviceuser.ExtFieldCategoryList);
      if (list == null) {
        const result = yield call(queryExtFieldCategoryList);
        yield put({
          type: 'saveExtFieldCategoryList',
          payload: result || [],
        });
      }
    },
    *fetchCertUserCareerList(_, { call }) {
      return yield call(queryCertUserCareerList);
    },
    *fetchCertDataListByRelType({ payload }, { call }) {
      return yield call(queryCertDataListByRelType, payload);
    },
    *fetchKeyListByRelTypeAndImg({ payload }, { call }) {
      return yield call(queryKeyListByRelTypeAndImg, payload);
    },
    *fetchKeyListByRelTypeAndExcel({ payload }, { call }) {
      return yield call(queryKeyListByRelTypeAndExcel, payload);
    },
    *fetchSysUserCertCareerList(_, { call }) {
      return yield call(querySysUserCertCareerList);
    },
    *fetchCertDataList(_, { call }) {
      return yield call(queryCertDataList);
    },
    *fetchCertUserExtConfigSearch({ payload }, { call }) {
      return yield call(queryCertUserExtConfigSearch, payload);
    },
    *fetchSysUserCertExtConfigSearch({ payload }, { call }) {
      return yield call(querySysUserCertExtConfigSearch, payload);
    },
    *addCertUser({ payload }, { call }) {
      yield call(postAddCertUser, payload);
    },
    *fetchCertUser({ payload }, { call }) {
      const id = payload;
      if (!id) {
        return null;
      }
      return yield call(queryCertUserInfo, { id });
    },
    *certUserlinkPubUser({ payload }, { call }) {
      yield call(certUserlinkPubAccountUser, payload);
    },
    *auditcertUser({ payload }, { call }) {
      yield call(postAuditCertUser, payload);
    },
    *downloadExportExcel({ payload }, { call }) {
      return yield call(postExportExcel, payload);
    },
    *downloadExportImage({ payload }, { call }) {
      return yield call(postExportImage, payload);
    },
    *postToImageZip({ payload }, { call }) {
      return yield call(postToZipImage, payload);
    },
    *updateCertUser({ payload }, { call }) {
      yield call(postUpdateCertUser, payload);
    },
    *deleteCertUsers({ payload }, { call }) {
      yield call(postDeleteCertUsers, payload);
    },
    *updateCertUserDetailInfo({ payload }, { call }) {
      yield call(postUpdateCertUserDetailInfo, payload);
    },
    *updateCertDataDetailInfo({ payload }, { call }) {
      yield call(postCertDataDetailInfo, payload);
    },
    *fetchCertAvailableAuditState({ payload }, { call }) {
      return yield call(queryCertAvailableAuditState, payload);
    },
    *auditKeySave({ payload }, { call }) {
      return yield call(auditKeySave, payload);
    },
    *auditKeyDelete({ payload }, { call }) {
      return yield call(auditKeyDelete, payload);
    },
    *updateCertNo({ payload }, { call }) {
      return yield call(updateCertNo, payload);
    },
  },

  reducers: {
    saveExtFieldCategoryList(state, { payload }) {
      return {
        ...state,
        ExtFieldCategoryList: payload,
      };
    },
  },
};
