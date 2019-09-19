const index = [
    {
        path: '/tgpt_v2/sys/areaFence',
        name: 'areaFence',
        component: () => import('@/views/tgpt_v2/sys/areaFence/list'),
        meta: {icon:'enclosure1',title: '区域栅栏设置'},
    },
    {
        path: '/tgpt_v2/sys/areaFence/add',
        name: 'areaFenceAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/sys/areaFence/add'),
        meta: {title: '添加'},
    },
    {
        path: '/tgpt_v2/sys/areaFence/edit',
        name: 'areaFenceEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/sys/areaFence/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/sys/areaFence/detail/:id',
        name: 'areaFenceDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/sys/areaFence/detail'),
        meta: {title: '查看'}
    },
    {
        path: '/tgpt_v2/sys/areaFence/areaFenceToVehicle',
        name: 'areaFenceToVehicle',
        class: 'area_fence_to_vehicle',
        hidden: true,
        component: () => import('@/views/tgpt_v2/sys/areaFence/areaFenceToVehicle'),
        meta: {title: '分配车辆'}
    }
]

export default index
