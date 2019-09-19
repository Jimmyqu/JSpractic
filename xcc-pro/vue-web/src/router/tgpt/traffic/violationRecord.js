const index = [
    {
        path: '/tgpt/traffic/violationRecord',
        name: 'trafficViolationRecord',
        component: () => import('@/views/tgpt/traffic/violationRecord/list'),
        meta: {icon:'carsService18',title: '违章记录'},
    },
   /* {
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
