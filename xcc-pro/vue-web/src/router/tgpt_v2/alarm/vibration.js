const index = [
    {
        path: '/tgpt_v2/alarm/vibration',
        name: 'vibration',
        component: () => import('@/views/tgpt_v2/alarm/vibration/list'),
        meta: {title: '异常震动'},
    },
    {
        path: '/tgpt_v2/alarm/vibration/detail/:id',
        name: 'vibrationDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/alarm/vibration/detail'),
        meta: {title: '查看'}
    }

]

export default index
