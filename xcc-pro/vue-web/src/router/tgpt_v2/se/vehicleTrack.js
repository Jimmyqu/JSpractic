const index = [
    {
        path: '/tgpt_v2/se/vehicleTrack',
        name: 'vehicleTrack',
        component: () => import('@/views/tgpt_v2/se/vehicleTrack/list'),
        meta: {icon:'se1',title: '车辆跟踪'},
    },
    {
        path: '/tgpt_v2/se/vehicleTrack/add',
        name: 'vehicleTrackAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/se/vehicleTrack/add'),
        meta: {title: '实时跟踪'},
    }/*,
    {
        path: '/tgpt_v2/se/vehicleTrack/edit',
        name: 'vehicleTrackEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/se/vehicleTrack/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/se/vehicleTrack/detail/:id',
        name: 'vehicleTrackDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/se/vehicleTrack/detail'),
        meta: {title: '查看'}
    }*/
]

export default index
