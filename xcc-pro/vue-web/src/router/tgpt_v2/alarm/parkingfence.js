const index = [
    {
        path: '/tgpt_v2/alarm/parkingfence',
        name: 'parkingfence',
        component: () => import('@/views/tgpt_v2/alarm/parkingfence/list'),
        meta: {title: '停车围栏'},
    },
    {
        path: '/tgpt_v2/alarm/parkingfence/detail/:id',
        name: 'parkingfenceDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/alarm/parkingfence/detail'),
        meta: {title: '查看'}
    },
    {
        path: '/tgpt_v2/alarm/parkingfence/detailtrip/:id',
        name: 'parkingfenceDetailTrip',
        hidden: true,
        component: () => import('@/views/tgpt_v2/alarm/parkingfence/detailtrip'),
        meta: {title: '查看'}
    }


]

export default index
