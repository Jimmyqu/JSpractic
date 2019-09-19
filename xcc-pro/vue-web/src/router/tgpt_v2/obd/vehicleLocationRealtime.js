const index = [
    {
        path: '/tgpt_v2/obd/vehicleLocationRealtime',
        name: 'vehicleLocationRealtime',
        component: () => import('@/views/tgpt_v2/obd/vehicleLocationRealtime/list'),
        meta: {icon:'obd2',title: '实时追踪'},
    }
]

export default index
