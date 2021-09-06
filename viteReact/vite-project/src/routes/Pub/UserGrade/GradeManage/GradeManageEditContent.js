import { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Row, Col, Form, Input, Select, DatePicker, Upload, Button, InputNumber, message } from 'antd';
import Content from '@/components/Datatable/Content';
import ColorPicker from '@/components/Form/FormItem/ColorPicker';
import { genUploadImgCustomRequest, FileAccept, formUploadOtherProps, fileMapper } from '@/utils/upload';
import { formItemLayoutNormal, getDayByTimeStamp } from '@/utils/utils';

@connect(({ pubservice, pubuser, loading }) => ({
  pubservice,
  pubuser,
  saving: loading.effects['pubuser/saveMemberLevel'],
  fetching: loading.effects['pubuser/getMemberLevelByLevelId'],
}))
@Form.create()
class EditContent extends Component {
  state = {
    data: {},
  };

  // eslint-disable-next-line react/destructuring-assignment
  customRequest = genUploadImgCustomRequest({ dispatch: this.props.dispatch });

  componentDidMount() {
    const { dispatch, edit, selectedRows } = this.props;
    dispatch({
      type: 'pubuser/fetchInterestsList',
    });

    if (edit) {
      dispatch({
        type: 'pubuser/getMemberLevelByLevelId',
        payload: selectedRows[0].memberLevelConfig.id,
      }).then(result => {
        this.setState({
          data: result,
        });
      });
    }
  }

  getPostFileKey = value => (Array.isArray(value) && value.length > 0 ? value[0].response : value.response);

  gradeList = () => {
    const list = [];
    for (let i = 1; i <= 10; i += 1) {
      list.push(i);
    }
    return list;
  };

  onFileChange = (name, { file }) => {
    if (file && file.status === 'done') {
      const { form } = this.props;
      setTimeout(() => {
        form.setFieldsValue({
          [name]: [file],
        });
      }, 0);
    }
  };

  doSure = () => {
    const { form, dispatch, sure = () => {}, edit } = this.props;
    const { data } = this.state;
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      const { levelPic, backdropPic, ...formValues } = formData;
      if (edit) {
        formValues.id = data.memberLevelConfig.id;
      }
      await dispatch({
        type: 'pubuser/saveMemberLevel',
        payload: {
          ...formValues,
          levelPic: this.getPostFileKey(levelPic),
          backdropPic: this.getPostFileKey(backdropPic),
        },
      });
      if (edit) {
        message.success('编辑成功');
      } else {
        message.success('添加成功');
      }
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
      saving,
      fetching,
      pubservice: { ServiceTypes },
      pubuser: { UserStatus, interestsList, srvList },
      edit,
      originUpgradeMode,
      ...restProps
    } = this.props;
    const { data } = this.state;
    const { memberLevelConfig = {}, backdropPic, equityInfo, levelPic } = edit ? data || {} : {};
    const { getFieldDecorator, getFieldValue } = form;
    const validType = getFieldValue('validType');
    const type = validType === 0 ? validType : validType || memberLevelConfig.validType;
    const isDynamicInVisible = type === ServiceTypes.DYNAMICINVISIBLE.key;
    const isFixationInVisible = type === ServiceTypes.FIXATIONINVISIBLE.key;
    return (
      <Content
        title={`${edit ? '编辑' : '添加'}`}
        loading={fetching}
        {...restProps}
        buttons={[
          {
            text: '取消',
            disabled: editing || saving,
            action: cancel,
          },
          {
            text: '确定',
            type: 'primary',
            loading: editing || saving,
            action: this.doSure,
          },
        ]}
      >
        <Form {...formItemLayoutNormal}>
          <Row>
            <Col md={8}>
              <Form.Item label="级别">
                {getFieldDecorator('levelWeight', {
                  initialValue: memberLevelConfig.levelWeight,
                  rules: [
                    {
                      required: true,
                      message: '请选择级别',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    {this.gradeList().map(item => (
                      <Select.Option key={item} value={item}>
                        {item}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="等级名称">
                {getFieldDecorator('levelName', {
                  initialValue: memberLevelConfig.levelName,
                  rules: [
                    {
                      required: true,
                      message: '请填写等级名称',
                    },
                  ],
                })(<Input placeholder="请填写" />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="有效期">
                {getFieldDecorator('validType', {
                  initialValue: memberLevelConfig.validType,
                  rules: [
                    {
                      required: true,
                      message: '请选择有效期',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    {Object.values(ServiceTypes).map(item => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.value}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            {isDynamicInVisible && (
              <Col md={8}>
                <Form.Item label="有效天数">
                  {getFieldDecorator('validLength', {
                    initialValue: getDayByTimeStamp(memberLevelConfig.validLength),
                    rules: [
                      {
                        required: true,
                        message: '请填写有效天数',
                      },
                    ],
                  })(<InputNumber className="full-width" precision={0} min={0} placeholder="请填写" />)}
                </Form.Item>
              </Col>
            )}
            {isFixationInVisible && (
              <>
                <Col md={8}>
                  <Form.Item label="开始日期">
                    {getFieldDecorator('validStartDate', {
                      initialValue: memberLevelConfig.validStartDate
                        ? moment(memberLevelConfig.validStartDate)
                        : moment(),
                      rules: [
                        {
                          required: true,
                          message: '请选择开始日期',
                        },
                      ],
                    })(<DatePicker className="full-width" />)}
                  </Form.Item>
                </Col>
                <Col md={8}>
                  <Form.Item label="结束日期">
                    {getFieldDecorator('validEndDate', {
                      initialValue: memberLevelConfig.validEndDate ? moment(memberLevelConfig.validEndDate) : moment(),
                      rules: [
                        {
                          required: true,
                          message: '请选择结束日期',
                        },
                      ],
                    })(<DatePicker className="full-width" />)}
                  </Form.Item>
                </Col>
              </>
            )}
            {interestsList && (
              <Col md={8}>
                <Form.Item label="会员权益">
                  {getFieldDecorator('MemberLevelEquityIds', {
                    initialValue: equityInfo && equityInfo.map(item => item.equityId),
                    rules: [
                      {
                        required: true,
                        message: '请选择会员权益',
                      },
                    ],
                  })(
                    <Select placeholder="请选择" mode="multiple">
                      {interestsList.map(item => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            )}
            <Col md={8}>
              <Form.Item label="升级方式">
                {getFieldDecorator('upgradeMode', {
                  initialValue: memberLevelConfig.upgradeMode,
                  rules: [
                    {
                      required: true,
                      message: '请选择升级方式',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    {Object.entries(originUpgradeMode).map(item => (
                      <Select.Option key={+item[0]} value={+item[0]}>
                        {item[1]}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            {/* <Form.Item label="成长值" className={styles.growUp} required>
              <Form.Item className={styles.growUpValue}>
                {getFieldDecorator('', {
                  rules: [
                    {
                      required: true,
                      message: '请填写成长值',
                    },
                  ],
                })(<InputNumber className="full-width" placeholder="请填写" />)}
              </Form.Item>
              <span className={styles.txt}>至</span>
              <Form.Item className={styles.growUpValue}>
                {getFieldDecorator('', {
                  rules: [
                    {
                      required: true,
                      message: '请填写成长值',
                    },
                  ],
                })(<InputNumber className="full-width" placeholder="请填写" />)}
              </Form.Item>
            </Form.Item>
            <Form.Item label="支付金额">
              {getFieldDecorator('', {
                rules: [
                  {
                    required: true,
                    message: '请填写支付金额',
                  },
                ],
              })(<InputNumber className="full-width" precision={2} min={0} placeholder="请填写" />)}
            </Form.Item> */}
            <Col md={8}>
              <Form.Item label="背景颜色">
                {getFieldDecorator('backdropColour', {
                  initialValue: memberLevelConfig.backgroundColor,
                })(<ColorPicker />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="等级图标">
                {form.getFieldDecorator('levelPic', {
                  ...formUploadOtherProps,
                  initialValue: levelPic ? [levelPic].map(fileMapper) : [],
                })(
                  <Upload
                    accept={FileAccept.IMG}
                    customRequest={this.customRequest}
                    onChange={target => this.onFileChange('levelPic', target)}
                  >
                    <Button icon="upload" type="primary">
                      选择
                    </Button>
                  </Upload>
                )}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="背景图片">
                {form.getFieldDecorator('backdropPic', {
                  ...formUploadOtherProps,
                  initialValue: backdropPic ? [backdropPic].map(fileMapper) : [],
                })(
                  <Upload
                    accept={FileAccept.IMG}
                    customRequest={this.customRequest}
                    onChange={target => this.onFileChange('backdropPic', target)}
                  >
                    <Button icon="upload" type="primary">
                      选择
                    </Button>
                  </Upload>
                )}
              </Form.Item>
            </Col>
            {/* <Form.Item label="备注">{getFieldDecorator('remark')(<Input.TextArea rows={4} />)}</Form.Item> */}
            <Col md={8}>
              <Form.Item label="业务名称">
                {getFieldDecorator('srvId', {
                  initialValue: memberLevelConfig.srvId,
                  rules: [
                    {
                      required: true,
                      message: '请选择业务名称',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    {srvList.map(item => (
                      <Select.Option key={item.srvId} value={item.srvId}>
                        {item.srvName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="排序">
                {getFieldDecorator('ranks', {
                  initialValue: memberLevelConfig.ranks,
                })(<InputNumber className="full-width" precision={0} min={0} placeholder="请填写" />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="状态">
                {getFieldDecorator('configState', {
                  initialValue: memberLevelConfig.configState,
                  rules: [
                    {
                      required: true,
                      message: '请选择状态',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    {Object.values(UserStatus).map(item => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.value}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Content>
    );
  }
}

export default EditContent;
