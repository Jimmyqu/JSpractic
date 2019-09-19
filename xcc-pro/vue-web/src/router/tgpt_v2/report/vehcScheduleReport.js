const index = [
    {
        path: '/tgpt_v2/report/vehcScheduleReport',
        name: 'vehcScheduleReport',
        component: () => import('@/views/tgpt_v2/report/vehcScheduleReport/list'),
        meta: {icon:'obd1',title: '车辆调度报表'},
    },
    {
        path: '/tgpt_v2/report/vehcScheduleReport/detail',
        name: 'vehcScheduleReportDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/report/vehcScheduleReport/detail'),
        meta: {title: '查看调度详情'}
    }

]

export default index
