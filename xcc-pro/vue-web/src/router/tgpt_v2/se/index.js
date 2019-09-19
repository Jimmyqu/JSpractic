import Layout from '@/views/common/layout/Layout'
import route from '@/views/common/route'
import seVehicletrack from '@/router/tgpt_v2/se/vehicleTrack/'
import seVehicletrackplayback from '@/router/tgpt_v2/se/vehicleTrackPlayback/'
import sePower from '@/router/tgpt_v2/se/power/'
import seBackout from '@/router/tgpt_v2/se/backout/'
import seVehicletrackingplan from '@/router/tgpt_v2/se/vehicleTrackingPlan/'
import seEquipmentstatus from '@/router/tgpt_v2/se/equipmentStatus/'
import seEquipmentinstall from '@/router/tgpt_v2/se/equipmentInstall/'
import seSendrecord from '@/router/tgpt_v2/se/sendRecord/'

const index = {
	path: '/',
	component: Layout,
	alwaysShow: true,
	name: '沉默鹰',
	redirect: 'noredirect',
	meta: {title: '沉默鹰'},
	children: [
		...seVehicletrack,
		...seVehicletrackplayback,
		...sePower,
		...seBackout,
		...seVehicletrackingplan,
		...seEquipmentstatus,
		...seEquipmentinstall,
		...seSendrecord,

	]
}
export default index
