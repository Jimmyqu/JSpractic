const index = [
    {
        path: '/tgpt_v2/operation/assignmentManagement',
        name: 'assignmentManagement',
        component: () => import('@/views/tgpt_v2/operation/assignment/list'),
        meta: {icon:'obd3',title: '任务管理'},
    },{
        path: '/tgpt_v2/operation/assignmentManagement/detail/:id',
        name: 'assignmentManagementDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/operation/assignment/detail'),
        meta: {title: '详情'},
    },{
        path: '/tgpt_v2/operation/assignmentManagement/add',
        name: 'assignmentManagementAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/operation/assignment/add'),
        meta: {title: '添加'},
    },{
        path: '/tgpt_v2/operation/assignmentManagement/edit',
        name: 'assignmentManagementEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/operation/assignment/edit'),
        meta: {title: '编辑'},
    },{
        path: '/tgpt_v2/operation/assignmentManagement/handOut/:id',
        name: 'assignmentManagementHandOut',
        hidden: true,
        component: () => import('@/views/tgpt_v2/operation/assignment/handOut'),
        meta: {title: '派发'},
    },{
        path: '/tgpt_v2/operation/assignmentManagement/detailtrip/:id',
        name: 'assignmentManagementDetailTrip',
        hidden: true,
        component: () => import('@/views/tgpt_v2/operation/assignment/detailtrip'),
        meta: {title: '查看行程'},
    }

]

export default index
