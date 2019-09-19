const index = [
    {
        path: '/tgpt/project/contractSan',
        name: 'projectContractSan',
        component: () => import('@/views/tgpt/project/contractSan/list'),
        meta: {icon:'auth6',title: '散租合同'},
    },
    {
        path: '/tgpt/project/contractSan/add',
        name: 'projectContractSanAdd',
        hidden: true,
        component: () => import('@/views/tgpt/project/contractSan/add'),
        meta: {title: '添加'},
    },
    {
        path: '/tgpt/project/contractSan/edit',
        name: 'projectContractSanEdit',
        hidden: true,
        component: () => import('@/views/tgpt/project/contractSan/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt/project/contractSan/detail/:id',
        name: 'projectContractSanDetail',
        hidden: true,
        component: () => import('@/views/tgpt/project/contractSan/detail'),
        meta: {title: '查看'}
    }
]

export default index
