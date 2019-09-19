const index = [
    {
        path: '/tgpt_v2/vehicleDisposalApply',
        name: 'baseVehicleDisposalApply',
        component: () => import('@/views/tgpt_v2/vehicleDisposalApply/list'),
        meta: {title: '车辆处置查询'},
    },
    {
        path: '/tgpt_v2/vehicleDisposalApply/add',
        name: 'baseVehicleDisposalApplyAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/vehicleDisposalApply/add'),
        meta: {title: '添加'},
    },
    {
        path: '/tgpt_v2/vehicleDisposalApply/edit',
        name: 'baseVehicleDisposalApplyEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/vehicleDisposalApply/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/vehicleDisposalApply/detail/:id',
        name: 'baseVehicleDisposalApplyDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/vehicleDisposalApply/detail'),
        meta: {title: '查看'}
    },
   
]

export default index