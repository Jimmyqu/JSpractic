import AuthTabsPageHeaderLayout from '@/layouts/AuthTabsPageHeaderLayout';

export default props => (
  <AuthTabsPageHeaderLayout
    {...props}
    authScopePath="/analysis/business/income"
    tabList={[
      {
        key: 'platform',
        tab: '营销中心收入汇总',
        auth: 'tab-platform',
      },
      {
        key: 'biz',
        tab: '业务收入汇总',
        auth: 'tab-biz',
      },
      {
        key: 'composite',
        tab: '综合收入汇总',
        auth: 'tab-composite',
      },
    ]}
  />
);
