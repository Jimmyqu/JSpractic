const index = [
    {
        path: '/tgpt/sys/organization',
        name: 'sysOrganization',
        component: () => import('@/views/tgpt/sys/organization/list'),
        meta: {title: '组织', icon: 'auth3'}
    },
    /*{
        path: '/tgpt/sys/attribute',
        name: 'sysAttribute',
        component: () => import('@/views/tgpt/sys/attribute/list'),
        meta: {title: '组织属性', icon: 'auth7'}
    },*/
    {
        path: '/tgpt/sys/role',
        name: 'sysRole',
        component: () => import('@/views/tgpt/sys/role/list'),
        meta: {title: '职位', icon: 'auth4'}
    },
]

export default index
