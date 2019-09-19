const index = [
    {
        path: '/tgpt_v2/obd/vehicleTrackExport',
        name: 'vehicleTrackExport',
        component: () => import('@/views/tgpt_v2/obd/vehicleTrackExport/list'),
        meta: {icon:'obd3',title: '轨迹导出'},
    },
    {
        path: '/tgpt_v2/obd/vehicleTrackExport/add',
        name: 'vehicleTrackExportAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/obd/vehicleTrackExport/add'),
        meta: {title: '添加导出任务'},
    }


]

export default index
