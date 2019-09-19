const index = [
    {
        path: '/tgpt_v2/alarm/fatigueDriving',
        name: 'fatigueDriving',
        component: () => import('@/views/tgpt_v2/alarm/fatigueDriving/list'),
        meta: {title: '疲劳驾驶'},

    },
    {
        path: '/tgpt_v2/alarm/fatigueDriving/detail/:id',
        name: 'fatigueDrivingDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/alarm/fatigueDriving/detail'),
        meta: {title: '查看'}
    }
]

export default index
