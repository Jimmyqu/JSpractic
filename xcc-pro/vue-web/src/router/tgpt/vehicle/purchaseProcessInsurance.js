const index = [
    {
        path: '/tgpt/vehicle/purchaseProcessInsurance',
        name: 'vehiclePurchaseProcessInsurance',
        component: () => import('@/views/tgpt/vehicle/purchaseProcessInsurance/list'),
        meta: {title: '车辆采购过程-保险', icon:"vehicleManage9"},
    },
    {
        path: '/tgpt/vehicle/purchaseProcessInsurance/edit',
        name: 'vehiclePurchaseProcessInsuranceEdit',
        hidden: true,
        component: () => import('@/views/tgpt/vehicle/purchaseProcessInsurance/edit'),
        meta: {title: '车辆采购信息-保险'}
    },
]

export default index
