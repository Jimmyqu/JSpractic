import { useDispatch } from 'react-redux';
import { push, goBack } from 'connected-react-router';
import { Button, Card } from 'antd';
import Result from '@/components/Result';
import AuthTabsPageHeaderLayout from '@/layouts/AuthTabsPageHeaderLayout';

export default props => {
  const dispatch = useDispatch();
  const { location, match } = props;
  const { id } = match.params || {};
  const invalid = !/^\d+$/.test(id);
  if (invalid) {
    return (
      <Card bordered={false}>
        <Result
          type="error"
          title="错误"
          description="会员id参数错误"
          actions={
            <Button type="primary" onClick={() => dispatch(goBack())}>
              返回
            </Button>
          }
        />
      </Card>
    );
  }
  return (
    <AuthTabsPageHeaderLayout
      {...props}
      authScopePath="/basic/pub/info"
      indexPath="/basic/pub/info/:id"
      getTabActiveKey={() => location.pathname.replace(`${match.path.replace(':id', id)}/`, '')}
      tabBarExtraContent={
        <Button type="primary" onClick={() => dispatch(push('../nav'))}>
          返回
        </Button>
      }
      tabList={[
        {
          key: 'base',
          tab: '基本信息',
        },
        {
          key: 'amountflow',
          tab: '账户流水',
          auth: 'tab-amountflow',
        },
        {
          key: 'dealflow',
          tab: '订单记录',
          auth: 'tab-dealflow',
        },
        {
          key: 'service',
          tab: '可用服务',
          auth: 'tab-service',
        },
        {
          key: 'serviceflow',
          tab: '服务流水',
          auth: 'tab-serviceflow',
        },
        {
          key: 'feeflow',
          tab: '积分流水',
          auth: 'tab-feeflow',
        },
        {
          key: 'amounttopup',
          tab: '充值/提现',
          auth: 'tab-amounttopup',
        },
        {
          key: 'feetopup',
          tab: '积分充值',
          auth: 'tab-feetopup',
        },
        {
          key: 'credit',
          tab: '白条',
          auth: 'tab-credit',
        },
        {
          key: 'invoice',
          tab: '发票',
          auth: 'tab-invoice',
        },
        {
          key: 'contact',
          tab: '人员/学员',
          auth: 'tab-contact',
        },
      ]}
    />
  );
};
