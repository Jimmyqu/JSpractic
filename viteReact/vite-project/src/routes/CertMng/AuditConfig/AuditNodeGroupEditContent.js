import { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Input, Select } from 'antd';
import Content from '@/components/Datatable/Content';
import { formItemLayoutNormal } from '@/utils/utils';

@connect(({ pubserviceuser, loading }) => ({
  pubserviceuser,
  editing:
    loading.effects['pubserviceuser/editAuditNodeGroup'] || loading.effects['pubserviceuser/batchSaveAuditNodeGroup'],
}))
@Form.create()
class EditContent extends Component {
  doSure = () => {
    const { form, dispatch, sure = () => {}, selectedRows, edit } = this.props;
    const selectedRow = (selectedRows || [])[0] || {};
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      await (edit
        ? dispatch({
            type: 'pubserviceuser/editAuditNodeGroup',
            payload: {
              ...formData,
              id: selectedRow.id,
            },
          })
        : dispatch({
            type: 'pubserviceuser/batchSaveAuditNodeGroup',
            payload: formData,
          }));
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
        title={`${edit ? '编辑' : '添加'}分组`}
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
              <Form.Item label="审核分组">
                {edit
                  ? getFieldDecorator('groupName', {
                      initialValue: selectedRow.groupName,
                      rules: [
                        {
                          required: true,
                          message: '请选择审核分组',
                        },
                      ],
                    })(<Input placeholder="请输入分组名称" />)
                  : getFieldDecorator('groupNames', {
                      rules: [
                        {
                          required: true,
                          message: '请选择审核分组',
                        },
                      ],
                    })(<Select mode="tags" placeholder="多个分组名称，输入后回车键入" />)}
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
