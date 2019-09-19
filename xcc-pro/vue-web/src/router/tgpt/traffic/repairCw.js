const index = [
    {
        path: '/tgpt_v2/traffic/repairCw',
        name: 'repairCw',
        component: () => import('@/views/tgpt_v2/traffic/repairCw/list'),
        meta: {title: '维修管理', icon:"carsService1"},
    },
    {
        path: '/tgpt_v2/traffic/repairCw/add',
        name: 'repairCwAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/traffic/repairCw/add'),
        meta: {title: '添加维修单'},
    },
     {
         path: '/tgpt_v2/traffic/repairCw/edit',
         name: 'repairCwEdit',
         hidden: true,
         component: () => import('@/views/tgpt_v2/traffic/repairCw/edit'),
         meta: {title: '编辑维修单'}
     },

    {
        path: '/tgpt_v2/traffic/repairCw/detail/:id',
        name: 'repairCwDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/traffic/repairCw//detail'),
        meta: {title: '维修单详情'}
    }
]

export default index
