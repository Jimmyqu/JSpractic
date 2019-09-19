const index = [
    {
        path: '/tgpt_v2/report/vehicleMileage',
        name: 'vehicleMileage',
        component: () => import('@/views/tgpt_v2/report/vehicleMileage/list'),
        meta: {icon:'obd1',title: '里程统计报表'},
    }
]

export default index
