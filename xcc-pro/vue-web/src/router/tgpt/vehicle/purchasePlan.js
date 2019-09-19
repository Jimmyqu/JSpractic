const index = [
    {
        path: '/tgpt/vehicle/purchasePlan',
        name: 'vehiclePurchasePlan',
        component: () => import('@/views/tgpt/vehicle/purchasePlan/list'),
        meta: {title: '车辆采购计划', icon:"vehicleManage6"},
    },
    {
        path: '/tgpt/vehicle/purchasePlan/add',
        name: 'vehiclePurchasePlanAdd',
        hidden: true,
        component: () => import('@/views/tgpt/vehicle/purchasePlan/add'),
        meta: {title: '添加车辆采购计划'},
    },
    {
        path: '/tgpt/vehicle/purchasePlan/edit',
        name: 'vehiclePurchasePlanEdit',
        hidden: true,
        component: () => import('@/views/tgpt/vehicle/purchasePlan/edit'),
        meta: {title: '编辑车辆采购计划'}
    },
    {
        path: '/tgpt/vehicle/purchasePlan/detail/:id',
        name: 'vehiclePurchasePlanDetail',
        hidden: true,
        component: () => import('@/views/tgpt/vehicle/purchasePlan/detail'),
        meta: {title: '车辆采购计划详情'}
    }
]

export default index
