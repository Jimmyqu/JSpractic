import AuthTabsPageHeaderLayout from '@/layouts/AuthTabsPageHeaderLayout';

export default props => (
  <AuthTabsPageHeaderLayout
    {...props}
    authScopePath="/basic/msgmanage/notice"
    tabList={[
      {
        key: 'system',
        tab: '系统消息',
        auth: 'tab-system',
      },
      {
        key: 'short',
        tab: '短信消息',
        auth: 'tab-short',
      },
      {
        key: 'wechat',
        tab: '微信消息',
        auth: 'tab-wechat',
      },
    ]}
  />
);
