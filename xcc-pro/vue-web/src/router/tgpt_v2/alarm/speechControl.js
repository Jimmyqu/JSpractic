const index = [
    {
        path: '/tgpt_v2/alarm/speechControl',
        name: 'speechControl',
        component: () => import('@/views/tgpt_v2/alarm/speechControl/list'),
        meta: {title: '语音控制'}
    },
    {
        path: '/tgpt_v2/alarm/speechControl/history/:id',
        name: 'speechControlHistory',
        hidden: true,
        component: () => import('@/views/tgpt_v2/alarm/speechControl/history'),
        meta: {title: '语音控制记录'}
    },
]

export default index
