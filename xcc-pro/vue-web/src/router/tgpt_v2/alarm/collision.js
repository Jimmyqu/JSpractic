const index = [
    {
        path: '/tgpt_v2/alarm/collision',
        name: 'collision',
        component: () => import('@/views/tgpt_v2/alarm/collision/list'),
        meta: {title: '碰撞报警'},
    },
    {
        path: '/tgpt_v2/alarm/collision/detail/:id',
        name: 'collisionDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/alarm/collision/detail'),
        meta: {title: '查看'}
    },
    {
        path: '/tgpt_v2/alarm/collision/detailtrip/:id',
        name: 'collisionTripDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/alarm/collision/detailtrip'),
        meta: {title: '查看'}
    }

]

export default index
