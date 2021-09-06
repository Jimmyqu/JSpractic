import { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Select, Input } from 'antd';
import Content from '@/components/Datatable/Content';
import { formItemLayoutNormal } from '@/utils/utils';

@connect(({ pubserviceuser, loading }) => ({
  pubserviceuser,
  authing: loading.effects['pubserviceuser/auditcertUser'],
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
        type: 'pubserviceuser/auditcertUser',
        payload: {
          ...formData,
          certDataListId: selectedRows[0].id,
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
      authing,
      stateList,
      pubserviceuser: { AuditNodeTypes },
      //
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      ...restProps
    } = this.props;

    const availableStateList = stateList || [];
    return (
      <Content
        title="审核"
        {...restProps}
        buttons={[
          {
            text: '取消',
            disabled: authing,
            action: cancel,
          },
          {
            text: '确定',
            type: 'primary',
            disabled: availableStateList.length === 0,
            loading: authing,
            action: this.doSure,
          },
        ]}
      >
        <Row>
          <Col md={12}>
            <Form {...formItemLayoutNormal}>
              <Form.Item label="审核">
                {form.getFieldDecorator('auditState', {
                  rules: [
                    {
                      required: true,
                      message: '请选择审核状态',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    {Object.values(AuditNodeTypes)
                      .filter(item => availableStateList.includes(item.key))
                      .map(item => (
                        <Select.Option key={item.key} value={item.key}>
                          {item.value}
                        </Select.Option>
                      ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="备注">
                {form.getFieldDecorator('descr')(<Input.TextArea placeholder="请填写" />)}
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Content>
    );
  }
}

export default EditContent;
