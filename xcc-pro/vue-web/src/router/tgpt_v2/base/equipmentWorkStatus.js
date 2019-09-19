const index = [
    {
        path: '/tgpt_v2/base/equipmentWorkStatus',
        name: 'equipmentWorkStatus',
        component: () => import('@/views/tgpt_v2/base/equipmentWorkStatus/list'),
        meta: {title: '有线设备工作状态'},
    },
    {
        path: '/tgpt_v2/base/wirelessEquipmentWorkStatus',
        name: 'wirelessEquipmentWorkStatus',
        component: () => import('@/views/tgpt_v2/base/wirelessEquipmentWorkStatus/list'),
        meta: {title: '无线设备工作状态'},
    },
    {
        path: '/tgpt_v2/base/equipmentWorkStatus/simdetail/:id',
        name: 'equipmentWorkStatusSimDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/base/equipmentWorkStatus/simdetail'),
        meta: {title: '手机卡记录'},
    },
    {
        path: '/tgpt_v2/base/equipmentWorkStatus/imeidetail/:id',
        name: 'equipmentWorkStatusImeiDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/base/equipmentWorkStatus/imeidetail'),
        meta: {title: '设备指令详情'}
    }
]

export default index
