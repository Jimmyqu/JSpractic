const index = [
    {
        path: '/tgpt/corporateCustomer/customerAccountsStatus',
        name: 'corporateCustomerAccountsStatus',
        component: () => import('@/views/tgpt/corporateCustomer/customerAccountsStatus/list'),
        meta: {title: '企业客户账目现状', icon:"company2"},
    },
    {
        path: '/tgpt/corporateCustomer/customerAccountsStatus/detail/:id',
        name: 'corporateCustomerAccountsStatusDetail',
        hidden: true,
        component: () => import('@/views/tgpt/corporateCustomer/customerAccountsStatus/detail'),
        meta: {title: '企业客户账目现状详情'}
    }
]

export default index
