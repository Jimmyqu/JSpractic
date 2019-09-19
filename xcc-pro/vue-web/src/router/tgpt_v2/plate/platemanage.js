const index = [
    {
        path: '/tgpt_v2/plateManage',
        name: 'plateManage',
        component: () => import('@/views/tgpt_v2/plateManage/list'),
        meta: {title: '车牌指标',icon:"app1"},
    },
    {
        path: '/tgpt_v2/plateManage/add',
        name: 'plateManageAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/plateManage/add'),
        meta: {title: '添加'},
    },
    {
        path: '/tgpt_v2/plateManage/edit',
        name: 'plateManageEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/plateManage/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/plateManage/detail/:id',
        name: 'plateManageDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/plateManage/detail'),
        meta: {title: '查看'}
    },
    {
        path: '/tgpt_v2/plateManage/use/:id',
        name: 'plateManageUse',
        hidden: true,
        component: () => import('@/views/tgpt_v2/plateManage/use'),
        meta: {title: '使用'}
    },
    {
        path: '/tgpt_v2/plateManage/disable/:id',
        name: 'plateManageDisable',
        hidden: true,
        component: () => import('@/views/tgpt_v2/plateManage/disable'),
        meta: {title: '停用'}
    }
]

export default index
