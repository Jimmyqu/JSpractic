import { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Select, Input } from 'antd';
import Content from '@/components/Datatable/Content';
import AmountInput from '@/components/Amount/Input';
import { encodeMoney } from '@/utils/format';
import { formItemLayoutNormal } from '@/utils/utils';

@connect(({ pubuser, venue, loading }) => ({
  pubuser,
  venue,
  payBacking: loading.effects['pubuser/payBackCredit'],
}))
@Form.create()
class PaybackContent extends Component {
  doSure = () => {
    const {
      form,
      match: { params },
      dispatch,
      sure = () => {},
    } = this.props;
    const { id: publicAccountId } = params || {};
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      const result = await dispatch({
        type: 'pubuser/payBackCredit',
        payload: {
          ...formData,
          publicAccountId,
          creditValue: encodeMoney(formData.creditValue),
        },
      });
      sure(result);
    });
  };

  render() {
    const {
      form,
      dispatch,
      cancel,
      sure,
      payBacking,
      match,
      pubuser,
      venue: { list },
      //
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      ...restProps
    } = this.props;

    return (
      <Content
        title="调整额度"
        {...restProps}
        buttons={[
          {
            text: '取消',
            disabled: payBacking,
            action: cancel,
          },
          {
            text: '确定',
            type: 'primary',
            loading: payBacking,
            action: this.doSure,
          },
        ]}
      >
        <Row>
          <Col md={12}>
            <Form {...formItemLayoutNormal}>
              <Form.Item label="营销中心">
                {form.getFieldDecorator('salesId', {
                  rules: [
                    {
                      required: true,
                      message: '请选择营销中心',
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
              <Form.Item label="还款额度">
                {form.getFieldDecorator('creditValue', {
                  initialValue: 0,
                  rules: [
                    {
                      message: '还款额度必须大于0',
                      validator(rule, value, fn) {
                        if (value > 0) {
                          fn();
                          return;
                        }
                        fn([new Error('invalid')]);
                      },
                    },
                  ],
                })(<AmountInput fullWidth min={0} precision={2} placeholder="请填写" />)}
              </Form.Item>
              <Form.Item label="备注">
                {form.getFieldDecorator('descr', {
                  // initialValue:
                })(<Input.TextArea placeholder="请填写" />)}
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Content>
    );
  }
}

export default PaybackContent;
