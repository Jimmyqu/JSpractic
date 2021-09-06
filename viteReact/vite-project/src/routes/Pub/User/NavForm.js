import { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Form, Input, Button } from 'antd';
import { isMobile } from '@/utils/utils';
import { modal } from '@/utils/feedback';

@connect(({ loading }) => ({
  newSaving: loading.effects['pubuser/createUser'],
}))
@Form.create()
class NavForm extends Component {
  handleFormSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields({ force: true }, async (err, fieldsValue) => {
      if (err) {
        return;
      }
      const { dispatch } = this.props;
      const params = fieldsValue;
      const result = await dispatch({
        type: 'pubuser/createUser',
        payload: params,
        dispatch,
      });
      if (result) {
        modal.confirm('新增会员成功，是否立即充值？', {
          onOk() {
            dispatch(push(`/basic/pub/info/${result.id}/amounttopup`));
          },
          onCancel() {
            dispatch(push(`/basic/pub/info/${result.id}`));
          },
        });
      }
    });
  };

  render() {
    const { form, newSaving } = this.props;
    const { getFieldDecorator } = form;
    const mobileRules = [
      {
        required: true,
        message: '请填写手机号',
      },
      {
        message: '请填写合法的手机号',
        validator(rule, value, fn) {
          if (!isMobile(value)) {
            fn([new Error('invalid')]);
            return;
          }
          fn();
        },
      },
    ];
    const userNameRules = [
      {
        message: '请填写会员姓名',
        validator(rule, value, fn) {
          const error = value == null || value.trim().length === 0;
          if (error) {
            fn([new Error('invalid')]);
            return;
          }
          fn();
        },
      },
    ];
    return (
      <Form onSubmit={this.handleFormSubmit}>
        <Form.Item>
          {getFieldDecorator('realName', {
            rules: userNameRules,
          })(<Input placeholder="会员姓名" />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('mobile', {
            rules: mobileRules,
          })(<Input placeholder="手机号" />)}
        </Form.Item>

        <Form.Item className="text-center">
          <Button type="primary" htmlType="submit" loading={newSaving} style={{ minWidth: 200 }}>
            添加
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default NavForm;
