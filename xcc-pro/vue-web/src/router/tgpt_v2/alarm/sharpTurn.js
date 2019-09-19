const index = [
    {
        path: '/tgpt_v2/alarm/sharpTurn',
        name: 'sharpTurn',
        component: () => import('@/views/tgpt_v2/alarm/sharpTurn/list'),
        meta: {title: '急转弯'},
    },
    {
        path: '/tgpt_v2/alarm/sharpTurn/detail/:id',
        name: 'sharpTurnDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/alarm/sharpTurn/detail'),
        meta: {title: '查看'}
    }
]

export default index
