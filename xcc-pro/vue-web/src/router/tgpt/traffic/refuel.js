const index = [
    {
        path: '/tgpt/traffic/refuel',
        name: 'trafficRefuel',
        component: () => import('@/views/tgpt/traffic/refuel/list'),
        meta: {title: '车辆加油单', icon:"carsService7"},
    },
    {
        path: '/tgpt/traffic/refuel/add',
        name: 'trafficRefuelAdd',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/refuel/add'),
        meta: {title: '添加车辆加油单'},
    },
    {
        path: '/tgpt/traffic/refuel/edit',
        name: 'trafficRefuelEdit',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/refuel/edit'),
        meta: {title: '编辑车辆加油单'}
    },
    {
        path: '/tgpt/traffic/refuel/detail/:id',
        name: 'trafficRefuelDetail',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/refuel/detail'),
        meta: {title: '车辆加油单详情'}
    }
]

export default index
