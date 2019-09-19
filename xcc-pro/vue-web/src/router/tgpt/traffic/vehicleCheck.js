const index = [
    {
        path: '/tgpt/traffic/vehicleCheck',
        name: 'vehicleCheckList',
        component: () => import('@/views/tgpt/traffic/vehicleCheck/list'),
        meta: {icon:'carsService23',title: '车辆日常检查'},
    },
    {
        path: '/tgpt/traffic/vehicleCheck/detail/:id',
        name: 'vehicleCheckDetail',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/vehicleCheck/detail'),
        meta: {title: '检查记录'},
    },
]

export default index
