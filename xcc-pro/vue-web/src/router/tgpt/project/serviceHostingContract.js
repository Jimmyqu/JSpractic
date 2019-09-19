const index = [
    {
        path: '/tgpt/project/serviceHosting/contract',
        name: 'serviceHostingContract',
        component: () => import('@/views/tgpt/project/serviceHosting/contract/list'),
        meta: {title: '托管服务合同', icon:"projectManage5"}
    },
    {
        path: '/tgpt/project/serviceHosting/contract/add',
        name: 'serviceHostingContractAdd',
        hidden: true,
        component: () => import('@/views/tgpt/project/serviceHosting/contract/add'),
        meta: {title: '新增托管服务合同'},
    },
    {
        path: '/tgpt/project/serviceHosting/contract/edit',
        name: 'serviceHostingContractEdit',
        hidden: true,
        component: () => import('@/views/tgpt/project/serviceHosting/contract/edit'),
        meta: {title: '编辑服务托管合同'}
    },
    {
        path: '/tgpt/project/serviceHosting/contract/exit',
        name: 'serviceHostingContractExit',
        hidden: true,
        component: () => import('@/views/tgpt/project/serviceHosting/contract/exit'),
        meta: {title: '服务托管合同退出'}
    },
    {
        path: '/tgpt/project/serviceHosting/contract/renew',
        name: 'serviceHostingContractRenew',
        hidden: true,
        component: () => import('@/views/tgpt/project/serviceHosting/contract/renew'),
        meta: {title: '服务托管合同续签'}
    },
    {
        path: '/tgpt/project/serviceHosting/contract/detail/:id',
        name: 'serviceHostingContractDetail',
        hidden: true,
        component: () => import('@/views/tgpt/project/serviceHosting/contract/detail'),
        meta: {title: '服务托管合同详情'}
    },
]

export default index
