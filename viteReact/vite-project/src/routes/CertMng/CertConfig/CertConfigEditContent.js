import { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Row, Col, Form, Input, Select, DatePicker, InputNumber, Radio } from 'antd';
import Content from '@/components/Datatable/Content';
import { formItemLayoutNormal, clearHMS } from '@/utils/utils';
import { decodeMoney, encodeMoney } from '@/utils/format';

@connect(({ pubserviceuser, pubservice, pubuser, venue, loading }) => ({
  pubserviceuser,
  pubservice,
  pubuser,
  venue,
  editing: loading.effects['pubserviceuser/editCertCfg'],
  fetching: loading.effects['pubserviceuser/getCertCfgById'],
}))
@Form.create()
class EditContent extends Component {
  state = {
    record: {},
  };

  async componentDidMount() {
    const { dispatch, selectedRows, edit } = this.props;
    if (!edit) {
      return;
    }
    const result = await dispatch({
      type: 'pubserviceuser/getCertCfgById',
      payload: ((selectedRows || [])[0] || {}).id,
    });
    this.setState({
      record: result || {},
    });
  }

  doSure = () => {
    const { form, dispatch, sure = () => {}, edit } = this.props;
    const { record } = this.state;
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      const { tiemRange, certTiemRange, certPrice, ...formValues } = formData;
      if (edit) {
        formValues.id = record.id;
      }
      if (certTiemRange) {
        formValues.certValidStartDate = certTiemRange[0] ? certTiemRange[0].valueOf() : null;
        formValues.certValidEndDate = certTiemRange[1] ? certTiemRange[1].valueOf() : null;
      }
      await dispatch({
        type: 'pubserviceuser/editCertCfg',
        payload: {
          ...formValues,
          startTime: tiemRange[0] ? tiemRange[0].valueOf() : null,
          endTime: tiemRange[1] ? tiemRange[1].valueOf() : null,
          certPrice: encodeMoney(certPrice),
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
      pubserviceuser,
      pubuser,
      pubservice,
      venue,
      edit,
      //
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      ...restProps
    } = this.props;
    const { record } = this.state;

    const { CertFlowNodes, CertCfgStates, UserTypes, CertNumberRule } = pubserviceuser;
    const { ServiceTypes } = pubservice;
    const { Industries, Careers, ProfessionTypes } = venue;

    const { getFieldValue } = form;

    const selectedRow = edit ? record : {};

    const certFlow = getFieldValue('certFlow') || selectedRow.certFlows || [];
    const certType = getFieldValue('certValidType');
    const certValidType = certType >= 0 ? certType : selectedRow.certValidType;

    // 表格查询里的dataRelated 字段没有值，单独查的才有
    const specialDisabled = edit && selectedRow.dataRelated;
    return (
      <Content
        title={`${edit ? '编辑' : '添加'}认证配置`}
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
        <Form {...formItemLayoutNormal}>
          <Row>
            <Col md={8}>
              <Form.Item label="认证流程类型">
                {form.getFieldDecorator('certFlow', {
                  initialValue: selectedRow.certFlows,
                  rules: [
                    {
                      required: true,
                      message: '请选择认证流程类型',
                    },
                  ],
                })(
                  <Select placeholder="请选择" mode="multiple" disabled={specialDisabled}>
                    {Object.values(CertFlowNodes)
                      .filter(item => {
                        switch (item.key) {
                          case CertFlowNodes.AutoPublish.key:
                            return !certFlow.includes(CertFlowNodes.ManualPublish.key);
                          case CertFlowNodes.ManualPublish.key:
                            return !certFlow.includes(CertFlowNodes.AutoPublish.key);
                          default:
                            return true;
                        }
                      })
                      .map(item => (
                        <Select.Option key={item.key} value={item.key}>
                          {item.value}
                        </Select.Option>
                      ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="行业">
                {form.getFieldDecorator('industryId', {
                  initialValue: selectedRow.industryId,
                  rules: [
                    {
                      required: true,
                      message: '请选择行业',
                    },
                  ],
                })(
                  <Select placeholder="请选择" disabled={specialDisabled}>
                    {Object.values(Industries).map(item => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.value}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="职业">
                {form.getFieldDecorator('careerId', {
                  initialValue: selectedRow.careerId,
                  rules: [
                    {
                      required: true,
                      message: '请选择职业',
                    },
                  ],
                })(
                  <Select placeholder="请选择" disabled={specialDisabled}>
                    {Object.values(Careers).map(item => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.value}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="专业项目">
                {form.getFieldDecorator('professionalId', {
                  initialValue: selectedRow.professionalId,
                  rules: [
                    {
                      required: true,
                      message: '请选择专业',
                    },
                  ],
                })(
                  <Select placeholder="请选择" disabled={specialDisabled}>
                    {Object.values(ProfessionTypes).map(item => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.value}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="认证标题">
                {form.getFieldDecorator('certTitle', {
                  initialValue: selectedRow.certTitle,
                  rules: [
                    {
                      required: true,
                      message: '请填写标题',
                    },
                  ],
                })(<Input placeholder="请填写" />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="申请时间">
                {form.getFieldDecorator('tiemRange', {
                  initialValue: [
                    selectedRow.startTime ? moment(selectedRow.startTime) : undefined,
                    selectedRow.endTime ? moment(selectedRow.endTime) : undefined,
                  ],
                  rules: [
                    {
                      required: true,
                      message: '请选择申请时间',
                    },
                  ],
                })(
                  <DatePicker.RangePicker
                    // format="YYYY-MM-DD"
                    placeholder={['请选择申请开始时间', '请选择申请结束时间']}
                    disabledDate={value => clearHMS(value).valueOf() < clearHMS(Date.now()).valueOf()}
                  />
                )}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="认证金额">
                {form.getFieldDecorator('certPrice', {
                  initialValue: decodeMoney(selectedRow.certPrice),
                  rules: [
                    {
                      required: true,
                      message: '请填写认证金额',
                    },
                  ],
                })(<InputNumber min={0} precision={2} placeholder="请填写" className="full-width" />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="认证简介">
                {form.getFieldDecorator('certIntroduce', {
                  initialValue: selectedRow.certIntroduce,
                })(<Input placeholder="请填写" />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="备注">
                {form.getFieldDecorator('descr', {
                  initialValue: selectedRow.descr,
                })(<Input placeholder="请填写" />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="排序">
                {form.getFieldDecorator('ranks', {
                  initialValue: selectedRow.ranks,
                })(<InputNumber precision={0} placeholder="请填写" className="full-width" />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="状态">
                {form.getFieldDecorator('certState', {
                  initialValue: selectedRow.certState,
                  rules: [
                    {
                      required: true,
                      message: '请选择状态',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    {Object.values(CertCfgStates).map(item => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.value}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="是否可重新认证">
                {form.getFieldDecorator('recertification', {
                  initialValue: selectedRow.recertification,
                  rules: [
                    {
                      required: true,
                      message: '请选择',
                    },
                  ],
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="提交后提醒">
                {form.getFieldDecorator('certAlert', {
                  initialValue: selectedRow.certAlert,
                })(<Input.TextArea placeholder="请填写" autoSize />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="用户类型">
                {form.getFieldDecorator('certType', {
                  initialValue: selectedRow.certType,
                  rules: [
                    {
                      required: true,
                      message: '请选择用户类型',
                    },
                  ],
                })(
                  <Select placeholder="请选择" disabled={specialDisabled}>
                    {Object.values(UserTypes).map(item => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.value}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="有效期类型">
                {form.getFieldDecorator('certValidType', {
                  initialValue: selectedRow.certValidType,
                  rules: [
                    {
                      required: true,
                      message: '请选择有效期类型',
                    },
                  ],
                })(
                  <Select placeholder="请选择" disabled={specialDisabled}>
                    {Object.values(ServiceTypes).map(item => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.value}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="证书编号生成方式">
                {form.getFieldDecorator('certNoGenMode', {
                  initialValue: selectedRow.certNoGenMode,
                  rules: [
                    {
                      required: true,
                      message: '请选择',
                    },
                  ],
                })(
                  <Radio.Group>
                    {Object.values(CertNumberRule).map(item => (
                      <Radio key={item.key} value={item.key}>
                        {item.value}
                      </Radio>
                    ))}
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
            {certValidType === ServiceTypes.DYNAMICINVISIBLE.key && (
              <Col md={8}>
                <Form.Item label="有效天数">
                  {form.getFieldDecorator('certValidDate', {
                    initialValue: selectedRow.certValidDate,
                    rules: [
                      {
                        required: true,
                        message: '请填写有效天数',
                        type: 'number',
                      },
                      {
                        message: '请填写有效天数',
                        validator: (rule, value, fn) => {
                          if (value <= 0) {
                            fn([new Error('invalid')]);
                            return;
                          }
                          fn();
                        },
                      },
                    ],
                  })(<InputNumber placeholder="请填写" className="full-width" />)}
                </Form.Item>
              </Col>
            )}
            {certValidType === ServiceTypes.FIXATIONINVISIBLE.key && (
              <Col md={8}>
                <Form.Item label="有效期时间">
                  {form.getFieldDecorator('certTiemRange', {
                    initialValue: [
                      selectedRow.certValidStartDate ? moment(selectedRow.certValidStartDate) : undefined,
                      selectedRow.certValidEndDate ? moment(selectedRow.certValidEndDate) : undefined,
                    ],
                    rules: [
                      {
                        required: true,
                        message: '请选择有效期时间',
                      },
                    ],
                  })(
                    <DatePicker.RangePicker
                      placeholder={['开始时间', '结束时间']}
                      disabledDate={value => clearHMS(value).valueOf() < clearHMS(Date.now()).valueOf()}
                    />
                  )}
                </Form.Item>
              </Col>
            )}
          </Row>
        </Form>
      </Content>
    );
  }
}

export default EditContent;
