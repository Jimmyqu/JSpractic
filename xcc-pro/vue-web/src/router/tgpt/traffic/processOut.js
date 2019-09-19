const index = [
    {
        path: '/tgpt/traffic/processOut',
        name: 'trafficProcessOut',
        component: () => import('@/views/tgpt/traffic/processOut/list'),
        meta: {title: '车辆调拨-调车', icon:"carsService15"},
    },
    {
        path: '/tgpt/traffic/processOut/out',
        name: 'trafficProcessOutAdd',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/processOut/out'),
        meta: {title: '出车'},
    },
    {
        path: '/tgpt/traffic/processOut/detail/:id',
        name: 'trafficProcessOutDetail',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/processOut/detail'),
        meta: {title: '车辆调拨-调车详情'}
    }
]

export default index
