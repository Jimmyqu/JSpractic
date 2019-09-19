const index = [
    {
        path: '/tgpt/project/contractOriginal',
        name: 'contractOriginal',
        component: () => import('@/views/tgpt/project/contractOriginal/list'),
        meta: {title: '合同原件管理', icon:"projectManage5"},
    },
    {
        path: '/tgpt/project/contractOriginal/add',
        name: 'contractOriginalAdd',
        hidden: true,
        component: () => import('@/views/tgpt/project/contractOriginal/add'),
        meta: {title: '添加合同原件'},
    },
    {
        path: '/tgpt/project/contractOriginal/edit',
        name: 'contractOriginalEdit',
        hidden: true,
        component: () => import('@/views/tgpt/project/contractOriginal/edit'),
        meta: {title: '编辑合同原件'}
    },
    /* {
         path: '/tgpt/project/contractOriginal/detail/:id',
         name: 'contractOriginalDetail',
         hidden: true,
         component: () => import('@/views/tgpt/project/contractOriginal/detail'),
         meta: {title: '查看'}
     }*/
]

export default index
