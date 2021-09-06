import {
  queryCurrent,
  queryMenu,
  postChangePwd,
  postChangeAuth,
  loadRoleList,
  postEditOrNew,
  postChangeMyPwd,
  fetchUserListBySomething,
} from '@/services/user';

export default {
  // cloud 用户
  namespace: 'user',

  state: {
    Roles: {
      guest: {
        key: -1,
        value: '访客',
      },
      user: {
        key: 0,
        value: '授权用户',
      },
      superadmin: {
        key: 1,
        value: '管理员',
      },
      authadmin: {
        key: 2,
        value: '授权管理员',
      },
    },
    UserStatus: {
      Enable: {
        key: 0,
        value: '可用',
      },
      Disabled: {
        key: 1,
        value: '禁用',
      },
    },
    currentUser: {
      // 客户端与服务器时钟偏移量（毫秒）
      duration: 0,
    },
    serverMenuData: null,
    rolesMapping: {}, // companyId为key的角色集合
  },

  effects: {
    *editOrNew({ payload }, { call }) {
      yield call(postEditOrNew, payload);
    },
    *changepwd({ payload }, { call }) {
      yield call(postChangePwd, payload);
    },
    *changeMypwd({ payload }, { call }) {
      yield call(postChangeMyPwd, payload);
    },
    *changeAuth({ payload }, { call }) {
      yield call(postChangeAuth, payload);
    },
    *fetchRoles({ payload }, { call, put, select }) {
      const companyId = payload;
      let response = yield select(state => state.user.rolesMapping[companyId]);
      if (response) {
        return;
      }
      response = yield call(loadRoleList, {
        companyId,
      });
      response = response || [];
      yield put({
        type: 'saveRoles',
        payload: {
          key: companyId,
          value: response,
        },
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
      return response;
    },
    *fetchMenu(_, { call, put }) {
      const response = yield call(queryMenu);
      yield put({
        type: 'saveMenu',
        payload: response || [], // 保证查询后存储为非null
      });
    },
    *clearServerMenuData(_, { put }) {
      yield put({
        type: 'clearMenu',
      });
    },
    fetchUserByKey: [
      function* fetchUserByKey({ payload }, { call }) {
        return yield call(fetchUserListBySomething, payload);
      },
      {
        type: 'takeLatest',
      },
    ],
  },

  reducers: {
    saveRoles(state, { payload }) {
      const { key, value } = payload;
      return {
        ...state,
        rolesMapping: {
          ...state.rolesMapping,
          [key]: value,
        },
      };
    },
    saveCurrentUser(state, action) {
      const { currentTime, ...reset } = action.payload || {};
      const now = Date.now();
      return {
        ...state,
        currentUser: {
          ...reset,
          duration: now - (currentTime == null ? now : currentTime),
          notifyCount: state.currentUser.notifyCount, // queryCurrent接口notifyCount数据丢弃
        },
      };
    },
    saveMenu(state, action) {
      return {
        ...state,
        serverMenuData: action.payload,
      };
    },
    clearMenu(state) {
      return {
        ...state,
        serverMenuData: undefined,
      };
    },

    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
    addNotifyCount(state, action) {
      const { notifyCount } = state.currentUser || {};
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: (Number.isInteger(notifyCount) ? notifyCount : 0) + action.payload,
        },
      };
    },
  },
};
