const index = [
    {
        path: '/tgpt/project/driverRecord',
        name: 'projectDriverRecord',
        component: () => import('@/views/tgpt/project/driverRecord/list'),
        meta: {title: '更换司机记录' , icon:"projectManage9"}
    },
    {
        path: '/tgpt/project/driverRecord/detail/:id',
        name: 'projectDriverRecordDetail',
        hidden: true,
        component: () => import('@/views/tgpt/project/driverRecord/detail'),
        meta: {title: '更换司机记录'}
    },


]

export default index
