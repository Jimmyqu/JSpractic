const index = [
    {
        path: '/tgpt_v2/traffic/contract',
        name: 'contract',
        component: () => import('@/views/tgpt_v2/traffic/contract/list'),
        meta: {title: '合同管理', icon:"projectManage5"},
    },
    {
        path: '/tgpt_v2/traffic/contract/add',
        name: 'contractAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/traffic/contract/add'),
        meta: {title: '添加合同'},
    },
    {
        path: '/tgpt_v2/traffic/contract/edit',
        name: 'contractEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/traffic/contract/edit'),
        meta: {title: '编辑合同'}
    },
    {
        path: '/tgpt_v2/traffic/contract/detail/:id',
        name: 'contractDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/traffic/contract/detail'),
        meta: {title: '合同详情'}
    }
]

export default index
