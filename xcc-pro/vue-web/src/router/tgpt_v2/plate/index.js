import Layout from '@/views/common/layout/Layout'
import plateManage from '@/router/tgpt_v2/plate/platemanage/'

const index = {
    path: '/',
    component: Layout,
    alwaysShow: true,
    name: '基础数据',
    redirect: 'noredirect',
    meta: {title: '基础数据'},
    children: [
        ...plateManage

    ]
}
export default index
