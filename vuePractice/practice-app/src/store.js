import Vue from 'vue'
import store from './utils/myStore'

Vue.use(store) 

const MyStore  =new store.Store({
    state:{
        count:1
    },
    mutation:{
        increment(state,n=1) {
            state.count =  state.count+n
        }
    }
})

export default MyStore