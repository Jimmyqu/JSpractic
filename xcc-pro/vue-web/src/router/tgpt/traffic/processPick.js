const index = [
    {
        path: '/tgpt/traffic/processPick',
        name: 'trafficProcessPick',
        component: () => import('@/views/tgpt/traffic/processPick/list'),
        meta: {title: '车辆调拨-接车', icon:"carsService10"},
    },
    {
        path: '/tgpt/traffic/processPick/pick',
        name: 'trafficProcessPickPick',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/processPick/pick'),
        meta: {title: '编辑车辆调拨-接车'},
    },
    {
        path: '/tgpt/traffic/processPick/arrival',
        name: 'trafficProcessPickArrival',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/processPick/arrival'),
        meta: {title: '编辑车辆调拨-接车'}
    },
    {
        path: '/tgpt/traffic/processPick/detail/:id',
        name: 'trafficProcessPickDetail',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/processOut/detail'),
        meta: {title: '车辆调拨-接车详情'}
    }
]

export default index
