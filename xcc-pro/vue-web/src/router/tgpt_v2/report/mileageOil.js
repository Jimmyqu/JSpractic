const index = [
    {
        path: '/tgpt_v2/report/mileageOil',
        name: 'mileageOil',
        component: () => import('@/views/tgpt_v2/report/mileageOil/list'),
        meta: {icon:'obd1',title: '里程油耗查询'},
    },
    {
        path: '/tgpt_v2/report/mileageOil/mileageDetail',
        name: 'mileageDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/report/mileageOil/mileageDetail'),
        meta: {title: '里程明细'},
    },{
        path: '/tgpt_v2/report/mileageOil/oilDetail',
        name: 'oilDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/report/mileageOil/oilDetail'),
        meta: {title: '油耗明细'},
    }
]

export default index
