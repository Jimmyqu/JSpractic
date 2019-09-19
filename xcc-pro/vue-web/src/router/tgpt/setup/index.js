/** When your routing table is too long, you can split it into small tgpt**/

import Layout from '@/views/common/layout/Layout'

import province from '@/router/tgpt/setup/province'
import city from '@/router/tgpt/setup/city'

const index = {
    path: '/tgpt/setup',
    component: Layout,
    name: '系统设置',
    alwaysShow: true,
    redirect: 'noredirect',
    meta: {title: '系统设置', icon: 'example'},
    children: [
        ...province,
        ...city,
    ]
}

export default index
