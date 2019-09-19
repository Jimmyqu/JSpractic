const index = [
    {
        path: '/tgpt_v2/base/equipment',
        name: 'baseEquipmentInfo',
        component: () => import('@/views/tgpt_v2/base/equipment/list'),
        meta: {title: '设备信息'},
    },
    {
        path: '/tgpt_v2/base/equipment/add',
        name: 'equipmentAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/base/equipment/add'),
        meta: {title: '添加'},
    },
    {
        path: '/tgpt_v2/base/equipment/edit',
        name: 'equipmentEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/base/equipment/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/base/equipment/detail/:id',
        name: 'equipmentDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/base/equipment/detail'),
        meta: {title: '查看'}
    },
    {
        path: '/tgpt_v2/base/equipment/commandLoglist/:deviceId',
        name: 'commandLoglist',
        hidden: true,
        component: () => import('@/views/tgpt_v2/base/equipment/commandLoglist'),
        meta: {title: '指令详情'}
    },
    {
        path: '/tgpt_v2/base/equipment/simdetail/:id',
        name: 'equipmentSimDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/base/equipment/simdetail'),
        meta: {title: '手机卡记录'},
    }
]

export default index
