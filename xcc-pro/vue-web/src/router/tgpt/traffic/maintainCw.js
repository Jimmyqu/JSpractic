const index = [
    {
        path: '/tgpt/traffic/maintainCw',
        name: 'maintainCwList',
        component: () => import('@/views/tgpt/traffic/maintainCw/list'),
        meta: {icon:'carsService17',title: '保养管理'},
    },
    {
        path: '/tgpt/traffic/maintainCw/add',
        name: 'maintainCwAdd',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/maintainCw/add'),
        meta: {title: '保养登记'},
    },
    {
        path: '/tgpt/traffic/maintainCw/edit',
        name: 'maintainCwEdit',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/maintainCw/edit'),
        meta: {title: '修改'},
    },
    {
        path: '/tgpt/traffic/maintainCw/record',
        name: 'maintainCwRecord',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/maintainCw/record'),
        meta: {title: '保养记录'},
    },
]

export default index
