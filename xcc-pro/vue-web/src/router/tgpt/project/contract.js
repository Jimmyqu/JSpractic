const index = [
    {
        path: '/tgpt/project/contract',
        name: 'projectContract',
        component: () => import('@/views/tgpt/project/contract/list'),
        meta: {title: '长租合同', icon:"projectManage5"}
    },
    {
        path: '/tgpt/project/contract/add',
        name: 'projectContractAdd',
        hidden: true,
        component: () => import('@/views/tgpt/project/contract/add'),
        meta: {title: '添加项目合同'},
    },
    {
        path: '/tgpt/project/contract/edit',
        name: 'projectContractEdit',
        hidden: true,
        component: () => import('@/views/tgpt/project/contract/edit'),
        meta: {title: '编辑项目合同'}
    },
    {
        path: '/tgpt/project/contract/exit',
        name: 'projectContractExit',
        hidden: true,
        component: () => import('@/views/tgpt/project/contract/exit'),
        meta: {title: '项目合同退出'}
    },
    {
        path: '/tgpt/project/contract/renew',
        name: 'projectContractRenew',
        hidden: true,
        component: () => import('@/views/tgpt/project/contract/renew'),
        meta: {title: '项目合同续签'}
    },
    {
        path: '/tgpt/project/contract/detail/:id',
        name: 'projectContractDetail',
        hidden: true,
        component: () => import('@/views/tgpt/project/contract/detail'),
        meta: {title: '项目合同详情'}
    },
    {
        path: '/tgpt/project/contractRenew/detail/:id',
        name: 'projectContractDetail',
        hidden: true,
        component: () => import('@/views/tgpt/project/contract/detail'),
        meta: {title: '项目合同详情'}
    },


]

export default index
