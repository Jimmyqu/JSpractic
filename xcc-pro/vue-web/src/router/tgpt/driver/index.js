/** When your routing table is too long, you can split it into small tgpt**/

import Layout from '@/views/common/layout/Layout'
import vehicleDriverBinding from '@/router/tgpt/driver/vehicleDriverBinding'
import driverInformation from '@/router/tgpt/driver/driverInformation'
import driverSalary from '@/router/tgpt/driver/driverSalary'
import appDriverMessage from '@/router/tgpt_v2/appDriver/message'
import appDriverExamine from '@/router/tgpt_v2/appDriver/examine'
import appDriverMicroCourse from '@/router/tgpt_v2/appDriver/microCourse'
import route from '@/views/common/route'

const index = {
    path: '/',
    component: Layout,
    name: '司机平台',
    redirect: 'noredirect',
    meta: {title: '司机平台'},
    children: [
        ...driverInformation,
        ...vehicleDriverBinding,
        ...driverSalary,
        ...appDriverMessage,
        ...appDriverMicroCourse,
        ...appDriverExamine,

    ]
}

export default index
