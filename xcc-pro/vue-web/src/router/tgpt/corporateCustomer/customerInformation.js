const index = [
    {
        path: '/tgpt/corporateCustomer/customerInformation',
        name: 'corporateCustomerInformation',
        component: () => import('@/views/tgpt/corporateCustomer/customerInformation/list'),
        meta: {title: '企业客户资料', icon:"company1"},
    },
    {
        path: '/tgpt/corporateCustomer/customerInformation/add',
        name: 'corporateCustomerInformationAdd',
        hidden: true,
        component: () => import('@/views/tgpt/corporateCustomer/customerInformation/add'),
        meta: {title: '添加企业客户资料'},
    },
    {
        path: '/tgpt/corporateCustomer/customerInformation/edit',
        name: 'corporateCustomerInformationEdit',
        hidden: true,
        component: () => import('@/views/tgpt/corporateCustomer/customerInformation/edit'),
        meta: {title: '编辑企业客户资料'}
    },
    {
        path: '/tgpt/corporateCustomer/customerInformation/detail/:id',
        name: 'corporateCustomerInformationDetail',
        hidden: true,
        component: () => import('@/views/tgpt/corporateCustomer/customerInformation/detail'),
        meta: {title: '企业客户资料详情'}
    }
]

export default index
