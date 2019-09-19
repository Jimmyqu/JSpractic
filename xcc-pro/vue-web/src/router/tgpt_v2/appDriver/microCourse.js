const index = [
    {
        path: '/tgpt_v2/appDriver/microCourse',
        name: 'microCourse',
        component: () => import('@/views/tgpt_v2/appDriver/microCourse/list'),
        meta: {title: '微课程管理',icon:"app3"},
    },
    {
        path: '/tgpt_v2/appDriver/microCourse/add',
        name: 'microCourseAdd',
        hidden: true,
        component: () => import('@/views/tgpt_v2/appDriver/microCourse/add'),
        meta: {title: '添加'},
    },
    {
        path: '/tgpt_v2/appDriver/microCourse/edit',
        name: 'microCourseEdit',
        hidden: true,
        component: () => import('@/views/tgpt_v2/appDriver/microCourse/edit'),
        meta: {title: '编辑'}
    },
    {
        path: '/tgpt_v2/appDriver/microCourse/detail/:id',
        name: 'microCourseDetail',
        hidden: true,
        component: () => import('@/views/tgpt_v2/appDriver/microCourse/detail'),
        meta: {title: '查看'}
    }
]

export default index
