const index = [
    {
        path: '/tgpt_v2/vehicleUseApply',
        name: 'vehicleUseApply',
        component: () => import('@/views/tgpt_v2/base/vehicleUseApply/list'),
        meta: {title: '使用车辆',icon:"app1"},
    },
    {
        path: '/tgpt_v2/vehicleUseApply/add',
        name: 'vehicleUseApplyAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/base/vehicleUseApply/add'),
        meta: {title: '申请使用'},
    },
    {
        path: '/tgpt_v2/vehicleUseApply/edit',
        name: 'vehicleUseApplyEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/base/vehicleUseApply/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/vehicleUseApply/detail/:id',
        name: 'vehicleUseApplyDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/base/vehicleUseApply/detail'),
        meta: {title: '查看'}
    }
]

export default index
