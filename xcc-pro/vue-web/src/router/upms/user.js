const index = [
    {
        path: '/upms/user',
        name: 'user',
        component: () => import('@/views/upms/user/list'),
        meta: {icon: 'auth1', title: '用户'},
    },
    {
        path: '/upms/user/add',
        name: 'userAdd',
        hidden: true,
        component: () => import('@/views/upms/user/add'),
        meta: {title: '添加'},
    },
    {
        path: '/upms/user/edit',
        name: 'userEdit',
        hidden: true,
        component: () => import('@/views/upms/user/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/upms/user/detail/:id',
        name: 'userDetail',
        hidden: true,
        component: () => import('@/views/upms/user/detail'),
        meta: {title: '查看'}
    }
];

export default index
