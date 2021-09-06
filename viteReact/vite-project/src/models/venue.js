import { getPageQuery } from '@/utils/utils';
import { appStore } from '@/commons/lib/store';
import {
  queryVenueList,
  queryVenueItemList,
  fetchPlatformListBySalesId,
  fetchServiceUserListBySalesId,
  postUpdateVenue,
  queryCourseSalesOpenTime,
  postNewOrEditTheaterSetting,
  deleteTheaterSetting,
  postUpdateTheaterMatrixCfg,
} from '@/services/venue';
import { VenueModel } from '@/commons/lib/models';

const VENUE_KEY = '__venue-id__';
const ITEM_KEY = '__item-id__';
const PLATFORM_ITEM_KEY = '__platform-item-id__';

export default {
  // 场馆/项目/职业（教练/裁判等）
  namespace: 'venue',

  state: {
    ...VenueModel,

    list: undefined,
    listAndOther: undefined,
    currentVenue: undefined,
    currentItem: undefined,
    currentPlatformItem: undefined,
    itemList: undefined, // 场馆下的项目类型
    itemListCache: {},
    sportPlatformItemList: undefined, // 场地项目单独处理
    sportPlatformItemListCache: {},
    // 统一查询表单用
    platformListMapping: {},
    serviceUserListMapping: {},
  },

  effects: {
    *fetchServiceUserList({ payload }, { put, call, select }) {
      const salesId = payload;
      if (salesId == null) {
        return;
      }
      let list = yield select(state => state.venue.serviceUserListMapping[salesId]);
      if (list == null) {
        list = yield call(fetchServiceUserListBySalesId, {
          salesId,
        });
        list = list || [];
        yield put({
          type: 'saveServiceUserList',
          payload: {
            key: salesId,
            value: list,
          },
        });
      }
    },
    *fetchPlatformList({ payload }, { put, call, select }) {
      const salesId = payload;
      if (salesId == null) {
        return;
      }
      let list = yield select(state => state.venue.platformListMapping[salesId]);
      if (list == null) {
        list = yield call(fetchPlatformListBySalesId, {
          salesId,
        });
        list = list || [];
        yield put({
          type: 'savePlatformList',
          payload: {
            key: salesId,
            value: list,
          },
        });
      }
    },
    *fetch(_, { call, put, select, putResolve }) {
      let response = yield select(state => state.venue.list);
      if (response) {
        return;
      }
      response = yield call(queryVenueList);
      const list = response || [];
      yield put({
        type: 'save',
        payload: list,
      });
      yield putResolve({
        type: 'initializeVenue',
      });
      if (list.length === 0) {
        yield put({
          type: 'flushViewItemList',
          payload: {
            itemList: [],
            sportPlatformItemList: [],
          },
        });
      }
    },
    *getItem({ payload }, { call, select, put }) {
      const salesId = payload;
      if (salesId == null) {
        return {};
      }
      const cache = yield select(state => {
        return {
          itemList: state.venue.itemListCache[salesId],
          sportPlatformItemList: state.venue.sportPlatformItemListCache[salesId],
        };
      });
      let { itemList, sportPlatformItemList } = cache;
      if (itemList && sportPlatformItemList) {
        return cache;
      }
      sportPlatformItemList = yield call(queryVenueItemList, {
        salesId,
      });
      itemList = sportPlatformItemList?.reduce((prev, current) => {
        if (prev.some(item => item.itemId === current.itemId)) {
          return prev;
        }
        return [...prev, current];
      }, []);
      yield put({
        type: 'saveItemList',
        payload: {
          key: salesId,
          value: itemList || [],
        },
      });
      yield put({
        type: 'saveSportPlatformItemList',
        payload: {
          key: salesId,
          value: sportPlatformItemList || [],
        },
      });
      return {
        itemList,
        sportPlatformItemList,
      };
    },
    fetchItem: [
      function* fetchItem({ payload }, { select, put, putResolve }) {
        const salesId = payload || (yield select(state => (state.venue.currentVenue || {}).id));
        if (salesId == null) {
          return;
        }
        yield put({
          type: 'flushViewItemList',
          payload: {},
        });
        const res = yield putResolve({
          type: 'getItem',
          payload: salesId,
        });
        yield putResolve({
          type: 'flushViewItemList',
          payload: res,
        });
        yield put({
          type: 'initializeItem',
        });
        yield put({
          type: 'initializePlatformItem',
        });
      },
      {
        type: 'takeLatest',
      },
    ],
    *initializeVenue(_, { select, putResolve }) {
      const list = yield select(state => state.venue.list);
      if (list == null) {
        return;
      }
      const query = getPageQuery();
      // 1.参数指定值
      const queryId = +query['sales-id'];
      if (queryId && list.some(item => item.id === queryId)) {
        yield putResolve({
          type: 'changeVenueId',
          payload: queryId,
        });
        return;
      }

      // 2.存储缓存值
      const storeId = appStore.get(VENUE_KEY);
      if (storeId && list.some(item => item.id === storeId)) {
        yield putResolve({
          type: 'changeVenueId',
          payload: storeId,
        });
        return;
      }

      // 3.系统设置默认值
      const found = list.find(item => item.isSelected);
      if (found) {
        yield putResolve({
          type: 'changeVenueId',
          payload: found.id,
        });
        return;
      }

      // 最后默认第一个
      const { id } = list[0] || {};
      yield putResolve({
        type: 'changeVenueId',
        payload: id,
      });
    },
    *fetchCourseSalesOpenTime({ payload }, { call }) {
      return yield call(queryCourseSalesOpenTime, payload);
    },
    *changeVenueId({ payload }, { put, select, putResolve }) {
      if (!(payload > 0)) {
        return;
      }
      appStore.put(VENUE_KEY, payload);
      yield put({
        type: 'changeCurrentVenue',
        payload: yield select(state => state.venue.list.find(item => item.id === payload)),
      });
      yield putResolve({
        type: 'fetchItem',
      });
    },
    *initializeItem(_, { select, put }) {
      const itemList = yield select(state => state.venue.itemList);
      if (itemList == null) {
        return;
      }
      const query = getPageQuery();
      // 1.参数指定值
      const queryId = +query['item-id'];
      if (queryId && itemList.some(item => item.itemId === queryId)) {
        yield put({
          type: 'changeItemId',
          payload: queryId,
        });
        return;
      }

      // 2.存储缓存值
      const storeId = appStore.get(ITEM_KEY);
      if (storeId && itemList.some(item => item.itemId === storeId)) {
        yield put({
          type: 'changeItemId',
          payload: storeId,
        });
        return;
      }

      // 最后默认第一个
      const { itemId } = itemList[0] || {};
      yield put({
        type: 'changeItemId',
        payload: itemId,
      });
    },
    *initializePlatformItem(_, { select, put }) {
      const sportPlatformItemList = yield select(state => state.venue.sportPlatformItemList);
      if (sportPlatformItemList == null) {
        return;
      }
      const query = getPageQuery();
      // 1.参数指定值
      const queryId = +query['platform-item-id'];
      if (queryId && sportPlatformItemList.some(item => item.salesItemId === queryId)) {
        yield put({
          type: 'changePlatformItemId',
          payload: queryId,
        });
        return;
      }

      // 2.存储缓存值
      const storeId = appStore.get(PLATFORM_ITEM_KEY);
      if (storeId && sportPlatformItemList.some(item => item.salesItemId === storeId)) {
        yield put({
          type: 'changePlatformItemId',
          payload: storeId,
        });
        return;
      }

      // 最后默认第一个
      const { salesItemId } = sportPlatformItemList[0] || {};
      yield put({
        type: 'changePlatformItemId',
        payload: salesItemId,
      });
    },
    *changeItemId({ payload }, { put, select }) {
      if (payload > 0) {
        appStore.put(ITEM_KEY, payload);
      }
      const currentItem = payload
        ? yield select(state => state.venue.itemList.find(item => item.itemId === payload))
        : null;
      yield put({
        type: 'changeCurrentItem',
        payload: currentItem,
      });
      const currentPlatformItem = yield select(state => state.venue.currentPlatformItem);
      if (currentPlatformItem?.itemId === currentItem?.itemId) {
        return;
      }
      yield put({
        type: 'changePlatformItemId',
        payload: currentItem?.salesItemId,
      });
    },
    *changePlatformItemId({ payload }, { put, select }) {
      if (payload > 0) {
        appStore.put(PLATFORM_ITEM_KEY, payload);
      }
      const currentPlatformItem = payload
        ? yield select(state => state.venue.sportPlatformItemList.find(item => item.salesItemId === payload))
        : null;
      yield put({
        type: 'changeCurrentPlatformItem',
        payload: currentPlatformItem,
      });
      const currentItem = yield select(state => state.venue.currentItem);
      if (currentItem?.itemId === currentPlatformItem?.itemId) {
        return;
      }
      yield put({
        type: 'changeItemId',
        payload: currentPlatformItem?.itemId,
      });
    },
    *updateVenueInfo({ payload }, { call }) {
      yield call(postUpdateVenue, payload);
    },
    *saveOrEditTheaterSetting({ payload }, { call }) {
      yield call(postNewOrEditTheaterSetting, payload);
    },
    *updateTheaterMatrixCfg({ payload }, { call }) {
      yield call(postUpdateTheaterMatrixCfg, payload);
    },
    *delTheaterSettingByIds({ payload }, { call }) {
      yield call(deleteTheaterSetting, {
        ids: payload,
      });
    },
  },

  reducers: {
    savePlatformList(state, { payload }) {
      return {
        ...state,
        platformListMapping: {
          ...state.platformListMapping,
          [payload.key]: payload.value,
        },
      };
    },
    saveServiceUserList(state, { payload }) {
      return {
        ...state,
        serviceUserListMapping: {
          ...state.serviceUserListMapping,
          [payload.key]: payload.value,
        },
      };
    },
    save(state, { payload: list }) {
      return {
        ...state,
        list,
        listAndOther: [
          ...list,
          {
            id: 0,
            isSelected: 0,
            salesName: '其他',
          },
        ],
      };
    },
    saveItemList(state, { payload }) {
      return {
        ...state,
        itemListCache: {
          ...state.itemListCache,
          [payload.key]: payload.value,
        },
      };
    },
    saveSportPlatformItemList(state, { payload }) {
      return {
        ...state,
        sportPlatformItemListCache: {
          ...state.sportPlatformItemListCache,
          [payload.key]: payload.value,
        },
      };
    },
    flushViewItemList(state, { payload }) {
      const { itemList, sportPlatformItemList } = payload || {};
      return {
        ...state,
        itemList,
        sportPlatformItemList,
      };
    },
    changeCurrentVenue(state, action) {
      return {
        ...state,
        currentVenue: action.payload,
      };
    },
    changeCurrentItem(state, action) {
      return {
        ...state,
        currentItem: action.payload,
      };
    },
    changeCurrentPlatformItem(state, action) {
      return {
        ...state,
        currentPlatformItem: action.payload,
      };
    },
    clean(state) {
      return {
        ...state,
        list: undefined,
        listAndOther: undefined,
        currentVenue: undefined,
        currentItem: undefined,
        currentPlatformItem: undefined,
        itemList: undefined,
        itemListCache: {},
        platformListMapping: {},
        serviceUserListMapping: {},
      };
    },
  },
};
