const index = [
    {
        path: '/tgpt/vehicle/purchaseOrder',
        name: 'vehiclePurchaseOrder',
        component: () => import('@/views/tgpt/vehicle/purchaseOrder/list'),
        meta: {title: '车辆采购订单', icon:"vehicleManage7"},
    },
    {
        path: '/tgpt/vehicle/purchaseOrder/add',
        name: 'vehiclePurchaseOrderAdd',
        hidden: true,
        component: () => import('@/views/tgpt/vehicle/purchaseOrder/add'),
        meta: {title: '添加车辆采购订单'},
    },
    {
        path: '/tgpt/vehicle/purchaseOrder/edit',
        name: 'vehiclePurchaseOrderEdit',
        hidden: true,
        component: () => import('@/views/tgpt/vehicle/purchaseOrder/edit'),
        meta: {title: '编辑车辆采购订单'}
    },
    {
        path: '/tgpt/vehicle/purchaseOrder/detail/:id',
        name: 'vehiclePurchaseOrderDetail',
        hidden: true,
        component: () => import('@/views/tgpt/vehicle/purchaseOrder/detail'),
        meta: {title: '车辆采购订单详情'}
    }
]

export default index
