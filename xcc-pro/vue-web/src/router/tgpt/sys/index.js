/** When your routing table is too long, you can split it into small tgpt**/

import Layout from '@/views/common/layout/Layout'

import user from '@/router/tgpt/sys/user'
import tree from '@/router/tgpt/sys/tree'
import permission from '@/router/tgpt/sys/permission'
import audit from '@/router/tgpt/sys/audit'
import access from '@/router/tgpt/sys/access'

const index = {
    path: '/tgpt/sys',
    component: Layout,
    name: '权限管理',
    alwaysShow: true,
    redirect: 'noredirect',
    meta: {title: '权限管理'},
    children: [
        ...user,
        ...tree,
        ...permission,
        ...audit,
        ...access,

    ]
}

export default index
