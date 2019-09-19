const index = [
    {
        path: '/tgpt_v2/clientVehicleApplication',
        name: 'clientVehicleApplication',
        component: () => import('@/views/tgpt_v2/clientVehicleApplication/list'),
        meta: {title: '用车申请',icon:"app1"},
    },
    {
        path: '/tgpt_v2/clientVehicleApplication/add',
        name: 'clientVehicleApplicationAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/clientVehicleApplication/add'),
        meta: {title: '新增'},
    },
    {
        path: '/tgpt_v2/clientVehicleApplication/edit',
        name: 'clientVehicleApplicationEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/clientVehicleApplication/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/clientVehicleApplication/detail/:id',
        name: 'clientVehicleApplicationDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/clientVehicleApplication/detail'),
        meta: {title: '查看'}
    }
]

export default index
