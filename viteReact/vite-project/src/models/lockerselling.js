import { queryLeaseRentHome, postBatchSetLeaseState } from '@/services/rent';

export default {
  // 储物柜销售
  namespace: 'lockerselling',

  state: {
    isWantToDisable: false,
    isWantToEnable: false,
    isWantToLock: false,
    isWantToUnlock: false,
    isWantToClean: false,
    // 页面呈现数据
    leaseLockerBoxData: null,
  },

  effects: {
    *batchSetState({ payload }, { call, select }) {
      const list = payload || [];
      const { isWantToDisable, isWantToEnable, isWantToLock, isWantToUnlock, isWantToClean } = yield select(
        state => state.lockerselling
      );
      const { RentOperationTypes } = yield select(state => state.rent);
      let type;
      if (isWantToDisable) {
        type = RentOperationTypes.DISABLE.key;
      } else if (isWantToEnable) {
        type = RentOperationTypes.ENABLE.key;
      } else if (isWantToLock) {
        type = RentOperationTypes.LOCK.key;
      } else if (isWantToUnlock) {
        type = RentOperationTypes.DISLOCK.key;
      } else if (isWantToClean) {
        type = RentOperationTypes.CLEAN.key;
      }
      yield call(postBatchSetLeaseState, {
        type,
        ids: list,
      });
    },
    *lockerNextStep({ payload, summary }, { putResolve }) {
      yield putResolve({
        type: 'orderprocessing/newOrder',
        payload: {
          dealLeaseList: payload,
          deal: null,
        },
      });
      if (summary) {
        return yield putResolve({
          type: 'saveOrder',
        });
      }
    },
    *userNextStep({ payload, summary }, { put, putResolve }) {
      if (!summary) {
        yield put({
          type: 'orderprocessing/updateUser',
          payload,
        });
      }
      return yield putResolve({
        type: 'saveOrder',
      });
    },
    *fastSaveOrder({ payload }, { putResolve }) {
      const { list, ...rest } = payload;
      return yield putResolve({
        type: 'orderprocessing/genericFastSaveOrder',
        payload: {
          dealLeaseList: list,
          ...rest,
        },
      });
    },
    *saveOrder(_, { putResolve }) {
      return yield putResolve({
        type: 'orderprocessing/saveOrder',
      });
    },
    // 重置到销售状态
    *resetToSell(_, { put }) {
      yield put({
        type: 'resetWantTo',
      });
      yield put({
        type: 'clearSelected',
      });
    },
    fetch: [
      function* fetch({ payload }, { call, select, put }) {
        yield put({
          type: 'resetWantTo',
        });
        yield put({
          type: 'saveLeaseLockerBoxList',
        });
        // currentVenue 是BasicLayout确保的
        const currentItem = yield select(state => state.venue.currentItem);
        if (currentItem == null && payload.professionalId == null) {
          return;
        }
        const currentVenue = yield select(state => state.venue.currentVenue);
        const result = yield call(queryLeaseRentHome, {
          salesId: currentVenue.id,
          professionalId: currentItem.itemId,
          ...payload,
        });
        const { leaseProjectList, leasePriceConfigList, dealLeaseList, leaseConfigVO, ...reset } = result || {};

        const saveLeaseLockerDataMapping = {};

        (leaseProjectList || []).forEach(project => {
          const { id, groupId, priceGroupId } = project;
          if (groupId == null) {
            return;
          }
          saveLeaseLockerDataMapping[groupId] = saveLeaseLockerDataMapping[groupId] || [];
          saveLeaseLockerDataMapping[groupId].push({
            ...project,
            priceConfig: (leasePriceConfigList || []).find(cfg => cfg.priceGroupId === priceGroupId),
            orderInfo: (dealLeaseList || []).find(order => order.projectId === id),
          });
        });

        yield put({
          type: 'saveLeaseLockerBoxList',
          payload: {
            ...reset,
            // 是一个枚举数组，表示当前租赁配置所配置的支付方式，其他的不应该支持，
            // 但是，目前放到这里仅仅基于租赁订单不支持编辑，否则不合理
            // 租赁订单支持编辑的话需要另外思考合适的方式来控制订单流程中每一个step内可能需要用的支付类型的地方（主要是快捷支付），订单预览页面是接口直接控制的
            limitPayModes: leaseConfigVO?.payMode,
            saveLeaseLockerDataMapping,
          },
        });
      },
      {
        type: 'takeLatest',
      },
    ],
    *clearOrder(_, { put }) {
      yield put({
        type: 'orderprocessing/clearOrder',
      });
    },
  },

  reducers: {
    saveLeaseLockerBoxList(state, { payload }) {
      return {
        ...state,
        leaseLockerBoxData: payload,
      };
    },
    resetWantTo(state) {
      return {
        ...state,
        isWantToDisable: false,
        isWantToEnable: false,
        isWantToLock: false,
        isWantToUnlock: false,
        isWantToClean: false,
      };
    },
    setWantTo(state, { payload }) {
      const {
        isWantToDisable = state.isWantToDisable,
        isWantToEnable = state.isWantToEnable,
        isWantToLock = state.isWantToLock,
        isWantToUnlock = state.isWantToUnlock,
        isWantToClean = state.isWantToClean,
      } = payload || {};
      return {
        ...state,
        isWantToDisable,
        isWantToEnable,
        isWantToLock,
        isWantToUnlock,
        isWantToClean,
      };
    },
    select(state, { payload }) {
      const { id, groupId, selected } = payload;
      const { leaseLockerBoxData } = state;
      const { saveLeaseLockerDataMapping } = leaseLockerBoxData || {};
      const list = saveLeaseLockerDataMapping[groupId];
      const targetIndex = list.findIndex(project => project && project.id === id);
      const target = list[targetIndex];
      const newList = [...list];
      newList[targetIndex] = {
        ...target,
        // 如果指定selected 则使用，否则取反
        selected: selected == null ? !target.selected : !!selected,
      };
      return {
        ...state,
        leaseLockerBoxData: {
          ...leaseLockerBoxData,
          saveLeaseLockerDataMapping: {
            ...saveLeaseLockerDataMapping,
            [groupId]: newList,
          },
        },
      };
    },
    clearSelected(state) {
      const { leaseLockerBoxData } = state;
      const { saveLeaseLockerDataMapping } = leaseLockerBoxData || {};
      if (saveLeaseLockerDataMapping == null) {
        return state;
      }
      const newDataMapping = {};
      Object.entries(saveLeaseLockerDataMapping).forEach(([key, list]) => {
        newDataMapping[key] = list.map(project => ({
          ...project,
          selected: false,
        }));
      });
      return {
        ...state,
        leaseLockerBoxData: {
          ...leaseLockerBoxData,
          saveLeaseLockerDataMapping: newDataMapping,
        },
      };
    },
  },
};
