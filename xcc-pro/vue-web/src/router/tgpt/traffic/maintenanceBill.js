const index = [
    {
        path: '/tgpt/traffic/maintenanceBill',
        name: 'trafficMaintenanceBill',
        component: () => import('@/views/tgpt/traffic/maintenanceBill/list'),
        meta: {title: '维修保养单', icon:"carsService1"},
    },
    {
        path: '/tgpt/traffic/maintenanceBill/add',
        name: 'trafficMaintenanceBillAdd',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/maintenanceBill/add'),
        meta: {title: '添加维修保养单'},
    },
    {
        path: '/tgpt/traffic/maintenanceBill/edit',
        name: 'trafficMaintenanceBillEdit',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/maintenanceBill/edit'),
        meta: {title: '编辑维修保养单'}
    },
    {
        path: '/tgpt/traffic/maintenanceBill/nuclearPrice',
        name: 'nuclearPrice',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/maintenanceBill/nuclearPrice'),
        meta: {title: '核价'}
    },
    {
        path: '/tgpt/traffic/maintenanceBill/detail/:id',
        name: 'trafficMaintenanceBillDetail',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/maintenanceBill/detail'),
        meta: {title: '维修保养单详情'}
    }
]

export default index
