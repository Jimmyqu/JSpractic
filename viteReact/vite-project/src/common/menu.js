import classNames from 'classnames';
import { isUrl } from '@/utils/utils';
import IconFont from '@/components/Icon';
import style from '@/components/SiderMenu/index.less';

const MenuIcon = ({ type, className, ...props }) => (
  <IconFont type={type} {...props} className={classNames(style.icon, className)} />
);

const menuData = [
  {
    name: '实时概况',
    icon: <MenuIcon type="stock-all" />,
    path: 'dashboard',
  },
  {
    name: '基础功能',
    path: 'basic',
    // icon: <MenuIcon type="menu-base" />,
    icon: <MenuIcon type="menu-store-list" />,
    group: true,

    children: [
      {
        name: '消息管理',
        icon: <MenuIcon type="menu-msg-manage" />,
        path: 'msgmanage',

        children: [
          {
            name: '消息通知',
            icon: <MenuIcon type="menu-notices" />,
            path: 'notice',
          },
          {
            name: '消息群发',
            icon: <MenuIcon type="menu-msg-groupsend" />,
            path: 'tmplist',
          },
        ],
      },
      {
        name: '场地管理',
        icon: <MenuIcon type="menu-platform-mng" />,
        path: 'platform',

        children: [
          {
            name: '在线预订',
            icon: <MenuIcon type="menu-booking" />,
            path: 'booking',
          },
          {
            name: '固定场设置',
            icon: <MenuIcon type="menu-forever-settings" />,
            path: 'forever',
          },
          {
            name: '锁场列表',
            icon: <MenuIcon type="menu-lock-list" />,
            path: 'locklist',
          },
          {
            name: '锁场日志',
            icon: <MenuIcon type="menu-lock-logs" />,
            path: 'locklogs',
          },
          // {
          //   name: '商品信息',
          //   path: 'item',
          // },
          // {
          //   name: '服务人员信息',
          //   path: 'serviceuser',
          // },
        ],
      },
      {
        name: '课程培训',
        icon: <MenuIcon type="menu-course-mng" />,
        path: 'course',

        children: [
          {
            name: '课程列表',
            icon: <MenuIcon type="menu-course-sales" />,
            path: 'sell',
          },
          {
            name: '课程信息',
            icon: <MenuIcon type="course-info-list" />,
            path: 'list',
          },
          {
            name: '考勤信息',
            icon: <MenuIcon type="course-attendance-list" />,
            path: 'attendance',
          },
        ],
      },
      {
        name: '会员管理',
        icon: <MenuIcon type="menu-pubuser-mng" />,
        path: 'pub',
        children: [
          {
            name: '会员信息',
            icon: <MenuIcon type="menu-pubuser-profile" />,
            path: 'info',
          },
          {
            name: '会员服务',
            icon: <MenuIcon type="menu-pubuser-service" />,
            path: 'pubservice',
          },
          {
            name: '可用服务',
            icon: <MenuIcon type="menu-stat-biz-pubservice" />,
            path: 'pubservicesold',
          },
          {
            name: '服务详情',
            icon: <MenuIcon type="menu-service-detail" />,
            path: 'recover',
          },
          {
            name: '服务流水',
            icon: <MenuIcon type="service-flow" />,
            path: 'pubserviceflow',
          },
          {
            name: '会员列表',
            icon: <MenuIcon type="menu-pubuser-list" />,
            path: 'list',
          },
          {
            name: '会员等级',
            icon: <MenuIcon type="menu-pubuser-grade" />,
            path: 'grade',
          },
          {
            name: '人员/学员',
            icon: <MenuIcon type="menu-stat-biz-serviceuser" />,
            path: 'contact',
          },
        ],
      },
      {
        name: '商城管理',
        icon: <MenuIcon type="menu-store-mng" />,
        path: 'mall',
        children: [
          {
            name: '商品销售',
            icon: <MenuIcon type="menu-store-sell" />,
            path: 'sell',
          },
          {
            name: '商品列表',
            icon: <MenuIcon type="menu-store-list" />,
            path: 'list',
          },
          {
            name: '商品库存',
            icon: <MenuIcon type="stock-all" />,
            path: 'stockall',
          },
          {
            name: '库存流水',
            icon: <MenuIcon type="menu-stock-flow" />,
            path: 'stockflow',
          },
          {
            name: '进出货管理',
            path: 'stock',
            hideInMenu: true,
          },
        ],
      },
      {
        name: '票务管理',
        icon: <MenuIcon type="menu-ticket-mng" />,
        path: 'ticket',

        children: [
          {
            name: '扫码验票',
            icon: <MenuIcon type="menu-ticket-scancheck" />,
            path: 'scanchecking',
          },
          {
            name: '在线验票',
            icon: <MenuIcon type="menu-ticket-webcheck" />,
            path: 'webchecking',
          },
          {
            name: '票务列表',
            icon: <MenuIcon type="menu-ticket-sales" />,
            path: 'sell',
          },
        ],
      },
      {
        name: '租赁管理',
        icon: <MenuIcon type="menu-rent-mng" />,
        path: 'rent',
        children: [
          {
            name: '储物柜',
            icon: <MenuIcon type="menu-rent-locker" />,
            path: 'locker',
          },
          {
            name: '租赁项目',
            icon: <MenuIcon type="menu-rent-project" />,
            path: 'project',
          },
          {
            name: '租赁配置',
            icon: <MenuIcon type="menu-rent-list" />,
            path: 'list',
          },
          {
            name: '使用记录',
            // icon: <MenuIcon type="menu-rent-list" />,
            path: 'logs',
          },
        ],
      },
      {
        name: '销售管理',
        icon: <MenuIcon type="menu-stat-biz-store-d" />,
        path: 'marketingmng',
        children: [
          {
            name: '分成报表',
            icon: <MenuIcon type="menu-stat" />,
            path: 'list',
          },
        ],
      },
      {
        name: '扫码支付',
        icon: <MenuIcon type="menu-scan-pay" />,
        path: 'scanpay',
      },
      {
        name: '订单管理',
        icon: 'file-text',
        path: 'deal',
        children: [
          {
            name: '主订单',
            icon: <MenuIcon type="menu-deal-main" />,
            path: 'deal',
          },
          {
            name: '场地订单',
            icon: <MenuIcon type="menu-deal-platform" />,
            path: 'platform',
          },
          {
            name: '商品订单',
            icon: <MenuIcon type="menu-deal-store" />,
            path: 'item',
          },
          {
            name: '分销人员订单',
            icon: <MenuIcon type="menu-deal-store" />,
            path: 'marketingmember',
          },
          {
            name: '活动票务',
            icon: <MenuIcon type="menu-deal-ticket" />,
            path: 'ticket',
          },
          {
            name: '场地票务',
            icon: <MenuIcon type="menu-deal-ticket" />,
            path: 'spticket',
          },
          {
            name: '服务人员订单',
            icon: <MenuIcon type="menu-deal-serviceuser" />,
            path: 'serviceuser',
          },
          {
            name: '会员服务订单',
            icon: <MenuIcon type="menu-deal-pubservice" />,
            path: 'pubservice',
          },
          {
            name: '报名订单',
            icon: <MenuIcon type="menu-deal-signup" />,
            path: 'signup',
          },
          {
            name: '课程订单',
            icon: <MenuIcon type="menu-deal-course" />,
            path: 'course',
          },
          {
            name: '账户订单',
            icon: 'file-text',
            path: 'account',
          },
          {
            name: '扫码订单',
            icon: 'file-text',
            path: 'scan',
          },
          {
            name: '白条订单',
            icon: 'file-text',
            path: 'credit',
          },
          {
            name: '提现订单',
            icon: 'file-text',
            path: 'withdraw',
          },
          {
            name: '租赁订单',
            icon: 'file-text',
            path: 'rent',
          },
          {
            name: '认证订单',
            icon: 'file-text',
            path: 'cert',
          },
          // {
          //   name: '订单支付配置',
          //   path: 'pay',
          // },
          {
            name: '订单',
            path: ':id',
          },
        ],
      },
      {
        name: '设备管理',
        icon: <MenuIcon type="menu-devices" />,
        path: 'device',
        children: [
          {
            name: '人脸认证',
            icon: <MenuIcon type="menu-devices-afr" />,
            path: 'afr',
            children: [
              {
                name: '人脸认证',
                icon: <MenuIcon type="menu-devices-afr" />,
                path: 'auth',
              },
              {
                name: '认证图片',
                // icon: <MenuIcon type="menu-deal-ticket" />,
                path: 'pics',
              },
            ],
          },
          {
            name: '核验记录',
            icon: <MenuIcon type="menu-ticket-webcheck" />,
            path: 'logs',
          },
          {
            name: 'IC/物理卡管理',
            icon: <MenuIcon type="ic-card" />,
            path: 'iccard',
          },
        ],
      },
      {
        name: '项目管理',
        icon: <MenuIcon type="menu-activity2" />,
        path: 'activity2',
        children: [
          {
            name: '项目申请',
            icon: <MenuIcon type="menu-project-req" />,
            path: 'req',
          },
          {
            name: '项目列表',
            icon: <MenuIcon type="menu-project" />,
            path: 'project',
          },
          {
            name: '活动列表',
            icon: <MenuIcon type="menu-activity-list" />,
            path: 'activity',
          },
        ],
      },
      {
        name: '活动管理',
        icon: <MenuIcon type="menu-activity" />,
        path: 'activity',

        children: [
          {
            name: '体育活动',
            icon: <MenuIcon type="menu-sports" />,
            path: 'sport',
            children: [
              {
                name: '活动申报',
                icon: <MenuIcon type="menu-activity-s-profile" />,
                path: 'info',
              },
              {
                name: '申报列表',
                icon: <MenuIcon type="menu-activity-s-list" />,
                path: 'list',
              },
            ],
          },
          {
            name: '文化活动',
            icon: <MenuIcon type="menu-culture" />,
            path: 'culture',
            children: [
              {
                name: '活动申报',
                icon: <MenuIcon type="menu-activity-c-profile" />,
                path: 'info',
              },
              {
                name: '申报列表',
                icon: <MenuIcon type="menu-activity-c-list" />,
                path: 'list',
              },
            ],
          },
        ],
      },
      {
        name: '物流管理',
        icon: <MenuIcon type="menu-logistics-mng" />,
        path: 'logistics',
        children: [
          {
            name: '发货',
            icon: <MenuIcon type="menu-logistics-deliver" />,
            path: 'shipping',
          },
        ],
      },
      {
        name: '发票管理',
        icon: <MenuIcon type="invoice-a" />,
        path: 'invoice',
        children: [
          {
            name: '发票列表',
            icon: <MenuIcon type="invoice-b" />,
            path: 'list',
          },
          {
            name: '发票信息',
            icon: 'file-text',
            path: ':id',
            hideInMenu: true,
          },
        ],
      },
      {
        name: '优惠码/券',
        icon: <MenuIcon type="menu-coupon" />,
        path: 'coupon',
        children: [
          {
            name: '核验',
            icon: <MenuIcon type="menu-coupon-verify" />,
            path: 'verify',
          },
          {
            name: '已发行',
            icon: <MenuIcon type="menu-coupon-list" />,
            path: 'list',
          },
          {
            name: '核验记录',
            icon: <MenuIcon type="menu-coupon-logs" />,
            path: 'logs',
          },
        ],
      },
      {
        name: '认证管理',
        icon: <MenuIcon type="menu-cert-mng" />,
        path: 'certmng',
        children: [
          {
            name: '认证列表',
            icon: <MenuIcon type="menu-cert-list" />,
            path: 'list',
          },
          {
            name: '认证配置',
            icon: <MenuIcon type="svusrmng-certcfg" />,
            path: 'certcfg',
          },
          {
            name: '审核配置',
            icon: <MenuIcon type="svusrmng-auditcfg" />,
            path: 'auditcfg',
          },
        ],
      },
      // {
      //   name: '订单支付',
      //   icon: 'home',
      //   path: 'pay',
      // },
      {
        name: '人员管理',
        icon: <MenuIcon type="svusrmng" />,
        path: 'serviceusermng',
        children: [
          {
            name: '人员列表',
            icon: <MenuIcon type="svusrmng-usrlist" />,
            path: 'user',
          },
        ],
      },
      {
        name: '模板列表',
        icon: <MenuIcon type="svusrmng-auditcfg" />,
        path: 'template',
      },
      {
        name: '门店场馆',
        icon: <MenuIcon type="menu-venue" />,
        path: 'venue',
      },
    ],
  },
  {
    name: '数字传媒',
    path: 'digital',
    icon: <MenuIcon type="menu-store-list" />,
    group: true,

    children: [
      {
        name: '报纸管理',
        icon: <MenuIcon type="menu-newspaper-mng" />,
        path: 'newspaper',
        children: [
          {
            name: '报纸列表',
            icon: <MenuIcon type="menu-newspaper-list" />,
            path: 'list',
          },
          {
            name: '报纸配置',
            icon: <MenuIcon type="menu-newspaper-info" />,
            path: 'info',
          },
          {
            name: '媒体配置',
            icon: <MenuIcon type="menu-newspaper-type" />,
            path: 'type',
          },
        ],
      },
    ],
  },
  {
    name: '系统管理',
    // icon: <MenuIcon type="menu-install" />,
    icon: <MenuIcon type="menu-store-list" />,
    path: 'sys',
    group: true,

    children: [
      {
        name: '单位管理',
        icon: <MenuIcon type="menu-sys-company-mng" />,
        path: 'syscompany',
      },
      {
        name: '用户管理',
        icon: <MenuIcon type="menu-sys-user-mng" />,
        path: 'sysuser',
      },
    ],
  },
  {
    name: '新统计',
    path: 'analysis',
    icon: <MenuIcon type="menu-store-list" />,
    group: true,
    children: [
      {
        name: '业务统计',
        icon: <MenuIcon type="menu-stat-biz" />,
        path: 'business',
        children: [
          {
            name: '收入汇总',
            path: 'income',
          },
          {
            name: '业务汇总',
            path: 'summary',
          },
          {
            name: '业务明细',
            path: 'detail',
          },
        ],
      },
      {
        name: '财务统计',
        icon: <MenuIcon type="menu-stat-finance" />,
        path: 'finance',
        children: [
          {
            name: '财务汇总',
            icon: <MenuIcon type="menu-stat-finance-s" />,
            path: 'summary',
          },
          {
            name: '财务明细',
            icon: <MenuIcon type="menu-stat-finance-d" />,
            path: 'detail',
          },
          {
            name: '第三方支付明细',
            icon: <MenuIcon type="menu-stat-tppay" />,
            path: 'tpdetail',
          },
        ],
      },
    ],
  },
  {
    name: '账户',
    icon: 'user',
    path: 'user',
    authority: 'guest',
    children: [
      {
        name: '登录',
        path: 'login',
      },
      {
        name: '忘记密码',
        path: 'forgot',
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority, childrenKey = 'children') {
  return data.map(item => {
    let { path } = item;
    const { authority } = item;
    if (!isUrl(path)) {
      path = parentPath + path;
    }
    const result = {
      ...item,
      path,
      authority: authority || parentAuthority,
    };
    if (item[childrenKey]) {
      result[childrenKey] = formatter(item[childrenKey], `${parentPath}${item.path}/`, authority, childrenKey);
    }
    return result;
  });
}

export function pathFormatter(data, childrenKey) {
  return formatter(data, '/', null, childrenKey);
}

export const getMenuData = () => formatter(menuData);
