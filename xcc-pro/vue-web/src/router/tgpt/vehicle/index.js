/** When your routing table is too long, you can split it into small tgpt**/

import Layout from '@/views/common/layout/Layout'
import modelBrand from '@/router/tgpt/vehicle/modelBrand'
import modelSeries from '@/router/tgpt/vehicle/modelSeries'
import modelStyle from '@/router/tgpt/vehicle/modelStyle'
import modelInformation from '@/router/tgpt/vehicle/modelInformation'
import purchaseOrder from '@/router/tgpt/vehicle/purchaseOrder'
import purchasePlan from '@/router/tgpt/vehicle/purchasePlan'
import purchaseProcess from '@/router/tgpt/vehicle/purchaseProcess'
import purchaseProcessInsurance from '@/router/tgpt/vehicle/purchaseProcessInsurance'
import vehicleInformation from '@/router/tgpt/vehicle/vehicleInformation'
import supplierInformation from '@/router/tgpt/supplier/supplierInformation'
import customerAccounts from '@/router/tgpt/corporateCustomer/customerAccounts'
import customerAccountsStatus from '@/router/tgpt/corporateCustomer/customerAccountsStatus'
import customerInformation from '@/router/tgpt/corporateCustomer/customerInformation'
import customerWriteoffRecord from '@/router/tgpt/corporateCustomer/customerWriteoffRecord'
import customerPersonal from '@/router/tgpt/corporateCustomer/customerPersonal'
import route from '@/views/common/route'
import businessVehicleInformation from '@/router/tgpt/vehicle/businessVehicleInformation';


const index = {
    path: '/',
    component: Layout,
    name: '基础数据',
    redirect: 'noredirect',
    meta: {title: '基础数据'},
    children: [
        ...businessVehicleInformation,
        ...vehicleInformation,
        ...purchasePlan,
        ...purchaseOrder,
        ...purchaseProcess,
        ...customerInformation,
        ...customerAccountsStatus,
        ...customerAccounts,
        ...customerWriteoffRecord,
        /*...modelStyle,*/
        ...modelBrand,
        ...modelSeries,
        ...modelInformation,
        ...customerPersonal,
        ...supplierInformation,


       /* ...purchaseProcessInsurance,*/

    ]
}

export default index
