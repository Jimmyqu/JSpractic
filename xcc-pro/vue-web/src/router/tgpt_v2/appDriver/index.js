import Layout from '@/views/common/layout/Layout'
import modelBrand from '@/router/tgpt/vehicle/modelBrand'
import purchaseProcessInsurance from '@/router/tgpt/vehicle/purchaseProcessInsurance'
import modelSeries from '@/router/tgpt/vehicle/modelSeries'
import modelStyle from '@/router/tgpt/vehicle/modelStyle'

const index = {
    path: '/',
    component: Layout,
    alwaysShow: true,
    name: '基础数据',
    redirect: 'noredirect',
    meta: {title: '基础数据'},
    children: [
        ...modelStyle,
        ...modelBrand,
        ...modelSeries,
        /* ...purchaseProcessInsurance,*/

    ]
}
export default index
