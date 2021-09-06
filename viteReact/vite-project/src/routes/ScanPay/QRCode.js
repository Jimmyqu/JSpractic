import { Card } from 'antd';
import { CDN_STATIC_HOST } from '@/utils/utils';
import { formatPayPlatform } from '@/utils/format';

export default ({ loading, selectPaymodeInfo, currentPayment: cp }) => {
  const currentPayment = cp || {};
  return (
    <Card title="收款二维码" loading={loading} className="text-center">
      <div>{selectPaymodeInfo.payAccount}</div>
      <img
        className="img-max"
        src={currentPayment.codeUrl || `${CDN_STATIC_HOST}/themes/cloud/images/ewm-1.jpg`}
        alt="qr code"
      />
      {cp && (
        <div className="text-center" style={{ padding: '15px 0 60px' }}>
          请顾客打开
          {formatPayPlatform(selectPaymodeInfo.payPlatform)}
          APP扫描上方二维码完成支付
        </div>
      )}
    </Card>
  );
};
