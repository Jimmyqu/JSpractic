const index = [
    {
        path: '/tgpt/sys/user',
        name: 'sysUser',
        component: () => import('@/views/tgpt/sys/user/list'),
        meta: {title: '用户列表', icon: 'auth1'}
    },
    {
        path: '/tgpt/sys/user/add',
        name: 'sysUserAdd',
        hidden: true,
        component: () => import('@/views/tgpt/sys/user/add'),
        meta: {title: '新增用户'}
    },
    {
        path: '/tgpt/sys/user/edit',
        name: 'sysUserEdit',
        hidden: true,
        component: () => import('@/views/tgpt/sys/user/edit'),
        meta: {title: '编辑用户'}
    },
    {
        path: '/tgpt/sys/user/detail/:id',
        name: 'sysUserDetail',
        hidden: true,
        component: () => import('@/views/tgpt/sys/user/detail'),
        meta: {title: '用户详情'}
    },
]

export default index
