const index = [
    {
        path: '/tgpt/project/leaseCheck',
        name: 'leaseCheck',
        component: () => import('@/views/tgpt/project/leaseCheck/list'),
        meta: {title: '租借月结单', icon:"projectManage5"}
    },
    {
        path: '/tgpt/project/leaseCheck/detail/:id',
        name: 'leaseCheckDetail',
        hidden: true,
        component: () => import('@/views/tgpt/project/leaseCheck/detail'),
        meta: {title: '租借月结单'}
    },
]

export default index
