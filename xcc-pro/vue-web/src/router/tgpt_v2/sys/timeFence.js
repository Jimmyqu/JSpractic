const index = [
    {
        path: '/tgpt_v2/sys/timeFence',
        name: 'timeFence',
        component: () => import('@/views/tgpt_v2/sys/timeFence/list'),
        meta: {icon:'enclosure4',title: '时间栅栏设置'},
    },
    {
        path: '/tgpt_v2/sys/timeFence/add',
        name: 'timeFenceAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/sys/timeFence/add'),
        meta: {title: '添加'},
    },
    {
        path: '/tgpt_v2/sys/timeFence/edit',
        name: 'timeFenceEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/sys/timeFence/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/sys/timeFence/detail/:id',
        name: 'timeFenceDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/sys/timeFence/detail'),
        meta: {title: '查看'}
    },
    {
        path: '/tgpt_v2/sys/timeFence/assign/:id',
        name: 'baseTimeFenceAssign',
        hidden: true,
        component: () => import('@/views/tgpt_v2/sys/timeFence/assign'),
        meta: {title: '分配车辆'}
    }
]

export default index
