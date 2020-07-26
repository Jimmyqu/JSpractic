import {combineReducers} from 'redux'
import homeReducer from './module/home'
import computedReducer from './module/computed'

export const reducer = combineReducers({
    homeReducer,
    computedReducer
})
