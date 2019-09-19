const index = [
    {
        path: '/tgpt_v2/obd/vehicleTrackRecord',
        name: 'vehicleTrackRecord',
        component: () => import('@/views/tgpt_v2/obd/vehicleTrackRecord/list'),
        meta: {icon:'obd6',title: '行程记录'},
    },
    {
        path: '/tgpt_v2/obd/vehicleTrackRecord/add',
        name: 'vehicleTrackRecordAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/obd/vehicleTrackRecord/add'),
        meta: {title: '添加'},
    },
    {
        path: '/tgpt_v2/obd/vehicleTrackRecord/edit',
        name: 'vehicleTrackRecordEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/obd/vehicleTrackRecord/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/obd/vehicleTrackRecord/detail/:id',
        name: 'vehicleTrackRecordDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/obd/vehicleTrackRecord/detail'),
        meta: {title: '查看'}
    }
]

export default index
