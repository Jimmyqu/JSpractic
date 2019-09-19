const index = [
    {
        path: '/tgpt/financial/companyReceipt',
        name: 'financialCompanyReceipt',
        component: () => import('@/views/tgpt/financial/companyReceipt/list'),
        meta: {title: '企业客户收款单', icon: 'finance1'},
    },
    {
        path: '/tgpt/financial/companyReceipt/add',
        name: 'financialCompanyReceiptAdd',
        hidden: true,
        component: () => import('@/views/tgpt/financial/companyReceipt/add'),
        meta: {title: '添加企业客户收款单'},
    },
    {
        path: '/tgpt/financial/companyReceipt/edit',
        name: 'financialCompanyReceiptEdit',
        hidden: true,
        component: () => import('@/views/tgpt/financial/companyReceipt/edit'),
        meta: {title: '编辑企业客户收款单'}
    },
    {
        path: '/tgpt/financial/companyReceipt/detail/:id',
        name: 'financialCompanyReceiptDetail',
        hidden: true,
        component: () => import('@/views/tgpt/financial/companyReceipt/detail'),
        meta: {title: '企业客户收款单详情'}
    },
    {
        path: '/tgpt/financial/companyReceipt/reverse',
        name: 'financialCompanyReceiptReverse',
        hidden: true,
        component: () => import('@/views/tgpt/financial/companyReceipt/reverse'),
        meta: {title: '冲销'}
    }
]

export default index
