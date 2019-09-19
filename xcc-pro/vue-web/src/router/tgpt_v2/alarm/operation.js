const index = [
    {
        path: '/tgpt_v2/alarm/operation',
        name: 'illegalOperation',
        component: () => import('@/views/tgpt_v2/alarm/illegalOperation/list'),
        meta: {title: '时间栅栏'},
    },
    {
        path: '/tgpt_v2/alarm/operation/detail/:id',
        name: 'illegalOperationDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/alarm/illegalOperation/detail'),
        meta: {title: '查看行程'}
    }
]

export default index
