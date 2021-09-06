// Use require.context to require reducers automatically
// Ref: https://webpack.js.org/guides/dependency-management/#require-context
import {
  put,
  call,
  all,
  delay,
  putResolve,
  select,
  fork,
  take,
  takeLatest,
  takeEvery,
  cancel,
} from 'redux-saga/effects';
import { noop } from '@/commons';

// eslint-disable-next-line unicorn/prefer-set-has
const ignoreFiles = ['./index.js'];

// eslint-disable-next-line unicorn/prefer-module
const context = require.context('./', false, /\.js$/);
export default {
  keys: () =>
    context
      .keys()
      .filter(item => !ignoreFiles.includes(item))
      // eslint-disable-next-line unicorn/prefer-string-slice
      .map(path => path.substring(2, path.lastIndexOf('.'))),
  load: key => context(`./${key}.js`),
};
// 自动引入并对外暴露所有models

export const SHOW = '@@LOADING/SHOW';
export const HIDE = '@@LOADING/HIDE';
export const NAMESPACE_SEP = '/';

function handleAction(namespace, actionType, reducer) {
  const fullActionType = `${namespace}${NAMESPACE_SEP}${actionType}`;
  return (state, action) => {
    const { type } = action;
    if (type == null) {
      throw new Error('dispatch: action should be a plain Object with type');
    }
    if (fullActionType === type) {
      return reducer(state, action);
    }
    return state;
  };
}

function reduceReducers(reducers) {
  return (state, action) => reducers.reduce((p, r) => r(p, action), state);
}

function defaultHandleActions(namespace, handlers = {}, defaultState) {
  const reducers = Object.keys(handlers).map(type => handleAction(namespace, type, handlers[type]));
  const reducer = reduceReducers(reducers);
  return (state = defaultState, action) => reducer(state, action);
}

export const getReducer = model => {
  const { namespace, state, reducers } = model;
  return defaultHandleActions(namespace, reducers, state);
};

function prefixType(type, model) {
  const prefixedType = `${model.namespace}${NAMESPACE_SEP}${type}`;
  const reducer = model.reducers && model.reducers[type];

  if (reducer || (model.effects && model.effects[type])) {
    return prefixedType;
  }
  return type;
}

function onEffect(effect, model, key) {
  const { namespace } = model;
  const actionType = `${namespace}${NAMESPACE_SEP}${key}`;
  // eslint-disable-next-line func-names
  return function* (action) {
    const { _resolve = noop, _reject = noop, ...ac } = action;
    yield put({ type: SHOW, payload: { actionType } });
    yield put({ type: `${actionType}@@start` });
    try {
      const result = yield effect(ac, {
        all,
        call,
        select,
        delay,
        put: a =>
          put({
            ...a,
            type: prefixType(a.type, model),
          }),

        putResolve: a =>
          putResolve({
            ...a,
            type: prefixType(a.type, model),
          }),
      });
      _resolve(result);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(`catch error from effect: ${prefixType(ac.type, model)}`);
      _reject(e);
    }
    yield put({ type: `${actionType}@@end` });
    yield put({ type: HIDE, payload: { actionType } });
  };
}

const getWatcher = (
  key,
  effect,
  model,
  // eslint-disable-next-line unicorn/no-object-as-default-parameter
  opts = {
    type: 'takeEvery',
  }
) => {
  const actionType = `${model.namespace}${NAMESPACE_SEP}${key}`;

  const sagaWithOnEffect = onEffect(effect, model, key);
  switch (opts.type) {
    case 'takeLatest':
      // eslint-disable-next-line func-names
      return function* () {
        yield takeLatest(actionType, sagaWithOnEffect);
      };
    default:
      if (opts.type !== 'takeEvery') {
        // eslint-disable-next-line no-console
        console.warn(`还未支持[${opts.type}]，当作takeEvery使用`);
      }
      // eslint-disable-next-line func-names
      return function* () {
        yield takeEvery(actionType, sagaWithOnEffect);
      };
  }
};

/**
 * 加载saga
 * reducers先初始化，所以在加载effects时判断命名空间内是否重复
 * @param model
 */
export const getSaga = model => {
  const { namespace, effects, reducers } = model || {};
  const reducerKeys = Object.keys(reducers || {});
  return function* saga() {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in effects) {
      if (Object.prototype.hasOwnProperty.call(effects, key)) {
        const actionType = `${namespace}${NAMESPACE_SEP}${key}`;
        if (reducerKeys.includes(key)) {
          // eslint-disable-next-line no-console
          console.error(`[${actionType}]: effects与reducers命名重复, 将忽略effects.`);
        } else {
          // const effect = effects[key];
          // if (Array.isArray(effect)) {
          //   const { type } = effect[1] || {};
          //   if (type === 'takeLatest') {
          //     yield takeLatest(actionType, effect[0]);
          //   }
          // }
          // yield takeEvery(actionType, effect);
          let effect = effects[key];
          let opts;
          if (Array.isArray(effect)) {
            [effect, opts] = effect;
          }
          const watcher = getWatcher(key, effect, model, opts);
          const task = yield fork(watcher);
          // eslint-disable-next-line func-names
          yield fork(function* () {
            yield take(`${actionType}/@@CANCEL_EFFECTS`);
            yield cancel(task);
          });
        }
      }
    }
  };
};
