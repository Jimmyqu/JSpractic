const index = [
    {
        path: '/tgpt/vehicle/modelInformation',
        name: 'vehicleModelInformation',
        component: () => import('@/views/tgpt/vehicle/modelInformation/list'),
        meta: {title: '车型资料', icon:"vehicleManage1"},
    },
    {
        path: '/tgpt/vehicle/modelInformation/add',
        name: 'vehicleModelInformationAdd',
        hidden: true,
        component: () => import('@/views/tgpt/vehicle/modelInformation/add'),
        meta: {title: '添加车型'},
    },
    {
        path: '/tgpt/vehicle/modelInformation/edit',
        name: 'vehicleModelInformationEdit',
        hidden: true,
        component: () => import('@/views/tgpt/vehicle/modelInformation/edit'),
        meta: {title: '编辑车型'}
    },
    {
        path: '/tgpt/vehicle/modelInformation/detail/:id',
        name: 'vehicleModelInformationDetail',
        hidden: true,
        component: () => import('@/views/tgpt/vehicle/modelInformation/detail'),
        meta: {title: '车型资料详情'}
    }
]

export default index
