const index = [
    {
        path: '/tgpt_v2/base/equipmentModal',
        name: 'equipmentModal',
        component: () => import('@/views/tgpt_v2/base/equipmentModal/list'),
        meta: {icon:'base1',title: '产品型号管理'},
    },
    {
        path: '/tgpt_v2/base/equipmentModal/add',
        name: 'equipmentModalAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/base/equipmentModal/add'),
        meta: {title: '添加'},
    },
    {
        path: '/tgpt_v2/base/equipmentModal/edit',
        name: 'equipmentModalEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/base/equipmentModal/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/base/equipmentModal/detail/:id',
        name: 'equipmentModalDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/base/equipmentModal/detail'),
        meta: {title: '查看'}
    }
]

export default index
