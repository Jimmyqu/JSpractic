const index = [
    {
        path: '/tgpt/sys/audit',
        name: 'sysAudit',
        component: () => import('@/views/tgpt/sys/audit/list'),
        meta: {title: '审核流程', icon: 'auth6'}
    },
    {
        path: '/tgpt/sys/audit/add',
        name: 'sysAuditAdd',
        hidden:true,
        component: () => import('@/views/tgpt/sys/audit/add'),
        meta: {title: '新增审核流程'}
    },
    {
        path: '/tgpt/sys/audit/edit',
        name: 'sysAuditEdit',
        hidden:true,
        component: () => import('@/views/tgpt/sys/audit/edit'),
        meta: {title: '编辑审核流程'}
    },

]

export default index
