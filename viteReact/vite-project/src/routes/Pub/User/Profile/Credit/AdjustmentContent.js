import { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Select, Input } from 'antd';
import Content from '@/components/Datatable/Content';
import AmountInput from '@/components/Amount/Input';
import { encodeMoney, decodeMoney } from '@/utils/format';
import { formItemLayoutNormal } from '@/utils/utils';

@connect(({ pubuser, loading }) => ({
  pubuser,
  adjustmenting: loading.effects['pubuser/adjustmentCreditQuota'],
}))
@Form.create()
class AdjustmentContent extends Component {
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
      await dispatch({
        type: 'pubuser/adjustmentCreditQuota',
        payload: {
          ...formData,
          publicAccountId,
          creditValue: encodeMoney(formData.creditValue),
        },
      });
      sure();
    });
  };

  handleCreditTypeChange = () => {
    const { form } = this.props;
    form.setFieldsValue({
      creditValue: 0,
    });
  };

  render() {
    const {
      form,
      dispatch,
      cancel,
      sure,
      adjustmenting,
      match: { params },
      pubuser,
      //
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      ...restProps
    } = this.props;

    const { id: pubAccountId } = params || {};
    const { userInfoCache = {}, CreditTypes } = pubuser;
    const viewUserInfo = userInfoCache[pubAccountId] || {};
    const { publicAccount = {} } = viewUserInfo || {};

    const creditType = form.getFieldValue('creditType');
    return (
      <Content
        title="调整额度"
        {...restProps}
        buttons={[
          {
            text: '取消',
            disabled: adjustmenting,
            action: cancel,
          },
          {
            text: '确定',
            type: 'primary',
            loading: adjustmenting,
            action: this.doSure,
          },
        ]}
      >
        <Row>
          <Col md={12}>
            <Form {...formItemLayoutNormal}>
              <Form.Item label="调整额度方式">
                {form.getFieldDecorator(
                  'creditType',
                  {}
                )(
                  <Select placeholder="请选择" onChange={this.handleCreditTypeChange}>
                    {Object.values(CreditTypes)
                      .filter(item => item === CreditTypes.ADD || item === CreditTypes.SUB)
                      .map(item => (
                        <Select.Option value={item.key} key={item.key}>
                          {item.value}
                        </Select.Option>
                      ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="调整幅度">
                {form.getFieldDecorator('creditValue', {
                  initialValue: 0,
                  rules: [
                    {
                      message: '调整额度必须大于0',
                      validator(rule, value, fn) {
                        if (value > 0) {
                          fn();
                          return;
                        }
                        fn([new Error('invalid')]);
                      },
                    },
                  ],
                })(
                  <AmountInput
                    fullWidth
                    min={0}
                    max={creditType === CreditTypes.SUB.key ? decodeMoney(publicAccount.creditBalance) : undefined}
                    precision={2}
                    placeholder="请填写"
                  />
                )}
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

export default AdjustmentContent;
