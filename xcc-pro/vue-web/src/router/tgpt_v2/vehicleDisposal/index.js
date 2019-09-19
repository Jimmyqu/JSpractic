import Layout from '@/views/common/layout/Layout'
import vehicleDisposalApply from '@/router/tgpt_v2/vehicleDisposal/vehicleDisposalApply/'
import vehicleSellApply from '@/router/tgpt_v2/vehicleDisposal/vehicleSellApply/'
import vehicleUseApply from '@/router/tgpt_v2/vehicleDisposal/vehicleUseApply/'
import vehicleSellProcess from '@/router/tgpt_v2/vehicleDisposal/vehicleSellProcess/'

const index = {
    path: '/',
    component: Layout,
    alwaysShow: true,
    name: '基础数据',
    redirect: 'noredirect',
    meta: {title: '基础数据'},
    children: [
        ...vehicleDisposalApply,
        ...vehicleSellApply,
        ...vehicleUseApply,
        ...vehicleSellProcess
    ]
}
export default index
