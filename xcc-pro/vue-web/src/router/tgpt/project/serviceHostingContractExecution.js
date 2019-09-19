const index = [
    {
        path: '/tgpt/project/serviceHosting/contractExecution',
        name: 'serviceHostingContractExecution',
        component: () => import('@/views/tgpt/project/serviceHosting/contractExecution/list'),
        meta: {title: '服务托管合同执行', icon:"projectManage5"}
    },
    {
        path: '/tgpt/project/serviceHosting/contractExecution/perform',
        name: 'serviceHostingContractExecutionPerform',
        hidden: true,
        component: () => import('@/views/tgpt/project/serviceHosting/contractExecution/perform'),
        meta: {title: '执行服务托管合同执行'}
    },
    {
        path: '/tgpt/project/serviceHosting/contractExecution/edit',
        name: 'pserviceHostingContractExecutionEdit',
        hidden: true,
        component: () => import('@/views/tgpt/project/serviceHosting/contractExecution/edit'),
        meta: {title: '编辑服务托管合同执行'}
    },
    {
        path: '/tgpt/project/serviceHosting/contractExecution/detail/:id',
        name: 'serviceHostingContractExecutionDetail',
        hidden: true,
        component: () => import('@/views/tgpt/project/serviceHosting/contractExecution/detail'),
        meta: {title: '服务托管合同执行详情'}
    },
]

export default index
