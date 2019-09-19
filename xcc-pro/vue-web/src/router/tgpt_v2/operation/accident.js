const index = [
    {
        path: '/tgpt_v2/operation/trafficAccident',
        name: 'appAccident',
        component: () => import('@/views/tgpt_v2/operation/trafficAccident/list'),
        meta: {icon:'base1',title: '事故管理'},
    },
    {
        path: '/tgpt_v2/operation/trafficAccident/confirm/:id',
        name: 'appAccidentConfirm',
        hidden: true,
        component: () => import('@/views/tgpt_v2/operation/trafficAccident/confirm'),
        meta: {title: '事故确认'}
    },
    {
        path: '/tgpt_v2/operation/trafficAccident/detail/:id',
        name: 'appAccidentDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/operation/trafficAccident/detail'),
        meta: {title: '事故详情'}
    }
]

export default index
