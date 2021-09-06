import { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Input, Radio } from 'antd';
import Content from '@/components/Datatable/Content';
import { formItemLayoutNormal } from '@/utils/utils';

@connect(({ pubserviceuser, loading }) => ({
  pubserviceuser,
  editing: loading.effects['pubserviceuser/editAuditNodeGroupUser'],
}))
@Form.create()
class EditContent extends Component {
  doSure = () => {
    const { form, dispatch, sure = () => {}, selectedRows } = this.props;
    const selectedRow = (selectedRows || [])[0] || {};
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      await dispatch({
        type: 'pubserviceuser/editAuditNodeGroupUser',
        payload: {
          ...formData,
          id: selectedRow.id,
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
      edit,
      //
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      ...restProps
    } = this.props;

    const { getFieldDecorator } = form;

    const selectedRow = (selectedRows || [])[0] || {};
    return (
      <Content
        title="编辑审核人"
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
              <Form.Item label="是否接受通知">
                {getFieldDecorator('receiveMessage', {
                  initialValue: selectedRow.receiveMessage,
                  rules: [
                    {
                      required: true,
                      message: '请选择审核后是否发送通知',
                    },
                  ],
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              <Form.Item label="备注">
                {getFieldDecorator('descr', {
                  initialValue: selectedRow.descr,
                })(<Input.TextArea placeholder="请填写" autoSize />)}
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Content>
    );
  }
}

export default EditContent;
