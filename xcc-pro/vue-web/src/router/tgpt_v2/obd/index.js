import Layout from '@/views/common/layout/Layout'
import route from '@/views/common/route'
import obdVehiclelocation from '@/router/tgpt_v2/obd/vehicleLocation/'
import obdVehiclelocationrealtime from '@/router/tgpt_v2/obd/vehicleLocationRealtime/'
import obdVehicletrack from '@/router/tgpt_v2/obd/vehicleTrack/'
import obdVehicletrackExport from '@/router/tgpt_v2/obd/vehicleTrackExport/'
import obdVehiclelocationhistorical from '@/router/tgpt_v2/obd/vehicleLocationHistorical/'
import obdVehiclelocationtrack from '@/router/tgpt_v2/obd/vehicleLocationTrack/'
import obdVehicletrackrecord from '@/router/tgpt_v2/obd/vehicleTrackRecord/'
import seVehicletrack from '@/router/tgpt_v2/se/vehicleTrack/'
import seVehicletrackplayback from '@/router/tgpt_v2/se/vehicleTrackPlayback/'
import sePower from '@/router/tgpt_v2/se/power/'
import seBackout from '@/router/tgpt_v2/se/backout/'
import seVehicletrackingplan from '@/router/tgpt_v2/se/vehicleTrackingPlan/'
import seEquipmentstatus from '@/router/tgpt_v2/se/equipmentStatus/'
import seEquipmentinstall from '@/router/tgpt_v2/se/equipmentInstall/'
import seSendrecord from '@/router/tgpt_v2/se/sendRecord/'
import areaFence from '@/router/tgpt_v2/sys/areaFence'
import customParameter from '@/router/tgpt_v2/sys/customParameter'
import electronFence from '@/router/tgpt_v2/sys/electronFence'
import timeFence from '@/router/tgpt_v2/sys/timeFence'
import timeOutFence from '@/router/tgpt_v2/sys/timeOutFence'
import parkingFence from '@/router/tgpt_v2/sys/parkingFence'
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
import alarmDecelerate from '@/router/tgpt_v2/alarm/decelerate/'
import alarmidlespeed from '@/router/tgpt_v2/alarm/idlespeed/'
import alarmspeeding from '@/router/tgpt_v2/alarm/speeding/'
import alarmDragracing from '@/router/tgpt_v2/alarm/dragracing/'
import alarmAccelerate from '@/router/tgpt_v2/alarm/accelerate/'
import fatigueDriving from '@/router/tgpt_v2/alarm/fatigueDriving/'
import sharpTurn from '@/router/tgpt_v2/alarm/sharpTurn/'
import areaLimit from '@/router/tgpt_v2/alarm/areaLimit/'
import timeLimit from '@/router/tgpt_v2/alarm/timeLimit/'
import seriouscollision from '@/router/tgpt_v2/alarm/seriouscollision/'
import electricfence from '@/router/tgpt_v2/alarm/electricfence/'
import parkingfence from '@/router/tgpt_v2/alarm/parkingfence/'
import poweroff from '@/router/tgpt_v2/alarm/poweroff/'
import watertemperature from '@/router/tgpt_v2/alarm/watertemperature/'
import lowvoltage from '@/router/tgpt_v2/alarm/lowvoltage/'
import vibration from '@/router/tgpt_v2/alarm/vibration/'
import tow from '@/router/tgpt_v2/alarm/tow/'
import rollover from '@/router/tgpt_v2/alarm/rollover/'
import collision from '@/router/tgpt_v2/alarm/collision/'
import stopOilPower from '@/router/tgpt_v2/alarm/stopOilPower/'
import speechControl from '@/router/tgpt_v2/alarm/speechControl/'
import bassPassValid from '@/router/tgpt_v2/base/passValid/'
import baseAppVersion from '@/router/tgpt_v2/base/appVersion/'
import stopOutTime from '@/router/tgpt_v2/alarm/stopOutTime/'

const index = {
	path: '/',
	component: Layout,
	alwaysShow: true,
	name: '监控平台',
	redirect: 'noredirect',
	meta: {title: '监控平台'},
	children: [
        ...obdVehiclelocation,
        ...obdVehiclelocationrealtime,
        ...obdVehicletrack,
        ...obdVehiclelocationhistorical,
        ...obdVehiclelocationtrack,
        ...obdVehicletrackrecord,
        ...seVehicletrack,
        ...obdVehicletrackExport,
        ...seVehicletrackplayback,
        ...sePower,
        ...seBackout,
        ...seVehicletrackingplan,
        ...seEquipmentstatus,
        ...seEquipmentinstall,
        ...seSendrecord,
        ...areaFence,
        ...customParameter,
        ...electronFence,
        ...timeFence,
        ...timeOutFence,
        ...parkingFence,
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
        ...alarmidlespeed,
        ...alarmspeeding,
        ...alarmDragracing,
        ...fatigueDriving,
        ...alarmDecelerate,
        ...alarmAccelerate,
        ...sharpTurn,
        ...timeLimit,
        ...areaLimit,
        ...electricfence,
        ...parkingfence,
        ...poweroff,
        ...watertemperature,
        ...lowvoltage,
        ...vibration,
        ...tow,
        ...rollover,
        ...collision,
        ...seriouscollision,
        ...stopOilPower,
        ...speechControl,
        ...bassPassValid,
        ...baseAppVersion,
        ...stopOutTime,
	]
}
export default index
