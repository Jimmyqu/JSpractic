const index = [
    {
        path: '/tgpt/traffic/transfer',
        name: 'trafficTransfer',
        component: () => import('@/views/tgpt/traffic/transfer/list'),
        meta: {title: '车辆调拨申请', icon:"carsService9"},
    },
    {
        path: '/tgpt/traffic/transfer/add',
        name: 'trafficTransferAdd',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/transfer/add'),
        meta: {title: '添加车辆调拨申请单'},
    },
    {
        path: '/tgpt/traffic/transfer/edit',
        name: 'trafficTransferEdit',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/transfer/edit'),
        meta: {title: '编辑车辆调拨申请单'}
    },
    {
        path: '/tgpt/traffic/transfer/detail/:id',
        name: 'trafficTransferDetail',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/transfer/detail'),
        meta: {title: '车辆调拨申请单详情'}
    }
]

export default index
