const index = [
    {
        path: '/tgpt/project/leaseContract',
        name: 'leaseContract',
        component: () => import('@/views/tgpt/project/leaseContract/list'),
        meta: {title: '租借合同', icon:"projectManage5"}
    },
    {
        path: '/tgpt/project/leaseContract/detail/:id',
        name: 'leaseContractDetail',
        hidden: true,
        component: () => import('@/views/tgpt/project/leaseContract/detail'),
        meta: {title: '租借合同详情'}
    },
]

export default index
