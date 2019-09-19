const index = [
    {
        path: '/tgpt/project/purchase',
        name: 'projectPurchase',
        component: () => import('@/views/tgpt/project/approve/inquiry/purchase/list'),
        meta: {title: '采购询价' , icon:"projectManage3"}
    },
    {
        path: '/tgpt/project/purchase/confirm',
        name: 'projectPurchaseConfirm',
        hidden: true,
        component: () => import('@/views/tgpt/project/approve/inquiry/purchase/confirm'),
        meta: {title: '确认采购询价'}
    },
]

export default index
