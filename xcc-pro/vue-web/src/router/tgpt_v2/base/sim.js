const index = [
    {
        path: '/tgpt_v2/base/sim',
        name: 'sim',
        component: () => import('@/views/tgpt_v2/base/sim/list'),
        meta: {title: '手机卡管理'},
    },
    {
        path: '/tgpt_v2/base/sim/edit',
        name: 'simEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/base/sim/edit'),
        meta: {title: '编辑'}
    }
]

export default index
