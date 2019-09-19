const index = [
    {
        path: '/tgpt/vehicle/modelStyle',
        name: 'vehicleModelStyle',
        component: () => import('@/views/tgpt/vehicle/modelStyle/list'),
        meta: {title: '车型款式', icon:"vehicleManage4"},
    },
    {
        path: '/tgpt/vehicle/modelStyle/add',
        name: 'vehicleModelStyleAdd',
        hidden: true,
        component: () => import('@/views/tgpt/vehicle/modelStyle/add'),
        meta: {title: '添加车型款式'},
    },
    {
        path: '/tgpt/vehicle/modelStyle/edit',
        name: 'vehicleModelStyleEdit',
        hidden: true,
        component: () => import('@/views/tgpt/vehicle/modelStyle/edit'),
        meta: {title: '编辑车型款式'}
    },
    {
        path: '/tgpt/vehicle/modelStyle/detail/:id',
        name: 'vehicleModelStyleDetail',
        hidden: true,
        component: () => import('@/views/tgpt/vehicle/modelStyle/detail'),
        meta: {title: '车型款式详情'}
    }
]

export default index
