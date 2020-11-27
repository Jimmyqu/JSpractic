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

function getDistance(p1, p2) {
  const x = p2.pageX - p1.pageX
  const y = p2.pageY - p1.pageY
  return Math.sqrt(x * x + y * y)
}
let isPinch = false
let start, nowScale
Vue.directive('pinch', {
  bind(el, binding) {
    el.addEventListener(
      'touchstart',
      function (e) {
        console.log(e)
        if (e.touches.length >= 2) {
          // 判断是否有两个点在屏幕上
          isPinch = true
          start = e.touches // 得到第一组两个点
        }
      },
      false
    )
    el.addEventListener(
      'touchmove',
      function (e) {
        if (e.touches.length >= 2 && isPinch) {
          const now = e.touches // 得到第二组两个点
          nowScale = getDistance(now[0], now[1]) / getDistance(start[0], start[1]) // 得到缩放比例
          const center = { x: (now[0].pageX + start[0].pageX) / 2, y: (now[1].pageY + start[1].pageY) / 2 }
          if (typeof binding.value === 'function') {
            binding.value(nowScale, center)
          }
        }
      },
      false
    )
  },
})

Vue.directive('pinchend', {
  bind(el, binding) {
    el.addEventListener(
      'touchend',
      function (e) {
        if (isPinch) {
          isPinch = false
          if (typeof binding.value === 'function') {
            binding.value(nowScale)
          }
        }
      },
      false
    )
  },
}) 

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
