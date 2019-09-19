const index = [
    {
        path: '/tgpt/vehicle/vehicleInformation',
        name: 'vehicleVehicleInformation',
        component: () => import('@/views/tgpt/vehicle/vehicleInformation/list'),
        meta: {title: '车辆管理', icon:"vehicleManage2"},
    },
    {
        path: '/tgpt/vehicle/vehicleInformation/add',
        name: 'vehicleVehicleInformationAdd',
        hidden: true,
        component: () => import('@/views/tgpt/vehicle/vehicleInformation/add'),
        meta: {title: '添加车辆资料'},
    },
    {
        path: '/tgpt/vehicle/vehicleInformation/edit',
        name: 'vehicleVehicleInformationEdit',
        hidden: true,
        component: () => import('@/views/tgpt/vehicle/vehicleInformation/edit'),
        meta: {title: '编辑车辆资料'}
    },
    {
        path: '/tgpt/vehicle/vehicleInformation/changePlate',
        name: 'vehicleVehicleInformationChangePlate',
        hidden: true,
        component: () => import('@/views/tgpt/vehicle/vehicleInformation/changePlate'),
        meta: {title: '更换车牌'}
    },
    {
        path: '/tgpt/vehicle/vehicleInformation/detail/:id',
        name: 'vehicleVehicleInformationDetail',
        hidden: true,
        component: () => import('@/views/tgpt/vehicle/vehicleInformation/detail'),
        meta: {title: '车辆资料详情'}
    }
]

export default index
