const index = [
    {
        path: '/tgpt_v2/operation/assignmentStatistics',
        name: 'assignmentStatistics',
        component: () => import('@/views/tgpt_v2/operation/assignmentStatistics/list'),
        meta: {icon:'obd3',title: '任务统计'},
    },
    {
        path: '/tgpt_v2/operation/assignmentStatistics/routeList',
        name: 'assignmentStatisticsRouteList',
        hidden: true,
        component: () => import('@/views/tgpt_v2/operation/assignmentStatistics/routeList'),
        meta: {icon:'obd3',title: '行程记录'},
    }

]

export default index
