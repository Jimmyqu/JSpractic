const index = [
    {
        path: '/tgpt_v2/traffic/contractReceipt',
        name: 'contractReceipt',
        component: () => import('@/views/tgpt_v2/traffic/contractReceipt/list'),
        meta: {title: '合同收款'},
    },
    {
        path: '/tgpt_v2/traffic/contractReceipt/detail/:id',
        name: 'contractReceiptDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/traffic/contractReceipt/detail'),
        meta: {title: '收款明细'},
    }
]

export default index
