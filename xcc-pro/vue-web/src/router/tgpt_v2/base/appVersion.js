const index = [
    {
        path: '/tgpt_v2/base/appVersion',
        name: 'appVersion',
        component: () => import('@/views/tgpt_v2/base/appVersion/list'),
        meta: {icon:'base1',title: 'APP版本管理'},
    },
    {
        path: '/tgpt_v2/base/appVersion/add',
        name: 'appVersionAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/base/appVersion/add'),
        meta: {title: '添加'},
    },
    {
        path: '/tgpt_v2/base/appVersion/edit',
        name: 'appVersionEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/base/appVersion/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/base/appVersion/detail/:id',
        name: 'appVersionDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/base/appVersion/detail'),
        meta: {title: '查看'}
    }
]

export default index
