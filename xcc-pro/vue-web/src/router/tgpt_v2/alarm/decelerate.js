const index = [
    {
        path: '/tgpt_v2/alarm/decelerate',
        name: 'decelerate',
        component: () => import('@/views/tgpt_v2/alarm/decelerate/list'),
        meta: {title: '急减速'},
    },
    {
        path: '/tgpt_v2/alarm/decelerate/detail/:id',
        name: 'decelerateDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/alarm/decelerate/detail'),
        meta: {title: '查看'}
    }
]

export default index
