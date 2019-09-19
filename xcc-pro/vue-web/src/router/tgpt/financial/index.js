/** When your routing table is too long, you can split it into small tgpt**/

import Layout from '@/views/common/layout/Layout'
import companyReceipt from '@/router/tgpt/financial/companyReceipt'
import companyRefund from '@/router/tgpt/financial/companyRefund'



const index = {
    path: '/',
    component: Layout,
    name: '财务平台',
    redirect: 'noredirect',
    meta: {title: '财务平台'},
    children: [
        ...companyReceipt,
        ...companyRefund,
    ]
}

export default index
