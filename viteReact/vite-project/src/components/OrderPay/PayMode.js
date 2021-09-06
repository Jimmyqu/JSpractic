import { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { CDN_STATIC_HOST } from '@/utils/utils';
import styles from './paymode.less';

@connect(({ deal }) => ({
  deal,
}))
class PayWayTypes extends Component {
  handleSelect = mode => {
    const { onSelect } = this.props;
    if (onSelect) {
      onSelect(mode);
    }
  };

  render() {
    const { mode, deal, popover } = this.props;
    const { PayWayTypes: dealPayMode } = deal;

    const cls = classNames(styles.mode, {
      [styles.popover]: popover,
    });
    switch (mode) {
      case dealPayMode.GROUP.key:
        return (
          <div className={cls} onClick={() => this.handleSelect(mode)}>
            <img className="img-max" alt="组合支付" src={`${CDN_STATIC_HOST}/images/cloud/pay-model/pay-group.png`} />
            <div>{dealPayMode.GROUP.value}</div>
          </div>
        );
      case dealPayMode.WECHAT.key:
        return (
          <div className={cls} onClick={() => this.handleSelect(mode)}>
            <img className="img-max" alt="微信支付" src={`${CDN_STATIC_HOST}/images/cloud/pay-model/pay-wechat.png`} />
            <div>{dealPayMode.WECHAT.value}</div>
          </div>
        );
      case dealPayMode.ZFB.key:
        return (
          <div className={cls} onClick={() => this.handleSelect(mode)}>
            <img
              className="img-max"
              alt="支付宝支付"
              src={`${CDN_STATIC_HOST}/images/cloud/pay-model/pay-alipay.png`}
            />
            <div>{dealPayMode.ZFB.value}</div>
          </div>
        );
      case dealPayMode.CASH.key:
        return (
          <div className={cls} onClick={() => this.handleSelect(mode)}>
            <img className="img-max" alt="现金支付" src={`${CDN_STATIC_HOST}/images/cloud/pay-model/pay-cash.png`} />
            <div>{dealPayMode.CASH.value}</div>
          </div>
        );
      default:
    }
    return null;
  }
}

export default PayWayTypes;
