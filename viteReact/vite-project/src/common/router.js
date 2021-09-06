/* eslint-disable import/prefer-default-export */
import Loadable from '@loadable/component';
// react-router 5.x 依赖 path-to-regexp 1.8.0，为了避免多重版本，项目也引用1.8.0，react-router 6 会删除这个依赖
import pathToRegexp from 'path-to-regexp';
import { Spin } from 'antd';
import { getMenuData } from './menu';

const OrderSummaryModules = ['pubservice', 'deal', 'pubsignup', 'pubcourse', 'booking', 'rent', 'pubwithdraw'];

let routerDataCache;

// wrapper of dynamic
const dynamicWrapper = (app, models, getComponent) => {
  const Component = Loadable(
    () => {
      app.injectModel(models);
      return getComponent();
    },
    {
      fallback: <Spin size="large" className="global-spin" />,
    }
  );
  return props => {
    // eslint-disable-next-line no-use-before-define
    return <Component {...props} routerData={getRouterData(app)} />;
  };
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

function findMenuKey(menuData, path) {
  const menuKey = Object.keys(menuData).find(key => pathToRegexp(path).test(key));
  if (menuKey == null) {
    if (path === '/') {
      return null;
    }
    const lastIdx = path.lastIndexOf('/');
    if (lastIdx < 0) {
      return null;
    }
    if (lastIdx === 0) {
      return findMenuKey(menuData, '/');
    }
    // 如果没有，使用上一层的配置
    return findMenuKey(menuData, path.slice(0, lastIdx));
  }
  return menuKey;
}

export function getRouterData(app) {
  if (routerDataCache) {
    return routerDataCache;
  }
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, [], () => import('@/layouts/BasicLayout')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('@/layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, [], () => import('@/routes/User/Login')),
    },
    '/user/forgot': {
      component: dynamicWrapper(app, [], () => import('@/routes/User/Forgot')),
    },
    '/dashboard': {
      component: dynamicWrapper(
        app,
        [
          'dashboard',
          'deal',
          'pubplatform',
          'pubcourse',
          'pubservice',
          'pubaccount',
          'analysis',
          'pubsignup',
          'pubscan',
          'pubcredit',
        ],
        () => import('@/routes/Dashboard')
      ),
    },
    '/basic/msgmanage/notice': {
      component: dynamicWrapper(app, ['message'], () => import('@/routes/MsgManage/Notice')),
    },
    '/basic/msgmanage/notice/system': {
      component: dynamicWrapper(app, ['message'], () => import('@/routes/MsgManage/Notice/System')),
    },
    '/basic/msgmanage/notice/short': {
      component: dynamicWrapper(app, ['message'], () => import('@/routes/MsgManage/Notice/Short')),
    },
    '/basic/msgmanage/notice/wechat': {
      component: dynamicWrapper(app, ['message'], () => import('@/routes/MsgManage/Notice/Wechat')),
    },
    '/basic/msgmanage/tmplist': {
      component: dynamicWrapper(app, ['message'], () => import('@/routes/MsgManage/TmpList')),
    },
    '/basic/platform/booking': {
      component: dynamicWrapper(app, ['deal', 'booking', 'pubplatform', 'orderprocessing'], () =>
        import('@/routes/Platform/Booking')
      ),
    },
    '/basic/platform/booking/booking': {
      component: dynamicWrapper(app, ['pubservice', 'pubticket', 'pubcourse', 'rent', 'pubwithdraw'], () =>
        import('@/routes/Platform/Booking/Booking')
      ),
    },
    '/basic/platform/booking/user': {
      component: dynamicWrapper(app, ['pubuser'], () => import('@/routes/Platform/Booking/User')),
    },
    '/basic/platform/booking/serviceuser': {
      component: dynamicWrapper(app, [], () => import('@/routes/Platform/Booking/ServiceUser')),
    },
    '/basic/platform/booking/mall': {
      component: dynamicWrapper(app, ['store', 'pubitem'], () => import('@/routes/Platform/Booking/Mall')),
    },
    '/basic/platform/booking/fill': {
      component: dynamicWrapper(app, ['contact', 'pubticket'], () => import('@/routes/Platform/Booking/Fill')),
    },
    '/basic/platform/booking/summary': {
      component: dynamicWrapper(app, OrderSummaryModules, () => import('@/routes/Platform/Booking/Summary')),
    },
    '/basic/platform/booking/pay': {
      component: dynamicWrapper(app, ['payment'], () => import('@/routes/Platform/Booking/Pay')),
    },
    '/basic/platform/booking/result': {
      component: dynamicWrapper(app, ['print'], () => import('@/routes/Platform/Booking/Result')),
    },
    '/basic/platform/forever': {
      component: dynamicWrapper(app, ['pubplatform'], () => import('@/routes/Platform/Forever')),
    },
    '/basic/platform/forever/list': {
      component: dynamicWrapper(app, [], () => import('@/routes/Platform/Forever/Profile/List')),
    },
    '/basic/platform/forever/add': {
      component: dynamicWrapper(app, ['pubuser'], () => import('@/routes/Platform/Forever/Profile/Add')),
    },
    '/basic/platform/locklist': {
      component: dynamicWrapper(app, ['pubplatform'], () => import('@/routes/Platform/Lock/List')),
    },
    '/basic/platform/locklogs': {
      component: dynamicWrapper(app, ['pubplatform'], () => import('@/routes/Platform/Lock/Logs')),
    },
    '/basic/mall/sell': {
      component: dynamicWrapper(app, ['deal', 'mallselling', 'orderprocessing'], () => import('@/routes/Mall/Sell')),
    },
    '/basic/mall/sell/mall': {
      component: dynamicWrapper(app, ['store', 'pubitem'], () => import('@/routes/Mall/Sell/Mall')),
    },
    '/basic/mall/sell/user': {
      component: dynamicWrapper(app, ['pubuser'], () => import('@/routes/Mall/Sell/User')),
    },
    '/basic/mall/sell/summary': {
      component: dynamicWrapper(app, OrderSummaryModules, () => import('@/routes/Mall/Sell/Summary')),
    },
    '/basic/mall/sell/pay': {
      component: dynamicWrapper(app, ['payment'], () => import('@/routes/Mall/Sell/Pay')),
    },
    '/basic/mall/sell/result': {
      component: dynamicWrapper(app, ['print'], () => import('@/routes/Mall/Sell/Result')),
    },
    '/basic/mall/list': {
      component: dynamicWrapper(app, ['store'], () => import('@/routes/Mall/List')),
    },
    '/basic/mall/list/list': {
      component: dynamicWrapper(app, [], () => import('@/routes/Mall/List/List')),
    },
    '/basic/mall/list/:id/stock': {
      component: dynamicWrapper(app, [], () => import('@/routes/Mall/List/Stock')),
    },
    '/basic/mall/stockflow': {
      component: dynamicWrapper(app, ['store'], () => import('@/routes/Mall/List/Flow')),
    },
    '/basic/mall/stockall': {
      component: dynamicWrapper(app, ['store'], () => import('@/routes/Mall/StockAll')),
    },
    '/basic/marketingmng/list': {
      component: dynamicWrapper(app, ['pubmktmb'], () => import('@/routes/Marketing/List')),
    },
    '/basic/marketingmng/list/list': {
      component: dynamicWrapper(app, [], () => import('@/routes/Marketing/List/List')),
    },
    '/basic/marketingmng/list/:id/stock': {
      component: dynamicWrapper(app, [], () => import('@/routes/Marketing/List/Stock')),
    },
    '/basic/device/afr/auth': {
      component: dynamicWrapper(app, [], () => import('@/routes/Device/Afr')),
    },
    '/basic/device/afr/pics': {
      component: dynamicWrapper(app, [], () => import('@/routes/Device/Pics')),
    },
    '/basic/device/logs': {
      component: dynamicWrapper(app, ['deal', 'pubticket'], () => import('@/routes/Device/Logs')),
    },
    '/basic/device/iccard': {
      component: dynamicWrapper(app, ['contact', 'pubuser', 'pubservice', 'pubticket'], () =>
        import('@/routes/Device/ICCard')
      ),
    },
    '/basic/scanpay': {
      component: dynamicWrapper(app, ['payment', 'deal'], () => import('@/routes/ScanPay')),
    },
    '/basic/venue': {
      component: dynamicWrapper(app, ['pubticket'], () => import('@/routes/Venue')),
    },
    '/basic/pub/grade': {
      component: dynamicWrapper(app, ['pubuser'], () => import('@/routes/Pub/UserGrade')),
    },
    '/basic/pub/grade/grade-manage': {
      component: dynamicWrapper(app, ['pubservice', 'pubuser'], () => import('@/routes/Pub/UserGrade/GradeManage')),
    },
    '/basic/pub/grade/interests-manage': {
      component: dynamicWrapper(app, ['pubuser'], () => import('@/routes/Pub/UserGrade/InterestsManage')),
    },
    '/basic/pub/grade/interests-change': {
      component: dynamicWrapper(app, ['pubuser'], () => import('@/routes/Pub/UserGrade/InterestsChange')),
    },
    '/basic/pub/grade/grade-interests': {
      component: dynamicWrapper(app, ['pubuser'], () =>
        import('@/routes/Pub/UserGrade/GradeManage/GradeInterestsDetails')
      ),
    },
    '/basic/pub/grade/three-grade-relation': {
      component: dynamicWrapper(app, ['pubuser'], () => import('@/routes/Pub/UserGrade/ThreeGradeRelation')),
    },
    '/basic/pub/info': {
      component: dynamicWrapper(app, ['pubuser'], () => import('@/routes/Pub/User')),
    },
    '/basic/pub/info/nav': {
      component: dynamicWrapper(app, [], () => import('@/routes/Pub/User/Nav')),
    },
    '/basic/pub/info/:id': {
      component: dynamicWrapper(app, ['pubticket'], () => import('@/routes/Pub/User/Profile')),
    },
    '/basic/pub/info/:id/base': {
      component: dynamicWrapper(app, [], () => import('@/routes/Pub/User/Profile/Base')),
    },
    '/basic/pub/info/:id/amountflow': {
      component: dynamicWrapper(app, ['payment', 'deal'], () => import('@/routes/Pub/User/Profile/AmountFlow')),
    },
    '/basic/pub/info/:id/dealflow': {
      component: dynamicWrapper(app, ['payment', 'deal'], () => import('@/routes/Pub/User/Profile/DealFlow')),
    },
    '/basic/pub/info/:id/service': {
      component: dynamicWrapper(app, ['pubservice', 'deal', 'pubuser', 'contact', 'pubticket', 'pubcourse'], () =>
        import('@/routes/Pub/User/Profile/Service')
      ),
    },
    '/basic/pub/info/:id/serviceflow': {
      component: dynamicWrapper(app, ['deal', 'pubservice'], () => import('@/routes/Pub/User/Profile/ServiceFlow')),
    },
    '/basic/pub/info/:id/feeflow': {
      component: dynamicWrapper(app, ['action'], () => import('@/routes/Pub/User/Profile/FeeFlow')),
    },
    '/basic/pub/info/:id/amounttopup': {
      component: dynamicWrapper(app, ['deal'], () => import('@/routes/Pub/User/Profile/AmountTopUp')),
    },
    '/basic/pub/info/:id/feetopup': {
      component: dynamicWrapper(app, [], () => import('@/routes/Pub/User/Profile/FeeTopUp')),
    },
    '/basic/pub/info/:id/credit': {
      component: dynamicWrapper(app, [], () => import('@/routes/Pub/User/Profile/Credit')),
    },
    '/basic/pub/info/:id/invoice': {
      component: dynamicWrapper(app, ['deal', 'pubinvoice'], () => import('@/routes/Pub/User/Profile/Invoice')),
    },
    '/basic/pub/info/:id/contact': {
      component: dynamicWrapper(app, ['pubuser', 'contact'], () => import('@/routes/Pub/User/Profile/Contact')),
    },
    '/basic/pub/list': {
      component: dynamicWrapper(app, ['pubuser', 'pubticket'], () => import('@/routes/Pub/UserList')),
    },
    '/basic/pub/pubservice': {
      component: dynamicWrapper(app, [], () => import('@/routes/Pub/PubService')),
    },
    '/basic/pub/pubservice/list': {
      component: dynamicWrapper(app, ['pubservice'], () => import('@/routes/Pub/PubService/List')),
    },
    '/basic/pub/pubservice/:id': {
      component: dynamicWrapper(app, ['pubservice', 'pubserviceselling', 'orderprocessing'], () =>
        import('@/routes/Pub/PubService/Sell')
      ),
    },
    '/basic/pub/pubservice/:id/sell': {
      component: dynamicWrapper(app, [], () => import('@/routes/Pub/PubService/Sell/Sell')),
    },
    '/basic/pub/pubservice/:id/user': {
      component: dynamicWrapper(app, ['pubuser'], () => import('@/routes/Pub/PubService/Sell/User')),
    },
    '/basic/pub/pubservice/:id/fill': {
      component: dynamicWrapper(app, ['contact', 'pubticket'], () => import('@/routes/Pub/PubService/Sell/Fill')),
    },
    '/basic/pub/pubservice/:id/summary': {
      component: dynamicWrapper(app, OrderSummaryModules, () => import('@/routes/Pub/PubService/Sell/Summary')),
    },
    '/basic/pub/pubservice/:id/pay': {
      component: dynamicWrapper(app, ['payment'], () => import('@/routes/Pub/PubService/Sell/Pay')),
    },
    '/basic/pub/pubservice/:id/result': {
      component: dynamicWrapper(app, ['print'], () => import('@/routes/Pub/PubService/Sell/Result')),
    },
    '/basic/pub/pubservicesold': {
      component: dynamicWrapper(app, ['pubservice', 'deal', 'pubuser', 'contact', 'pubticket', 'pubcourse'], () =>
        import('@/routes/Pub/PubService/Sold')
      ),
    },
    '/basic/pub/pubserviceflow': {
      component: dynamicWrapper(app, ['pubservice', 'deal'], () => import('@/routes/Pub/PubService/Flow')),
    },
    '/basic/pub/contact': {
      component: dynamicWrapper(app, ['pubuser', 'pubticket', 'contact'], () => import('@/routes/Pub/Contact')),
    },
    '/basic/pub/recover': {
      component: dynamicWrapper(app, ['pubservice', 'deal'], () => import('@/routes/Pub/Recover')),
    },
    '/basic/deal/deal': {
      component: dynamicWrapper(app, ['deal', 'orderprocessing', 'print'], () => import('@/routes/Deal/MainDeal')),
    },
    '/basic/deal/platform': {
      component: dynamicWrapper(app, ['deal', 'pubplatform', 'pubticket', 'print'], () =>
        import('@/routes/Deal/Platform')
      ),
    },
    '/basic/deal/item': {
      component: dynamicWrapper(app, ['deal', 'pubitem', 'print'], () => import('@/routes/Deal/Item')),
    },
    '/basic/deal/marketingmember': {
      component: dynamicWrapper(app, ['deal', 'pubmktmb', 'print'], () => import('@/routes/Deal/MarketingMember')),
    },
    '/basic/deal/pubservice': {
      component: dynamicWrapper(app, ['deal', 'pubservice', 'print'], () => import('@/routes/Deal/PubService')),
    },
    '/basic/deal/serviceuser': {
      component: dynamicWrapper(app, ['deal', 'pubserviceuser', 'pubticket', 'print'], () =>
        import('@/routes/Deal/Serviceuser')
      ),
    },
    '/basic/deal/ticket': {
      component: dynamicWrapper(app, ['deal', 'pubticket', 'print'], () => import('@/routes/Deal/Ticket')),
    },
    '/basic/deal/spticket': {
      component: dynamicWrapper(app, ['deal', 'pubticket', 'print'], () => import('@/routes/Deal/SpTicket')),
    },
    '/basic/deal/signup': {
      component: dynamicWrapper(app, ['deal', 'pubsignup', 'print'], () => import('@/routes/Deal/Signup')),
    },
    '/basic/deal/course': {
      component: dynamicWrapper(app, ['deal', 'pubcourse', 'pubticket', 'print'], () => import('@/routes/Deal/Course')),
    },
    '/basic/deal/account': {
      component: dynamicWrapper(app, ['deal', 'pubaccount', 'print'], () => import('@/routes/Deal/Account')),
    },
    '/basic/deal/scan': {
      component: dynamicWrapper(app, ['deal', 'pubscan', 'print'], () => import('@/routes/Deal/Scan')),
    },
    '/basic/deal/credit': {
      component: dynamicWrapper(app, ['deal', 'pubcredit', 'print'], () => import('@/routes/Deal/Credit')),
    },
    '/basic/deal/withdraw': {
      component: dynamicWrapper(app, ['deal', 'pubwithdraw', 'print'], () => import('@/routes/Deal/Withdraw')),
    },
    '/basic/deal/rent': {
      component: dynamicWrapper(app, ['deal', 'rent'], () => import('@/routes/Deal/Rent')),
    },
    '/basic/deal/cert': {
      component: dynamicWrapper(app, ['deal', 'pubserviceuser'], () => import('@/routes/Deal/Cert')),
    },
    '/basic/deal/:id': {
      component: dynamicWrapper(app, ['deal', 'orderprocessing'], () => import('@/routes/Deal/Deal')),
    },
    '/basic/deal/:id/detail': {
      component: dynamicWrapper(
        app,
        ['pubservice', 'deal', 'pubsignup', 'pubcourse', 'booking', 'rent', 'pubticket', 'pubwithdraw'],
        () => import('@/routes/Deal/Deal/Detail')
      ),
    },
    '/basic/deal/:id/print': {
      component: dynamicWrapper(app, ['print'], () => import('@/routes/Deal/Deal/Print')),
    },
    '/basic/deal/:id/summary': {
      component: dynamicWrapper(app, OrderSummaryModules, () => import('@/routes/Deal/Deal/Summary')),
    },
    '/basic/deal/:id/pay': {
      component: dynamicWrapper(app, ['payment'], () => import('@/routes/Deal/Deal/Pay')),
    },
    '/basic/deal/:id/result': {
      component: dynamicWrapper(app, ['print'], () => import('@/routes/Deal/Deal/Result')),
    },
    '/basic/logistics/shipping': {
      component: dynamicWrapper(app, ['logistics'], () => import('@/routes/Logistics/Shipping')),
    },
    '/basic/ticket/scanchecking': {
      component: dynamicWrapper(app, [], () => import('@/routes/Ticket/ScanChecking')),
    },
    '/basic/ticket/scanchecking/list': {
      component: dynamicWrapper(app, ['pubticket'], () => import('@/routes/Ticket/ScanChecking/List')),
    },
    '/basic/ticket/scanchecking/:id': {
      component: dynamicWrapper(app, ['pubticket'], () => import('@/routes/Ticket/ScanChecking/Profile')),
    },
    '/basic/ticket/webchecking': {
      component: dynamicWrapper(app, ['deal', 'pubticket'], () => import('@/routes/Ticket/WebChecking')),
    },
    '/basic/ticket/sell': {
      component: dynamicWrapper(app, [], () => import('@/routes/Ticket/Sell')),
    },
    '/basic/ticket/sell/list': {
      component: dynamicWrapper(app, ['deal', 'pubticket'], () => import('@/routes/Ticket/Sell/List')),
    },
    '/basic/ticket/sell/:id': {
      component: dynamicWrapper(app, ['pubticket', 'ticketselling', 'orderprocessing'], () =>
        import('@/routes/Ticket/Sell/Sell')
      ),
    },
    '/basic/ticket/sell/:id/pick': {
      component: dynamicWrapper(app, [], () => import('@/routes/Ticket/Sell/Sell/Pick')),
    },
    '/basic/ticket/sell/:id/user': {
      component: dynamicWrapper(app, ['pubuser'], () => import('@/routes/Ticket/Sell/Sell/User')),
    },
    '/basic/ticket/sell/:id/sell': {
      component: dynamicWrapper(app, [], () => import('@/routes/Ticket/Sell/Sell/Sell')),
    },
    '/basic/ticket/sell/:id/fill': {
      component: dynamicWrapper(app, ['contact', 'pubuser'], () => import('@/routes/Ticket/Sell/Sell/Fill')),
    },
    '/basic/ticket/sell/:id/seat': {
      component: dynamicWrapper(app, ['contact'], () => import('@/routes/Ticket/Sell/Sell/Seat')),
    },
    '/basic/ticket/sell/:id/summary': {
      component: dynamicWrapper(app, OrderSummaryModules, () => import('@/routes/Ticket/Sell/Sell/Summary')),
    },
    '/basic/ticket/sell/:id/pay': {
      component: dynamicWrapper(app, ['payment'], () => import('@/routes/Ticket/Sell/Sell/Pay')),
    },
    '/basic/ticket/sell/:id/result': {
      component: dynamicWrapper(app, ['print'], () => import('@/routes/Ticket/Sell/Sell/Result')),
    },
    '/basic/course/list': {
      component: dynamicWrapper(app, [], () => import('@/routes/Course/List')),
    },
    '/basic/course/attendance': {
      component: dynamicWrapper(app, ['pubcourse'], () => import('@/routes/Course/Attendance')),
    },
    '/basic/course/sell': {
      component: dynamicWrapper(app, ['pubcourse'], () => import('@/routes/Course/Sell')),
    },
    '/basic/course/sell/list': {
      component: dynamicWrapper(app, ['deal'], () => import('@/routes/Course/Sell/List')),
    },
    '/basic/course/sell/:id': {
      component: dynamicWrapper(app, ['pubcourse', 'courseselling', 'orderprocessing'], () =>
        import('@/routes/Course/Sell/Sell')
      ),
    },
    '/basic/course/sell/:id/schedule': {
      component: dynamicWrapper(app, ['deal'], () => import('@/routes/Course/Sell/Sell/Schedule')),
    },
    '/basic/course/sell/:id/pick': {
      component: dynamicWrapper(app, [], () => import('@/routes/Course/Sell/Sell/Pick')),
    },
    '/basic/course/sell/:id/user': {
      component: dynamicWrapper(app, ['pubuser'], () => import('@/routes/Course/Sell/Sell/User')),
    },
    '/basic/course/sell/:id/sell': {
      component: dynamicWrapper(app, [], () => import('@/routes/Course/Sell/Sell/Sell')),
    },
    '/basic/course/sell/:id/fill': {
      component: dynamicWrapper(app, ['contact', 'pubuser'], () => import('@/routes/Course/Sell/Sell/Fill')),
    },
    '/basic/course/sell/:id/summary': {
      component: dynamicWrapper(app, OrderSummaryModules, () => import('@/routes/Course/Sell/Sell/Summary')),
    },
    '/basic/course/sell/:id/pay': {
      component: dynamicWrapper(app, ['payment'], () => import('@/routes/Course/Sell/Sell/Pay')),
    },
    '/basic/course/sell/:id/result': {
      component: dynamicWrapper(app, ['print'], () => import('@/routes/Course/Sell/Sell/Result')),
    },
    '/basic/activity/sport/info': {
      component: dynamicWrapper(app, ['activity'], () => import('@/routes/Activity/Info')),
    },
    '/basic/activity/sport/list': {
      component: dynamicWrapper(app, ['activity'], () => import('@/routes/Activity/List')),
    },
    '/basic/activity/culture/info': {
      component: dynamicWrapper(app, ['activity'], () => import('@/routes/Activity/Info')),
    },
    '/basic/activity/culture/list': {
      component: dynamicWrapper(app, ['activity'], () => import('@/routes/Activity/List')),
    },
    '/basic/activity2/req': {
      component: dynamicWrapper(app, ['activity2'], () => import('@/routes/Activity2/Project/Req')),
    },
    '/basic/activity2/project': {
      component: dynamicWrapper(app, ['activity2'], () => import('@/routes/Activity2/Project/List')),
    },
    '/basic/activity2/activity': {
      component: dynamicWrapper(app, ['activity2'], () => import('@/routes/Activity2/Activity')),
    },
    '/basic/activity2/activity/list': {
      component: dynamicWrapper(app, [], () => import('@/routes/Activity2/Activity/List')),
    },
    '/basic/activity2/activity/info': {
      component: dynamicWrapper(app, [], () => import('@/routes/Activity2/Activity/Info')),
    },
    '/basic/invoice/list': {
      component: dynamicWrapper(app, ['deal', 'pubinvoice'], () => import('@/routes/Invoice/List')),
    },
    '/basic/invoice/:id': {
      component: dynamicWrapper(app, ['deal', 'pubinvoice'], () => import('@/routes/Invoice/Profile')),
    },
    '/basic/certmng/list': {
      component: dynamicWrapper(app, ['pubserviceuser'], () => import('@/routes/CertMng/List')),
    },
    '/basic/certmng/list/teacher': {
      component: dynamicWrapper(app, [], () => import('@/routes/CertMng/List/Teacher')),
    },
    '/basic/certmng/list/coach': {
      component: dynamicWrapper(app, [], () => import('@/routes/CertMng/List/Coach')),
    },
    '/basic/certmng/list/referee': {
      component: dynamicWrapper(app, [], () => import('@/routes/CertMng/List/Referee')),
    },
    '/basic/certmng/list/athlete': {
      component: dynamicWrapper(app, [], () => import('@/routes/CertMng/List/Athlete')),
    },
    '/basic/certmng/list/cert': {
      component: dynamicWrapper(app, [], () => import('@/routes/CertMng/List/Cert')),
    },
    '/basic/certmng/certcfg': {
      component: dynamicWrapper(app, ['pubserviceuser', 'pubservice'], () => import('@/routes/CertMng/CertConfig')),
    },
    '/basic/certmng/auditcfg': {
      component: dynamicWrapper(app, ['pubserviceuser'], () => import('@/routes/CertMng/AuditConfig')),
    },
    '/basic/template': {
      component: dynamicWrapper(app, ['pubserviceuser', 'venue'], () => import('@/routes/Template')),
    },
    '/basic/serviceusermng/user': {
      component: dynamicWrapper(app, ['pubserviceuser'], () => import('@/routes/ServiceUserMng/User')),
    },
    '/basic/serviceusermng/user/teacher': {
      component: dynamicWrapper(app, [], () => import('@/routes/ServiceUserMng/User/Teacher')),
    },
    '/basic/serviceusermng/user/coach': {
      component: dynamicWrapper(app, [], () => import('@/routes/ServiceUserMng/User/Coach')),
    },
    '/basic/serviceusermng/user/referee': {
      component: dynamicWrapper(app, [], () => import('@/routes/ServiceUserMng/User/Referee')),
    },
    '/basic/serviceusermng/user/athlete': {
      component: dynamicWrapper(app, [], () => import('@/routes/ServiceUserMng/User/Athlete')),
    },
    '/basic/coupon/verify': {
      component: dynamicWrapper(app, ['coupon'], () => import('@/routes/Coupon/Verify')),
    },
    '/basic/coupon/list': {
      component: dynamicWrapper(app, ['coupon'], () => import('@/routes/Coupon/List')),
    },
    '/basic/coupon/logs': {
      component: dynamicWrapper(app, ['coupon'], () => import('@/routes/Coupon/Logs')),
    },
    '/basic/rent/logs': {
      component: dynamicWrapper(app, ['rent'], () => import('@/routes/Rent/Logs')),
    },
    '/basic/rent/locker': {
      component: dynamicWrapper(app, ['deal', 'rent', 'orderprocessing', 'lockerselling'], () =>
        import('@/routes/Rent/Locker')
      ),
    },
    '/basic/rent/locker/locker': {
      component: dynamicWrapper(app, [], () => import('@/routes/Rent/Locker/Locker')),
    },
    '/basic/rent/locker/user': {
      component: dynamicWrapper(app, ['pubuser'], () => import('@/routes/Rent/Locker/User')),
    },
    '/basic/rent/locker/summary': {
      component: dynamicWrapper(app, OrderSummaryModules, () => import('@/routes/Rent/Locker/Summary')),
    },
    '/basic/rent/locker/pay': {
      component: dynamicWrapper(app, ['payment'], () => import('@/routes/Rent/Locker/Pay')),
    },
    '/basic/rent/locker/result': {
      component: dynamicWrapper(app, ['print'], () => import('@/routes/Rent/Locker/Result')),
    },
    '/basic/rent/project': {
      component: dynamicWrapper(app, ['rent'], () => import('@/routes/Rent/Project')),
    },
    '/basic/rent/list': {
      component: dynamicWrapper(app, ['deal', 'rent'], () => import('@/routes/Rent/List')),
    },
    '/digital/newspaper/list': {
      component: dynamicWrapper(app, ['digital'], () => import('@/routes/Digital/Newspaper/List')),
    },
    '/digital/newspaper/info': {
      component: dynamicWrapper(app, ['digital'], () => import('@/routes/Digital/Newspaper/Info')),
    },
    '/digital/newspaper/info/music': {
      component: dynamicWrapper(app, ['digital'], () => import('@/routes/Digital/Newspaper/Info/Music')),
    },
    '/digital/newspaper/info/version': {
      component: dynamicWrapper(app, ['digital'], () => import('@/routes/Digital/Newspaper/Info/Version')),
    },
    '/digital/newspaper/info/column': {
      component: dynamicWrapper(app, ['digital'], () => import('@/routes/Digital/Newspaper/Info/Column')),
    },
    '/digital/newspaper/type': {
      component: dynamicWrapper(app, ['digital'], () => import('@/routes/Digital/Newspaper/Type')),
    },
    '/sys/syscompany': {
      component: dynamicWrapper(app, ['company'], () => import('@/routes/Sys/Company')),
    },
    '/sys/sysuser': {
      component: dynamicWrapper(app, ['pubticket'], () => import('@/routes/Sys/User')),
    },
    '/analysis/business/income': {
      component: dynamicWrapper(app, ['deal', 'analysis'], () => import('@/routes/Analysis/Business/Income')),
    },
    '/analysis/business/income/platform': {
      component: dynamicWrapper(app, [], () => import('@/routes/Analysis/Business/Income/Platform')),
    },
    '/analysis/business/income/biz': {
      component: dynamicWrapper(app, ['pubservice', 'pubwithdraw'], () =>
        import('@/routes/Analysis/Business/Income/Biz')
      ),
    },
    '/analysis/business/income/composite': {
      component: dynamicWrapper(app, ['pubservice'], () => import('@/routes/Analysis/Business/Income/Composite')),
    },
    '/analysis/business/summary': {
      component: dynamicWrapper(app, ['deal', 'analysis'], () => import('@/routes/Analysis/Business/Summary')),
    },
    '/analysis/business/summary/platform': {
      component: dynamicWrapper(app, ['pubplatform', 'pubticket'], () =>
        import('@/routes/Analysis/Business/Summary/Platform')
      ),
    },
    '/analysis/business/summary/serviceuser': {
      component: dynamicWrapper(app, ['pubserviceuser'], () =>
        import('@/routes/Analysis/Business/Summary/ServiceUser')
      ),
    },
    '/analysis/business/summary/pubservice': {
      component: dynamicWrapper(app, ['pubservice', 'pubuser'], () =>
        import('@/routes/Analysis/Business/Summary/PubService')
      ),
    },
    '/analysis/business/summary/item': {
      component: dynamicWrapper(app, ['pubitem', 'store'], () => import('@/routes/Analysis/Business/Summary/Item')),
    },
    '/analysis/business/summary/spticket': {
      component: dynamicWrapper(app, ['pubticket'], () => import('@/routes/Analysis/Business/Summary/SpTicket')),
    },
    '/analysis/business/summary/ticket': {
      component: dynamicWrapper(app, ['pubticket'], () => import('@/routes/Analysis/Business/Summary/Ticket')),
    },
    '/analysis/business/summary/signup': {
      component: dynamicWrapper(app, ['pubsignup'], () => import('@/routes/Analysis/Business/Summary/Signup')),
    },
    '/analysis/business/summary/rent': {
      component: dynamicWrapper(app, ['rent'], () => import('@/routes/Analysis/Business/Summary/Rent')),
    },
    '/analysis/business/summary/course': {
      component: dynamicWrapper(app, ['pubcourse'], () => import('@/routes/Analysis/Business/Summary/Course')),
    },
    '/analysis/business/summary/pubaccount': {
      component: dynamicWrapper(app, ['pubaccount'], () => import('@/routes/Analysis/Business/Summary/PubAccount')),
    },
    '/analysis/business/summary/scan': {
      component: dynamicWrapper(app, [], () => import('@/routes/Analysis/Business/Summary/Scan')),
    },
    '/analysis/business/summary/credit': {
      component: dynamicWrapper(app, [], () => import('@/routes/Analysis/Business/Summary/Credit')),
    },
    '/analysis/business/detail': {
      component: dynamicWrapper(app, ['pubservice', 'deal', 'analysis'], () =>
        import('@/routes/Analysis/Business/Detail')
      ),
    },
    '/analysis/business/detail/item': {
      component: dynamicWrapper(app, ['pubitem'], () => import('@/routes/Analysis/Business/Detail/Item')),
    },
    '/analysis/business/detail/ticket': {
      component: dynamicWrapper(app, ['pubticket'], () => import('@/routes/Analysis/Business/Detail/Ticket')),
    },
    '/analysis/business/detail/serviceuser': {
      component: dynamicWrapper(app, ['pubserviceuser'], () => import('@/routes/Analysis/Business/Detail/ServiceUser')),
    },
    '/analysis/business/detail/pubservice': {
      component: dynamicWrapper(app, [], () => import('@/routes/Analysis/Business/Detail/PubService')),
    },
    '/analysis/business/detail/rent': {
      component: dynamicWrapper(app, ['rent'], () => import('@/routes/Analysis/Business/Detail/Rent')),
    },
    '/analysis/business/detail/course': {
      component: dynamicWrapper(app, ['pubcourse'], () => import('@/routes/Analysis/Business/Detail/Course')),
    },
    '/analysis/business/detail/spticket': {
      component: dynamicWrapper(app, ['pubticket'], () => import('@/routes/Analysis/Business/Detail/SpTicket')),
    },
    '/analysis/business/detail/platform': {
      component: dynamicWrapper(app, ['pubplatform'], () => import('@/routes/Analysis/Business/Detail/Platform')),
    },
    '/analysis/business/detail/signup': {
      component: dynamicWrapper(app, ['pubsignup'], () => import('@/routes/Analysis/Business/Detail/Signup')),
    },
    '/analysis/business/detail/pubaccount': {
      component: dynamicWrapper(app, ['pubaccount'], () => import('@/routes/Analysis/Business/Detail/PubAccount')),
    },
    '/analysis/business/detail/scan': {
      component: dynamicWrapper(app, [], () => import('@/routes/Analysis/Business/Detail/Scan')),
    },
    '/analysis/business/detail/credit': {
      component: dynamicWrapper(app, [], () => import('@/routes/Analysis/Business/Detail/Credit')),
    },
    '/analysis/finance/detail': {
      component: dynamicWrapper(app, ['deal', 'pubservice', 'analysis'], () =>
        import('@/routes/Analysis/Finance/Detail')
      ),
    },
    '/analysis/finance/summary': {
      component: dynamicWrapper(app, [], () => import('@/routes/Analysis/Finance/Summary')),
    },
    '/analysis/finance/summary/paymode': {
      component: dynamicWrapper(app, ['deal', 'analysis'], () => import('@/routes/Analysis/Finance/Summary/PayMode')),
    },
    '/analysis/finance/summary/pubaccount': {
      component: dynamicWrapper(app, ['deal', 'pubuser'], () => import('@/routes/Analysis/Finance/Summary/PubAccount')),
    },
    '/analysis/finance/summary/balance': {
      component: dynamicWrapper(app, [], () => import('@/routes/Analysis/Finance/Summary/Balance')),
    },
    '/analysis/finance/tpdetail': {
      component: dynamicWrapper(app, ['payment'], () => import('@/routes/Analysis/Finance/ThirdPartyDetail')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('@/routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('@/routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('@/routes/Exception/500')),
    },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuKeysDataMapping = getFlatMenuData(getMenuData());

  const routerData = {};

  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    let menuKey = Object.keys(menuKeysDataMapping).find(key => pathToRegexp(path).test(`${key}`)) || null;
    const inherited = menuKey == null;
    if (menuKey == null) {
      menuKey = findMenuKey(menuKeysDataMapping, path);
    }
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuKeysDataMapping[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
      inherited,
    };
    routerData[path] = router;
  });

  routerDataCache = routerData;
  return routerData;
}
