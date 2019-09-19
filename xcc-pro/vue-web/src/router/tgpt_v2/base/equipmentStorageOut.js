const index = [
    {
        path: '/tgpt_v2/base/equipmentStorageOut',
        name: 'baseEquipmentOutput',
        component: () => import('@/views/tgpt_v2/base/equipmentStorageOut/list'),
        meta: {icon:'base3',title: '销售出库'},
    },
    {
        path: '/tgpt_v2/base/equipmentStorageOut/add',
        name: 'baseEquipmentOutputAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/base/equipmentStorageOut/add'),
        meta: {title: '添加'},
    },
    {
        path: '/tgpt_v2/base/equipmentStorageOut/edit',
        name: 'equipmentStorageOutEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/base/equipmentStorageOut/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/base/equipmentStorageOut/detail/:id',
        name: 'baseEquipmentOutputDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/base/equipmentStorageOut/detail'),
        meta: {title: '设备出库明细'}
    },
    {
        path: '/tgpt_v2/base/equipmentStorageOut/detail2/:id',
        name: 'baseEquipmentOutputDetail2',
        hidden: true,
        component: () => import('@/views/tgpt_v2/base/equipmentStorageOut/detail2'),
        meta: {title: '设备出库明细'}
    }
]

export default index
