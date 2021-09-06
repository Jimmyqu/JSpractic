import { Component } from 'react';
import { Card, Form, Input, Button, InputNumber, message } from 'antd';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { formatMoney, encodeMoney } from '@/utils/format';
import { postTopUpFee } from '@/services/pubuser';

@connect(({ pubuser }) => ({
  pubuser,
}))
@Form.create()
class ProfileAmountTopUp extends Component {
  formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
      md: { span: 10 },
    },
  };

  submitFormLayout = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 10, offset: 7 },
    },
  };

  state = {
    submiting: false,
  };

  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { id: pubAccountId } = params || {};
    dispatch({
      type: 'pubuser/fetch',
      payload: pubAccountId,
    });
  }

  toTopUp = e => {
    e.preventDefault();
    const {
      form,
      match: { params },
      dispatch,
    } = this.props;
    const { id: pubAccountId } = params || {};
    form.validateFieldsAndScroll(async (err, formValues) => {
      if (err) {
        return;
      }
      this.setState({
        submiting: true,
      });
      const formData = {
        ...formValues,
        fee: encodeMoney(formValues.fee),
      };
      try {
        await postTopUpFee({
          ...formData,
          pubAccountId,
        });
      } finally {
        this.setState({
          submiting: false,
        });
      }

      message.success('积分充值成功');
      dispatch({
        type: 'pubuser/addFeeForCacheUser',
        payload: {
          key: pubAccountId,
          fee: formData.fee,
        },
      });
      dispatch(push('./'));
    });
  };

  render() {
    const {
      form,
      pubuser,
      match: { params },
    } = this.props;
    const { id: pubAccountId } = params || {};
    const { getFieldDecorator } = form;
    const { userInfoCache = {} } = pubuser;
    const viewUserInfo = userInfoCache[pubAccountId] || {};
    // const { publicAccount = {}, publicUserBasic = {} } = viewUserInfo;
    const { publicAccount = {} } = viewUserInfo;
    const { submiting } = this.state;

    return (
      <Card>
        <Form {...this.formItemLayout} onSubmit={this.toTopUp}>
          <Form.Item label="账户名">
            <Input disabled value={publicAccount.realName} />
          </Form.Item>
          <Form.Item label="可用积分">
            <Input disabled value={formatMoney(publicAccount.accountFee)} />
          </Form.Item>
          <Form.Item label="充值积分">
            {getFieldDecorator('fee', {
              initialValue: 0,
              rules: [
                {
                  required: true,
                  message: '请填写充值积分值',
                },
              ],
            })(<InputNumber min={0} precision={2} className="full-width" />)}
          </Form.Item>
          <Form.Item label="备注">{getFieldDecorator('descr', {})(<Input.TextArea rows={4} />)}</Form.Item>
          <Form.Item {...this.submitFormLayout}>
            <Button type="primary" htmlType="submit" loading={submiting}>
              充值
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}

export default ProfileAmountTopUp;
