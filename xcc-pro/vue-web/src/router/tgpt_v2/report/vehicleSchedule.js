const index = [
    {
        path: '/tgpt_v2/report/vehicleSchedule',
        name: 'vehicleScheduleReport',
        component: () => import('@/views/tgpt_v2/report/vehicleSchedule/list'),
        meta: {icon:'obd1',title: '散租结算报表'},
    },
    {
        path: '/tgpt_v2/report/vehicleSchedule/detail/:id',
        name: 'vehicleScheduleReportDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/report/vehicleSchedule/detail'),
        meta: {title: '查看'}
    }
]

export default index
