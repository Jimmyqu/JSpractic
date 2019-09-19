const index = [
    {
        path: '/tgpt/traffic/etc',
        name: 'trafficVehicleEtc',
        component: () => import('@/views/tgpt/traffic/etc/list'),
        meta: {icon:'carsService23',title: 'ETC卡管理'},
    },
    {
        path: '/tgpt/traffic/etc/add',
        name: 'trafficVehicleEtcAdd',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/etc/add'),
        meta: {title: 'ETC卡新增'},
    },
    {
        path: '/tgpt/traffic/etc/detail/:id',
        name: 'trafficVehicleEtcDetail',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/etc/detail/list'),
        meta: {title: '消费记录'},
    },
]

export default index
