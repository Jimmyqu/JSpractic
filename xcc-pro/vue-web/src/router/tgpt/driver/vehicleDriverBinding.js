const index = [
    {
        path: '/tgpt/driver/driverAndCar',
        name: 'vehicleDriverBindingList',
        component: () => import('@/views/tgpt/driver/vehicleDriverBinding/list'),
        meta: {icon:'driver2',title: '车辆与司机绑定'},
    },
    {
        path: '/tgpt/driver/driverAndCar/binding',
        name: 'vehicleDriverBinding',
        hidden: true,
        component: () => import('@/views/tgpt/driver/vehicleDriverBinding/binding'),
        meta: {title: '绑定'},
    },
    {
        path: '/tgpt/driver/driverAndCar/record',
        name: 'vehicleDriverBindingRecord',
        hidden: true,
        component: () => import('@/views/tgpt/driver/vehicleDriverBinding/record'),
        meta: {title: '操作记录'},
    },
]

export default index
