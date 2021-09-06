import { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, InputNumber, Input, Select } from 'antd';
import Content from '@/components/Datatable/Content';
import AmountInput from '@/components/Amount/Input';
import { formItemLayoutNormal } from '@/utils/utils';
import { decodeMoney, encodeMoney } from '@/utils/format';

@connect(({ store, venue, loading }) => ({
  store,
  venue,
  moving: loading.effects['store/moveNum'],
}))
@Form.create()
class TransferContent extends Component {
  doSure = () => {
    const { form, dispatch, sure = () => {}, selectedRows } = this.props;
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      await dispatch({
        type: 'store/moveNum',
        payload: {
          ...formData,
          marketPrice: encodeMoney(formData.marketPrice),
          salesPrice: encodeMoney(formData.salesPrice),
          buyPrice: encodeMoney(formData.buyPrice),
          itemStockId: selectedRows[0].id,
        },
      });
      sure();
    });
  };

  render() {
    const {
      form,
      dispatch,
      cancel,
      sure,
      store,
      venue: { list },
      moving,
      //
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      ...restProps
    } = this.props;
    const { itemId, itemName, stockUnit, salesName, stockCount, salesId, marketPrice, buyPrice, salesPrice } =
      (selectedRows || [])[0] || {};
    return (
      <Content
        title="调货"
        {...restProps}
        buttons={[
          {
            text: '取消',
            disabled: moving,
            action: cancel,
          },
          {
            text: '确定',
            type: 'primary',
            loading: moving,
            action: this.doSure,
          },
        ]}
      >
        <Row>
          <Col md={12}>
            <Form {...formItemLayoutNormal}>
              <Form.Item label="商品编号">
                <Input value={itemId} disabled readOnly />
              </Form.Item>
              <Form.Item label="商品名称">
                <Input value={itemName} disabled readOnly />
              </Form.Item>
              <Form.Item label="单位">
                <Input value={stockUnit} disabled readOnly />
              </Form.Item>
              <Form.Item label="当前仓库">
                <Input value={salesName} disabled readOnly />
              </Form.Item>
              <Form.Item label="当前库存">
                <Input value={stockCount} disabled readOnly />
              </Form.Item>
              <Form.Item label="商品调拨到">
                {form.getFieldDecorator('inSalesId', {
                  rules: [
                    {
                      required: true,
                      message: '请选择调拨到哪个仓库',
                    },
                  ],
                })(
                  <Select>
                    {list.map(
                      item =>
                        item.id !== salesId && (
                          <Select.Option value={item.id} key={item.id}>
                            {item.salesName}
                          </Select.Option>
                        )
                    )}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="销售单价">
                {form.getFieldDecorator('salesPrice', {
                  initialValue: decodeMoney(salesPrice),
                  rules: [
                    {
                      message: '价格无效',
                      validator(rule, value, fn) {
                        if (value >= 0) {
                          fn();
                          return;
                        }
                        fn([new Error('invalid')]);
                      },
                    },
                  ],
                })(<AmountInput fullWidth min={0} precision={2} />)}
              </Form.Item>
              <Form.Item label="进货价">
                {form.getFieldDecorator('buyPrice', {
                  initialValue: decodeMoney(buyPrice),
                  rules: [
                    {
                      message: '价格无效',
                      validator(rule, value, fn) {
                        if (value >= 0) {
                          fn();
                          return;
                        }
                        fn([new Error('invalid')]);
                      },
                    },
                  ],
                })(<AmountInput fullWidth min={0} precision={2} />)}
              </Form.Item>
              <Form.Item label="商品原价">
                {form.getFieldDecorator('marketPrice', {
                  initialValue: decodeMoney(marketPrice),
                  rules: [
                    {
                      message: '价格无效',
                      validator(rule, value, fn) {
                        if (value >= 0) {
                          fn();
                          return;
                        }
                        fn([new Error('invalid')]);
                      },
                    },
                  ],
                })(<AmountInput fullWidth min={0} precision={2} />)}
              </Form.Item>
              <Form.Item label="调拨数量">
                {form.getFieldDecorator('num', {
                  initialValue: 0,
                  rules: [
                    {
                      message: '调拨数量必须大于0',
                      validator(rule, value, fn) {
                        if (value > 0) {
                          fn();
                          return;
                        }
                        fn([new Error('invalid')]);
                      },
                    },
                  ],
                })(<InputNumber placeholder="请填写" className="full-width" min={0} max={stockCount} precision={0} />)}
              </Form.Item>
              <Form.Item label="备注">
                {form.getFieldDecorator('descr', {})(<Input.TextArea placeholder="请填写" />)}
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Content>
    );
  }
}

export default TransferContent;
