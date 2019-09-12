import { createStore, applyMiddleware } from 'redux'  // 引入createStore方法
import reducer from './reducers'
import thunk from 'redux-thunk'

const store = createStore(
    reducer,
    applyMiddleware(thunk) //异步中间件
    ) // 创建数据存储仓库

export default store   