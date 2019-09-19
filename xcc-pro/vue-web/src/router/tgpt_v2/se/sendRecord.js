const index = [
    {
        path: '/tgpt_v2/se/sendRecord',
        name: 'sendRecord1',
        component: () => import('@/views/tgpt_v2/se/sendRecord/list'),
        meta: {icon:'se8',title: '设备指令设置记录'},
    },
    {
        path: '/tgpt_v2/se/sendRecord/add',
        name: 'sendRecordAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/se/sendRecord/add'),
        meta: {title: '添加'},
    },
    {
        path: '/tgpt_v2/se/sendRecord/edit',
        name: 'sendRecordEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/se/sendRecord/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/se/sendRecord/detail/:id',
        name: 'sendRecordDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/se/sendRecord/detail'),
        meta: {title: '查看'}
    }
]

export default index
