import AuthTabsPageHeaderLayout from '@/layouts/AuthTabsPageHeaderLayout';

export default props => (
  <AuthTabsPageHeaderLayout
    {...props}
    authScopePath="/analysis/finance/summary"
    tabList={[
      {
        key: 'paymode',
        tab: '按支付方式汇总',
        auth: 'tab-paymode',
      },
      {
        key: 'pubaccount',
        tab: '账户汇总',
        auth: 'tab-pubaccount',
      },
      {
        key: 'balance',
        tab: '账户总结余',
        auth: 'tab-balance',
      },
    ]}
  />
);
