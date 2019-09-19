const index = [
    {
        path: '/tgpt/project/serviceHosting/settlement',
        name: 'serviceHostingSettlement',
        component: () => import('@/views/tgpt/project/serviceHosting/settlement/list'),
        meta: {title: '服务托管月结单', icon:"projectManage5"}
    },
    {
        path: '/tgpt/project/serviceHosting/settlement/settle',
        name: 'pserviceHostingContractExecutionEdit',
        hidden: true,
        component: () => import('@/views/tgpt/project/serviceHosting/settlement/form'),
        meta: {title: '服务托管月结单结算'}
    },
    {
        path: '/tgpt/project/serviceHosting/settlement/detail/:id',
        name: 'serviceHostingContractExecutionDetail',
        hidden: true,
        component: () => import('@/views/tgpt/project/serviceHosting/settlement/detail'),
        meta: {title: '服务托管月结单详情'}
    },
]

export default index
