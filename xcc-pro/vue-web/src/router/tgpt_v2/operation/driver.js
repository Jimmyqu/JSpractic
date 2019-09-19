const index = [
    {
        path: '/tgpt_v2/operation/driver',
        name: 'appDriver',
        component: () => import('@/views/tgpt_v2/operation/driver/list'),
        meta: {icon:'base1',title: '司机管理'},
    },
    {
        path: '/tgpt_v2/operation/driver/add',
        name: 'appDriverAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/operation/driver/add'),
        meta: {title: '添加司机'},
    },
    {
        path: '/tgpt_v2/operation/driver/edit',
        name: 'appDriverEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/operation/driver/edit'),
        meta: {title: '修改司机'}
    },
    {
        path: '/tgpt_v2/operation/driver/detail/:id',
        name: 'appDriverDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/operation/driver/detail'),
        meta: {title: '司机详情'}
    }
]

export default index
