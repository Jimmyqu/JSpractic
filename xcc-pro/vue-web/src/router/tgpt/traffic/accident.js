const index = [
    {
        path: '/tgpt/traffic/accident',
        name: 'trafficAccident',
        component: () => import('@/views/tgpt/traffic/accident/list'),
        meta: {title: '车辆事故单', icon:"carsService11"},
    },
    {
        path: '/tgpt/traffic/accident/add',
        name: 'trafficAccidentAdd',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/accident/add'),
        meta: {title: '添加车辆事故单'},
    },
    {
        path: '/tgpt/traffic/accident/edit',
        name: 'trafficAccidentEdit',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/accident/edit'),
        meta: {title: '编辑车辆事故单'}
    },
    {
        path: '/tgpt/traffic/accident/detail/:id',
        name: 'trafficAccidentDetail',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/accident/detail'),
        meta: {title: '车辆事故单详情'}
    }
]

export default index
