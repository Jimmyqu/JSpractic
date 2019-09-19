const index = [
    {
        path: '/tgpt/traffic/vehicleSchedule',
        name: 'trafficVehicleSchedule',
        component: () => import('@/views/tgpt/traffic/vehicleSchedule/list'),
        meta: {title: '散租订单', icon:"carsService8"},
    },
    {
        path: '/tgpt/traffic/vehicleSchedule/form',
        name: 'trafficVehicleScheduleEdit',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/vehicleSchedule/form'),
        meta: {title: '编辑调度订单'},
    },
    {
        path: '/tgpt/traffic/vehicleSchedule/schedule',
        name: 'trafficVehicleScheduleSchedule',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/vehicleSchedule/schedule'),
        meta: {title: '调度车辆'},
    },
    {
        path: '/tgpt/traffic/vehicleSchedule/detail/:id',
        name: 'trafficVehicleScheduleDetail',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/vehicleSchedule/detail'),
        meta: {title: '车辆调度详情'}
    },
    {
        path: '/tgpt/traffic/vehicleSchedule/settlement',
        name: 'trafficVehicleScheduleSettlement',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/vehicleSchedule/settlement'),
        meta: {title: '结算'}
    },
]

export default index
