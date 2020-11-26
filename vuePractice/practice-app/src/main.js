import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant';
import 'vant/lib/index.css';
import './directive/index'
import './assets/index.css'

var VueTouch = require('vue-touch/vue-touch')

Vue.use(VueTouch, { name: 'v-touch' })
Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
