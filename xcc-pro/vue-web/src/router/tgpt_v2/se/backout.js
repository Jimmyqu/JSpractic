const index = [
    {
        path: '/tgpt_v2/se/backout',
        name: 'backout',
        component: () => import('@/views/tgpt_v2/se/backout/list'),
        meta: {icon:'se4',title: '拆机报警'},
    },
    {
        path: '/tgpt_v2/se/backout/add',
        name: 'backoutAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/se/backout/add'),
        meta: {title: '添加'},
    },
    {
        path: '/tgpt_v2/se/backout/edit',
        name: 'backoutEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/se/backout/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/se/backout/detail/:id',
        name: 'backoutDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/se/backout/detail'),
        meta: {title: '拆机报警详情'}
    }
]

export default index
