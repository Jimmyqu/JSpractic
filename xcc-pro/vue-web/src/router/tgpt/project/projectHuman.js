const index = [
    {
            path: '/tgpt/project/human',
            name: 'projectHuman',
            component: () => import('@/views/tgpt/project/approve/inquiry/human/list'),
            meta: {title: '人力询价' , icon:"projectManage2"}
        },
        {
            path: '/tgpt/project/human/confirm',
            name: 'projectHumanConfirm',
            hidden: true,
            component: () => import('@/views/tgpt/project/approve/inquiry/human/confirm'),
            meta: {title: '确认人力询价'}
        },
]

export default index
