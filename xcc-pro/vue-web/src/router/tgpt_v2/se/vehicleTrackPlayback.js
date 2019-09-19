const index = [
    {
        path: '/tgpt_v2/se/vehicleTrackPlayback',
        name: 'vehicleTrackPlayback',
        component: () => import('@/views/tgpt_v2/se/vehicleTrackPlayback/list'),
        meta: {icon:'se2',title: '轨迹回放'},
    },
    {
        path: '/tgpt_v2/se/vehicleTrackPlayback/add',
        name: 'vehicleTrackPlaybackAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/se/vehicleTrackPlayback/add'),
        meta: {title: '添加'},
    },
    {
        path: '/tgpt_v2/se/vehicleTrackPlayback/edit',
        name: 'vehicleTrackPlaybackEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/se/vehicleTrackPlayback/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/se/vehicleTrackPlayback/detail/:id',
        name: 'vehicleTrackPlaybackDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/se/vehicleTrackPlayback/detail'),
        meta: {title: '查看'}
    }
]

export default index
