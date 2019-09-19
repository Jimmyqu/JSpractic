const index = [
    {
        path: '/tgpt_v2/alarm/tow',
        name: 'tow',
        component: () => import('@/views/tgpt_v2/alarm/tow/list'),
        meta: {title: '拖吊报警'},
    },
    {
        path: '/tgpt_v2/alarm/tow/detail/:id',
        name: 'towDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/alarm/tow/detail'),
        meta: {title: '查看'}
    }

]

export default index
