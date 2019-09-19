const index = [
    {
        path: '/tgpt/project/termStatus',
        name: 'projectTermStatus',
        component: () => import('@/views/tgpt/project/termStatus/list'),
        meta: {title: '项目条款现状', icon:"projectManage11"}
    },
    {
        path: '/tgpt/project/termStatus/detail/:id',
        name: 'projectTermStatusDetail',
        hidden: true,
        component: () => import('@/views/tgpt/project/termStatus/detail'),
        meta: {title: '项目条款现状详情'}
    },


]

export default index
