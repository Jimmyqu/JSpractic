import { Card, Button } from 'antd';
import classNames from 'classnames';
import Result from '@/components/Result';
import { formatMoney } from '@/utils/format';
import style from './index.less';

export default ({ currentPaymentState, onBack }) => {
  const { dealPayState, payMoney } = currentPaymentState || {};
  return (
    <Card bordered={false}>
      <Result
        type="error"
        title={dealPayState}
        extra={<div className={classNames('text-center', style.amountNum)}>{formatMoney(payMoney)}元</div>}
        actions={
          <Button type="primary" onClick={onBack}>
            返回
          </Button>
        }
        description="请核对支付信息"
      />
    </Card>
  );
};
