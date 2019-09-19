const index = [
    {
        path: '/tgpt/traffic/violationTimes',
        name: 'trafficViolationTimesList',
        component: () => import('@/views/tgpt/traffic/violationTimes/list'),
        meta: {icon:'carsService21',title: '车辆违章次数'},
    },
    {
        path: '/tgpt/traffic/violationRecord/list:id',
        name: 'violationRecord',
        hidden: true,
       // component: () => import('@/views/tgpt/traffic/violationTimes/detail'),
        component: () => import('@/views/tgpt/traffic/violationRecord/list'),
        meta: {title: '违章记录'},
    }
]

export default index
