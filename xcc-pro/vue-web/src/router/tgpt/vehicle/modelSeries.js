const index = [
    {
        path: '/tgpt/vehicle/modelSeries',
        name: 'vehicleModelSeries',
        component: () => import('@/views/tgpt/vehicle/modelSeries/list'),
        meta: {title: '车型系列', icon:"vehicleManage3"},
    },
    {
        path: '/tgpt/vehicle/modelSeries/add',
        name: 'vehicleModelSeriesAdd',
        hidden: true,
        component: () => import('@/views/tgpt/vehicle/modelSeries/add'),
        meta: {title: '添加添加车型'},
    },
    {
        path: '/tgpt/vehicle/modelSeries/edit',
        name: 'vehicleModelSeriesEdit',
        hidden: true,
        component: () => import('@/views/tgpt/vehicle/modelSeries/edit'),
        meta: {title: '编辑车型系列'}
    },
    {
        path: '/tgpt/vehicle/modelSeries/detail/:id',
        name: 'vehicleModelSeriesDetail',
        hidden: true,
        component: () => import('@/views/tgpt/vehicle/modelSeries/detail'),
        meta: {title: '车型系列详情'}
    }
]

export default index
