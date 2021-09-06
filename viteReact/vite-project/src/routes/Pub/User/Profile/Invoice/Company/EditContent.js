import { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Input } from 'antd';
import Content from '@/components/Datatable/Content';
import { formItemLayoutNormal } from '@/utils/utils';

@connect(({ pubinvoice, loading }) => ({
  pubinvoice,
  editing: loading.effects['pubinvoice/save'],
}))
@Form.create()
class EditContent extends Component {
  doSure = () => {
    const { form, dispatch, sure = () => {}, selectedRows, edit, pubAccountId } = this.props;
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      const formValue = {
        ...formData,
        pubAccountId,
      };
      if (edit) {
        formValue.id = selectedRows[0].id;
      }
      const result = await dispatch({
        type: 'pubinvoice/save',
        payload: formValue,
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
      edit,
      pubinvoice,
      editing,
      //
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      ...restProps
    } = this.props;

    const selectedRow = edit ? selectedRows[0] : {};

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
              <Form.Item label="发票抬头">
                {form.getFieldDecorator('invoiceName', {
                  initialValue: selectedRow.invoiceName,
                  rules: [
                    {
                      required: true,
                      message: '请填写发票抬头',
                    },
                  ],
                })(<Input placeholder="请填写" />)}
              </Form.Item>
              <Form.Item label="税务登记证号">
                {form.getFieldDecorator('registerNo', {
                  initialValue: selectedRow.registerNo,
                })(<Input placeholder="请填写" />)}
              </Form.Item>
              <Form.Item label="开户银行">
                {form.getFieldDecorator('bankName', {
                  initialValue: selectedRow.bankName,
                })(<Input placeholder="请填写" />)}
              </Form.Item>
              <Form.Item label="开户账号">
                {form.getFieldDecorator('bankAccount', {
                  initialValue: selectedRow.bankAccount,
                })(<Input placeholder="请填写" />)}
              </Form.Item>
              <Form.Item label="单位注册地址">
                {form.getFieldDecorator('regAddress', {
                  initialValue: selectedRow.regAddress,
                })(<Input placeholder="请填写" />)}
              </Form.Item>
              <Form.Item label="单位电话">
                {form.getFieldDecorator('contact', {
                  initialValue: selectedRow.contact,
                })(<Input placeholder="格式:0755-12345678" />)}
              </Form.Item>
              <Form.Item label="收件邮箱">
                {form.getFieldDecorator('email', {
                  initialValue: selectedRow.email,
                  rules: [
                    {
                      type: 'email',
                      message: '请输入正确的邮件格式',
                    },
                  ],
                })(<Input placeholder="请填写" />)}
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Content>
    );
  }
}

export default EditContent;
