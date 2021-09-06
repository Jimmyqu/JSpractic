import { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Input } from 'antd';
import Content from '@/components/Datatable/Content';
import { formItemLayoutNormal } from '@/utils/utils';
import { RSAEncrypt } from '@/commons/lib/security';

@connect(({ user, loading }) => ({
  user,
  changePwdIng: loading.effects['user/changepwd'],
}))
@Form.create()
class ChangePwdContent extends Component {
  doSure = () => {
    const { form, dispatch, sure = () => {}, selectedRows } = this.props;
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      await dispatch({
        type: 'user/changepwd',
        payload: {
          ...formData,
          qPwd: RSAEncrypt(formData.qPwd),
          pwd: RSAEncrypt(formData.pwd),
          id: selectedRows[0].id,
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
      changePwdIng,
      user,
      //
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      ...restProps
    } = this.props;

    return (
      <Content
        title="修改密码"
        {...restProps}
        buttons={[
          {
            text: '取消',
            disabled: changePwdIng,
            action: cancel,
          },
          {
            text: '确定',
            type: 'primary',
            loading: changePwdIng,
            action: this.doSure,
          },
        ]}
      >
        <Row>
          <Col md={12}>
            <Form {...formItemLayoutNormal}>
              <Form.Item label="邮箱">
                {form.getFieldDecorator('email', {
                  initialValue: selectedRows[0].email,
                  rules: [
                    {
                      required: true,
                      message: '请填写邮箱',
                    },
                  ],
                })(<Input placeholder="请填写" />)}
              </Form.Item>
              <Form.Item label="新密码">
                {form.getFieldDecorator('pwd', {
                  rules: [
                    {
                      required: true,
                      message: '请填写新密码',
                    },
                  ],
                })(<Input.Password placeholder="请填写" />)}
              </Form.Item>
              <Form.Item label="确定密码">
                {form.getFieldDecorator('qPwd', {
                  rules: [
                    {
                      required: true,
                      message: '请填写确定密码',
                    },
                    {
                      message: '两次密码不一致',
                      validator: (rule, value, fn) => {
                        if (value === form.getFieldValue('pwd')) {
                          fn();
                          return;
                        }
                        fn([new Error('invalid')]);
                      },
                    },
                  ],
                })(<Input.Password placeholder="请填写" />)}
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Content>
    );
  }
}

export default ChangePwdContent;
