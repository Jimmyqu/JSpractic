import { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Select, Input } from 'antd';
import Content from '@/components/Datatable/Content';
import { checkMobile } from '@/commons/lib/validator';
import { formItemLayoutNormal } from '@/utils/utils';

@connect(({ user, loading }) => ({
  user,
  editing: loading.effects['user/editOrNew'],
}))
@Form.create()
class EditContent extends Component {
  doSure = () => {
    const { form, dispatch, sure = () => {}, selectedRows } = this.props;
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      await dispatch({
        type: 'user/editOrNew',
        payload: {
          ...formData,
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
      editing,
      user: { Roles, UserStatus },
      //
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      ...restProps
    } = this.props;

    return (
      <Content
        title="编辑"
        {...restProps}
        buttons={[
          {
            text: '取消',
            disabled: editing,
            action: cancel,
          },
          {
            text: '确定',
            type: 'primary',
            loading: editing,
            action: this.doSure,
          },
        ]}
      >
        <Row>
          <Col md={12}>
            <Form {...formItemLayoutNormal}>
              <Form.Item label="姓名">
                {form.getFieldDecorator('realName', {
                  initialValue: selectedRows[0].realName,
                  rules: [
                    {
                      required: true,
                      message: '请填写姓名',
                    },
                  ],
                })(<Input placeholder="请填写" />)}
              </Form.Item>
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
              <Form.Item label="手机号">
                {form.getFieldDecorator('mobile', {
                  initialValue: selectedRows[0].mobile,
                  rules: [
                    {
                      required: true,
                      message: '请填写手机号',
                    },
                    {
                      min: 11,
                      max: 11,
                      message: '请输入合法的手机号码!',
                      validator: checkMobile,
                    },
                  ],
                })(<Input placeholder="请填写" />)}
              </Form.Item>
              <Form.Item label="用户类型">
                {form.getFieldDecorator('superAdmin', {
                  initialValue: selectedRows[0].superAdmin,
                  rules: [
                    {
                      required: true,
                      message: '请选择用户类型',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    {[Roles.user, Roles.authadmin].map(item => (
                      <Select.Option value={item.key} key={item.key}>
                        {item.value}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="状态">
                {form.getFieldDecorator('state', {
                  initialValue: selectedRows[0].state,
                  rules: [
                    {
                      required: true,
                      message: '请选择状态',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    {Object.values(UserStatus).map(item => (
                      <Select.Option value={item.key} key={item.key}>
                        {item.value}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="备注">
                {form.getFieldDecorator('descr', {
                  initialValue: selectedRows[0].descr,
                })(<Input.TextArea placeholder="请填写" />)}
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Content>
    );
  }
}

export default EditContent;
