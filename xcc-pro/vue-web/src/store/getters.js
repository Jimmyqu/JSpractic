import {getToken} from '@/utils/cookie'

const getters = {
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    isInit: state => state.app.isInit,// 应用是否第一次加载列表
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    user: state => state.user.user,
    authRouters: state => state.auth.authRouters,
    menu: state => state.auth.menu,
    loadAuth: state => state.auth.loadAuth,
    auth: state => state.auth.auth,
    authMenu: state => state.auth.authMenu,
    roles: state => state.user.roles,
    hasWorkbench: state => state.auth.hasWorkbench,
    authorityMenu: state => state.auth.authorityMenu,
    logoUrl: state => state.user.logoUrl,
}
export default getters
