const index = [
    {
        path: '/tgpt/traffic/insuranceCompany',
        name: 'trafficInsuranceCompany',
        component: () => import('@/views/tgpt/traffic/insuranceCompany/list'),
        meta: {title: '保险公司', icon:"carsService12"},
    },
    {
        path: '/tgpt/traffic/insuranceCompany/add',
        name: 'trafficInsuranceCompanyAdd',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/insuranceCompany/add'),
        meta: {title: '添加保险公司'},
    },
    {
        path: '/tgpt/traffic/insuranceCompany/edit',
        name: 'trafficInsuranceCompanyEdit',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/insuranceCompany/edit'),
        meta: {title: '编辑保险公司'}
    },
    {
        path: '/tgpt/traffic/insuranceCompany/detail/:id',
        name: 'trafficInsuranceCompanyDetail',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/insuranceCompany/detail'),
        meta: {title: '保险公司详情'}
    }
]

export default index
