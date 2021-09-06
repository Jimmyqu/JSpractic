import { push, replace } from 'connected-react-router';
import { stringify } from 'qs';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import { appStore, sessionStore } from '@/commons/lib/store';
import { doAccountLogin, doAccountLoginByAfs, doAccountLogout } from '@/services/api';
import { querySysUserIds, postSendSMS, postToCheckSMSForForgot, postChangePwdForForgot } from '@/services/user';

let flagNumber = 1;
const RE_LOGIN_FLAG = 're-login-flag';

export default {
  // 登录
  namespace: 'login',

  state: {
    status: undefined,
    sysUserList: undefined,
  },

  effects: {
    *login({ payload }, { call }) {
      return yield call(doAccountLogin, payload);
    },
    *loginByAfs({ payload }, { call, put, select }) {
      const { type, ...rest } = payload;
      let response = yield call(doAccountLoginByAfs, rest);
      response = Number(response);
      if (Number.isNaN(response)) {
        response = {
          status: false,
          type,
          currentAuthority: 'guest',
        };
      } else {
        const Roles = yield select(state => state.user.Roles);
        const roles = Object.keys(Roles);
        response = {
          status: 'ok',
          type,
          currentAuthority: roles.find(key => Roles[key].key === response),
        };
      }
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status === 'ok') {
        // 更新一个值
        flagNumber += 1;
        appStore.put(RE_LOGIN_FLAG, flagNumber);
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        let redirect = urlParams.searchParams.get('redirect');
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.slice(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.slice(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(replace(redirect || '/'));
      }
    },
    *logout({ payload }, { put, call }) {
      yield call(doAccountLogout);
      // 删除
      appStore.put(RE_LOGIN_FLAG, 0);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      sessionStore.clear();
      // const urlParams = new URL(window.location.href);
      // const redirect = urlParams.searchParams.get('redirect');
      yield put(
        push({
          pathname: '/user/login',
          search: payload
            ? stringify({
                redirect: payload,
              })
            : null,
        })
      );

      // 登出清理
      yield put({
        type: 'saveSysUserList',
        payload: null,
      });
      yield put({
        type: 'venue/clean',
      });
      yield put({
        type: 'activity/clean',
      });
      yield put({
        type: 'global/clean',
      });
      yield put({
        type: 'booking/clean',
      });
      yield put({
        type: 'pubinvoice/clean',
      });
    },
    *sysUser({ payload }, { call, put }) {
      const response = yield call(querySysUserIds, payload);
      yield put({
        type: 'saveSysUserList',
        payload: response || [],
      });
    },
    *sendSms({ payload }, { call }) {
      yield call(postSendSMS, payload);
    },
    *checkSmsForForgot({ payload }, { call }) {
      return yield call(postToCheckSMSForForgot, payload);
    },
    *changePwdForForgot({ payload }, { call }) {
      yield call(postChangePwdForForgot, payload);
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    saveSysUserList(state, { payload }) {
      return {
        ...state,
        sysUserList: payload,
      };
    },
  },
};
