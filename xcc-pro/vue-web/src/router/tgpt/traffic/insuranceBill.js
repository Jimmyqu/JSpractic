const index = [
    {
        path: '/tgpt/traffic/insuranceBill',
        name: 'trafficInsuranceBill',
        component: () => import('@/views/tgpt/traffic/insuranceBill/list'),
        meta: {title: '车辆保险单', icon:"carsService13"},
    },
    {
        path: '/tgpt/traffic/insuranceBill/add',
        name: 'trafficInsuranceBillAdd',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/insuranceBill/add'),
        meta: {title: '添加车辆保险单'},
    },
    {
        path: '/tgpt/traffic/insuranceBill/edit',
        name: 'trafficInsuranceBillEdit',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/insuranceBill/edit'),
        meta: {title: '编辑车辆保险单'}
    },
    {
        path: '/tgpt/traffic/insuranceBill/detail/:id',
        name: 'trafficInsuranceBillDetail',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/insuranceBill/detail'),
        meta: {title: '车辆保险单详情'}
    }
]

export default index
