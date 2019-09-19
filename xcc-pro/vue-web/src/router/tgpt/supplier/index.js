/** When your routing table is too long, you can split it into small tgpt**/

import Layout from '@/views/common/layout/Layout'
import supplierInformation from '@/router/tgpt/supplier/supplierInformation'


const index = {
    path: '/',
    component: Layout,
    name: '供应商管理',
    alwaysShow: true,
    redirect: 'noredirect',
    meta: {title: '供应商管理'},
    children: [
        ...supplierInformation,
    ]
}

export default index
