const index = [
    {
        path: '/tgpt/vehicle/modelBrand',
        name: 'vehicleModelBrand',
        component: () => import('@/views/tgpt/vehicle/modelBrand/list'),
        meta: {title: '车型品牌', icon:"vehicleManage5"},
    },
    {
        path: '/tgpt/vehicle/modelBrand/add',
        name: 'vehicleModelBrandAdd',
        hidden: true,
        component: () => import('@/views/tgpt/vehicle/modelBrand/add'),
        meta: {title: '添加车型品牌'},
    },
    {
        path: '/tgpt/vehicle/modelBrand/edit',
        name: 'vehicleModelBrandEdit',
        hidden: true,
        component: () => import('@/views/tgpt/vehicle/modelBrand/edit'),
        meta: {title: '编辑车型品牌'}
    },
    {
        path: '/tgpt/vehicle/modelBrand/detail/:id',
        name: 'vehicleModelBrandDetail',
        hidden: true,
        component: () => import('@/views/tgpt/vehicle/modelBrand/detail'),
        meta: {title: '车型品牌详情'}
    }
]

export default index
