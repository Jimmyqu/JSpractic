import { Card, Button, Descriptions } from 'antd';
import Result from '@/components/Result';
import MarginBar from '@/components/MarginBar';
import { formatMoney } from '@/utils/format';
import style from './index.less';

export default ({ currentPayment, currentPaymentState, onBack, onToDealDetail, onPrint }) => {
  const { opUser } = currentPayment || {};
  const { payMoney } = currentPaymentState || {};
  return (
    <Card bordered={false}>
      <Result
        type="success"
        title="支付成功"
        extra={
          <div className="text-center">
            <div className={style.amountNum}>{formatMoney(payMoney)}元</div>
            {/* 不同订单需要展示不同内容时添加在这里 */}
            {opUser && (
              <MarginBar top>
                <Descriptions column={1}>
                  <Descriptions.Item label="会员">{opUser}(散客结算)</Descriptions.Item>
                </Descriptions>
              </MarginBar>
            )}
          </div>
        }
        actions={
          <>
            <Button type="primary" onClick={onBack}>
              返回
            </Button>
            <Button onClick={onToDealDetail}>查看订单详情</Button>
            <Button onClick={onPrint}>打 印</Button>
          </>
        }
        description={`收款方：${currentPaymentState.receiptSalesName || ''}`}
      />
    </Card>
  );
};
