import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Input, Checkbox, Button } from 'antd';
import AmountColor from '@/components/Amount/Color';
import MarginBar from '@/components/MarginBar';
import { add, mul } from '@/commons/lib/math';
import { formatMoney } from '@/utils/format';
import styles from './index.less';

@connect(({ loading }) => ({
  scanning: loading.effects['global/wxScan'],
}))
class Cart extends Component {
  static contextTypes = {
    scanQRCode: PropTypes.func,
  };

  state = {
    scanValue: '',
  };

  componentDidMount() {
    if (this.barCodeNode) {
      this.barCodeNode.focus();
    }
  }

  handleScanSearch = (value, e) => {
    this.setState({
      scanValue: '',
    });
    // 扫码枪回车
    const { onBarCodeScan } = this.props;
    if (e.keyCode === 13) {
      onBarCodeScan(value);
      return;
    }
    const { scanQRCode } = this.context;
    // 调起微信扫码
    if (scanQRCode(onBarCodeScan)) {
      return;
    }
    onBarCodeScan(value);
  };

  handleScanChange = e => {
    this.setState({
      scanValue: e.target.value,
    });
  };

  handleRemove = () => {
    const { onChange, itemList, checkedIds } = this.props;
    if (onChange) {
      const mapping = {};
      itemList?.forEach(({ id, ...item }) => {
        // 选中的表示删除
        if ((checkedIds || []).includes(id)) {
          return;
        }
        mapping[id] = item;
      });
      onChange(mapping);
    }
  };

  render() {
    const {
      loading,
      scanning,
      disabled,
      headerExtra,
      footerExtra,
      enterButton = '确定',
      itemList: list,
      checkedIds,
      onCheckAllChange,
      children,
    } = this.props;
    const { scanValue } = this.state;

    const itemList = list || [];
    const checkedItemIds = checkedIds || [];

    const totalPrice = (itemList || []).reduce((prev, { num, price }) => add(prev, mul(num || 0, price || 0)), 0);
    return (
      <div className={styles.cart}>
        <div className={styles.header}>
          <div className={styles.barcode}>
            <Input.Search
              placeholder="请扫码或输入条码"
              onSearch={this.handleScanSearch}
              enterButton={enterButton}
              value={scanValue}
              onChange={this.handleScanChange}
              disabled={disabled}
              loading={loading || scanning}
              ref={node => {
                this.barCodeNode = node;
              }}
            />
          </div>
          {headerExtra}
        </div>
        <div className={styles.body}>{children}</div>
        <div className={styles.footer}>
          <div className={styles.counter}>
            <div>
              <Checkbox
                indeterminate={checkedItemIds.length > 0 && checkedItemIds.length < itemList.length}
                checked={itemList.length > 0 && checkedItemIds.length === itemList.length}
                onChange={onCheckAllChange}
              >
                全选
              </Checkbox>
            </div>
            <div>
              合计: <AmountColor className={styles.price}>￥{formatMoney(totalPrice)}</AmountColor>
            </div>
          </div>
          {checkedItemIds.length > 0 && (
            <MarginBar top={16}>
              <Button type="danger" onClick={this.handleRemove}>
                删除
              </Button>
            </MarginBar>
          )}
          {footerExtra ? <MarginBar top>{footerExtra}</MarginBar> : null}
        </div>
      </div>
    );
  }
}

export default Cart;
