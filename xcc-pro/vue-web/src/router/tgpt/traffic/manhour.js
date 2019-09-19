const index = [
    {
        path: '/tgpt/traffic/manhour',
        name: 'trafficManhour',
        component: () => import('@/views/tgpt/traffic/manhour/list'),
        meta: {title: '工时项目', icon:"carsService3"},
    },
    {
        path: '/tgpt/traffic/manhour/add',
        name: 'trafficManhourAdd',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/manhour/add'),
        meta: {title: '添加工时项目'},
    },
    {
        path: '/tgpt/traffic/manhour/edit',
        name: 'trafficManhourEdit',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/manhour/edit'),
        meta: {title: '编辑工时项目'}
    },
    {
        path: '/tgpt/traffic/manhour/detail/:id',
        name: 'trafficManhourDetail',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/manhour/detail'),
        meta: {title: '工时项目详情'}
    }
]

export default index
