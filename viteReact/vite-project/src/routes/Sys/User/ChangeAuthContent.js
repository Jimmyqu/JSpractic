import { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Select, Input } from 'antd';
import Content from '@/components/Datatable/Content';
import { formItemLayoutNormal } from '@/utils/utils';

@connect(({ user, loading }) => ({
  user,
  changeAuthIng: loading.effects['user/changeAuth'],
  rolesLoading: loading.effects['user/fetchRoles'],
}))
@Form.create()
class ChangeAuthContent extends Component {
  componentDidMount() {
    const { dispatch, selectedRows } = this.props;
    dispatch({
      type: 'user/fetchRoles',
      payload: selectedRows[0].companyId,
    });
  }

  doSure = () => {
    const { form, dispatch, sure = () => {}, selectedRows } = this.props;
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      await dispatch({
        type: 'user/changeAuth',
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
      changeAuthIng,
      rolesLoading,
      user: { rolesMapping },
      //
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      ...restProps
    } = this.props;

    return (
      <Content
        title="授权"
        {...restProps}
        buttons={[
          {
            text: '取消',
            loading: rolesLoading,
            disabled: changeAuthIng,
            action: cancel,
          },
          {
            text: '确定',
            type: 'primary',
            loading: changeAuthIng || rolesLoading,
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
              <Form.Item label="角色">
                {form.getFieldDecorator('roleIds', {
                  initialValue: selectedRows[0].roleIds || undefined,
                  rules: [
                    {
                      required: true,
                      message: '请选择角色',
                    },
                  ],
                })(
                  <Select mode="multiple" placeholder="请选择">
                    {(rolesMapping[selectedRows[0].companyId] || []).map(item => (
                      <Select.Option value={item.id} key={item.id}>
                        {item.text}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Content>
    );
  }
}

export default ChangeAuthContent;
