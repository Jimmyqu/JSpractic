const index = [
    {
        path: '/tgpt_v2/vehicleSellProcess',
        name: 'baseVehicleSellProcess',
        component: () => import('@/views/tgpt_v2/vehicleSellProcess/list'),
        meta: {title: '车辆出售过程'},
    },
    {
        path: '/tgpt_v2/vehicleSellProcess/add',
        name: 'baseVehicleSellProcessAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/vehicleSellProcess/add'),
        meta: {title: '添加'},
    },
    {
        path: '/tgpt_v2/vehicleSellProcess/edit',
        name: 'baseVehicleSellProcessEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/vehicleSellProcess/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/vehicleSellProcess/detail/:id',
        name: 'baseVehicleSellProcessDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/vehicleSellProcess/detail'),
        meta: {title: '查看'}
    },

]

export default index
