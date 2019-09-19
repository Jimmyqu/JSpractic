const index = [
    {
        path: '/tgpt_v2/alarm/watertemperature',
        name: 'watertemperature',
        component: () => import('@/views/tgpt_v2/alarm/watertemperature/list'),
        meta: {title: '水温报警'},
    },
    {
        path: '/tgpt_v2/alarm/watertemperature/detail/:id',
        name: 'watertemPeratureDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/alarm/watertemperature/detail'),
        meta: {title: '查看'}
    },
    {
        path: '/tgpt_v2/alarm/watertemperature/detailtrip/:id',
        name: 'watertemPeratureTripDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/alarm/watertemperature/detailtrip'),
        meta: {title: '查看'}
    }

]

export default index
