const index = [
    {
        path: '/tgpt_v2/obd/vehicleLocationTrack',
        name: 'vehicleLocationTrack',
        component: () => import('@/views/tgpt_v2/obd/vehicleLocationTrack/list'),
        meta: {icon:'obd5',title: '车辆轨迹'},
    },
    {
        path: '/tgpt_v2/obd/vehicleLocationTrack/add',
        name: 'vehicleLocationTrackAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/obd/vehicleLocationTrack/add'),
        meta: {title: '添加'},
    },
    {
        path: '/tgpt_v2/obd/vehicleLocationTrack/edit',
        name: 'vehicleLocationTrackEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/obd/vehicleLocationTrack/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/obd/vehicleLocationTrack/detail/:id',
        name: 'vehicleLocationTrackDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/obd/vehicleLocationTrack/detail'),
        meta: {title: '查看'}
    }
]

export default index
