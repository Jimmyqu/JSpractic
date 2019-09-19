/** When your routing table is too long, you can split it into small tgpt**/

import Layout from '@/views/common/layout/Layout'
import approve from '@/router/tgpt/project/approve'
import contract from '@/router/tgpt/project/contract'
import contractExecute from '@/router/tgpt/project/contractExecute'
import contractSan from '@/router/tgpt/project/contractSan'
import order from '@/router/tgpt/project/order'
import check from '@/router/tgpt/project/check'
import checkSum from '@/router/tgpt/project/checkSum'
import vehicleRecord from '@/router/tgpt/project/vehicleRecord'
import driverRecord from '@/router/tgpt/project/driverRecord'
import contractOriginal from '@/router/tgpt/project/contractOriginal'
import bid from '@/router/tgpt/project/bid'
import vehicleSchedule from '@/router/tgpt/traffic/vehicleSchedule'
import route from '@/views/common/route'
import projectHuman from '@/router/tgpt/project/projectHuman.js'
import projectPurchase from '@/router/tgpt/project/projectPurchase.js'
import projectMaintenance from '@/router/tgpt/project/projectMaintenance.js'
import contractOut from '@/router/tgpt/project/contractOut.js'
import leaseContract from '@/router/tgpt/project/leaseContract.js'
import leaseOrder from '@/router/tgpt/project/leaseOrder.js'
import leaseCheck from '@/router/tgpt/project/leaseCheck.js'
import serviceHostingContract from '@/router/tgpt/project/serviceHostingContract.js'
import serviceHostingContractExecution from '@/router/tgpt/project/serviceHostingContractExecution.js'
import serviceHostingSettlement from '@/router/tgpt/project/serviceHostingSettlement.js'

const index = {
    path: '/',
    component: Layout,
    name: '业务平台',
    redirect: 'noredirect',
    meta: {title: '业务平台'},
    children: [
        ...bid,
        ...approve,
        ...projectHuman,
        ...projectPurchase,
        ...projectMaintenance,
        ...contract,
        ...contractExecute,
        ...contractSan,
        ...contractOriginal,
        ...contractOut,
        ...vehicleSchedule,
        ...order,
        ...leaseContract,
        ...leaseOrder,
        ...leaseCheck,
        ...check,
        ...checkSum,
        ...vehicleRecord,
        ...driverRecord,
        ...serviceHostingContract,
        ...serviceHostingContractExecution,
        ...serviceHostingSettlement
    ]
}

export default index
