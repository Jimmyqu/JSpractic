const index = [
    {
        path: '/tgpt/project/vehicleRecord',
        name: 'projectVehicleRecord',
        component: () => import('@/views/tgpt/project/vehicleRecord/list'),
        meta: {title: '更换车辆记录' , icon:"projectManage8"}
    },
    {
        path: '/tgpt/project/vehicleRecord/detail/:id',
        name: 'projectVehicleRecordDetail',
        hidden: true,
        component: () => import('@/views/tgpt/project/vehicleRecord/detail'),
        meta: {title: '更换车辆记录详情'}
    },


]

export default index
