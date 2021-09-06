import AuthTabsPageHeaderLayout from '@/layouts/AuthTabsPageHeaderLayout';

export default props => (
  <AuthTabsPageHeaderLayout
    {...props}
    authScopePath="/analysis/business/detail"
    tabList={[
      {
        key: 'platform',
        tab: '场地',
        auth: 'tab-platform',
      },
      {
        key: 'serviceuser',
        tab: '服务人员',
        auth: 'tab-serviceuser',
      },
      {
        key: 'item',
        tab: '商品',
        auth: 'tab-item',
      },
      {
        key: 'spticket',
        tab: '场地票务',
        auth: 'tab-spticket',
      },
      {
        key: 'ticket',
        tab: '活动票务',
        auth: 'tab-ticket',
      },
      {
        key: 'pubservice',
        tab: '会员服务',
        auth: 'tab-pubservice',
      },
      {
        key: 'signup',
        tab: '报名',
        auth: 'tab-signup',
      },
      {
        key: 'rent',
        tab: '租赁',
        auth: 'tab-rent',
      },
      {
        key: 'course',
        tab: '课程',
        auth: 'tab-course',
      },
      {
        key: 'pubaccount',
        tab: '账户充值',
        auth: 'tab-pubaccount',
      },
      {
        key: 'scan',
        tab: '扫码',
        auth: 'tab-scan',
      },
      {
        key: 'credit',
        tab: '白条',
        auth: 'tab-credit',
      },
    ]}
  />
);
