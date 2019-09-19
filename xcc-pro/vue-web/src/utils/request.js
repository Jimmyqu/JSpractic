import axios from 'axios'
import { Message, Loading } from 'element-ui'
import store from '../store'
import NProgress from 'nprogress' // Progress 进度条

let loading
const loadingWhite = ['/sys/login/login', '/sys/login/getUserInfo', '/sys/common/getCurrentUserAuthority']
// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API // api的base_url
  // timeout: 5000 // 请求超时时间
})

service._get = service.get
service.get = function(url, params) {
  return service._get(url, { params })
}
service.defaults.headers.common['Content-Type'] = 'application/json'
// request拦截器
service.interceptors.request.use(config => {
  NProgress.start()
  if (store.getters.token) {
    config.headers['Authorization'] = 'Bearer ' + store.getters.token // 让每个请求携带自定义token 请根据实际情况自行修改
  }

  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    NProgress.done()
    // loading && loading.close();
    /**
         * status为非0是抛错 可结合自己业务进行修改
         */
    const res = response.data
    if (res.status === 401) {
      showError(res)
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    NProgress.done()
    const res = error.response.data
    // loading && loading.close();
    if (res.message) {
      showError(res)
    } else if (res.msg) {
      res.message = res.msg
      showError(res)
    }
    return Promise.reject(res)
  }
)

function showError(res) {
  if (res.status === 401) {
    store.dispatch('FedLogOut').then(() => {
      location.reload() // 为了重新实例化vue-router对象 避免bug
    })
    return
  }
  Message({
    message: res.message,
    type: 'error',
    duration: 5 * 1000,
    onClose() {

    }
  })
}

export default service
