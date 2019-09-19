const index = [
    {
        path: '/tgpt/traffic/violationQuery',
        name: 'trafficViolationQuery',
        component: () => import('@/views/tgpt/traffic/violationQuery/list'),
        meta: {icon:'carsService19',title: '违章查询'},
    },
    /*{
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
    },*/
]

export default index
