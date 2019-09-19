const index = [
    {
        path: '/tgpt_v2/se/power',
        name: 'power',
        component: () => import('@/views/tgpt_v2/se/power/list'),
        meta: {icon:'se3',title: '低电量报警'},
    },
    {
        path: '/tgpt_v2/se/power/add',
        name: 'powerAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/se/power/add'),
        meta: {title: '添加'},
    },
    {
        path: '/tgpt_v2/se/power/edit',
        name: 'powerEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/se/power/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/se/power/detail/:id',
        name: 'powerDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/se/power/detail'),
        meta: {title: '查看'}
    }
]

export default index
