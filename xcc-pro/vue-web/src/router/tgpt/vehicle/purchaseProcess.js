const index = [
    {
        path: '/tgpt/vehicle/purchaseProcess',
        name: 'vehiclePurchaseProcess',
        component: () => import('@/views/tgpt/vehicle/purchaseProcess/list'),
        meta: {title: '车辆采购过程', icon:"vehicleManage8"},
    },
    {
        path: '/tgpt/vehicle/purchaseProcess/edit',
        name: 'vehiclePurchaseProcessEdit',
        hidden: true,
        component: () => import('@/views/tgpt/vehicle/purchaseProcess/edit'),
        meta: {title: '车辆采购过程'}
    },
    {
        path: '/tgpt/vehicle/purchaseProcess/detail/:id',
        name: 'vehiclePurchaseProcessDetail',
        hidden: true,
        component: () => import('@/views/tgpt/vehicle/purchaseProcess/detail'),
        meta: {title: '车辆采购过程详情'}
    },

]

export default index
