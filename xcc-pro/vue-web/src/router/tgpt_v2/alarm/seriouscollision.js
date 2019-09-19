const index = [
    {
        path: '/tgpt_v2/alarm/seriouscollision',
        name: 'seriousCollision',
        component: () => import('@/views/tgpt_v2/alarm/seriouscollision/list'),
        meta: {title: '严重碰撞'},
    },
    {
        path: '/tgpt_v2/alarm/seriouscollision/detail/:id',
        name: 'seriousCollisionDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/alarm/seriouscollision/detail'),
        meta: {title: '查看'}
    },
    {
        path: '/tgpt_v2/alarm/seriouscollision/detailtrip/:id',
        name: 'seriouscollisionTripDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/alarm/seriouscollision/detailtrip'),
        meta: {title: '查看'}
    }

]

export default index
