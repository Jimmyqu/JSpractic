import { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Select, Input } from 'antd';
import Content from '@/components/Datatable/Content';
import { formItemLayoutNormal } from '@/utils/utils';

@connect(({ company, loading }) => ({
  company,
  authing: loading.effects['company/auth'],
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
        type: 'company/auth',
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
      authing,
      company: { AuditStatus },
      //
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      ...restProps
    } = this.props;

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
                    <Select.Option value={AuditStatus.Success.key}>通过</Select.Option>
                    <Select.Option value={AuditStatus.Back.key}>驳回</Select.Option>
                    <Select.Option value={AuditStatus.Failed.key}>未通过</Select.Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="备注">
                {form.getFieldDecorator('reviewDescr')(<Input.TextArea placeholder="请填写" />)}
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Content>
    );
  }
}

export default EditContent;
