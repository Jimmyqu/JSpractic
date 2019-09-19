const index = [
    {
        path: '/tgpt/corporateCustomer/customerWriteoffRecord',
        name: 'corporateCustomerWriteoffRecord',
        component: () => import('@/views/tgpt/corporateCustomer/customerWriteoffRecord/list'),
        meta: {title: '企业客户账目冲销记录', icon:"company4"},
    },
    {
        path: '/tgpt/corporateCustomer/customerWriteoffRecord/detail/:id',
        name: 'corporateCustomerWriteoffRecordDetail',
        hidden: true,
        component: () => import('@/views/tgpt/corporateCustomer/customerWriteoffRecord/detail'),
        meta: {title: '企业客户账目冲销记录详情'}
    }
]

export default index
