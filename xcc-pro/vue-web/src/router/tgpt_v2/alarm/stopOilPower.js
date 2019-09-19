const index = [
    {
        path: '/tgpt_v2/alarm/stopOilPower',
        name: 'stopOilPower',
        component: () => import('@/views/tgpt_v2/alarm/stopOilPower/list'),
        meta: {title: '油电控制'}
    },
    {
        path: '/tgpt_v2/alarm/stopOilPower/history/:id',
        name: 'stopOilPowerHistory',
        hidden: true,
        component: () => import('@/views/tgpt_v2/alarm/stopOilPower/history'),
        meta: {title: '油电控制记录'}
    },
]

export default index
