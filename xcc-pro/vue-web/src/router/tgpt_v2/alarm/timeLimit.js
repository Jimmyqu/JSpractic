const index = [
    {
        path: '/tgpt_v2/alarm/timeLimit',
        name: 'timeLimit',
        component: () => import('@/views/tgpt_v2/alarm/timeLimit/list'),
        meta: {title: '时间栅栏'},
    },
    {
        path: '/tgpt_v2/alarm/timeLimit/detail/:id',
        name: 'timeLimitDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/alarm/timeLimit/detail'),
        meta: {title: '行驶轨迹'}
    },
    {
        path: '/tgpt_v2/alarm/timeLimit/detailRoute/:id',
        name: 'detailRoute',
        hidden: true,
        component: () => import('@/views/tgpt_v2/alarm/timeLimit/detailRoute'),
        meta: {title: '查看行程'}
    },
    {
        path: '/tgpt_v2/alarm/operation',
        name: 'illegalOperation',
        component: () => import('@/views/tgpt_v2/alarm/illegalOperation/list'),
        meta: {title: '非法调度'},
    },
    {
        path: '/tgpt_v2/alarm/operation/detail/:id',
        name: 'illegalOperationDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/alarm/illegalOperation/detail'),
        meta: {title: '非法调度详情'}
    }
]

export default index
