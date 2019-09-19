import Layout from '@/views/common/layout/Layout'
import route from '@/views/common/route'
import areaFence from '@/router/tgpt_v2/sys/areaFence'
import customParameter from '@/router/tgpt_v2/sys/customParameter'
import electronFence from '@/router/tgpt_v2/sys/electronFence'
import timeFence from '@/router/tgpt_v2/sys/timeFence'
import timeOutFence from '@/router/tgpt_v2/sys/timeOutFence'
import parkingFence from '@/router/tgpt_v2/sys/parkingFence'

const index = {
    path: '/',
    component: Layout,
    alwaysShow: true,
    name: '栅栏设置',
    redirect: 'noredirect',
    meta: {title: '栅栏设置'},
    children: [
        ...areaFence,
        ...customParameter,
        ...electronFence,
        ...timeFence,
        ...parkingFence,
        ...timeOutFence,
    ]
}
export default index
