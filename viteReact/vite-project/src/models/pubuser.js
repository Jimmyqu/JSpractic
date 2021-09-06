import merge from 'lodash/merge';
import {
  queryPubUserCount,
  fetchUserListBySomething,
  createNewPubUser,
  fetchPubUserInfo,
  saveUserBasicInfo,
  postTopUpAmount,
  withdrawAmount,
  adjustmentCreditQuota,
  payBackCredit,
  resetPwd,
  changeMemberLevel,
  queryMemberLevelByLevelId,
  postSaveMemberLevel,
  deleteMemberLevel,
  queryMemberByEquitylId,
  postSaveMemberEquity,
  deleteMemberEquity,
  relevanceBusiness,
  getMemberLevelEquity,
  getLevelList,
  getListByCompanyId,
  postSaveOuterRel,
  deleteOuterRel,
  getSrv,
  saveLevelInfo,
  getLevelInfo,
  queryMemberUpgradeMode,
  queryAllMemberUpgradeMode,
} from '@/services/pubuser';
import { PubUserModel } from '@/commons/lib/models';

export default {
  // 会员
  namespace: 'pubuser',

  state: {
    ...PubUserModel,

    userCount: 0,
    userFetchMapping: {}, // 查找用户时，名称或者手机号为key的缓存

    userInfoCache: {}, // pubAccountId查询的用户缓存
  },

  effects: {
    *fetchById({ payload }, { call }) {
      if (!payload) {
        return;
      }
      return yield call(fetchPubUserInfo, {
        publicAccountId: payload,
      });
    },
    fetch: [
      function* fetch({ payload }, { put, putResolve }) {
        const key = payload;
        let response = yield putResolve({
          type: 'fetchById',
          payload: key,
        });
        response = response || {};
        yield put({
          type: 'cacheUserInfo',
          payload: {
            key,
            value: response,
          },
        });
      },
      {
        type: 'takeLatest',
      },
    ],
    *fetchUserCount(_, { call, put }) {
      const response = yield call(queryPubUserCount);
      yield put({
        type: 'saveUserCount',
        payload: response,
      });
    },
    fetchUserByKey: [
      function* fetchUserByKey({ payload }, { call, put }) {
        const key = payload.mobile || payload.realName;
        let response = yield call(fetchUserListBySomething, payload);
        response = response || [];
        yield put({
          type: 'cacheUserMapping',
          payload: {
            key,
            value: response,
          },
        });
        return response;
      },
      {
        type: 'takeLatest',
      },
    ],
    *createUser({ payload }, { call, put, select }) {
      const response = yield call(createNewPubUser, payload);
      const userCount = yield select(state => state.pubuser.userCount);
      yield put({
        type: 'saveUserCount',
        payload: (userCount || 0) + 1,
      });
      yield put({
        type: 'cacheUserMapping',
        payload: {
          key: payload.mobile,
          value: [response],
        },
      });
      return response;
    },
    *basicSave({ payload }, { call, select, put }) {
      const key = payload.publicAccount.id;
      const old = yield select(state => state.pubuser.userInfoCache[key]);
      yield call(saveUserBasicInfo, payload);
      const newObj = merge({}, old, payload);
      yield put({
        type: 'cacheUserInfo',
        payload: {
          key,
          value: newObj,
        },
      });
    },

    *addFeeForCacheUser({ payload: { key, fee } }, { select, put }) {
      const old = yield select(state => state.pubuser.userInfoCache[key]);
      if (old == null) {
        return;
      }
      yield put({
        type: 'cacheUserInfo',
        payload: {
          key,
          value: {
            ...old,
            publicAccount: {
              ...old.publicAccount,
              accountFee: old.publicAccount.accountFee + fee,
              accountTotalFee: old.publicAccount.accountTotalFee + fee,
            },
          },
        },
      });
    },
    *topUpAmount({ payload }, { call }) {
      return yield call(postTopUpAmount, payload);
    },
    *withdrawAmount({ payload }, { call }) {
      return yield call(withdrawAmount, payload);
    },
    *updateCreditForCacheUser({ payload: { key, credit } }, { select, put }) {
      const old = yield select(state => state.pubuser.userInfoCache[key]);
      if (old == null) {
        return;
      }
      yield put({
        type: 'cacheUserInfo',
        payload: {
          key,
          value: {
            ...old,
            publicAccount: {
              ...old.publicAccount,
              creditLimit: old.publicAccount.creditLimit + credit,
              creditBalance: old.publicAccount.creditBalance + credit,
            },
          },
        },
      });
    },
    *adjustmentCreditQuota({ payload }, { call, put, select }) {
      yield call(adjustmentCreditQuota, payload);
      const { publicAccountId, creditValue, creditType } = payload;
      const CreditTypes = yield select(state => state.pubuser.CreditTypes);
      if (creditType === CreditTypes.ADD.key || creditType === CreditTypes.SUB.key) {
        yield put({
          type: 'updateCreditForCacheUser',
          payload: {
            key: publicAccountId,
            credit: creditType === CreditTypes.ADD.key ? creditValue : -creditValue,
          },
        });
      }
    },
    *payBackCredit({ payload }, { call }) {
      return yield call(payBackCredit, payload);
    },
    *resetPwd({ payload }, { call }) {
      return yield call(resetPwd, payload);
    },
    *changeMemberLevel({ payload }, { call }) {
      return yield call(changeMemberLevel, payload);
    },
    *getMemberLevelByLevelId({ payload }, { call }) {
      return yield call(queryMemberLevelByLevelId, {
        id: payload,
      });
    },
    *getMemberUpgradeMode(_, { call }) {
      return yield call(queryMemberUpgradeMode);
    },
    *getAllMemberUpgradeMode(_, { call }) {
      return yield call(queryAllMemberUpgradeMode);
    },
    *saveMemberLevel({ payload }, { call }) {
      yield call(postSaveMemberLevel, payload);
    },
    *deleteMemberLevel({ payload }, { call }) {
      yield call(deleteMemberLevel, payload);
    },
    *getMemberByEquityId({ payload }, { call }) {
      return yield call(queryMemberByEquitylId, {
        id: payload,
      });
    },
    *saveMemberEquity({ payload }, { call }) {
      yield call(postSaveMemberEquity, payload);
    },
    *deleteMemberEquity({ payload }, { call }) {
      yield call(deleteMemberEquity, payload);
    },
    *relevanceBusiness({ payload }, { call }) {
      return yield call(relevanceBusiness, payload);
    },
    *getMemberLevelEquity({ payload }, { call }) {
      return yield call(getMemberLevelEquity, payload);
    },
    *getLevelList({ payload }, { call }) {
      return yield call(getLevelList, payload);
    },
    *getLevelInfo({ payload }, { call }) {
      return yield call(getLevelInfo, payload);
    },
    *saveLevelInfo({ payload }, { call }) {
      yield call(saveLevelInfo, payload);
    },
    *fetchInterestsList(_, { call, put }) {
      const response = yield call(getListByCompanyId);
      yield put({
        type: 'saveInterestsList',
        payload: response || [],
      });
    },
    *saveOuterRel({ payload }, { call }) {
      yield call(postSaveOuterRel, payload);
    },
    *deleteOuterRel({ payload }, { call }) {
      yield call(deleteOuterRel, payload);
    },
    *fetchSrvList(_, { call, put, select }) {
      let response = yield select(state => state.pubuser.srvList);
      if (response) {
        return;
      }
      response = yield call(getSrv);
      yield put({
        type: 'saveSrvList',
        payload: response || [],
      });
    },
  },

  reducers: {
    saveUserCount(state, { payload }) {
      return {
        ...state,
        userCount: payload,
      };
    },
    cacheUserMapping(state, { payload: { key, value } }) {
      const clean = Object.keys(state.userFetchMapping).length > 30;
      return {
        ...state,
        userFetchMapping: {
          ...(clean ? {} : state.userFetchMapping),
          [key]: value,
        },
      };
    },
    cacheUserInfo(state, { payload: { key, value } }) {
      const clean = Object.keys(state.userInfoCache).length > 1000;
      return {
        ...state,
        userInfoCache: {
          ...(clean ? {} : state.userInfoCache),
          [key]: value,
        },
      };
    },
    saveInterestsList(state, action) {
      return {
        ...state,
        interestsList: action.payload,
      };
    },
    saveSrvList(state, action) {
      return {
        ...state,
        srvList: action.payload,
      };
    },
  },
};
