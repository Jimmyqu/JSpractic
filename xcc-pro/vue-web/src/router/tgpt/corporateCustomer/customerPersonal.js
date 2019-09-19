const index = [
    {
        path: '/tgpt/corporateCustomer/customerPersonal',
        name: 'customerPersonal',
        component: () => import('@/views/tgpt/corporateCustomer/customerPersonal/list'),
        meta: {title: '个人客户资料', icon:"company1"},
    },
    {
        path: '/tgpt/corporateCustomer/customerPersonal/add',
        name: 'customerPersonalAdd',
        hidden: true,
        component: () => import('@/views/tgpt/corporateCustomer/customerPersonal/add'),
        meta: {title: '添加个人客户资料'},
    },
    {
        path: '/tgpt/corporateCustomer/customerPersonal/edit',
        name: 'customerPersonalEdit',
        hidden: true,
        component: () => import('@/views/tgpt/corporateCustomer/customerPersonal/edit'),
        meta: {title: '编辑个人客户资料'}
    },
    {
        path: '/tgpt/corporateCustomer/customerPersonal/detail/:id',
        name: 'customerPersonalDetail',
        hidden: true,
        component: () => import('@/views/tgpt/corporateCustomer/customerPersonal/detail'),
        meta: {title: '个人客户资料详情'}
    }
]

export default index
