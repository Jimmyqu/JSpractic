import vehicleInsurance from '@/router/tgpt_v2/report/vehicleInsuranceReport'
import vehicleMaintenance from '@/router/tgpt_v2/report/vehicleMaintenanceReport'
import vehicleOilReport from '@/router/tgpt_v2/report/vehicleOilReport'
import projectVehicleProfit from '@/router/tgpt_v2/report/projectVehicleProfit'
import branchIncomeReport from '@/router/tgpt_v2/report/branchIncomeReport'
import vehicleAccidentMaintenanceReport from '@/router/tgpt_v2/report/vehicleAccidentMaintenanceReport'
import contractExpirationReg from '@/router/tgpt_v2/report/contractExpirationReg'
import vehicleSchedule from '@/router/tgpt_v2/report/vehicleSchedule'
import supplierMonthlyBill from '@/router/tgpt_v2/report/supplierMonthlyBill'
import alarmReport from '@/router/tgpt_v2/report/alarmReport'
import alarmLimtReport from '@/router/tgpt_v2/report/alarmLimtReport'
import vehicleOfflineReport from '@/router/tgpt_v2/report/vehicleOfflineReport'
import mileageOil from '@/router/tgpt_v2/report/mileageOil'
import Layout from '@/views/common/layout/Layout'
import vehicleMileage from '@/router/tgpt_v2/report/vehicleMileage'
import departmentRefuelingReport from '@/router/tgpt_v2/report/departmentRefuelingReport'
import maintenanceReport from '@/router/tgpt_v2/report/maintenanceReport'
import vehcOfflineRateReport from '@/router/tgpt_v2/report/vehcOfflineRateReport'
import refuelRecordReport from '@/router/tgpt_v2/report/refuelRecordReport'
import vehcScheduleReport from '@/router/tgpt_v2/report/vehcScheduleReport'
import maintenanceBillReport from '@/router/tgpt_v2/report/maintenanceBillReport'
import projectContractReport from '@/router/tgpt_v2/report/projectContractReport'
import projectContractSanReport from '@/router/tgpt_v2/report/projectContractSanReport'
import vehicleSummary from '@/router/tgpt_v2/report/vehicleSummary'
import maintainCost from '@/router/tgpt_v2/report/maintainCost'
import totalExpensesReport from '@/router/tgpt_v2/report/totalExpensesReport'
import operationalControlReport from '@/router/tgpt_v2/report/operationalControlReport'

import vehiclePositionReport from '@/router/tgpt_v2/report/vehiclePositionReport'
import refuelingRegistrationReport from '@/router/tgpt_v2/report/refuelingRegistrationReport'
import repairCwReport from '@/router/tgpt_v2/report/repairCwReport'
import maintainCwReport from '@/router/tgpt_v2/report/maintainCwReport'


const index = {
    path: '/',
    component: Layout,
    alwaysShow: true,
    name: '报表管理',
    redirect: 'noredirect',
    meta: {title: '报表管理'},
    children: [
        ...vehicleInsurance,
        ...vehicleMaintenance,
        ...vehicleOilReport,
        ...projectVehicleProfit,
        ...vehicleAccidentMaintenanceReport,
        ...branchIncomeReport,
        ...contractExpirationReg,
        ...supplierMonthlyBill,
        ...vehicleSchedule,
        ...alarmReport,
        ...vehicleOfflineReport,
        ...mileageOil,
        ...vehicleMileage,
        ...departmentRefuelingReport,
        ...maintenanceReport,
        ...vehcOfflineRateReport,
        ...refuelRecordReport,
        ...vehcScheduleReport,
        ...maintenanceBillReport,
        ...projectContractReport,
        ...projectContractSanReport,
        ...alarmLimtReport,
        ...vehicleSummary,
        ...maintainCost,
        ...totalExpensesReport,
        ...operationalControlReport,
        ...vehiclePositionReport,
        ...refuelingRegistrationReport,
        ...repairCwReport,
        ...maintainCwReport,
    ]
}
export default index
