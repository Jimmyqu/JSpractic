import { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Row, Col, Form, Input, DatePicker, InputNumber, Select, Radio } from 'antd';
import Content from '@/components/Datatable/Content';
import { formItemLayoutNormal, clearHMS } from '@/utils/utils';

@connect(({ pubserviceuser, loading }) => ({
  pubserviceuser,
  editing: loading.effects['pubserviceuser/editAuditCfg'],
  fetching: loading.effects['pubserviceuser/fetchCertCfgListForSelect'],
}))
@Form.create()
class EditContent extends Component {
  state = {
    certCfgList: [],
  };

  async componentDidMount() {
    const { dispatch } = this.props;
    const result = await dispatch({
      type: 'pubserviceuser/fetchCertCfgListForSelect',
    });
    this.setState({
      certCfgList: result || [],
    });
  }

  doSure = () => {
    const { form, dispatch, sure = () => {}, selectedRows, edit } = this.props;
    const selectedRow = (selectedRows || [])[0] || {};
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      const { tiemRange, ...formValues } = formData;
      if (edit) {
        formValues.id = selectedRow.id;
      }
      await dispatch({
        type: 'pubserviceuser/editAuditCfg',
        payload: {
          ...formValues,
          startTime: tiemRange[0] ? clearHMS(tiemRange[0]).valueOf() : null,
          endTime: tiemRange[1] ? clearHMS(tiemRange[1]).add('1', 'days').valueOf() : null,
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
      dataId,
      pubserviceuser,
      //
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      ...restProps
    } = this.props;
    const { certCfgList } = this.state;

    const { getFieldDecorator } = form;

    const selectedRow = edit ? (selectedRows || [])[0] || {} : { dataId };

    return (
      <Content
        title={`${edit ? '编辑' : '添加'}审核配置`}
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
              <Form.Item label="审核标题">
                {getFieldDecorator('auditTitle', {
                  initialValue: selectedRow.auditTitle,
                  rules: [
                    {
                      required: true,
                      message: '请填写审核标题',
                    },
                  ],
                })(<Input placeholder="请填写" />)}
              </Form.Item>
              <Form.Item label="认证配置">
                {getFieldDecorator('certConfigId', {
                  initialValue: selectedRow.dataId,
                  rules: [
                    {
                      required: true,
                      message: '请选择认证配置',
                    },
                  ],
                })(
                  <Select placeholder="请填写">
                    {certCfgList.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.certTitle}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="审核时间">
                {getFieldDecorator('tiemRange', {
                  initialValue: [
                    selectedRow.startTime ? moment(selectedRow.startTime) : undefined,
                    selectedRow.endTime
                      ? (() => {
                          // 与列表里的格式化处理呼应
                          const mmt = clearHMS(selectedRow.endTime);
                          if (mmt.valueOf() === selectedRow.endTime) {
                            return mmt.subtract('1', 'days');
                          }
                          return mmt;
                        })()
                      : undefined,
                  ],
                  rules: [
                    {
                      required: true,
                      message: '请填写审核标题',
                    },
                  ],
                })(
                  <DatePicker.RangePicker
                    // format="YYYY-MM-DD"
                    placeholder={['请选择审核开始时间', '请选择审核结束时间']}
                    disabledDate={value => clearHMS(value).valueOf() < clearHMS(Date.now()).valueOf()}
                  />
                )}
              </Form.Item>
              <Form.Item label="是否可越级审核">
                {getFieldDecorator('skip', {
                  initialValue: selectedRow.skip,
                  rules: [
                    {
                      required: true,
                      message: '请选择是否允许越级审核',
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
