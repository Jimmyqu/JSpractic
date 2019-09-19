const index = [
    {
        path: '/tgpt_v2/traffic/refuelingRegistration',
        name: 'refuelingRegistration',
        component: () => import('@/views/tgpt_v2/traffic/refuelingRegistration/list'),
        meta: {title: '加油登记', icon:"carsService13"},
    },
    {
        path: '/tgpt_v2/traffic/refuelingRegistration/add',
        name: 'refuelingRegistrationAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/traffic/refuelingRegistration/add'),
        meta: {title: '添加加油登记'},
    },
    {
        path: '/tgpt_v2/traffic/refuelingRegistration/edit',
        name: 'refuelingRegistrationEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/traffic/refuelingRegistration/edit'),
        meta: {title: '编辑加油登记'}
    }
]

export default index
