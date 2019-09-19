const index = [
    {
        path: '/tgpt_v2/base/vehicleInstall',
        name: 'vehicleInstallManagement',
        component: () => import('@/views/tgpt_v2/base/vehicleInstall/list'),
        meta: {title: '车辆安装管理'},
    },
    {
        path: '/tgpt_v2/base/vehicleInstall/add',
        name: 'vehicleInstallAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/base/vehicleInstall/add'),
        meta: {title: '添加'},
    },
    {
        path: '/tgpt_v2/base/vehicleInstall/edit',
        name: 'vehicleInstallEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/base/vehicleInstall/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/base/vehicleInstall/detail/:id',
        name: 'vehicleInstallDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/base/vehicleInstall/detail'),
        meta: {title: '查看'}
    },
    {
        path: '/tgpt_v2/base/vehicleInstall/history/:id',
        name: 'vehicleInstallManagementHistory',
        hidden: true,
        component: () => import('@/views/tgpt_v2/base/vehicleInstall/history'),
        meta: {title: '设备记录'}
    },
]

export default index
