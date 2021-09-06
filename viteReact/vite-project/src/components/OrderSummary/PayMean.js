import { Component } from 'react';
import { Radio, InputNumber, Checkbox, Row, Col } from 'antd';
import classNames from 'classnames';
import { connect } from 'react-redux';
import AmountInputWapper from '@/components/Amount/InputWapper';
import { encodeMoney, decodeMoney, formatModel } from '@/utils/format';
import { CDN_STATIC_HOST } from '@/utils/utils';
import Icon from '@/components/Icon';
import style from './index.less';

@connect(({ deal }) => ({
  deal,
}))
class PayMean extends Component {
  render() {
    const {
      data,
      deal: { PayWayTypes },
      checked,
      disabled,
      value,
      min,
      max,
      onChange = () => {},
      onChecked = () => {},
    } = this.props;
    const mode = { key: data?.payWay, payAccount: data?.payAccount };
    const { payWayShowName } = data;
    const imgcls = classNames('img-max', style.paymodeImg);
    const payWayName = formatModel(PayWayTypes, +mode.key);
    return (
      <Row>
        <Col md={12}>
          <div className={style.inputLeft}>
            {mode.key === PayWayTypes.ACCOUNT.key ? (
              <Checkbox
                checked={disabled ? false : checked}
                onChange={e => onChecked(e.target.checked)}
                disabled={disabled}
              >
                <img
                  className={imgcls}
                  alt={payWayName}
                  src={`${CDN_STATIC_HOST}/images/cloud/pay-model/pay-balance.png`}
                />
                {payWayName}
              </Checkbox>
            ) : (
              <Radio
                checked={disabled ? false : checked}
                onChange={e => onChecked(disabled ? false : e.target.checked)}
                disabled={disabled}
              >
                {(() => {
                  switch (mode.key) {
                    case PayWayTypes.GROUP.key:
                      return <Icon type="mixedpay2" />;
                    case PayWayTypes.WECHAT.key:
                      return (
                        <img
                          className={imgcls}
                          alt={payWayName}
                          src={`${CDN_STATIC_HOST}/images/cloud/pay-model/pay-wechat.png`}
                        />
                      );
                    case PayWayTypes.ZFB.key:
                      return (
                        <img
                          className={imgcls}
                          alt={payWayName}
                          src={`${CDN_STATIC_HOST}/images/cloud/pay-model/pay-alipay.png`}
                        />
                      );
                    case PayWayTypes.CASH.key:
                      return (
                        <img
                          className={imgcls}
                          alt={payWayName}
                          src={`${CDN_STATIC_HOST}/images/cloud/pay-model/pay-cash.png`}
                        />
                      );
                    case PayWayTypes.BANKCARD.key:
                      return (
                        <img
                          className={imgcls}
                          alt={payWayName}
                          src={`${CDN_STATIC_HOST}/images/cloud/pay-model/pay-unipay.png`}
                        />
                      );
                    case PayWayTypes.BANKTRANSFER.key:
                      return (
                        <img
                          className={imgcls}
                          alt={payWayName}
                          src={`${CDN_STATIC_HOST}/images/cloud/pay-model/pay-card.png`}
                        />
                      );
                    case PayWayTypes.CREDIT.key:
                      return (
                        <img
                          className={imgcls}
                          alt={payWayName}
                          src={`${CDN_STATIC_HOST}/images/cloud/pay-model/pay-sign.png`}
                        />
                      );
                    case PayWayTypes.POINTS.key:
                      return (
                        <img
                          className={imgcls}
                          alt={payWayName}
                          src={`${CDN_STATIC_HOST}/images/cloud/pay-model/pay-bonus-points.png`}
                        />
                      );
                    default:
                      return null;
                  }
                })()}
                <span className={style.payName}>{payWayShowName || `${payWayName}支付`}</span>
              </Radio>
            )}
            <span className={style.inputLeftTips}>
              {mode.key === PayWayTypes.WECHAT.key || mode.key === PayWayTypes.ZFB.key ? `${mode.payAccount}` : null}
            </span>
          </div>
        </Col>
        <Col md={12}>
          <AmountInputWapper className={style.input}>
            <InputNumber
              size="large"
              min={Math.max(0, decodeMoney(min))}
              max={Math.max(0, decodeMoney(max))}
              precision={2}
              disabled={!checked}
              value={decodeMoney(value)}
              onChange={v => onChange(encodeMoney(v))}
            />
          </AmountInputWapper>
        </Col>
      </Row>
    );
  }
}

export default PayMean;
