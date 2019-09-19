import Layout from '@/views/common/layout/Layout'
import route from '@/views/common/route'
import baseEquipmentmodal from '@/router/tgpt_v2/base/equipmentModal/'
import baseEquipmentstoragein from '@/router/tgpt_v2/base/equipmentStorageIn/'
import baseEquipmentstorageout from '@/router/tgpt_v2/base/equipmentStorageOut/'
import baseEquipment from '@/router/tgpt_v2/base/equipment/'
import baseEquipmentworkstatus from '@/router/tgpt_v2/base/equipmentWorkStatus/'
import baseVehicleinstall from '@/router/tgpt_v2/base/vehicleInstall/'
import baseEquipmentsetparameter from '@/router/tgpt_v2/base/equipmentSetParameter/'
import baseSim from '@/router/tgpt_v2/base/sim/'
import obdSendrecord from '@/router/tgpt_v2/obd/sendRecord/'
import baseQuipmentreturn from '@/router/tgpt_v2/base/quipmentReturn/'
import baseAppVersion from '@/router/tgpt_v2/base/appVersion/'

const index = {
	path: '/',
	component: Layout,
	alwaysShow: true,
	name: '后台管理',
	redirect: 'noredirect',
	meta: {title: '后台管理'},
	children: [
		...baseEquipmentmodal,
		...baseEquipmentstoragein,
		...baseEquipmentstorageout,
        ...baseEquipment,
        ...baseEquipmentworkstatus,
        ...baseVehicleinstall,
        ...baseEquipmentsetparameter,
        ...baseSim,
        ...obdSendrecord,

		...baseQuipmentreturn,
        ...baseAppVersion,

	]
}
export default index
