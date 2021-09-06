import AuthTabsPageHeaderLayout from '@/layouts/AuthTabsPageHeaderLayout';

export default props => (
  <AuthTabsPageHeaderLayout
    {...props}
    searchAlive={['mediaName']}
    authScopePath="/digital/newspaper/info"
    tabList={[
      {
        key: 'music',
        tab: '音乐',
        auth: 'tab-music',
      },
      {
        key: 'version',
        tab: '版次',
        auth: 'tab-version',
      },
      {
        key: 'column',
        tab: '版名/栏目',
        auth: 'tab-column',
      },
    ]}
  />
);
