const index = [
    {
        path: '/tgpt/project/termApplyApproval',
        name: 'projectTermApplyApprova',
        component: () => import('@/views/tgpt/project/termApplyApproval/list'),
        meta: {title: '项目条款申请及审批', icon:"projectManage12"},
    },
    {
        path: '/tgpt/project/termApplyApproval/add',
        name: 'projectTermApplyApprovaAdd',
        hidden: true,
        component: () => import('@/views/tgpt/project/termApplyApproval/add'),
        meta: {title: '申请项目条款申请及审批'},
    },
    {
        path: '/tgpt/project/termApplyApproval/edit',
        name: 'projectTermApplyApprovaEdit',
        hidden: true,
        component: () => import('@/views/tgpt/project/termApplyApproval/edit'),
        meta: {title: '编辑项目条款申请及审批'}
    },
    {
        path: '/tgpt/project/termApplyApproval/detail/:id',
        name: 'projectTermApplyApprovalDetail',
        hidden: true,
        component: () => import('@/views/tgpt/project/termApplyApproval/detail'),
        meta: {title: '项目条款申请及审批详情'}
    }

]

export default index
