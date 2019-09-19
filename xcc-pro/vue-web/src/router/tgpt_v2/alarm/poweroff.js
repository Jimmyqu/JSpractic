const index = [
    {
        path: '/tgpt_v2/alarm/poweroff',
        name: 'poweroff',
        component: () => import('@/views/tgpt_v2/alarm/poweroff/list'),
        meta: {title: '断电报警'},
    },
    {
        path: '/tgpt_v2/alarm/poweroff/detail/:id',
        name: 'powerOffDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/alarm/poweroff/detail'),
        meta: {title: '查看'}
    }

]

export default index
