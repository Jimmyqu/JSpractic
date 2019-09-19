const index = [
    {
        path: '/tgpt/project/contractOut',
        name: 'projectContractOut',
        component: () => import('@/views/tgpt/project/contractOut/list'),
        meta: {title: '长租合同退出', icon:"projectManage10" }
    },
    {
        path: '/tgpt/project/contractOut/exit',
        name: 'projectContractOutExit',
        hidden: true,
        component: () => import('@/views/tgpt/project/contractOut/exit'),
        meta: {title: '申请退出项目合同'}
    },
    {
        path: '/tgpt/project/contractOut/detail/:id',
        name: 'projectContractOutDetail',
        hidden: true,
        component: () => import('@/views/tgpt/project/contractOut/detail'),
        meta: {title: '项目合同详情'}
    },


]

export default index
