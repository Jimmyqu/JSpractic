import {createStore,applyMiddleware} from 'redux'
import createSagaMiddleware from 'redux-saga'
import reducer from './reducer'
import {sagaRoot} from './sagaRoot'

const sagaMiddleware=createSagaMiddleware()

const store = createStore(
    reducer,
    // applyMiddleware(sagaMiddleware)
    )

  // sagaMiddleware.run(sagaRoot)  

export default store
