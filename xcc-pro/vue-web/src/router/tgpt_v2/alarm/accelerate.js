const index = [
    {
        path: '/tgpt_v2/alarm/accelerate',
        name: 'accelerate',
        component: () => import('@/views/tgpt_v2/alarm/accelerate/list'),
        meta: {title: '急加速'},
    },
    {
        path: '/tgpt_v2/alarm/accelerate/detail/:id',
        name: 'accelerateDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/alarm/accelerate/detail'),
        meta: {title: '查看'}
    }
]

export default index
