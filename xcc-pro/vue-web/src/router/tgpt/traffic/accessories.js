const index = [
    {
        path: '/tgpt/traffic/accessories',
        name: 'trafficAccessories',
        component: () => import('@/views/tgpt/traffic/accessories/list'),
        meta: {title: '配件项目', icon:"carsService4"},
    },
    {
        path: '/tgpt/traffic/accessories/add',
        name: 'trafficAccessoriesAdd',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/accessories/add'),
        meta: {title: '添加配件项目'},
    },
    {
        path: '/tgpt/traffic/accessories/edit',
        name: 'trafficAccessoriesEdit',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/accessories/edit'),
        meta: {title: '编辑配件项目'}
    },
    {
        path: '/tgpt/traffic/accessories/detail/:id',
        name: 'trafficAccessoriesDetail',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/accessories/detail'),
        meta: {title: '配件项目详情'}
    }
]

export default index
