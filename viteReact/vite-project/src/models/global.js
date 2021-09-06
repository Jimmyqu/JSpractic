import {
  queryBuildVersion,
  uploadDocFile,
  uploadImgFile,
  uploadAudioFile,
  uploadPdfToPng,
  uploadBase64Img,
  fetchJsConfig,
  postWechatScan,
  fetchDefaultHomeTown,
  updateFileStyle,
  addFile,
  queryFiles,
  queryFilesByKey,
  postStreamFileWithFaceValid,
  postBase64FileWithFaceValid,
  delStreamFile,
  delStreamFileAndSync,
  queryInfoByCode,
  postVerifyTicket,
  updateFaceFile,
  syncFaceFile,
  postAddBanUser,
  postAddICCardBinding,
  postUpdateIcPhysicsNo,
  postUpdateICCardBindState,
  postICCardRebindding,
  getCacheValue,
  setCacheValue,
} from '@/services/api';
import { appStore } from '@/commons/lib/store';
import { RelTypes, PaymentModel, CommonFileModel, QrCodeMatrixModel } from '@/commons/lib/models';
import { isiOS, isWeiXin, isNumber } from '@/utils/utils';
import { formatDateTime, formatTimeDuration, formatPercent } from '@/utils/format';

// iOS微信签名问题:hack
// 新打开的时候的地址
const entryUrl = window.location.href.split('#');
// let entryUrlAfterOnload = entryUrl;
// window.addEventListener('load', () => {
//   entryUrlAfterOnload = window.location.href.split('#');
// });

function fileObjListToMap(fileList) {
  const obj = {};
  fileList.forEach(file => {
    obj[file.fileKey] = file;
  });
  return obj;
}

const MUTE_KEY = 'global-voice-mute';

const todoListMax = 10;

export default {
  namespace: 'global',

  state: {
    RelTypes, // 数据类型
    PayPlatform: PaymentModel.PayPlatform,
    ...CommonFileModel,
    ...QrCodeMatrixModel,

    collapsed: false,
    notices: [],
    NoticeTypes: {
      Message: {
        key: 'message',
        value: '消息',
      },
      Todo: {
        key: 'todo',
        value: '待办',
      },
      Notification: {
        key: 'noti',
        value: '通知',
      },
    },

    TodoTags: {
      todo: '',
      processing: 'blue',
      urgent: 'red',
      doing: 'gold',
    },

    mute: appStore.get(MUTE_KEY),

    // 全局文件对象查询缓存
    fileCacheByKeyMapping: {},
  },

  effects: {
    *fetchBuildVersion(_, { call }) {
      return yield call(queryBuildVersion);
    },
    *wxJsConfig(_, { call }) {
      if (!isWeiXin()) {
        return;
      }
      return yield call(fetchJsConfig, {
        url: isiOS() ? entryUrl : window.location.href.split('#')[0],
      });
    },
    *wxScan({ payload }, { call }) {
      return yield call(postWechatScan, payload);
    },
    *queryByCode({ payload }, { call }) {
      const { code, action } = payload || {};
      return yield call(queryInfoByCode, {
        validCode: code,
        action,
      });
    },
    *verifyTicket({ payload }, { call }) {
      return yield call(postVerifyTicket, payload);
    },
    *uploadDocFile({ payload }, { call }) {
      return yield call(uploadDocFile, payload);
    },
    *uploadImgFile({ payload }, { call }) {
      return yield call(uploadImgFile, payload);
    },
    *uploadAudioFile({ payload }, { call }) {
      return yield call(uploadAudioFile, payload);
    },
    *uploadPdfToPng({ payload }, { call }) {
      return yield call(uploadPdfToPng, payload);
    },
    *uploadBase64Img({ payload }, { call }) {
      return yield call(uploadBase64Img, payload);
    },
    *addFile({ payload }, { call }) {
      return yield call(addFile, payload);
    },
    *fetchFiles({ payload }, { call }) {
      const { linkId } = payload;
      if (linkId == null) {
        return [];
      }
      const list = linkId.filter(Boolean);
      if (list.length === 0) {
        return [];
      }
      const result = yield call(queryFiles, {
        ...payload,
        linkId: list,
      });
      return result || [];
    },
    // 根据文件key获得文件对象，查询结果会缓存
    *fetchFilesByKey({ payload }, { call, put, select }) {
      const fileKeys = payload;
      if (fileKeys == null || fileKeys.length < 0) {
        return [];
      }
      const { fileCacheByKeyMapping } = yield select(state => state.global);
      const availableFileKeys = fileKeys.filter(key => typeof key === 'string');
      const newKeys = availableFileKeys.filter(key => fileCacheByKeyMapping[key] == null);
      const fileList = availableFileKeys.map(key => fileCacheByKeyMapping[key]).filter(Boolean);
      if (newKeys == null || newKeys.length < 0) {
        return fileObjListToMap(fileList);
      }
      const result = yield call(queryFilesByKey, {
        fileKeys: newKeys,
      });
      yield put({
        type: 'flushFileCache',
        payload: result,
      });
      return fileObjListToMap([...fileList, ...(result || [])]);
    },
    *saveStreamFile({ payload }, { call }) {
      return yield call(postStreamFileWithFaceValid, payload);
    },
    *saveBase64File({ payload }, { call }) {
      return yield call(postBase64FileWithFaceValid, {
        file: payload,
      });
    },
    *deleteStreamFile({ payload }, { call }) {
      yield call(delStreamFile, payload);
    },
    *deleteStreamFileSync({ payload }, { call }) {
      yield call(delStreamFileAndSync, payload);
    },
    *receiveNotices({ payload }, { put, select }) {
      const { data, audioPlay } = payload;
      const NoticeTypes = yield select(state => state.global.NoticeTypes);

      if (data == null || data.length === 0) {
        return;
      }

      if (typeof audioPlay === 'function') {
        audioPlay();
      }

      data.forEach(item => {
        const it = item;
        it.type = NoticeTypes.Message.key; // 强制静态分类成消息
      });
      // yield put({
      //   type: 'saveNotices',
      //   payload: data,
      // });
      yield put({
        type: 'addNotices',
        payload: data,
      });
      yield put({
        type: 'user/addNotifyCount',
        payload: data.length,
      });
    },
    *clean(_, { put }) {
      yield put({
        type: 'clearNotices',
      });
    },
    // *readNotice({ payload }, { put, select }) {
    //   const findedItem = yield select(state => {
    //     return state.global.notices.find(item => item.id === payload);
    //   });
    //   if (findedItem == null) {
    //     return;
    //   }
    //   yield put({
    //     type: 'setNoticeReaded',
    //     payload: findedItem,
    //   });
    // },
    *clearOneNotice({ payload }, { put, select }) {
      const findedItem = yield select(state => {
        return state.global.notices.find(item => item.id === payload);
      });
      if (findedItem == null) {
        return;
      }
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'saveClearedOneNotice',
        payload: findedItem,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: count - 1,
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = payload ? yield select(state => state.global.notices.length) : 0;
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
    *queryDefaultHomeTown({ payload }, { call }) {
      return yield call(fetchDefaultHomeTown, {
        ownFunction: payload,
      });
    },
    *switchVoice(_, { put, select }) {
      const isMute = yield select(state => state.global.mute);
      const nowMute = !isMute;
      appStore.put(MUTE_KEY, nowMute);
      yield put({
        type: 'saveMute',
        payload: nowMute,
      });
    },
    *updateFileStyle({ payload }, { call }) {
      return yield call(updateFileStyle, payload);
    },
    *updateExportTask({ payload }, { put, select }) {
      const { id, fileName, startTime, endTime, percent } = payload;
      if (id == null) {
        return;
      }
      const NoticeTypes = yield select(state => state.global.NoticeTypes);
      const TodoTags = yield select(state => state.global.TodoTags);
      const todoList = yield select(state => state.global.notices.filter(item => item.type === NoticeTypes.Todo.key));
      const findedItem = todoList.find(item => item.id === id);
      if (findedItem == null) {
        yield put({
          type: 'addNotices',
          payload: [
            {
              ...payload,
              createTime: startTime,
              content: fileName || '',
              extra: `正在加载${isNumber(percent) ? `(${formatPercent(percent)})` : ''}`,
              tag: TodoTags.processing,
              // description: `添加时间 ${formatDateTime(startTime)}`,
              type: NoticeTypes.Todo.key, // 强制静态分类成待办
            },
          ],
        });
        if (todoList.length < todoListMax) {
          yield put({
            type: 'user/addNotifyCount',
            payload: 1,
          });
        }
        // addNotices 里处理的超出最大显示
        return;
      }
      const newItem = {
        ...findedItem,
        ...payload,
      };

      if (endTime) {
        const td = formatTimeDuration(endTime - newItem.startTime);
        Object.assign(newItem, {
          extra: '加载完成',
          tag: TodoTags.doing,
          description: `完成时间 ${formatDateTime(endTime)}${td ? ` (${td})` : ''}`,
        });
      }

      if (isNumber(percent) && percent > 0) {
        Object.assign(newItem, {
          extra: `正在加载(${formatPercent(percent)})`,
        });
      }

      yield put({
        type: 'updateNotice',
        payload: newItem,
      });
    },
    *updateFaceFile({ payload }, { call }) {
      yield call(updateFaceFile, payload);
    },
    *syncFaceFile({ payload }, { call }) {
      yield call(syncFaceFile, payload);
    },
    *addBanUser({ payload }, { call }) {
      yield call(postAddBanUser, payload);
    },
    *addICCardBinding({ payload }, { call }) {
      yield call(postAddICCardBinding, payload);
    },
    *updateIcPhysicsNo({ payload }, { call }) {
      yield call(postUpdateIcPhysicsNo, payload);
    },
    *updateICCardBindState({ payload }, { call }) {
      yield call(postUpdateICCardBindState, payload);
    },
    *rebindingICCard({ payload }, { call }) {
      yield call(postICCardRebindding, payload);
    },
    *getCache({ payload }, { call }) {
      const dataKey = payload;
      if (!dataKey) {
        return null;
      }
      const data = yield call(getCacheValue, {
        dataKey,
      });
      const { dataValue } = data || {};
      try {
        return JSON.parse(dataValue);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(e);
        return null;
      }
    },
    *setCache({ payload }, { call }) {
      const { key: dataKey, value } = payload || {};
      if (!dataKey) {
        return;
      }
      let dataValue;
      try {
        dataValue = JSON.stringify(value);
      } catch {
        return;
      }
      yield call(setCacheValue, {
        dataKey,
        dataValue,
      });
    },
  },

  reducers: {
    flushFileCache(state, { payload }) {
      const override = {};
      if (payload == null || payload.length < 0) {
        return state;
      }
      payload.forEach(obj => {
        override[obj.fileKey] = obj;
      });
      return {
        ...state,
        fileCacheByKeyMapping: {
          ...state.fileCacheByKeyMapping,
          ...override,
        },
      };
    },
    saveMute(state, { payload }) {
      return {
        ...state,
        mute: payload,
      };
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    // saveNotices(state, { payload }) {
    //   return {
    //     ...state,
    //     notices: payload,
    //   };
    // },
    // setNoticeReaded(state, { payload }) {
    //   return {
    //     ...state,
    //     notices: (state.notices || []).map(item => {
    //       if (item === payload || item.id === payload.id) {
    //         return {
    //           ...payload,
    //           readed: true,
    //         };
    //       }
    //       return item;
    //     }),
    //   };
    // },
    updateNotice(state, { payload }) {
      const idx = (state.notices || []).findIndex(item => item === payload || item.id === payload.id);
      const list = [...state.notices];
      list.splice(idx, 1, {
        ...list[idx],
        ...payload,
      });
      return {
        ...state,
        notices: list,
      };
    },
    addNotices(state, { payload }) {
      const todoList = payload.filter(item => item.type === state.NoticeTypes.Todo);
      const otherList = payload.filter(item => !todoList.includes(item));
      const newList = [...otherList, ...(state.notices || [])];
      if (todoList.length > 0) {
        // 一次性大于10个，则截断顶部最老的，使其保持max
        if (todoList.length > todoListMax) {
          todoList.splice(0, todoList.length - todoListMax);
        }
        const oldTodoList = newList.filter(item => item.type === payload.type);
        const pushNum = todoListMax - oldTodoList.length; // 可直接新增的数量,oneList.length 一定不大于max
        if (pushNum > 0) {
          // 需要删除一部分来保持max
          for (let idx = 0; idx < pushNum; idx += 1) {
            newList.splice(
              newList.filter(item => item === oldTodoList[idx]),
              1
            ); // oldTodo 来自newList可以直接===全等
          }
        }
        // 参考otherList的尾部放置，otherList是放就数据的最前面的
        newList.splice(otherList.length, 0, ...todoList); // 直接push
      }
      return {
        ...state,
        notices: newList,
      };
    },
    saveClearedOneNotice(state, { payload }) {
      if (payload == null) {
        return null;
      }
      return {
        ...state,
        notices: state.notices.filter(item => item !== payload || item.id !== payload.id),
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: payload ? state.notices.filter(item => item.type !== payload) : [],
      };
    },
  },

  subscriptions: {
    // setup({ history, dispatch }) {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(() => {
        // dispatch({
        //   type: 'venue/initializeVenue',
        // });
      });
    },
  },
};
