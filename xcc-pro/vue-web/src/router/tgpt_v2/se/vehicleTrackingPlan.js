const index = [
    {
        path: '/tgpt_v2/se/vehicleTrackingPlan',
        name: 'vehicleTrackingPlan',
        component: () => import('@/views/tgpt_v2/se/vehicleTrackingPlan/list'),
        meta: {icon:'se5',title: '跟踪计划'},
    },
    {
        path: '/tgpt_v2/se/vehicleTrackingPlan/add',
        name: 'vehicleTrackingPlanAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/se/vehicleTrackingPlan/add'),
        meta: {title: '添加'},
    },
    {
        path: '/tgpt_v2/se/vehicleTrackingPlan/edit',
        name: 'vehicleTrackingPlanEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/se/vehicleTrackingPlan/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/se/vehicleTrackingPlan/detail/:id',
        name: 'vehicleTrackingPlanDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/se/vehicleTrackingPlan/detail'),
        meta: {title: '查看'}
    }
]

export default index
