const index = [
    {
        path: '/tgpt/driver/driverSalary',
        name: 'driverSalary',
        component: () => import('@/views/tgpt/driver/driverSalary/list'),
        meta: {title: '司机工资', icon: 'driver3'},
    },
    {
        path: '/tgpt/driver/driverSalary/detail/:id',
        name: 'driverSalaryDetail',
        hidden: true,
        component: () => import('@/views/tgpt/driver/driverSalary/detail'),
        meta: {title: '司机工资详情'}
    }
]

export default index
