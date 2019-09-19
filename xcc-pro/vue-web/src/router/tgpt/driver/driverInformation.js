const index = [
    {
        path: '/tgpt/driver/driverInformation',
        name: 'driverInformation',
        component: () => import('@/views/tgpt/driver/driverInformation/list'),
        meta: {title: '司机资料', icon: 'driver1'},
    },
    {
        path: '/tgpt/driver/driverInformation/add',
        name: 'driverInformationAdd',
        hidden: true,
        component: () => import('@/views/tgpt/driver/driverInformation/add'),
        meta: {title: '添加司机'},
    },
    {
        path: '/tgpt/driver/driverInformation/edit',
        name: 'driverInformationEdit',
        hidden: true,
        component: () => import('@/views/tgpt/driver/driverInformation/edit'),
        meta: {title: '编辑司机'}
    },
    {
        path: '/tgpt/driver/driverInformation/detail/:id',
        name: 'driverInformationDetail',
        hidden: true,
        component: () => import('@/views/tgpt/driver/driverInformation/detail'),
        meta: {title: '司机详情'}
    }
]

export default index
