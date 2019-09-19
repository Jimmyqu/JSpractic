const index = [
    {
        path: '/tgpt_v2/appDriver/reimburse',
        name: 'appDriverReimburse',
        component: () => import('@/views/tgpt_v2/appDriver/reimburse/list'),
        meta: {title: '报销管理',icon:"app4"},
    },
    {
        path: '/tgpt_v2/appDriver/reimburse/add',
        name: 'appDriverReimburseAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/appDriver/reimburse/add'),
        meta: {title: '添加'},
    },
    {
        path: '/tgpt_v2/appDriver/reimburse/edit',
        name: 'appDriverReimburseEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/appDriver/reimburse/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/appDriver/reimburse/detail/:id',
        name: 'appDriverReimburseDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/appDriver/reimburse/detail'),
        meta: {title: '查看'}
    }
]

export default index
