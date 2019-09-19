const index = [
    {
        path: '/tgpt/setup/province',
        name: 'setupProvince',
        component: () => import('@/views/tgpt/setup/province/list'),
        meta: {title: '省份设置'}
    },
    {
        path: '/tgpt/setup/province/add',
        name: 'setupProvinceAdd',
        hidden:true,
        component: () => import('@/views/tgpt/setup/province/add'),
        meta: {title: '新增省份'}
    },
    {
        path: '/tgpt/setup/province/edit',
        name: 'setupProvinceEdit',
        hidden:true,
        component: () => import('@/views/tgpt/setup/province/edit'),
        meta: {title: '编辑省份'}
    },
    {
        path: '/tgpt/setup/province/detail/:id',
        name: 'setupProvinceDetail',
        hidden: true,
        component: () => import('@/views/tgpt/setup/province/detail'),
        meta: {title: '省份详情'}
    }

]

export default index
