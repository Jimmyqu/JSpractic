const index = [
    {
        path: '/tgpt_v2/appDriver/examine',
        name: 'appDriverExamineTemplate',
        component: () => import('@/views/tgpt_v2/appDriver/examine/list'),
        meta: {title: '在线考核',icon:"app1"},
    },
    {
        path: '/tgpt_v2/appDriver/examine/add',
        name: 'appDriverExamineTemplateAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/appDriver/examine/add'),
        meta: {title: '添加'},
    },
    {
        path: '/tgpt_v2/appDriver/examine/edit',
        name: 'appDriverExamineTemplateEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/appDriver/examine/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/appDriver/examine/detail/:id',
        name: 'appDriverExamineTemplateDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/appDriver/examine/detail'),
        meta: {title: '查看'}
    },
    {
        path: '/tgpt_v2/appDriver/examine/driversubdetail',
        name: 'driverSubDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/appDriver/examine/driverSubDetail'),
        meta: {title: '司机考核详情'}
    }
]

export default index
