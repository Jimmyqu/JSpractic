/** When your routing table is too long, you can split it into small tgpt**/

import Layout from '@/views/common/layout/Layout'
import customerAccounts from '@/router/tgpt/corporateCustomer/customerAccounts'
import customerAccountsStatus from '@/router/tgpt/corporateCustomer/customerAccountsStatus'
import customerInformation from '@/router/tgpt/corporateCustomer/customerInformation'
import customerWriteoffRecord from '@/router/tgpt/corporateCustomer/customerWriteoffRecord'


const index = {
    path: '/',
    component: Layout,
    name: '企业客户',
    redirect: 'noredirect',
    meta: {title: '企业客户'},
    children: [
        ...customerInformation,
        ...customerAccountsStatus,
        ...customerAccounts,
        ...customerWriteoffRecord,
    ]
}

export default index
