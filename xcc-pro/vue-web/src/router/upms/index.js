import Layout from '@/views/common/layout/Layout'
import user from '@/router/upms/user/'
import organization from '@/router/upms/organization/'
import organizationType from '@/router/upms/organizationType/'
import position from '@/router/upms/position/'
import role from '@/router/upms/role/'
import access from '@/router/tgpt/sys/access'
import audit from '@/router/tgpt/sys/audit'
import personalise from '@/router/upms/personalise'

const index = {
    path: '/',
    component: Layout,
    alwaysShow: true,
    name: '权限管理',
    redirect: 'noredirect',
    meta: {title: '权限管理'},
    children: [
        ...user,
        ...position,
        ...organization,
        ...organizationType,
        ...role,
        ...audit,
        ...access,
        ...personalise
    ]
}
export default index
