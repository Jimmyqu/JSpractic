import ajax from '@/utils/request'
import {getToken, setToken, removeToken, removeAuth} from '@/utils/cookie'

const user = {
    state: {
        avatar: "",
        token: getToken(),
        user: {},
        logoUrl:''
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_USER: (state, user) => {
            state.user = user
        },
        SET_LOGO_URL:(state, url) => {
            state.logoUrl = url
        }
    },

    actions: {
        // 登录
        Login({commit}, data) {
            return new Promise((resolve, reject) => {
                ajax({
                    url: 'auth/oauth/token',
                    method: 'post',
                    headers:{'Authorization':'Basic dGVzdDp0ZXN0','Content-Type':'application/x-www-form-urlencoded'},
                    params: {
                        username: data.account,
                        password: data.password,
                        grant_type: 'password'
                    }
                }).then(data => {
                    setToken(data.access_token)
                    commit('SET_TOKEN', data.access_token)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取用户信息
        GetInfo({commit, state}) {
            return new Promise((resolve, reject) => {
                ajax.get('admin/user/vUserInfo').then(response => {
                    const data = response.data
                    commit('SET_USER', data)
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 获取用户信息
        GetLOgo({commit, state}) {
            return new Promise((resolve, reject) => {
                ajax.get('admin/personaliseController/getLogo?company=').then(response => {
                    const data = response.data
                    commit('SET_LOGO_URL', data.path)
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 登出
        LogOut({commit, state}) {
            return new Promise((resolve, reject) => {
                ajax.get('admin/user/logout').then(() => {
                    commit('SET_TOKEN', '');
                    removeToken();
                    sessionStorage.clear();
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 前端 登出
        FedLogOut({commit}) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                removeToken()
                resolve()
            })
        },
        // 修改logo
        setLogoUrl({commit},url) {
            commit('SET_LOGO_URL', url)
        }
    }
}

export default user
