const index = [
    {
        path: '/tgpt/traffic/oilCard',
        name: 'trafficOilCard',
        component: () => import('@/views/tgpt/traffic/oilCard/list'),
        meta: {title: '加油卡', icon:"carsService5"},
    },
    {
        path: '/tgpt/traffic/oilCard/add',
        name: 'trafficOilCardAdd',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/oilCard/add'),
        meta: {title: '添加加油卡'},
    },
    {
        path: '/tgpt/traffic/oilCard/edit',
        name: 'trafficOilCardEdit',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/oilCard/edit'),
        meta: {title: '编辑加油卡'}
    },
    {
        path: '/tgpt/traffic/oilCard/detail/:id',
        name: 'trafficOilCardDetail',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/oilCard/detail'),
        meta: {title: '加油卡详情'}
    },
    {
        path: '/tgpt/traffic/oilCard/binding',
        name: 'trafficOilCardBinding',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/oilCard/binding'),
        meta: {title: '绑定车辆'}
    },

]

export default index
