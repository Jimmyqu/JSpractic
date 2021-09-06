// babel处理，不重复引入
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
// 由于i深圳安全检查原因，ua-check.js从静态文件挪到这里
import './ua-check';
import { render } from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';

import { ConnectedRouter, connectRouter, routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';

// import modelManager, { getReducer, getSaga, SHOW, HIDE } from '@/models';
import modelManager, { getReducer, getSaga, SHOW, HIDE } from './models';
// import initRequest from '@/utils/request';
import initRequest from './utils/request';
// import App from '@/routes/App';
import App from './routes/App';
import { getPageQuery, asyncInjectScript, CDN_STATIC_HOST } from './utils/utils';

const { __debug } = getPageQuery();

if (__debug) {
  asyncInjectScript(`${CDN_STATIC_HOST}/static/vconsole/3.3.4/dist/vconsole.min.js`, 'VConsole').then(Csl => {
    const vConsole = new Csl();
    // eslint-disable-next-line no-console
    console.log('vConsole 初始化:', vConsole);
  });
}

const history = createBrowserHistory();

// Build the middleware for intercepting and dispatching navigation actions
const reduxRouterMiddleware = routerMiddleware(history);
const reduxSagaMiddleware = createSagaMiddleware();

// window.__REDUX_DEVTOOLS_EXTENSION__
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
//   //
// }) || compose
// window.location.port 有端口认为是本地
const composeEnhancers = window.location.port ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : compose;
const connectRouterReducer = connectRouter(history);

const allModelKeysSet = new Set(modelManager.keys());

const injectedModelsMap = new Map();
const loadModels = keys => {
  new Set(keys).forEach(key => {
    if (injectedModelsMap.has(key) || !allModelKeysSet.has(key)) {
      return;
    }
    const model = modelManager.load(key);
    if (model == null) {
      // eslint-disable-next-line no-console
      console.warn(`[${key}]: Model load fails`);
      return;
    }
    injectedModelsMap.set(key, model.default || model);
  });
};

// redux 初始化默认加载的model
const initialModelKeys = ['global', 'login', 'user', 'venue', 'datatable', 'extfield', 'extfield2'];

loadModels(initialModelKeys);

const createNewReducers = () => {
  const reducers = {};
  injectedModelsMap.forEach((model, key) => {
    reducers[key] = getReducer(model);
  });
  return combineReducers({
    ...reducers,
    loading: (state, action) => {
      switch (action.type) {
        case SHOW:
        case HIDE:
          return {
            ...state,
            effects: {
              ...state.effects,
              [action.payload.actionType]: action.type === SHOW,
            },
          };
        default:
          return state || {};
      }
    },
    router: connectRouterReducer,
  });
};

const runSaga = (keysSet = [], hasLoadSet) => {
  injectedModelsMap.forEach((model, key) => {
    if (!keysSet.has(key) || hasLoadSet.has(key)) {
      return;
    }
    reduxSagaMiddleware.run(getSaga(model));
  });
};

const store = createStore(
  createNewReducers(),
  // preloadedState
  {
    loading: {
      effects: {},
    },
  },
  composeEnhancers(
    applyMiddleware(
      reduxRouterMiddleware,
      // promiseMiddleware
      // eslint-disable-next-line unicorn/consistent-function-scoping
      () => next => action => {
        const { type } = action;
        if (typeof type === 'string') {
          const [namespace, effectName] = type.split('/');
          // model.effects 的一定都是 effect
          const model = injectedModelsMap.get(namespace);
          if (model && model.effects && model.effects[effectName]) {
            return new Promise((resolve, reject) => {
              next({
                ...action,
                _resolve: resolve,
                _reject: reject,
              });
            });
          }
        }
        return Promise.resolve(next(action));
      },
      reduxSagaMiddleware
    )
  )
);

initRequest(store.dispatch, store);

runSaga(new Set(initialModelKeys), new Set());

const appManager = {
  injectModel: keys => {
    if (keys == null || keys.length === 0) {
      return;
    }
    // 加载其他的之前获取已加载的key
    const hasLoadKeysSet = new Set(injectedModelsMap.keys());
    loadModels(keys);
    store.replaceReducer(createNewReducers());
    runSaga(new Set(keys), hasLoadKeysSet);
  },
};

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App app={appManager} />
    </ConnectedRouter>
  </Provider>,
  // eslint-disable-next-line unicorn/prefer-query-selector
  document.getElementById('root')
);
