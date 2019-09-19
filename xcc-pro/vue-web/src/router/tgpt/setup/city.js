const index = [
    {
        path: '/tgpt/setup/city',
        name: 'setupCity',
        component: () => import('@/views/tgpt/setup/city/list'),
        meta: {title: '城市设置'}
    },
    {
        path: '/tgpt/setup/city/add',
        name: 'setupCityAdd',
        hidden:true,
        component: () => import('@/views/tgpt/setup/city/add'),
        meta: {title: '新增城市'}
    },
    {
        path: '/tgpt/setup/city/edit',
        name: 'setupCityEdit',
        hidden:true,
        component: () => import('@/views/tgpt/setup/city/edit'),
        meta: {title: '编辑城市'}
    },
    {
        path: '/tgpt/setup/city/detail/:id',
        name: 'setupCityDetail',
        hidden: true,
        component: () => import('@/views/tgpt/setup/city/detail'),
        meta: {title: '省份详情'}
    }

]

export default index
