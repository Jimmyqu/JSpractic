const index = [
    {
        path: '/tgpt_v2/report/vehicleMaintenanceReport',
        name: 'vehicleMaintenanceReport',
        component: () => import('@/views/tgpt_v2/report/vehicleMaintenance/list'),
        meta: {icon:'obd1',title: '车辆维保'},
    }
]

export default index
