import ajax from '@/utils/request'
import {constantRouterMap, authRouterMap} from '@/router'


function authCheck(routerMap, auth) {
    for (let i = 0; i < routerMap.length; i++) {
        let bean = routerMap[i];
        if(bean.path==='*') {
            continue
        }
        if (bean.children && bean.children.length) {
            authCheck(bean.children, auth)
        } else if (auth.indexOf(bean.path) === -1 && bean.hidden !== true) {
            routerMap.splice(i, 1);
            i--;
        }
    }

}

function getMenu(data){
    if(data){
        let out = [];
        data.forEach(bean =>{
            let item = Object.assign({},bean);
            if(!item.hidden){
                if(item.children && item.children.length) {
                    item.children = getMenu(item.children);
                }
                if(item.path === "/" && (!item.children || item.children.length==0)) {
                    return;
                }
                out.push(item);
            }
        });
        return out;
    } else {
        return [];
    }
}

let firstMenu = null
function setFisrtMenu(menu){
    for(let i = 0 ; i < menu.length; i++){
        if(firstMenu) break;
        const router = menu[i]
        if(router.children && router.children.length && !router.path){
            setFisrtMenu(router.children)
        }else if(router.path == '/tgpt/index'){
            continue;
        }else{
            firstMenu = {path: '/', redirect: router.path, hidden: true}
            break;
        }
    }
}

function getAuthorityMenu(arr){
    arr.map(router=>{
        if(router.children && router.children.length){
            getAuthorityMenu(router.children);
        }else{
            auth.state.authorityMenu.push(router);
        }
    })
}

const auth = {
    state: {
        auth: [],
        authMenu: [],
        authRouters: constantRouterMap,
        menu: [],
        loadAuth:false,
        hasWorkbench: false,
        authorityMenu:[]
    },

    mutations: {
        SET_AUTH: (state, data) => {
            state.auth = data
        },
        SET_AUTH_MENU: (state, data) => {
            state.authMenu = data
        },
        SET_MENU: (state, data) => {
            state.menu = data
            if(data.some(auth => auth.path === '/tgpt/index')){
               state.menu.find(menu =>{
                    if(menu.path === '/tgpt/index'){
                        menu.hidden = true
                    }
                })
            }
            setFisrtMenu(state.menu)
            getAuthorityMenu(state.menu)
            state.authRouters.unshift(firstMenu)
        },
        SET_ROUTERS: (state, routers) => {
            state.authRouters = constantRouterMap.concat(routers);
        },
        SET_LOAD_AUTH: (state, data) => {
            state.loadAuth = data
        },
        SET_HAS_WORK_BENCH: (state, flag) => {
            state.hasWorkbench = flag
        }
    },

    actions: {
        getAuth({commit, state}) {
            return new Promise((resolve, reject) => {
                ajax.get('admin/user/getCurrentUserAuthority').then(response => {
                    const data = response.data
                    commit('SET_LOAD_AUTH', true);
                    commit('SET_AUTH', data.btnStr.split(";"))
                    commit('SET_AUTH_MENU', data.menuStr.split(";"))
                    authCheck(authRouterMap, data.menuStr.split(";"))
                    commit('SET_ROUTERS', authRouterMap)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        getMenu({commit, state}) {
            return new Promise((resolve, reject) => {
                ajax.get('/admin/menu/tree').then(response => {
                    if(typeof response === "string"){
                        response = JSON.stringify(response);
                    }
                    console.log(response);
                    const data = response.data
                    commit('SET_MENU', data)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        getAuthInfo({commit, state, dispatch}) {
            return new Promise((resolve, reject) => {
                dispatch('GetInfo');
                Promise.all([dispatch('getAuth'),dispatch('getMenu')]).then(_ =>{
                    router.addRoutes(store.getters.authRouters)
                    resolve()
                })

            })
        },
        setHasWorkbench({commit},flag) {
            commit('SET_HAS_WORK_BENCH',flag)
        },
    }
}

export default auth
