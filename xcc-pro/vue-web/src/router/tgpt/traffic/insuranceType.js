const index = [
    {
        path: '/tgpt/traffic/insuranceType',
        name: 'trafficInsuranceType',
        component: () => import('@/views/tgpt/traffic/insuranceType/list'),
        meta: {title: '保单险种', icon:"carsService14"},
    },
    {
        path: '/tgpt/traffic/insuranceType/add',
        name: 'trafficInsuranceTypeAdd',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/insuranceType/add'),
        meta: {title: '添加保单险种'},
    },
    {
        path: '/tgpt/traffic/insuranceType/edit',
        name: 'trafficInsuranceTypeEdit',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/insuranceType/edit'),
        meta: {title: '编辑保单险种'}
    },
    {
        path: '/tgpt/traffic/insuranceType/detail/:id',
        name: 'trafficInsuranceTypeDetail',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/insuranceType/detail'),
        meta: {title: '保单险种详情'}
    }
]

export default index
