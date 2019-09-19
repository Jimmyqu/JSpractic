const index = [
    {
        path: '/tgpt_v2/sys/timeOutFence',
        name: 'timeOutFence',
        component: () => import('@/views/tgpt_v2/sys/timeOutFence/list'),
        meta: {icon:'enclosure4',title: '超时停车设置'},
    },
    {
        path: '/tgpt_v2/sys/timeOutFence/add',
        name: 'timeOutFenceAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/sys/timeOutFence/add'),
        meta: {title: '添加'},
    },
    {
        path: '/tgpt_v2/sys/timeOutFence/edit',
        name: 'timeOutFenceEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/sys/timeOutFence/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/sys/timeOutFence/detail/:id',
        name: 'timeOutFenceDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/sys/timeOutFence/detail'),
        meta: {title: '查看'}
    },
    {
        path: '/tgpt_v2/sys/timeOutFence/assign/:id',
        name: 'baseTimeOutFenceAssign',
        hidden: true,
        component: () => import('@/views/tgpt_v2/sys/timeOutFence/assign'),
        meta: {title: '分配车辆'}
    }
]

export default index
