const index = [
    {
        path: '/tgpt_v2/appDriver/message',
        name: 'appDriverMessage',
        component: () => import('@/views/tgpt_v2/appDriver/message/list'),
        meta: {title: '消息管理',icon:"app2"},
    },
    {
        path: '/tgpt_v2/appDriver/message/add',
        name: 'appDriverMessageAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/appDriver/message/add'),
        meta: {title: '新增消息'},
    },
    {
        path: '/tgpt_v2/appDriver/message/edit',
        name: 'appDriverMessageEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/appDriver/message/edit'),
        meta: {title: '编辑消息'}
    },
    {
        path: '/tgpt_v2/appDriver/message/detail/:id',
        name: 'appDriverMessageDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/appDriver/message/detail'),
        meta: {title: '查看详情'}
    }
]

export default index
