import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback, useReducer } from 'react';
import {
  genUploadImgCustomRequest,
  genUploadDocCustomRequest,
  genUploadAudioCustomRequest,
  genUploadPdfToPngCustomRequest,
} from './upload';

/**
 * 延时执行的Dispatch, 如果在执行前重新调用了，则重新计时
 * @param {*} delay
 */
function useDelayDispatch(delay = 1000 * 2) {
  const dispatch = useDispatch();
  const [, setTimer] = useState();

  const delayDispatch = useCallback(
    (...args) =>
      new Promise(resolve => {
        const id = setTimeout(() => {
          resolve(dispatch(...args));
        }, delay);
        setTimer(oldId => {
          if (oldId) {
            clearTimeout(oldId);
          }
          return id;
        });
      }),
    []
  );

  return delayDispatch;
}

/**
 * 服务端数据缓存hook
 * @param {*} key
 */
function useServerCache(key) {
  if (!key) {
    throw new Error('key 无效');
  }
  const dispatch = useDispatch();
  const delayDispatch = useDelayDispatch();
  const [inited, setInited] = useState();
  const [setting, setSetting] = useState();

  useEffect(() => {
    dispatch({
      type: 'global/getCache',
      payload: key,
    }).then(data => {
      setSetting(data);
      setInited(true);
    });
  }, []);

  const setServerCache = useCallback(
    newSetting => {
      setSetting(newSetting);
      delayDispatch({
        type: 'global/setCache',
        payload: {
          key,
          value: newSetting,
        },
      });
    },
    [delayDispatch]
  );

  return [setting, setServerCache, inited];
}

useServerCache.queryEffectName = 'global/getCache';
useServerCache.saveEffectName = 'global/setCache';

export { useDelayDispatch, useServerCache };

/**
 * composeStateMapping 管理hook
 */
export function useComposeMapping() {
  const [composeStateMapping, setComposeStateMapping] = useState({});

  const handleComposeStateChange = useCallback((obj, compose) => {
    if (compose == null) {
      return;
    }
    // 使用函数方式setState, 兼容初始化值并发修改
    setComposeStateMapping(mapping => ({
      ...mapping,
      [compose]: {
        ...mapping[compose],
        ...obj,
      },
    }));
  }, []);

  return [composeStateMapping, setComposeStateMapping, handleComposeStateChange];
}

/**
 * genUploadImgCustomRequest hook
 * @param {*} p
 */
export function useUploadImgRequest(p = {}) {
  const { params, dispatch } = p;
  return useCallback(genUploadImgCustomRequest(p), [params, dispatch]);
}

/**
 * genUploadDocCustomRequest hook
 * @param {*} p
 */
export function useUploadDocRequest(p = {}) {
  const { params, dispatch } = p;
  return useCallback(genUploadDocCustomRequest(p), [params, dispatch]);
}

/**
 * genUploadAudioCustomRequest hook
 * @param {*} p
 */
export function useUploadAudioRequest(p = {}) {
  const { params, dispatch } = p;
  return useCallback(genUploadAudioCustomRequest(p), [params, dispatch]);
}

/**
 * genUploadPdfToPngCustomRequest hook
 * @param {*} p
 */
export function useUploadPdfToPngRequest(p = {}) {
  const { params, dispatch } = p;
  return useCallback(genUploadPdfToPngCustomRequest(p), [params, dispatch]);
}

const noneSeatCategory = {
  id: 0,
  categoryName: '无',
};

/**
 * 查询座位分类数据
 * @param {*} salesId
 * @param {*} dataId
 * @param {*} hasNone
 * @return [floorList, areaList, levelList, loading]
 */
export function useSeatCategory(salesId, dataId, hasNone) {
  const dispatch = useDispatch();
  const SeatCategoryTypes = useSelector(state => state.pubticket.SeatCategoryTypes);
  const loading = useSelector(state => state.loading.effects['pubticket/fetchSeatCategory']);
  const [areaList, setAreaList] = useState([]);
  const [floorList, setFloorList] = useState([]);
  const [levelList, setLevelList] = useState([]);
  useEffect(() => {
    dispatch({
      type: 'pubticket/fetchSeatCategory',
      payload: {
        salesId,
        dataId,
      },
    }).then(data => {
      const aList = [];
      const fList = [];
      const lList = [];
      if (hasNone) {
        aList.push(noneSeatCategory);
        fList.push(noneSeatCategory);
        lList.push(noneSeatCategory);
      }
      (data || []).forEach(item => {
        switch (item.categoryType) {
          case SeatCategoryTypes.FLOOR.key:
            fList.push(item);
            break;
          case SeatCategoryTypes.REGION.key:
            aList.push(item);
            break;
          case SeatCategoryTypes.GRADE.key:
            lList.push(item);
            break;
          default:
        }
      });
      setAreaList(aList);
      setFloorList(fList);
      setLevelList(lList);
    });
  }, [salesId, dataId]);

  return [floorList, areaList, levelList, loading];
}

/**
 * 支持历史快照的state数据 hook
 * @param {*} initialData
 */
function useHistoryData(initialData) {
  const [initial, setInitial] = useState(initialData);
  const reducer = useCallback(
    (state, { type, payload }) => {
      switch (type) {
        // 正常用户操作，添加记录
        case useHistoryData.PUSH:
          return {
            ...state,
            currentIndex: state.currentIndex + 1,
            // 当前引用在最后则直接新增并指向新index
            // 如果当前引用不在最后，则舍弃引用index之后所有的，补充新的并指向新index
            history: [...state.history.slice(0, state.currentIndex + 1), payload],
          };
        case useHistoryData.BACK:
          if (state.currentIndex === 0) {
            return;
          }
          return {
            ...state,
            currentIndex: state.currentIndex - 1,
          };
        case useHistoryData.FORWARD:
          if (state.currentIndex === state.history.length - 1) {
            return;
          }
          return {
            ...state,
            currentIndex: state.currentIndex + 1,
          };
        case useHistoryData.INIT:
          setInitial(payload);
          return {
            currentIndex: 0,
            history: [payload],
          };
        case useHistoryData.RESET:
          return {
            currentIndex: 0,
            history: [initial],
          };
        default:
          throw new Error('unknown');
      }
    },
    [initial]
  );
  const [{ currentIndex, history }, storeManagerDispatch] = useReducer(reducer, {
    currentIndex: 0,
    history: [initial],
  });

  return [history[currentIndex], currentIndex, history.length, storeManagerDispatch];
}

useHistoryData.RESET = -1;
useHistoryData.INIT = 0;
useHistoryData.PUSH = 1;
useHistoryData.BACK = 2;
useHistoryData.FORWARD = 3;

export { useHistoryData };
