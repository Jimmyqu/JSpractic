const index = [
    {
        path: '/tgpt/corporateCustomer/customerAccounts',
        name: 'corporateCustomerAccounts',
        component: () => import('@/views/tgpt/corporateCustomer/customerAccounts/list'),
        meta: {title: '企业客户账目', icon:"company3"},
    },
    {
        path: '/tgpt/corporateCustomer/customerAccounts/detail/:id',
        name: 'corporateCustomerAccountsDetail',
        hidden: true,
        component: () => import('@/views/tgpt/corporateCustomer/customerAccounts/detail'),
        meta: {title: '企业客户账目详情'}
    }
]

export default index
