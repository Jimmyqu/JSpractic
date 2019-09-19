const index = [
    {
        path: '/tgpt/traffic/annual',
        name: 'annualList',
        component: () => import('@/views/tgpt/traffic/annual/list'),
        meta: {icon:'carsService17',title: '年检管理'},
    },
    {
        path: '/tgpt/traffic/annual/add',
        name: 'annualAdd',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/annual/add'),
        meta: {title: '年检登记'},
    },
    {
        path: '/tgpt/traffic/annual/edit',
        name: 'annualEdit',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/annual/edit'),
        meta: {title: '修改'},
    },
    {
        path: '/tgpt/traffic/annual/record',
        name: 'annualRecord',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/annual/record'),
        meta: {title: '年检记录'},
    },
]

export default index
