const index = [
    {
        path: '/tgpt_v2/se/equipmentStatus',
        name: 'seEquipmentStatus',
        component: () => import('@/views/tgpt_v2/se/equipmentStatus/list'),
        meta: {icon:'se6',title: '设备状态管理'},
    },
    {
        path: '/tgpt_v2/se/equipmentStatus/add',
        name: 'seEquipmentStatusAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/se/equipmentStatus/add'),
        meta: {title: '添加'},
    },
    {
        path: '/tgpt_v2/se/equipmentStatus/edit',
        name: 'seEquipmentStatusEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/se/equipmentStatus/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/se/equipmentStatus/detail/:id',
        name: 'seEquipmentStatusDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/se/equipmentStatus/detail'),
        meta: {title: '查看'}
    }
]

export default index
