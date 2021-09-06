import { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Input, InputNumber, Select, Radio } from 'antd';
import Content from '@/components/Datatable/Content';
import { formItemLayoutNormal } from '@/utils/utils';

@connect(({ pubserviceuser, loading }) => ({
  pubserviceuser,
  editing: loading.effects['pubserviceuser/editAuditNode'],
  fetching: loading.effects['pubserviceuser/fetchAuditNodeGroupListForSelect'],
}))
@Form.create()
class EditContent extends Component {
  state = {
    auditNodeGroupList: [],
  };

  async componentDidMount() {
    const { dispatch, auditConfigId } = this.props;
    const result = await dispatch({
      type: 'pubserviceuser/fetchAuditNodeGroupListForSelect',
      payload: auditConfigId,
    });
    this.setState({
      auditNodeGroupList: result || [],
    });
  }

  doSure = () => {
    const { form, dispatch, sure = () => {}, selectedRows, edit, auditConfigId } = this.props;
    const selectedRow = (selectedRows || [])[0] || {};
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      const { ...formValues } = formData;
      if (edit) {
        formValues.id = selectedRow.id;
      }
      await dispatch({
        type: 'pubserviceuser/editAuditNode',
        payload: {
          ...formValues,
          configId: auditConfigId,
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
      fetching,
      edit,
      pubserviceuser,
      //
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      ...restProps
    } = this.props;
    const { AuditNodeTypes } = pubserviceuser;
    const { auditNodeGroupList } = this.state;

    const { getFieldDecorator } = form;

    const selectedRow = (selectedRows || [])[0] || {};
    return (
      <Content
        title={`${edit ? '编辑' : '添加'}审核流程`}
        loading={fetching}
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
              <Form.Item label="审核节点标题">
                {getFieldDecorator('auditTitle', {
                  initialValue: selectedRow.auditTitle,
                  rules: [
                    {
                      required: true,
                      message: '请填写审核节点标题',
                    },
                  ],
                })(<Input placeholder="请填写" />)}
              </Form.Item>
              <Form.Item label="审核分组">
                {getFieldDecorator('groupId', {
                  initialValue: selectedRow.groupId,
                  rules: [
                    {
                      required: true,
                      message: '请选择审核分组',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    {auditNodeGroupList.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.groupName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="审核节点">
                {getFieldDecorator('auditType', {
                  initialValue: selectedRow.auditType,
                  rules: [
                    {
                      required: true,
                      message: '请选择认证配置',
                    },
                  ],
                })(
                  <Select placeholder="请填写" mode="multiple">
                    {Object.values(AuditNodeTypes).map(item => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.value}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="审核后发送通知">
                {getFieldDecorator('sendMessage', {
                  initialValue: selectedRow.sendMessage,
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
              <Form.Item label="排序">
                {form.getFieldDecorator('ranks', {
                  initialValue: selectedRow.ranks,
                })(<InputNumber precision={0} placeholder="请填写" className="full-width" />)}
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
