const index = [
    {
        path: '/tgpt_v2/alarm/areaLimit',
        name: 'areaLimit',
        component: () => import('@/views/tgpt_v2/alarm/areaLimit/list'),
        meta: {title: '区域栅栏'},
    },
    {
        path: '/tgpt_v2/alarm/areaLimit/detail/:id',
        name: 'areaLimitdetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/alarm/areaLimit/detail'),
        meta: {title: '行驶轨迹'}
    },
    {
        path: '/tgpt_v2/alarm/areaLimit/detailRoute/:id',
        name: 'detailRoute',
        hidden: true,
        component: () => import('@/views/tgpt_v2/alarm/areaLimit/detailRoute'),
        meta: {title: '查看行程'}
    }
]

export default index
