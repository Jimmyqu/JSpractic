const index = [
    {
        path: '/tgpt_v2/sys/electronFence',
        name: 'electronFence',
        component: () => import('@/views/tgpt_v2/sys/electronFence/list'),
        meta: {icon:'enclosure3',title: '电子围栏设置'},
    },
    {
        path: '/tgpt_v2/sys/electronFence/add',
        name: 'electronFenceAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/sys/electronFence/add'),
        meta: {title: '添加'},
    },
    {
        path: '/tgpt_v2/sys/electronFence/edit',
        name: 'electronFenceEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/sys/electronFence/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/sys/electronFence/detail/:id',
        name: 'electronFenceDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/sys/electronFence/detail'),
        meta: {title: '查看'}
    },
    {
        path: '/tgpt_v2/sys/electronFence/electronFenceToVehicle',
        name: 'electronFenceToVehicle',
        class: 'electron_fence_to_vehicle',
        hidden: true,
        component: () => import('@/views/tgpt_v2/sys/electronFence/electronFenceToVehicle'),
        meta: {title: '分配车辆'}
    }
]

export default index
