const index = [
    {
        path: '/tgpt_v2/operation/trafficMaintenance',
        name: 'appMaintenance',
        component: () => import('@/views/tgpt_v2/operation/trafficMaintenance/list'),
        meta: {icon:'base1',title: '维修管理'},
    },
    {
        path: '/tgpt_v2/operation/trafficMaintenance/confirm/:id',
        name: 'appMaintenanceConfirm',
        hidden: true,
        component: () => import('@/views/tgpt_v2/operation/trafficMaintenance/confirm'),
        meta: {title: '维修确认'}
    },
    {
        path: '/tgpt_v2/operation/trafficMaintenance/detail/:id',
        name: 'appMaintenanceDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/operation/trafficMaintenance/detail'),
        meta: {title: '维修详情'}
    }
]

export default index
