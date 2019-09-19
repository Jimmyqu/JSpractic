const index = [
    {
        path: '/tgpt/traffic/profit',
        name: 'trafficProfit',
        component: () => import('@/views/tgpt/traffic/profit/list'),
        meta: {title: '每月单车利润表', icon:"carsService16"},
    },
    {
        path: '/tgpt/traffic/profit/detail/:id',
        name: 'trafficProfitDetail',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/profit/detail'),
        meta: {title: '每月单车利润表详情'}
    }
]

export default index
