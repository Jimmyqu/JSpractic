/** When your routing table is too long, you can split it into small tgpt**/

import Layout from '@/views/common/layout/Layout'
import accessories from '@/router/tgpt/traffic/accessories'
import accident from '@/router/tgpt/traffic/accident'
import clean from '@/router/tgpt/traffic/clean'
import insuranceBill from '@/router/tgpt/traffic/insuranceBill'
import insuranceCompany from '@/router/tgpt/traffic/insuranceCompany'
import maintenanceBill from '@/router/tgpt/traffic/maintenanceBill'
import manhour from '@/router/tgpt/traffic/manhour'
import oilCard from '@/router/tgpt/traffic/oilCard'
import oilCardRecharge from '@/router/tgpt/traffic/oilCardRecharge'
import processOut from '@/router/tgpt/traffic/processOut'
import processPick from '@/router/tgpt/traffic/processPick'
import profit from '@/router/tgpt/traffic/profit'
import refuel from '@/router/tgpt/traffic/refuel'
import serviceDepot from '@/router/tgpt/traffic/serviceDepot'
import transfer from '@/router/tgpt/traffic/transfer'
import annual from '@/router/tgpt/traffic/annual'
import violationRecord from '@/router/tgpt/traffic/violationRecord'
import violationQuery from '@/router/tgpt/traffic/violationQuery'
import violationHand from '@/router/tgpt/traffic/violationHand'
import violationTimes from '@/router/tgpt/traffic/violationTimes'
import violationSetting from '@/router/tgpt/traffic/violationSetting'
import vehicleMileageVorrection from '@/router/tgpt/traffic/vehicleMileageVorrection'
import vehicleCheck from '@/router/tgpt/traffic/vehicleCheck'
import reimburse from '@/router/tgpt_v2/appDriver/reimburse'
import clientVehicleSchedule from '@/router/tgpt/traffic/clientVehicleSchedule'
import transferenceRecord from '@/router/tgpt/traffic/transferenceRecord'
import maintainCw from '@/router/tgpt/traffic/maintainCw'
import refuelingRegistration from '@/router/tgpt/traffic/refuelingRegistration'
import repairCw from '@/router/tgpt/traffic/repairCw'
import etc from '@/router/tgpt/traffic/vehicleEtc'
import contract from '@/router/tgpt/traffic/contract'
import contractDelivery from '@/router/tgpt/traffic/contractDelivery'
import contractReceipt from '@/router/tgpt/traffic/contractReceipt'

const index = {
    path: '/',
    component: Layout,
    name: '车务平台',
    redirect: 'noredirect',
    meta: {title: '车务平台'},
    children: [
        ...oilCard,
        ...refuelingRegistration,
        ...oilCardRecharge,
        ...refuel,
        ...maintenanceBill,
        ...serviceDepot,
        ...manhour,
        ...accessories,
        ...clean,
        ...accident,
        ...insuranceBill,
        ...annual,
        ...reimburse,
        ...transfer,
        ...processOut,
        ...processPick,
        ...violationRecord,
        ...violationQuery,
        ...violationHand,
        ...violationTimes,
        ...violationSetting,
        ...profit,
        ...vehicleMileageVorrection,
        ...vehicleCheck,
        ...insuranceCompany,
        ...clientVehicleSchedule,
        ...transferenceRecord,
        ...maintainCw,
        ...repairCw,
        ...etc,
        ...contract,
        ...contractDelivery,
        ...contractReceipt
    ]
}

export default index
