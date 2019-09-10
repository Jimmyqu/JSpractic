import { createStore } from 'redux'  // 引入createStore方法
import reducers from './reducers'

// createStore 接受一个reducer函数返回一个store对象
const stroe = createStore(reducers) //创建时会自动调用init
console.log(stroe)

export default stroe