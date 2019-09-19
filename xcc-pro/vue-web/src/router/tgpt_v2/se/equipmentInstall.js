const index = [
    {
        path: '/tgpt_v2/se/equipmentInstall',
        name: 'equipmentInstall',
        component: () => import('@/views/tgpt_v2/se/equipmentInstall/list'),
        meta: {icon:'se7',title: '设备安装管理'},
    },
    {
        path: '/tgpt_v2/se/equipmentInstall/add',
        name: 'equipmentInstallAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/se/equipmentInstall/add'),
        meta: {title: '添加'},
    },
    {
        path: '/tgpt_v2/se/equipmentInstall/edit',
        name: 'equipmentInstallEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/se/equipmentInstall/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/se/equipmentInstall/detail/:id',
        name: 'equipmentInstallDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/se/equipmentInstall/detail'),
        meta: {title: '查看'}
    }
]

export default index
