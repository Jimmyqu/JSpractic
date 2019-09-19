const index = [
    {
        path: '/tgpt/project/order',
        name: 'projectOrder',
        component: () => import('@/views/tgpt/project/order/list'),
        meta: {title: '长租订单' , icon:"projectManage6"}
    },
    {
        path: '/tgpt/project/order/dispatch',
        name: 'projectOrderDispatch',
        hidden: true,
        component: () => import('@/views/tgpt/project/order/dispatch'),
        meta: {title: '项目订单-调度'}
    },
    {
        path: '/tgpt/project/order/approval',
        name: 'projectOrderApproval',
        hidden: true,
        component: () => import('@/views/tgpt/project/order/approval'),
        meta: {title: '项目订单-提交审批'}
    },
    {
        path: '/tgpt/project/order/changeDriver',
        name: 'projectOrderChangeDriver',
        hidden: true,
        component: () => import('@/views/tgpt/project/order/changeDriver'),
        meta: {title: '项目订单-更换司机'}
    },
    {
        path: '/tgpt/project/order/changeVehicle',
        name: 'projectOrderChangeVehicle',
        hidden: true,
        component: () => import('@/views/tgpt/project/order/changeVehicle'),
        meta: {title: '项目订单-更换车辆'}
    },
    {
        path: '/tgpt/project/order/vehicleOut',
        name: 'projectOrderVehicleOut',
        hidden: true,
        component: () => import('@/views/tgpt/project/order/vehicleOut'),
        meta: {title: '项目订单-出车'}
    },
    {
        path: '/tgpt/project/order/finish',
        name: 'projectOrderFinish',
        hidden: true,
        component: () => import('@/views/tgpt/project/order/finish'),
        meta: {title: '项目订单-完成'}
    },
    {
        path: '/tgpt/project/order/detail/:id',
        name: 'projectOrderEdit',
        hidden: true,
        component: () => import('@/views/tgpt/project/order/detail'),
        meta: {title: '项目订单详情'}
    },


]

export default index
