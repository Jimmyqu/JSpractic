const index = [
    {
        path: '/tgpt/driver/driverAndCar',
        name: 'driverAndCar',
        component: () => import('@/views/tgpt/driver/driverAndCar/list'),
        meta: {title: '司机与车辆绑定', icon: 'driver2'},
    },
    {
        path: '/tgpt/driver/driverAndCar/detail/:id',
        name: 'driverAndCarDetail',
        hidden: true,
        component: () => import('@/views/tgpt/driver/driverAndCar/detail'),
        meta: {title: '司机与车辆绑定详情'}
    }

]

export default index
