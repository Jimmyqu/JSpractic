import Vue from 'vue';
import Vuex from 'vuex'
import { get, post } from '../utils/request'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    token: "",
    user:{},
    organization:{},
    driver:{}
  },
  actions:{
    login({commit,dispatch},data){
        post({
            url:'auth/oauth/token',
            data:data,
            header:{'Authorization':'Basic dGVzdDp0ZXN0','Content-Type':'application/x-www-form-urlencoded'}
        }).then(res=>{
            if(res.access_token){
                commit('SET_TOKEN',res)
                dispatch('getUserInfo')
            }
        },err=>{
            uni.showToast({
                title: err.msg,
                icon: 'success',
                icon: 'none',
                duration: 3000
            })
        })
    },
    getUserInfo({commit}){
        get({
            url:'admin/user/vUserInfo',
        }).then(res=>{
            if(res.status == 0){
                commit('SET_USER_INFO',res.data);
            }
        },err=>{
            uni.showToast({
                title: err.msg,
                icon: 'none',
                duration: 2000
            })
        })
    },
    loginOut({commit}){
        get({
            url:'admin/user/logout',
        }).then(res=>{
            if(res.status == 0){
                commit('CLEAR');
            }
        })
    }
  },
  mutations: {
    SET_TOKEN:(state,data)=>{
        uni.setStorageSync('token', data.access_token)
        state.token = data.access_token;
    },
    SET_USER_INFO:(state,data)=>{
        state.user = data;
        uni.reLaunch({
            url: '/pages/index/index'
        })
    },
    CLEAR:(state)=>{
        state.user = {};
        uni.clearStorageSync();
        uni.reLaunch({
            url: '/pages/login/index'
        })
    },
    /**
     * 在main.js例引入
     * import store from './store/index'
     * 把store挂载到全局
     * Vue.prototype.$store = store;
     */

    /**
     * 这里设置一个统一的方法,大部分用的vuex都是简单的改变一些状态,不需要写过多的mutations
     * 使用方法 例:
     * this.$store.update({"cityName":"北京"})
     * 
     *  config需要传入对象
     * @param {*} state 
     * @param {*Object} config 
     */
    update(state, config) {
      Object.keys(config).map((item, key) => {
        state[item] = config[item]
      })
    },
    
  }
})

export default store;
