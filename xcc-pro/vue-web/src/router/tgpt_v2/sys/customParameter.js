const index = [
    {
        path: '/tgpt_v2/sys/customParameter',
        name: 'customParameter',
        component: () => import('@/views/tgpt_v2/sys/customParameter/list'),
        meta: {icon:'enclosure2',title: '自定义参数'},
    },
    {
        path: '/tgpt_v2/sys/customParameter/add',
        name: 'customParameterAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/sys/customParameter/add'),
        meta: {title: '添加'},
    },
    {
        path: '/tgpt_v2/sys/customParameter/edit',
        name: 'customParameterEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/sys/customParameter/edit'),
        meta: {title: '编辑'}
    }
]

export default index
