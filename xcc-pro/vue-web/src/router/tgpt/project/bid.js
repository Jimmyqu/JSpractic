const index = [
    {
        path: '/tgpt/project/bid',
        name: 'bid',
        component: () => import('@/views/tgpt/project/bid/list'),
        meta: {title: '招投标管理',icon:"projectManage1"},
    },
    {
        path: '/tgpt/project/bid/add',
        name: 'bidAdd',
        hidden: true,
        component: () => import('@/views/tgpt/project/bid/add'),
        meta: {title: '新增投标'},
    },
    {
        path: '/tgpt/project/bid/edit',
        name: 'bidEdit',
        hidden: true,
        component: () => import('@/views/tgpt/project/bid/edit'),
        meta: {title: '编辑投标'}
    },
    {
        path: '/tgpt/project/bid/detail/:id',
        name: 'bidDetail',
        hidden: true,
        component: () => import('@/views/tgpt/project/bid/detail'),
        meta: {title: '投标详情'}
    }
]

export default index
