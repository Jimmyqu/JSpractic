const index = [
    {
        path: '/tgpt_v2/alarm/rollover',
        name: 'rollover',
        component: () => import('@/views/tgpt_v2/alarm/rollover/list'),
        meta: {title: '侧翻报警'},
    },
    {
        path: '/tgpt_v2/alarm/rollover/detail/:id',
        name: 'rolloverDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/alarm/rollover/detail'),
        meta: {title: '查看'}
    },
    {
        path: '/tgpt_v2/alarm/rollover/detailtrip/:id',
        name: 'rolloverTripDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/alarm/rollover/detailtrip'),
        meta: {title: '查看'}
    }

]

export default index
