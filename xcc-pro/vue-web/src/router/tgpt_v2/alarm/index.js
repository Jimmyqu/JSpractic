import Layout from '@/views/common/layout/Layout'
import route from '@/views/common/route'

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
import baseEquipmentworkstatus from "../base";
import stopOutTime from '@/router/tgpt_v2/alarm/stopOutTime/'



const index = {
    path: '/',
    component: Layout,
    alwaysShow: true,
    name: '运营管理',
    redirect: 'noredirect',
    meta: {title: '运营管理'},
    children: [
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
        ...stopOutTime,
    ]
}
export default index
