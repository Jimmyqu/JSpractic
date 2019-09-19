const index = [
    {
        path: '/tgpt/project/leaseOrder',
        name: 'leaseOrder',
        component: () => import('@/views/tgpt/project/leaseOrder/list'),
        meta: {title: '租借订单', icon:"projectManage5"}
    },
    {
        path: '/tgpt/project/leaseOrder/detail/:id',
        name: 'leaseOrderDetail',
        hidden: true,
        component: () => import('@/views/tgpt/project/leaseOrder/detail'),
        meta: {title: '租借订单详情'}
    },
]

export default index
