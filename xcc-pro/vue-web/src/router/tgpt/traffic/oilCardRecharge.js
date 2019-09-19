const index = [
    {
        path: '/tgpt/traffic/oilCardRecharge',
        name: 'trafficOilCardRecharge',
        component: () => import('@/views/tgpt/traffic/oilCardRecharge/list'),
        meta: {title: '加油卡充值记录', icon:"carsService6"},
    },
    {
        path: '/tgpt/traffic/oilCardRecharge/add',
        name: 'trafficOilCardRechargeAdd',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/oilCardRecharge/add'),
        meta: {title: '添加加油卡充值记录'},
    },
    {
        path: '/tgpt/traffic/oilCardRecharge/edit',
        name: 'trafficOilCardRechargeEdit',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/oilCardRecharge/edit'),
        meta: {title: '编辑加油卡充值记录'}
    },
    {
        path: '/tgpt/traffic/oilCardRecharge/detail/:id',
        name: 'trafficOilCardRechargeDetail',
        hidden: true,
        component: () => import('@/views/tgpt/traffic/oilCardRecharge/detail'),
        meta: {title: '加油卡充值记录详情'}
    }
]

export default index
