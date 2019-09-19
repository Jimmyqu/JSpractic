const index = [
    {
        path: '/tgpt/project/contractExecute',
        name: 'projectContractExecute',
        component: () => import('@/views/tgpt/project/contractExecute/list'),
        meta: {title: '合同执行', icon:"projectManage5"}
    },
    {
        path: '/tgpt/project/contractExecute/perform',
        name: 'projectContractExecutePerform',
        hidden: true,
        component: () => import('@/views/tgpt/project/contractExecute/perform'),
        meta: {title: '执行合同执行'}
    },
    {
        path: '/tgpt/project/contractExecute/edit',
        name: 'projectContractExecuteEdit',
        hidden: true,
        component: () => import('@/views/tgpt/project/contractExecute/edit'),
        meta: {title: '编辑合同执行'}
    },
    {
        path: '/tgpt/project/contractExecute/detail/:id',
        name: 'projectContractExecuteDetail',
        hidden: true,
        component: () => import('@/views/tgpt/project/contractExecute/detail'),
        meta: {title: '合同执行详情'}
    },
    {
        path: '/tgpt/project/contractExecute/versionDetail',
        name: 'projectContractExecuteVersionDetail',
        hidden: true,
        component: () => import('@/views/tgpt/project/contractExecute/versionDetail'),
        meta: {title: '合同执行历史版本详情'}
    },


]

export default index
