const index = [
    {
        path: '/tgpt_v2/vehicleSellApply',
        name: 'baseVehicleSellApply',
        component: () => import('@/views/tgpt_v2/vehicleSellApply/list'),
        meta: {title: '车辆出售申请'},
    },
    {
        path: '/tgpt_v2/vehicleSellApply/add',
        name: 'baseVehicleSellApplyAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/vehicleSellApply/add'),
        meta: {title: '添加'},
    },
    {
        path: '/tgpt_v2/vehicleSellApply/edit',
        name: 'baseVehicleSellApplyEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/vehicleSellApply/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/vehicleSellApply/detail/:id',
        name: 'baseVehicleSellApplyDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/vehicleSellApply/detail'),
        meta: {title: '查看'}
    },

]

export default index
