const index = [
    {
        path: '/tgpt_v2/operation/oilManage',
        name: 'appOilManage',
        component: () => import('@/views/tgpt_v2/operation/trafficOil/list'),
        meta: {icon:'base1',title: '加油管理'},
    },
    {
        path: '/tgpt_v2/operation/trafficOil/confirm/:id',
        name: 'appOilManageConfirm',
        hidden: true,
        component: () => import('@/views/tgpt_v2/operation/trafficOil/confirm'),
        meta: {title: '加油确认'}
    },
    {
        path: '/tgpt_v2/operation/trafficOil/detail/:id',
        name: 'appOilManageDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/operation/trafficOil/detail'),
        meta: {title: '加油详情'}
    }
]

export default index
