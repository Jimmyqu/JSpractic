import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import {Message} from 'element-ui'
import {getToken} from '@/utils/cookie' // 验权

const whiteList = ['/login','/autoLogin'] // 不重定向白名单
router.beforeEach((to, from, next) => {
    NProgress.start()
    if (getToken()) {
        if (to.path === '/login' || to.path === '/autoLogin') {
            next({path: '/'})
            NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
        } else {
            if (!store.getters.loadAuth) {
                try {
                    // store.dispatch('getAuth');
                    store.dispatch('GetInfo');
                    store.dispatch('GetLOgo');
                    store.dispatch('getAuth').then(_=>{
                        store.dispatch('getMenu').then(res =>{
                            console.log(store.getters.authRouters);
                            router.addRoutes(store.getters.authRouters)
                            next({...to, replace: true});
                        });
                    });

                }catch(err){
                    store.dispatch('FedLogOut').then(() => {
                        Message.error(err || 'Verification failed, please login again')
                        next({path: '/'})
                    })
                }

            } else {
                next()
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next('/login')
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done() // 结束Progress
})
