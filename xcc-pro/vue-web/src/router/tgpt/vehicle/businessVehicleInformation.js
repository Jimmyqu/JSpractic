const index = [
    {
        path: '/tgpt/vehicle/businessVehicleInformation',
        name: 'businessVehicleVehicleInformation',
        component: () => import('@/views/tgpt/vehicle/businessVehicleInformation/list'),
        meta: {title: '车辆信息管理', icon: "vehicleManage2"},
    },
    {
        path: '/tgpt/vehicle/businessVehicleInformation/add',
        name: 'businessVehicleVehicleInformationAdd',
        hidden: true,
        component: () => import('@/views/tgpt/vehicle/businessVehicleInformation/add'),
        meta: {title: '添加车辆资料'},
    },
    {
        path: '/tgpt/vehicle/businessVehicleInformation/edit',
        name: 'businessVehicleVehicleInformationEdit',
        hidden: true,
        component: () => import('@/views/tgpt/vehicle/businessVehicleInformation/edit'),
        meta: {title: '编辑车辆资料'},
    },
    {
        path: '/tgpt/vehicle/businessVehicleInformation/changePlate',
        name: 'businessVehicleVehicleInformationChangePlate',
        hidden: true,
        component: () => import('@/views/tgpt/vehicle/businessVehicleInformation/changePlate'),
        meta: {title: '更换车牌'}
    },
    {
        path: '/tgpt/vehicle/businessVehicleInformation/detail/:id',
        name: 'businessVehicleVehicleInformationDetail',
        hidden: true,
        component: () => import('@/views/tgpt/vehicle/businessVehicleInformation/detail'),
        meta: {title: '车辆资料详情'}
    }
]

export default index
