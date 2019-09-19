const index = [
    {
        path: '/tgpt_v2/alarm/electricfence',
        name: 'electricfence',
        component: () => import('@/views/tgpt_v2/alarm/electricfence/list'),
        meta: {title: '电子围栏'},
    },
    {
        path: '/tgpt_v2/alarm/electricfence/detail/:id',
        name: 'electricfenceDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/alarm/electricfence/detail'),
        meta: {title: '行驶轨迹'}
    },
    {
        path: '/tgpt_v2/alarm/electricfence/detailtrip/:id',
        name: 'electricfenceDetailTrip',
        hidden: true,
        component: () => import('@/views/tgpt_v2/alarm/electricfence/detailtrip'),
        meta: {title: '查看'}
    }


]

export default index
