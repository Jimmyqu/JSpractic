const index = [
    {
        path: '/tgpt_v2/obd/vehicleLocationHistorical',
        name: 'vehicleLocationHistorical',
        component: () => import('@/views/tgpt_v2/obd/vehicleLocationHistorical/list'),
        meta: {icon:'obd4',title: '历史位置'},
    },
    {
        path: '/tgpt_v2/obd/vehicleLocationHistorical/add',
        name: 'vehicleLocationHistoricalAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/obd/vehicleLocationHistorical/add'),
        meta: {title: '添加'},
    },
    {
        path: '/tgpt_v2/obd/vehicleLocationHistorical/edit',
        name: 'vehicleLocationHistoricalEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/obd/vehicleLocationHistorical/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/obd/vehicleLocationHistorical/detail/:id',
        name: 'vehicleLocationHistoricalDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/obd/vehicleLocationHistorical/detail'),
        meta: {title: '查看'}
    }
]

export default index
