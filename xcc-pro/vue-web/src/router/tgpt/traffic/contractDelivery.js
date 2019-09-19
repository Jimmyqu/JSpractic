const index = [
    {
        path: '/tgpt_v2/traffic/contractDelivery',
        name: 'contractDelivery',
        component: () => import('@/views/tgpt_v2/traffic/contractDelivery/list'),
        meta: {title: '合同交车'},
    },
    {
        path: '/tgpt_v2/traffic/contractDelivery/detail/:id',
        name: 'contractDeliveryDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/traffic/contractDelivery/detail'),
        meta: {title: '交车详情'},
    },
    {
        path: '/tgpt_v2/traffic/contractDelivery/registration/:id',
        name: 'deliveryRegistration',
        hidden: true,
        component: () => import('@/views/tgpt_v2/traffic/contractDelivery/registration'),
        meta: {title: '交车登记'}
    }
]

export default index
