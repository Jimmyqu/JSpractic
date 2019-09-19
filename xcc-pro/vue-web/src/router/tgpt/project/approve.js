const index = [
    {
        path: '/tgpt/project/approve',
        name: 'projectApprove',
        component: () => import('@/views/tgpt/project/approve/list'),
        meta: {title: '项目评审', icon:"projectManage1"},
    },
    {
        path: '/tgpt/project/approve/add',
        name: 'projectApproveAdd',
        hidden: true,
        component: () => import('@/views/tgpt/project/approve/add'),
        meta: {title: '添加项目评审'},
    },
    {
        path: '/tgpt/project/approve/edit',
        name: 'projectApproveEdit',
        hidden: true,
        component: () => import('@/views/tgpt/project/approve/edit'),
        meta: {title: '编辑项目评审'}
    },
    {
        path: '/tgpt/project/approve/detail/:id',
        name: 'projectApproveDetail',
        hidden: true,
        component: () => import('@/views/tgpt/project/approve/detail'),
        meta: {title: '项目评审详情'}
    },
    {
        path: '/tgpt/project/approve/submit',
        name: 'projectApproveSubmit',
        hidden: true,
        component: () => import('@/views/tgpt/project/approve/submit'),
        meta: {title: '提交项目评审'}
    },



]

export default index
