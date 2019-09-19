import config from './config'
import store from '../store'

function setHeader(header) {
    if(header){
        return header
    }else if(store.state.token){
        return {
            'content-type': 'application/json', // 默认值
            'Authorization': 'Bearer ' + store.state.token
          }
    }else{
        return {
            'content-type': 'application/json', // 默认值
        }
    }
}

//请求封装
function request(url, method, data, header) {
    uni.showLoading({
      title: '加载中' //数据请求前loading
    })
    return new Promise(async (resolve, reject) => {
      await uni.request({
        url: config.BASE_API + url, //仅为示例，并非真实的接口地址
        method: method,
        data: data,
        header: setHeader(header),
				//header: {'content-type': 'application/json'},
        success: function (res) {
          uni.hideLoading();
          if(res.statusCode == 200){
              resolve(res.data)
          }else{
                if(res.statusCode > 400 && res.statusCode <= 403){
                    uni.showToast({
                      title: '登录过期',
                      icon: 'none',
                      duration: 2000
                    })
                    setTimeout(()=>{
                      uni.reLaunch({
                          url: '/pages/login/index'
                      })
                    },2000)
                }else if(res.statusCode == 400 || res.statusCode >= 500){
                  uni.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 2000
                  })
                }else{
                  reject(res.data);
                }
          }
        },
        fail: function (error) {
          uni.hideLoading();
          uni.showToast({
            title: '请求失败',
            icon: 'none',
            duration: 3000
          })
        },
        complete: function () {
        }
      })
    })
  }
export function get({url,data}) {
    return request(url, 'GET', data)
  }
export function post({url,data,header}) {
return request(url, 'POST', data, header)
}
export default {
	get,
	post
}