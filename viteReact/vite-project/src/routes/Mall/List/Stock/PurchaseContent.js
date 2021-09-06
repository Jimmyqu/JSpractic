import { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, InputNumber, Input } from 'antd';
import Content from '@/components/Datatable/Content';
import AmountInput from '@/components/Amount/Input';
import { formItemLayoutNormal } from '@/utils/utils';
import { decodeMoney, encodeMoney } from '@/utils/format';

@connect(({ store, loading }) => ({
  store,
  purchasing: loading.effects['store/purchaseNum'],
}))
@Form.create()
class PurchaseContent extends Component {
  doSure = () => {
    const { form, dispatch, sure = () => {}, selectedRows } = this.props;
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      await dispatch({
        type: 'store/purchaseNum',
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
      purchasing,
      //
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      ...restProps
    } = this.props;
    return (
      <Content
        title="进货"
        {...restProps}
        buttons={[
          {
            text: '取消',
            disabled: purchasing,
            action: cancel,
          },
          {
            text: '确定',
            type: 'primary',
            loading: purchasing,
            action: this.doSure,
          },
        ]}
      >
        <Row>
          <Col md={12}>
            <Form {...formItemLayoutNormal}>
              <Form.Item label="商品编号">
                <Input value={selectedRows[0].itemId} disabled readOnly />
              </Form.Item>
              <Form.Item label="商品名称">
                <Input value={selectedRows[0].itemName} disabled readOnly />
              </Form.Item>
              <Form.Item label="单位">
                <Input value={selectedRows[0].stockUnit} disabled readOnly />
              </Form.Item>
              <Form.Item label="当前库存">
                <Input value={selectedRows[0].stockCount} disabled readOnly />
              </Form.Item>
              <Form.Item label="销售单价">
                {form.getFieldDecorator('salesPrice', {
                  initialValue: decodeMoney(selectedRows[0].salesPrice),
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
                  initialValue: decodeMoney(selectedRows[0].buyPrice),
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
                  initialValue: decodeMoney(selectedRows[0].marketPrice),
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
              <Form.Item label="进货数量">
                {form.getFieldDecorator('num', {
                  initialValue: 0,
                  rules: [
                    {
                      message: '进货数量必须大于0',
                      validator(rule, value, fn) {
                        if (value > 0) {
                          fn();
                          return;
                        }
                        fn([new Error('invalid')]);
                      },
                    },
                  ],
                })(<InputNumber placeholder="请填写" className="full-width" min={0} precision={0} />)}
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

export default PurchaseContent;
