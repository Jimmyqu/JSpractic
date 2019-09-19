const index = [
    {
        path: '/tgpt_v2/alarm/dragracing',
        name: 'dragracing',
        component: () => import('@/views/tgpt_v2/alarm/dragracing/list'),
        meta: {title: '飙车'},
    },
    {
        path: '/tgpt_v2/alarm/dragracing/detail/:id',
        name: 'dragracingDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/alarm/dragracing/detail'),
        meta: {title: '查看'}
    }
]

export default index
