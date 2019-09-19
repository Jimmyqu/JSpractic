const index = [
    {
        path: '/tgpt/financial/companyRefund',
        name: 'financialCompanyRefund',
        component: () => import('@/views/tgpt/financial/companyRefund/list'),
        meta: {title: '企业客户退款单', icon: 'finance2'},
    },
    {
        path: '/tgpt/financial/companyRefund/add',
        name: 'financialCompanyRefundAdd',
        hidden: true,
        component: () => import('@/views/tgpt/financial/companyRefund/add'),
        meta: {title: '添加企业客户退款单'},
    },
    {
        path: '/tgpt/financial/companyRefund/edit',
        name: 'financialCompanyRefundEdit',
        hidden: true,
        component: () => import('@/views/tgpt/financial/companyRefund/edit'),
        meta: {title: '编辑企业客户退款单'}
    },
    {
        path: '/tgpt/financial/companyRefund/reversal',
        name: 'financialCompanyRefundReversal',
        hidden: true,
        component: () => import('@/views/tgpt/financial/companyRefund/reversal'),
        meta: {title: '冲销企业客户退款单'}
    },
    {
        path: '/tgpt/financial/companyRefund/detail/:id',
        name: 'financialCompanyRefundDetail',
        hidden: true,
        component: () => import('@/views/tgpt/financial/companyRefund/detail'),
        meta: {title: '企业客户退款单详情'}
    }
]

export default index
