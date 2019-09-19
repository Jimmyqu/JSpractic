const index = [
    {
        path: '/tgpt/project/maintenance',
        name: 'projectMaintenance',
        component: () => import('@/views/tgpt/project/approve/inquiry/maintenance/list'),
        meta: {title: '维保询价', icon:"projectManage4"}
    },
    {
        path: '/tgpt/project/maintenance/confirm',
        name: 'projectMaintenanceConfirm',
        hidden: true,
        component: () => import('@/views/tgpt/project/approve/inquiry/maintenance/confirm'),
        meta: {title: '确认维保询价'}
    },
]

export default index
