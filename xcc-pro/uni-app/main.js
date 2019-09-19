import Vue from 'vue'
import Vuex from 'vuex'
import store from './store/index'
import App from './App'
import ajax from './utils/request'
import './utils/util'

Vue.prototype.$store = store
Vue.prototype.$ajax = ajax

Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype.$bus = new Vue();

const app = new Vue({
    ...App
})
app.$mount()
