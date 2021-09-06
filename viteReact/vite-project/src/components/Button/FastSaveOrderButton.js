import { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Popover, Button, Form } from 'antd';
import { formItemLayoutNormal } from '@/utils/utils';
import { sub } from '@/commons/lib/math';
import { formatMoney, decodeMoney, encodeMoney } from '@/utils/format';
import AmountColor from '../Amount/Color';
import AmountInput from '../Amount/Input';
import Model from '../Modal';
import PayMode from '../OrderPay/PayMode';
import styles from './index.less';

@connect(({ deal, venue }) => ({
  deal,
  venue,
}))
@Form.create()
class FastSaveOrderButton extends Component {
  state = {
    popoverVisible: false,
    confirmVisible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'deal/fetchSupportPayModes',
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleSelect = mode => {
    const {
      onSummary,
      deal: { PayWayTypes },
      totalPrice,
    } = this.props;
    this.handlePopoverVisibleChange(false);
    if (mode === PayWayTypes.CASH.key) {
      this.handleModelVisibleChange(true);
      return;
    }
    onSummary(mode, 0, totalPrice);
  };

  onSure = ({ deepCallOk }) => {
    const {
      form,
      onSummary,
      deal: { PayWayTypes },
      totalPrice,
    } = this.props;
    const { validateFields } = form;
    validateFields((err, { transactionTotalPrice }) => {
      if (err) {
        return;
      }
      deepCallOk(() =>
        onSummary(PayWayTypes.CASH.key, sub(encodeMoney(transactionTotalPrice), totalPrice), totalPrice)
      );
    });
    return false;
  };

  handlePopoverVisibleChange = visible => {
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      popoverVisible: visible,
    });
  };

  handleModelVisibleChange = visible => {
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      confirmVisible: visible,
    });
  };

  render() {
    const {
      form,
      deal: { PayModesCacheMapping },
      venue: { currentVenue },
      className,
      onSummary,
      totalPrice,
      children,
      dispatch,
      limitPayModes,
      popover = true,
      ...rest
    } = this.props;
    const { getFieldDecorator } = form;
    const { popoverVisible, confirmVisible } = this.state;

    // 所有支付方式从后台返回 包括现金
    const availablePayModes = [...(PayModesCacheMapping[currentVenue?.id] || [])];

    const usedPayModes =
      Array.isArray(limitPayModes) && limitPayModes.length > 0
        ? availablePayModes.filter(key => limitPayModes.includes(key))
        : availablePayModes;

    const minShowPrice = decodeMoney(totalPrice);

    const model = (
      <Model
        title="快速结算"
        visible={confirmVisible}
        onVisibleChange={this.handleModelVisibleChange}
        onOk={this.onSure}
        footer={[
          <Button key="cancel" link="cancel">
            关闭
          </Button>,
          // 非现金的结算不需要使用价格，所以不处理
          <Button key="ok" link="ok" disabled={totalPrice == null}>
            {totalPrice == null ? '订单金额无效' : '确认选择'}
          </Button>,
        ]}
      >
        <Form {...formItemLayoutNormal}>
          <Form.Item label="应收¥">
            <AmountColor inputSize>{formatMoney(totalPrice)}</AmountColor>
          </Form.Item>
          <Form.Item label="实收¥">
            {getFieldDecorator('transactionTotalPrice', {
              initialValue: minShowPrice,
              rules: [
                {
                  message: '实收应不小于应收金额',
                  validator(rule, value, fn) {
                    if (value == null || value.toString().trim().length === 0 || value < minShowPrice) {
                      fn([new Error('invalid')]);
                      return;
                    }
                    fn();
                  },
                },
              ],
            })(<AmountInput fullWidth min={minShowPrice} precision={2} size="large" />)}
          </Form.Item>
        </Form>
      </Model>
    );

    const content = (
      <div
        className={classNames(
          'text-center',
          {
            [styles.flexModeWrapper]: !popover,
          },
          className
        )}
      >
        {usedPayModes.map(mode => (
          <PayMode key={mode} mode={mode} popover={popover} onSelect={this.handleSelect} />
        ))}
        {!popover && model}
      </div>
    );

    if (!popover) {
      return content;
    }
    return (
      <>
        <Popover
          title="请选择支付方式"
          trigger="click"
          autoAdjustOverflow={false}
          // https://github.com/ant-design/ant-design/issues/25318
          visible={rest.disabled || rest.loading ? false : popoverVisible}
          onVisibleChange={this.handlePopoverVisibleChange}
          content={content}
        >
          <Button type="danger" {...rest}>
            {children}
          </Button>
        </Popover>
        {model}
      </>
    );
  }
}

export default FastSaveOrderButton;
