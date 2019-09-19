import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/views/common/layout/Layout'
import project from '@/router/tgpt/project/index'
import vehicle from '@/router/tgpt/vehicle/index'
import traffic from '@/router/tgpt/traffic/index'
import driver from '@/router/tgpt/driver/index'
import financial from '@/router/tgpt/financial/index'
import tgptV2Obd from '@/router/tgpt_v2/obd/index.js'
import upms from '@/router/upms/index.js'
import tgptV2Report from '@/router/tgpt_v2/report/index.js'
import plateManage from '@/router/tgpt_v2/plate/index'
import vehicleDisposalApply from '@/router/tgpt_v2/vehicleDisposal/index'
import clientVehicleApplication from '@/router/tgpt_v2/clientVehicleApplication/index'
import operation from '@/router/tgpt_v2/operation/index'

// import tgptVehicle from '@/router/modules//tgpt/vehicle/index.js'
// import tgptTraffic from '@/router/modules//tgpt/traffic/index.js'
// import tgptDriver from '@/router/modules//tgpt/driver/index.js'
// import tgptProject from '@/router/modules//tgpt/project/index.js'
// import tgptFinancial from '@/router/modules//tgpt/financial/index.js'
// import tgptSupplier from '@/router/modules//tgpt/supplier/index.js'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

//import sys from '@/router/tgpt/sys/index'


/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [

    /*{path: '/', redirect: '/tgpt/index', hidden: true},*/
    // {path: '/', redirect: '/tgpt/vehicle/vehicleInformation', hidden: true},
    {path: '/login', component: () => import('@/views/common/login/index'), hidden: true},
    {path: '/autoLogin', component: () => import('@/views/common/autoLogin/index'), hidden: true},
    {path: '/404', component: () => import('@/views/common/404'), hidden: true},
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        meta: {
            noCache: true //如果设置为true ,则不会被 <keep-alive> 缓存(默认 false)
        },
        children: [
            {
                path: '/redirect/:path*',
                component: () => import('@/views/common/redirect/index')
            }
        ]
    },
]

export const authRouterMap = [
    {
        path: '/',
        component: Layout,
        name: '工作台',
        hidden: true,
        children: [
            {
                path: '/tgpt/index',
                name: 'index',
                component: () => import('@/views/tgpt/workbench/workbench'),
                meta: {title: '工作台', icon: 'index'}
            }
        ]
    },
    {
        path: '/',
        name: '流程待办',
        component: Layout,
        children: [
            {
                path: '/tgpt/todoFlow',
                name: 'todoFlow',
                component: () => import('@/views/tgpt/todoflow/todoflow'),
                meta: {title: '流程待办', icon: 'process'}
            }
        ]
    },
    /*基础数据*/
    vehicle,
    plateManage,
    vehicleDisposalApply,
    /*业务平台*/
    project,
    /*监控平台*/
    tgptV2Obd,
    /*车务平台*/
    traffic,
    /*司机平台*/
    driver,
    /*财务平台*/
    financial,
    /*报表统计*/
    tgptV2Report,
    /*权限管理*/
    upms,
    /*用车申请*/
    clientVehicleApplication,
    /*运管平台*/
    operation,
    /*appDriver,*/
    // sysProvinces,
    // tgptSys,
    // tgptCorporatecustomer,
    //tgptV2Base,
    //tgptV2Se,
    //tgptV2Sys,
    // tgptVehicle,
    // tgptTraffic,
    // tgptDriver,
    // tgptProject,
    // tgptFinancial,
    // tgptSupplier,
    /*tgptV2Alarm,*/
    //sys,
    {path: '*', redirect: '/404', hidden: true}
]

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
})

