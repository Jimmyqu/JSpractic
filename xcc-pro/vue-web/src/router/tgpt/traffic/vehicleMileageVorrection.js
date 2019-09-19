const index = [
    {
        path: '/tgpt_v2/traffic/mileage',
        name: 'trafficMileageList',
        component: () => import('@/views/tgpt_v2/traffic/mileage/list'),
        meta: {icon:'carsService22',title: '里程校正'},
    },
    {
        path: '/tgpt_v2/traffic/mileage/correctinglist/:id',
        name: 'correctionRecord',
        hidden: true,
        component: () => import('@/views/tgpt_v2/traffic/mileage/correctinglist'),
        meta: {title: '校正记录'}
    },
]

export default index
