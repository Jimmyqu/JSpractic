const index = [
    {
        path: '/tgpt_v2/traffic/manual',
        name: 'trafficManualList',
        component: () => import('@/views/tgpt_v2/traffic/manual/list'),
        meta: {icon:'carsService20',title: '手工查询'},
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
