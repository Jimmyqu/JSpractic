const index = [
    {
        path: '/tgpt_v2/report/vehicleOilReport',
        name: 'vehicleOilReport',
        component: () => import('@/views/tgpt_v2/report/vehicleOilReport/list'),
        meta: {icon:'obd1',title: '加油登记'},
    },
    {
        path: '/tgpt_v2/report/vehicleOilReport/detail/:id',
        name: 'vehicleOilReportDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/report/vehicleOilReport/detail'),
        meta: {title: '查看'}
    }
]

export default index
