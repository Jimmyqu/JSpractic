const index = [
    {
        path: '/tgpt_v2/sys/parkingFence',
        name: 'parkingFence',
        component: () => import('@/views/tgpt_v2/sys/parkingFence/list'),
        meta: {icon:'enclosure3',title: '停车栅栏设置'},
    },
    {
        path: '/tgpt_v2/sys/parkingFence/add',
        name: 'parkingFenceAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/sys/parkingFence/add'),
        meta: {title: '添加'},
    },
    {
        path: '/tgpt_v2/sys/parkingFence/edit',
        name: 'parkingFenceEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/sys/parkingFence/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/sys/parkingFence/detail/:id',
        name: 'parkingFenceDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/sys/parkingFence/detail'),
        meta: {title: '查看'}
    },
    {
        path: '/tgpt_v2/sys/parkingFence/parkingFenceToVehicle',
        name: 'parkingFenceToVehicle',
        class: 'parking_fence_to_vehicle',
        hidden: true,
        component: () => import('@/views/tgpt_v2/sys/parkingFence/parkingFenceToVehicle'),
        meta: {title: '分配车辆'}
    }
]

export default index
