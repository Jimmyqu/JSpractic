const index = [
    {
        path: '/tgpt/traffic/clean',
        name: 'trafficClean',
        component: () => import('@/views/tgpt/traffic/clean/list'),
        meta: {title: '车辆清洁单', icon:"carsService8"},
    },
    {
        path: '/tgpt/traffic/clean/add',
        name: 'trafficCleanAdd',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/clean/add'),
        meta: {title: '添加车辆清洁单'},
    },
    {
        path: '/tgpt/traffic/clean/edit',
        name: 'trafficCleanEdit',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/clean/edit'),
        meta: {title: '编辑车辆清洁单'}
    },
    {
        path: '/tgpt/traffic/clean/detail/:id',
        name: 'trafficCleanDetail',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/clean/detail'),
        meta: {title: '车辆清洁单详情'}
    }
]

export default index
