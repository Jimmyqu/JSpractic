const index = [
    {
        path: '/tgpt/supplier/supplierInformation',
        name: 'supplierInformation',
        component: () => import('@/views/tgpt/supplier/supplierInformation/list'),
        meta: {title: '供应商资料', icon: 'supplier1'},
    },
    {
        path: '/tgpt/supplier/supplierInformation/add',
        name: 'supplierInformationAdd',
        hidden: true,
        component: () => import('@/views/tgpt/supplier/supplierInformation/add'),
        meta: {title: '添加供应商'},
    },
    {
        path: '/tgpt/supplier/supplierInformation/edit',
        name: 'supplierInformationEdit',
        hidden: true,
        component: () => import('@/views/tgpt/supplier/supplierInformation/edit'),
        meta: {title: '编辑供应商'}
    },
    {
        path: '/tgpt/supplier/supplierInformation/detail/:id',
        name: 'supplierInformationDetail',
        hidden: true,
        component: () => import('@/views/tgpt/supplier/supplierInformation/detail'),
        meta: {title: '供应商详情'}
    }
]

export default index
