const index = [
    {
        path: '/tgpt/traffic/serviceDepot',
        name: 'trafficServiceDepot',
        component: () => import('@/views/tgpt/traffic/serviceDepot/list'),
        meta: {title: '维修厂资料', icon:"carsService2"},
    },
    {
        path: '/tgpt/traffic/serviceDepot/add',
        name: 'trafficServiceDepotAdd',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/serviceDepot/add'),
        meta: {title: '维修厂资料系列'},
    },
    {
        path: '/tgpt/traffic/serviceDepot/edit',
        name: 'trafficServiceDepotEdit',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/serviceDepot/edit'),
        meta: {title: '编辑维修厂资料'}
    },
    {
        path: '/tgpt/traffic/serviceDepot/detail/:id',
        name: 'trafficServiceDepotDetail',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/serviceDepot/detail'),
        meta: {title: '维修厂资料详情'}
    }
]

export default index
