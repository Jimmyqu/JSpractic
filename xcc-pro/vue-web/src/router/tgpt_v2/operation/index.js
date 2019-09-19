import Layout from '@/views/common/layout/Layout'
import route from '@/views/common/route'

import vehicle from '@/router/tgpt_v2/operation/vehicle/'
import oilManage from '@/router/tgpt_v2/operation/oilManage/'
import accident from '@/router/tgpt_v2/operation/accident/'
import maintenance from '@/router/tgpt_v2/operation/maintenance/'
import assignmentManagement from '@/router/tgpt_v2/operation/assignmentManagement'
import driver from '@/router/tgpt_v2/operation/driver.js'
import driverVehicleBinding from '@/router/tgpt_v2/operation/driverVehicleBinding.js'
import driverAttendanceReocrd from '@/router/tgpt_v2/operation/driverAttendanceRecord.js'

import assignmentStatistics from '@/router/tgpt_v2/operation/assignmentStatistics'
const index = {
	path: '/',
	component: Layout,
	alwaysShow: true,
	name: '运管平台',
	redirect: 'noredirect',
	meta: {title: '运管平台'},
	children: [
		...vehicle,
		...oilManage,
        ...accident,
        ...maintenance,
		...assignmentManagement,
        ...driver,
        ...assignmentStatistics,
        ...driverVehicleBinding,
        ...driverAttendanceReocrd
	]
}
export default index
