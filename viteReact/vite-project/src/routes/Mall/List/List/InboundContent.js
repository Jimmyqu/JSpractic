import { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Select, InputNumber, Input } from 'antd';
import Content from '@/components/Datatable/Content';
import AmountInput from '@/components/Amount/Input';
import { decodeMoney, encodeMoney } from '@/utils/format';
import { formItemLayoutNormal } from '@/utils/utils';

@connect(({ venue, store, loading }) => ({
  venue,
  store,
  deleting: loading.effects['store/delete'],
  inbounding: loading.effects['store/addNum'],
}))
@Form.create()
class Inbound extends Component {
  doSure = () => {
    const { form, dispatch, sure = () => {}, selectedRows } = this.props;
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      await dispatch({
        type: 'store/addNum',
        payload: {
          ...formData,
          marketPrice: encodeMoney(formData.marketPrice),
          salesPrice: encodeMoney(formData.salesPrice),
          buyPrice: encodeMoney(formData.buyPrice),
          itemId: selectedRows[0].id,
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
      deleting,
      inbounding,
      store,
      venue: { list },
      //
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      ...restProps
    } = this.props;
    return (
      <Content
        title="商品入库"
        {...restProps}
        buttons={[
          {
            text: '取消',
            disabled: inbounding || deleting,
            action: cancel,
          },
          {
            text: '确定',
            type: 'primary',
            loading: inbounding || deleting,
            action: this.doSure,
          },
        ]}
      >
        <Row>
          <Col md={12}>
            <Form {...formItemLayoutNormal}>
              <Form.Item label="仓库">
                {form.getFieldDecorator('salesId', {
                  rules: [
                    {
                      required: true,
                      message: '请选择仓库',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    {list.map(item => (
                      <Select.Option value={item.id} key={item.id}>
                        {item.salesName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
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
              <Form.Item label="数量">
                {form.getFieldDecorator('stockCount', {
                  initialValue: 0,
                  rules: [
                    {
                      message: '入库数量必须大于0',
                      validator(rule, value, fn) {
                        if (value > 0) {
                          fn();
                          return;
                        }
                        fn([new Error('invalid')]);
                      },
                    },
                  ],
                })(<InputNumber placeholder="请填写" min={0} precision={0} />)}
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

export default Inbound;
