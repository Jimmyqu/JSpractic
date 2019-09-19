const index = [
    {
        path: '/tgpt_v2/operation/driverVehicleBinding',
        name: 'driverVehicleBindingList',
        component: () => import('@/views/tgpt_v2/operation/driverVehicleBinding/list'),
        meta: {icon:'driver2',title: '司机与车辆绑定'},
    },
    {
        path: '/tgpt_v2/operation/driverVehicleBinding/binding',
        name: 'driverVehicleBinding',
        hidden: true,
        component: () => import('@/views/tgpt_v2/operation/driverVehicleBinding/binding'),
        meta: {title: '绑定'},
    },
    {
        path: '/tgpt_v2/operation/driverVehicleBinding/record',
        name: 'driverVehicleBindingRecord',
        hidden: true,
        component: () => import('@/views/tgpt_v2/operation/driverVehicleBinding/record'),
        meta: {title: '操作记录'},
    },
]

export default index
