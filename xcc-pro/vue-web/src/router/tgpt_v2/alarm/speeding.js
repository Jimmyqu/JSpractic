const index = [
    {
        path: '/tgpt_v2/alarm/speeding',
        name: 'speeding',
        component: () => import('@/views/tgpt_v2/alarm/speeding/list'),
        meta: {title: '超速'},
    },
    {
        path: '/tgpt_v2/alarm/speeding/detail/:id',
        name: 'speedingDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/alarm/speeding/detail'),
        meta: {title: '查看'}
    }
]

export default index
