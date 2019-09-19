const index = [
    {
        path: '/tgpt_v2/base/equipmentStorageIn',
        name: 'equipmentStorageIn',
        component: () => import('@/views/tgpt_v2/base/equipmentStorageIn/list'),
        meta: {icon:'base2',title: '采购入库'},
    },
    {
        path: '/tgpt_v2/base/equipmentStorageIn/add',
        name: 'equipmentStorageInAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/base/equipmentStorageIn/add'),
        meta: {title: '设备入库'},
    },
    {
        path: '/tgpt_v2/base/equipmentStorageIn/detailobd/:id',
        name: 'equipmentStorageInDetailObd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/base/equipmentStorageIn/detailobd'),
        meta: {title: '入库明细'}
    },
    {
        path: '/tgpt_v2/base/equipmentStorageIn/detailsim/:id',
        name: 'equipmentStorageInDetailSim',
        hidden: true,
        component: () => import('@/views/tgpt_v2/base/equipmentStorageIn/detailsim'),
        meta: {title: '入库明细'}
    }

]

export default index
