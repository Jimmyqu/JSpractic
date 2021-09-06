import {
  postEditOrNewLeaseConfig,
  postDeleteLeaseConfig,
  fetchLeaseGroupList,
  postLeaseBatchImport,
  postDeleteleaseGroup,
  postEditOrNewLeaseGroup,
  postDeleteLeasePriceGroup,
  postEditOrNewLeasePriceGroup,
  postDeleteLeasePriceConfig,
  postEditOrNewLeasePriceConfig,
  postDeleteLease,
  postEditOrNewLease,
  fetchLeasePriceGroupList,
  postBatchEditLease,
  postBatchSetLeaseState,
} from '@/services/rent';
import { RentModel } from '@/commons/lib/models';

export default {
  // 储物柜
  namespace: 'rent',
  state: {
    ...RentModel,
  },

  effects: {
    *deleteLeaseProject({ payload }, { call }) {
      yield call(postDeleteLease, payload);
    },
    *editOrAddLeaseProject({ payload }, { call }) {
      yield call(postEditOrNewLease, payload);
    },
    *editLeaseProjects({ payload }, { call }) {
      yield call(postBatchEditLease, payload);
    },
    *editOrAddLeaseConfig({ payload }, { call }) {
      yield call(postEditOrNewLeaseConfig, payload);
    },
    *deleteLeaseConfig({ payload }, { call }) {
      yield call(postDeleteLeaseConfig, payload);
    },
    *queryLeaseGroupList({ payload }, { call }) {
      return yield call(fetchLeaseGroupList, payload);
    },
    *queryLeasePriceGroupList({ payload }, { call }) {
      return yield call(fetchLeasePriceGroupList, payload);
    },
    *queryLeaseGroupListBy({ payload }, { put, select }) {
      // currentVenue 是BasicLayout确保的
      const currentItem = yield select(state => state.venue.currentItem);
      if (currentItem == null && payload.professionalId == null) {
        return;
      }
      const currentVenue = yield select(state => state.venue.currentVenue);
      return yield put({
        type: 'queryLeaseGroupList',
        payload: {
          salesId: currentVenue.id,
          professionalId: currentItem.itemId,
          ...payload,
        },
      });
    },
    *leaseBatchImport({ payload }, { call }) {
      yield call(postLeaseBatchImport, payload);
    },
    *deleteLeaseGroup({ payload }, { call }) {
      yield call(postDeleteleaseGroup, payload);
    },
    *editOrAddLeaseGroup({ payload }, { call }) {
      yield call(postEditOrNewLeaseGroup, payload);
    },
    *deleteLeasePriceGroup({ payload }, { call }) {
      yield call(postDeleteLeasePriceGroup, payload);
    },
    *editOrNewLeasePriceGroup({ payload }, { call }) {
      yield call(postEditOrNewLeasePriceGroup, payload);
    },
    *deleteLeasePriceConfig({ payload }, { call }) {
      yield call(postDeleteLeasePriceConfig, payload);
    },
    *editOrAddLeasePriceConfig({ payload }, { call }) {
      yield call(postEditOrNewLeasePriceConfig, payload);
    },
    *batchSetClean({ payload }, { call, select }) {
      const list = payload || [];
      const { RentOperationTypes } = yield select(state => state.rent);
      yield call(postBatchSetLeaseState, {
        type: RentOperationTypes.CLEAN.key,
        ids: list,
      });
    },
  },

  reducers: {},
};
