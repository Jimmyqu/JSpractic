import {
  deletePlatformForever,
  updatePlatformForeverDatePeriod,
  queryPlatformForeverServiceUser,
  queryPlatformForeverSportTeam,
  savePlatformForever,
  querySalesInfo,
  savePlatformLock,
  queryPlatformLockedInfo,
  saveNewLockMessage,
  cancelPlatformLock,
  cancelLockedLogs,
  cancelFoeverLocked,
  deleteFoeverLocked,
  changeFoeverLockedDate,
  queryFoeverLockedExcludeDate,
} from '@/services/booking';
import { PubPlatformModel } from '@/commons/lib/models';

export default {
  // 场地
  namespace: 'pubplatform',

  state: {
    ...PubPlatformModel,

    pubserviceUserListMapping: {}, // 第一层key:salesId,第二层key:itemid

    sportTeamInfoMapping: {}, // 第一层key:pubAccountId,第二层key:itemid

    salesInfoMapping: {},
  },

  effects: {
    *fetchSalesInfo(_, { put, call, select }) {
      const currentVenue = yield select(state => state.venue.currentVenue);
      let salseInfo = yield select(state => state.pubplatform.salesInfoMapping[currentVenue.id]);
      if (salseInfo == null) {
        salseInfo = yield call(querySalesInfo, {
          salesId: currentVenue.id,
        });
        salseInfo = salseInfo || {};
        yield put({
          type: 'saveSalesInfo',
          payload: {
            key: currentVenue.id,
            value: {
              ...salseInfo,
              commonSalesItemInfoList: (salseInfo.commonSalesItemInfoList || []).map(commonSalesItemInfo => {
                const { commonSalesItemCalendarList } = commonSalesItemInfo;
                return {
                  ...commonSalesItemInfo,
                  commonSalesItemCalendarList: (commonSalesItemCalendarList || []).map(commonSalesItemCalendar => {
                    const { commonCalendarInfoList } = commonSalesItemCalendar;
                    return {
                      ...commonSalesItemCalendar,
                      commonCalendarInfoList: (commonCalendarInfoList || []).map(commonCalendarInfo => {
                        const weekDateList = [];
                        const minuteStep = [];
                        const ids = [];
                        const { commonCalendarList, weekDate, ...infoRestProps } = commonCalendarInfo;
                        const newCommonCalendarList = [...commonCalendarList];
                        // 按开始时间排序，理论上时段数据之间不存在交叉，只会相接
                        newCommonCalendarList.sort((a, b) => a.startTime - b.startTime);
                        // 为了避免每个commonCalendar 多个属性需要处理，直接使用循环，避免多次reduce
                        newCommonCalendarList.forEach(commonCalendar => {
                          // weekDateList
                          const {
                            weekDateList: list,
                            startTime,
                            endTime,
                            viewType,
                            interVal,
                            commonCalendarId,
                          } = commonCalendar;

                          ids.push(commonCalendarId);

                          weekDateList.push(...list);

                          // viewType 1=循环时段 2=固定时段
                          minuteStep.push({
                            startTime,
                            endTime,
                            // 单位分钟
                            step: (viewType === 2 ? endTime - startTime : interVal) / 1000 / 60,
                          });
                        });
                        return {
                          ...infoRestProps,
                          // 改为数组
                          weekDate: weekDate ? weekDate.split(',') : null,
                          //  '8': '法定工作日',  '9': '法定节假日',
                          weekDateList: [...new Set(weekDateList.filter(item => item > 0 && item < 8))], // 里面必须是1-7，其他值不可用
                          // 补充新属性
                          id: ids.join('-'),
                          startTime: newCommonCalendarList[0].startTime,
                          endTime: newCommonCalendarList[newCommonCalendarList.length - 1].endTime,
                          minuteStep,
                        };
                      }),
                    };
                  }),
                };
              }),
            },
          },
        });
      }
    },
    *addNewPlatformForever({ payload }, { call, select }) {
      const salesId = yield select(state => (state.venue.currentVenue || {}).id);
      return yield call(savePlatformForever, {
        ...payload,
        salesId,
      });
    },
    *removePlatformForever({ payload }, { call }) {
      yield call(deletePlatformForever, payload);
    },
    *editPlatformForeverDatePeriod({ payload }, { call }) {
      return yield call(updatePlatformForeverDatePeriod, payload);
    },
    *fetchPubserviceUserList({ payload }, { put, call, select }) {
      const salesId = yield select(state => (state.venue.currentVenue || {}).id);
      const professionalId = payload;
      let list = yield select(state => (state.pubplatform.pubserviceUserListMapping[salesId] || {})[professionalId]);
      if (list) {
        return;
      }
      list = yield call(queryPlatformForeverServiceUser, {
        salesId,
        professionalId,
      });
      yield put({
        type: 'savePubserviceUserListMapping',
        payload: {
          salesId,
          professionalId,
          value: list || [],
        },
      });
    },
    *fetchSportTeam({ payload }, { put, call, select }) {
      const { pubAccountId, professionalId } = payload;
      if (pubAccountId == null || professionalId == null) {
        return null;
      }
      let info = yield select(state => (state.pubplatform.sportTeamInfoMapping[pubAccountId] || {})[professionalId]);
      if (info == null) {
        info = yield call(queryPlatformForeverSportTeam, payload);
        info = info || {};
        yield put({
          type: 'saveSportTeamInfoMapping',
          payload: {
            pubAccountId,
            professionalId,
            value: info,
          },
        });
      }
      return info;
    },
    *addNewPlatformLock({ payload }, { call, select }) {
      const salesId = yield select(state => (state.venue.currentVenue || {}).id);
      return yield call(savePlatformLock, {
        ...payload,
        salesId,
      });
    },
    fetch: [
      function* fetch({ payload }, { call }) {
        const lockId = payload;
        if (!lockId) {
          return null;
        }
        return yield call(queryPlatformLockedInfo, {
          lockId,
        });
      },
      {
        type: 'takeLatest',
      },
    ],
    *changeLockMessage({ payload }, { call }) {
      yield call(saveNewLockMessage, payload);
    },
    *removePlatformLocked({ payload }, { call }) {
      yield call(cancelPlatformLock, payload);
    },
    *removeLockedLogs({ payload }, { call }) {
      yield call(cancelLockedLogs, payload);
    },
    *removeFoeverLocked({ payload }, { call }) {
      yield call(cancelFoeverLocked, payload);
    },
    *deleteFoeverLocked({ payload }, { call }) {
      yield call(deleteFoeverLocked, payload);
    },
    *editFoeverLockedDate({ payload }, { call }) {
      yield call(changeFoeverLockedDate, payload);
    },
    *fetchFoeverLockedExcludeDate({ payload }, { call }) {
      const platformForeverId = payload;
      if (!platformForeverId) {
        return null;
      }
      return yield call(queryFoeverLockedExcludeDate, {
        platformForeverId,
      });
    },
  },

  reducers: {
    saveSalesInfo(state, { payload }) {
      return {
        ...state,
        salesInfoMapping: {
          ...state.salesInfoMapping,
          [payload.key]: payload.value,
        },
      };
    },
    savePubserviceUserListMapping(state, { payload }) {
      const { salesId, professionalId, value } = payload;
      return {
        ...state,
        pubserviceUserListMapping: {
          ...state.pubserviceUserListMapping,
          [salesId]: {
            ...state.pubserviceUserListMapping[salesId],
            [professionalId]: value,
          },
        },
      };
    },
    saveSportTeamInfoMapping(state, { payload }) {
      const { pubAccountId, professionalId, value } = payload;
      return {
        ...state,
        sportTeamInfoMapping: {
          ...state.sportTeamInfoMapping,
          [pubAccountId]: {
            ...state.sportTeamInfoMapping[pubAccountId],
            [professionalId]: value,
          },
        },
      };
    },
  },
};
