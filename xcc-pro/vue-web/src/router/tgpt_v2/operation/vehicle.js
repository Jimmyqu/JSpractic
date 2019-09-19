const index = [
    {
        path: '/tgpt_v2/operation/vehicle',
        name: 'appVehicle',
        component: () => import('@/views/tgpt_v2/operation/vehicle/list'),
        meta: {icon:'base1',title: '车辆管理'},
    },
    {
        path: '/tgpt_v2/operation/vehicle/add',
        name: 'appVehicleAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/operation/vehicle/add'),
        meta: {title: '添加'},
    },
    {
        path: '/tgpt_v2/operation/vehicle/edit',
        name: 'appVehicleEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/operation/vehicle/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/operation/vehicle/detail/:id',
        name: 'appVehicleDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/operation/vehicle/detail'),
        meta: {title: '查看'}
    }
]

export default index
