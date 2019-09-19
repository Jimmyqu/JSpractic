import Layout from '@/views/common/layout/Layout'
import clientVehicleApplication from '@/router/tgpt_v2/clientVehicleApplication/clientVehicleApplication/'

const index = {
    path: '/',
    component: Layout,
    alwaysShow: true,
    name: '业务平台',
    redirect: 'noredirect',
    meta: {title: '业务平台'},
    children: [
        ...clientVehicleApplication,
    ]
}
export default index
