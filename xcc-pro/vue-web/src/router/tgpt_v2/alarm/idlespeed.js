const index = [
    {
        path: '/tgpt_v2/alarm/idlespeed',
        name: 'idlespeed',
        component: () => import('@/views/tgpt_v2/alarm/idlespeed/list'),
        meta: {title: '怠速'},
    },
    {
        path: '/tgpt_v2/alarm/idlespeed/detail/:id',
        name: 'idlespeedDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/alarm/idlespeed/detail'),
        meta: {title: '查看'}
    }

]

export default index
