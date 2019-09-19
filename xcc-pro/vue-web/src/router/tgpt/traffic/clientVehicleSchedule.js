const index = [
    {
        path: '/tgpt/traffic/clientVehicleSchedule',
        name: 'clientVehicleSchedule',
        component: () => import('@/views/tgpt/traffic/clientVehicleSchedule/list'),
        meta: {title: '调度管理', icon:"carsService8"},
    },
    {
        path: '/tgpt/traffic/clientVehicleSchedule/form',
        name: 'clientVehicleScheduleEdit',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/clientVehicleSchedule/form'),
        meta: {title: '调度管理调度'},
    },
    {
        path: '/tgpt/traffic/clientVehicleSchedule/schedule',
        name: 'clientVehicleScheduleSchedule',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/clientVehicleSchedule/schedule'),
        meta: {title: '调度车辆'},
    },
    {
        path: '/tgpt/traffic/clientVehicleSchedule/detail/:id',
        name: 'clientVehicleScheduleDetail',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/clientVehicleSchedule/detail'),
        meta: {title: '调度管理详情'}
    }
]
export default index
