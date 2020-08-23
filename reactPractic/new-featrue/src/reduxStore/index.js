import {createStore} from 'redux'
import reducer from './reducer'

//createStore包装了reducer 返回的store对象具有dispatch  getState subscribe 等方法
export default createStore(reducer) //createStore接受一个reducer函数