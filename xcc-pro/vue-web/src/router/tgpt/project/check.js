const index = [
    {
        path: '/tgpt/project/check',
        name: 'projectCheck',
        component: () => import('@/views/tgpt/project/check/list'),
        meta: {title: '项目月结单', icon:"projectManage7"}
    },
    {
        path: '/tgpt/project/check/edit',
        name: 'projectCheckEdit',
        hidden: true,
        component: () => import('@/views/tgpt/project/check/form'),
        meta: {title: '结算项目用车月结单'}
    },
    {
        path: '/tgpt/project/check/detail/:id',
        name: 'projectCheckDetail',
        hidden: true,
        component: () => import('@/views/tgpt/project/check/detail'),
        meta: {title: '项目用车月结单详情'}
    },


]

export default index
