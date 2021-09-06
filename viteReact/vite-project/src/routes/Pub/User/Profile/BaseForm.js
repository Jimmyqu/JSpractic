import { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Input, InputNumber, Row, Col, Button, Select, DatePicker, Cascader, message } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import AuthComponent from '@/components/AuthComponent';
import { checkMobile } from '@/commons/lib/validator';
import { provinceList, cascaderData } from '@/commons/lib/home-town';
import ethnicList from '@/commons/lib/data/ethnic';
import { formItemLayoutFull, formItemLayoutNormal } from '@/utils/utils';
import Modal from '@/components/Modal';
import MarginBar from '@/components/MarginBar';
import styles from './base.less';

@connect(({ pubuser }) => ({
  pubuser,
}))
@Form.create()
class ProfileBaseForm extends Component {
  static contextTypes = {
    isAuthorized: PropTypes.func,
  };

  formLongItemLayout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 22 },
  };

  constructor(props, context) {
    super(props, context);
    const { isAuthorized } = context;
    const isGrade = isAuthorized('change-grade');
    this.state = {
      isGrade,
      gradeVisible: false,
      levelList: [],
      canEidt: false,
    };
  }

  componentDidMount() {
    const { dispatch, userinfo } = this.props;
    const { publicAccount = {} } = userinfo;
    const { companyId, srvId } = publicAccount;
    dispatch({
      type: 'pubuser/getLevelList',
      payload: {
        srvId,
        companyId,
      },
    }).then(result => {
      this.setState({
        levelList: result,
      });
    });
  }

  changeGradeVisible = visible => {
    this.setState({
      gradeVisible: visible,
    });
  };

  handleEditClick = () => {
    const { canEidt } = this.state;
    this.setState({
      canEidt: !canEidt,
    });
  };

  changeGradeSubmit = () => {
    const { form, dispatch, userinfo, fetch } = this.props;
    const { publicAccount = {} } = userinfo;
    const { levelList } = this.state;
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      const { levelId, remark } = formData;
      const levelName = levelList.find(item => item.id === levelId).name;
      dispatch({
        type: 'pubuser/changeMemberLevel',
        payload: {
          levelId,
          levelName,
          memberId: publicAccount.id,
          remark,
        },
      }).then(() => {
        message.success('修改成功');
        fetch();
      });
    });
  };

  render() {
    const {
      form,
      saveLoading,
      handleFormSubmit,
      userinfo,
      pubuser: { Genders, IDCardTypes, PubAccountTypes },
    } = this.props;
    const { publicAccount = {}, publicUserBasic = {}, levelId, levelName, remark, flag } = userinfo;
    const { getFieldDecorator } = form;

    const pcdValue = [publicUserBasic.province, publicUserBasic.city, publicUserBasic.district];
    const { isGrade, gradeVisible, levelList, canEidt } = this.state;

    return (
      <>
        <Form onSubmit={e => handleFormSubmit(e, form)}>
          <Row gutter={8}>
            <Col md={8}>
              <Form.Item {...formItemLayoutFull} label="姓名">
                {getFieldDecorator('publicAccount.realName', {
                  initialValue: publicAccount.realName,
                })(<Input placeholder="请填写" disabled={!canEidt} />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item {...formItemLayoutFull} label="手机号码">
                {getFieldDecorator('publicAccount.mobile', {
                  initialValue: publicAccount.mobile,
                  rules: [
                    {
                      required: false,
                      message: '请填写合法的手机号',
                      validator: checkMobile,
                    },
                  ],
                })(<Input placeholder="请填写" disabled={!canEidt} />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item {...formItemLayoutFull} label="会员类型">
                {getFieldDecorator('publicAccount.pubAccountType', {
                  initialValue: publicAccount.pubAccountType,
                })(
                  <Select placeholder="请选择" disabled={!canEidt}>
                    {Object.values(PubAccountTypes).map(item => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.value}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item {...formItemLayoutFull} label="性别">
                {getFieldDecorator('publicUserBasic.gender', {
                  initialValue: publicUserBasic.gender,
                })(
                  <Select placeholder="请选择" disabled={!canEidt}>
                    {Object.values(Genders).map(item => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.value}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item {...formItemLayoutFull} label="出生日期">
                {getFieldDecorator('publicUserBasic.birthday', {
                  initialValue: publicUserBasic.birthday ? moment(publicUserBasic.birthday) : null,
                })(<DatePicker placeholder="请选择" disabled={!canEidt} className="full-width" />)}
              </Form.Item>
            </Col>
            {flag && (
              <Col md={8}>
                <Form.Item {...formItemLayoutFull} label="会员等级">
                  <Row gutter={4} type="flex" justify="space-between">
                    <Col md={isGrade ? 15 : 24}>
                      <Input value={levelName} disabled={!canEidt} />
                    </Col>
                    {isGrade && (
                      <Col md={9} className="text-right">
                        <Button type="primary" disabled={!canEidt} onClick={() => this.changeGradeVisible(true)}>
                          修改
                        </Button>
                      </Col>
                    )}
                  </Row>
                </Form.Item>
              </Col>
            )}
            <Col md={8}>
              <Form.Item {...formItemLayoutFull} label="民族">
                {getFieldDecorator('publicUserBasic.ethnic', {
                  initialValue: publicUserBasic.ethnic,
                })(
                  <Select placeholder="请选择" disabled={!canEidt}>
                    {ethnicList.map(item => (
                      <Select.Option value={item.id} key={item.id}>
                        {item.text}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item {...formItemLayoutFull} label="籍贯">
                {getFieldDecorator('publicUserBasic.hometown', {
                  initialValue: publicUserBasic.hometown,
                })(
                  <Select placeholder="请选择" disabled={!canEidt}>
                    {provinceList.map(item => (
                      <Select.Option value={item.id} key={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item {...formItemLayoutFull} label="身高(cm)">
                {getFieldDecorator('publicUserBasic.height', {
                  initialValue: publicUserBasic.height,
                })(<InputNumber placeholder="请填写" disabled={!canEidt} className="full-width" min={0} />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item {...formItemLayoutFull} label="体重(kg)">
                {getFieldDecorator('publicUserBasic.weight', {
                  initialValue: publicUserBasic.weight,
                })(<InputNumber placeholder="请填写" disabled={!canEidt} className="full-width" min={0} />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item {...formItemLayoutFull} label="固定电话">
                {getFieldDecorator('publicUserBasic.telephone', {
                  initialValue: publicUserBasic.telephone,
                })(<Input placeholder="请填写" disabled={!canEidt} />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item {...formItemLayoutFull} label="政治面貌">
                {getFieldDecorator('publicUserBasic.party', { initialValue: publicUserBasic.party })(
                  <Input placeholder="请填写" disabled={!canEidt} />
                )}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item {...formItemLayoutFull} label="证件类型">
                {getFieldDecorator('publicUserBasic.idcardType', {
                  initialValue: publicUserBasic.idcardType,
                })(
                  <Select placeholder="请选择" disabled={!canEidt}>
                    {Object.values(IDCardTypes).map(item => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.value}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item {...formItemLayoutFull} label="证件号码">
                {getFieldDecorator('publicUserBasic.idcard', {
                  initialValue: publicUserBasic.idcard,
                })(<Input placeholder="请填写" disabled={!canEidt} />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item {...formItemLayoutFull} label="工作单位">
                {getFieldDecorator('publicUserBasic.company', {
                  initialValue: publicUserBasic.company,
                })(<Input placeholder="请填写" disabled={!canEidt} />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item {...formItemLayoutFull} label="职务">
                {getFieldDecorator('publicUserBasic.position', {
                  initialValue: publicUserBasic.position,
                })(<Input placeholder="请填写" disabled={!canEidt} />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item {...formItemLayoutFull} label="联系地址">
                {getFieldDecorator('publicUserBasic.address', {
                  initialValue: publicUserBasic.address,
                })(<Input placeholder="请填写" disabled={!canEidt} />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item {...formItemLayoutFull} label="邮箱">
                {getFieldDecorator('publicAccount.email', {
                  initialValue: publicAccount.email,
                  rules: [
                    {
                      required: false,
                      message: '请填写合法邮箱地址',
                      type: 'email',
                    },
                  ],
                })(<Input disabled={!canEidt} placeholder="请填写" />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item {...formItemLayoutFull} label="国籍">
                {getFieldDecorator('publicUserBasic.nationality', {
                  initialValue: publicUserBasic.nationality,
                })(<Input disabled={!canEidt} placeholder="请填写" />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item {...formItemLayoutFull} label="省/市/区">
                {getFieldDecorator('publicUserBasic.pcdValue', {
                  initialValue: pcdValue,
                })(<Cascader options={cascaderData} disabled={!canEidt} placeholder="请选择" />)}
              </Form.Item>
            </Col>
            {/* <Col md={8}>
              <Form.Item {...formItemLayoutFull} label="省">
                {getFieldDecorator('publicUserBasic.province', {
                  initialValue: publicUserBasic.province,
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item {...formItemLayoutFull} label="市">
                {getFieldDecorator('publicUserBasic.city', { initialValue: publicUserBasic.city })(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item {...formItemLayoutFull} label="区">
                {getFieldDecorator('publicUserBasic.district', {
                  initialValue: publicUserBasic.district,
                })(<Input />)}
              </Form.Item>
            </Col> */}
            {/* <Col md={8}>
              <Form.Item {...formItemLayoutFull} label="街道">{getFieldDecorator('real', {initialValue: publicAccount.realName,})(<Input />)}</Form.Item>
            </Col> */}
            <Col span={8}>
              <Form.Item {...formItemLayoutFull} label="个性签名">
                {getFieldDecorator('publicUserBasic.bio', { initialValue: publicUserBasic.bio })(
                  <Input placeholder="请填写" disabled={!canEidt} />
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item {...this.formLongItemLayout} label="备注">
                {getFieldDecorator('publicAccount.descr', { initialValue: publicAccount.descr })(
                  <Input.TextArea placeholder="请填写" disabled={!canEidt} rows={4} />
                )}
              </Form.Item>
            </Col>
            <Col span={24} className="text-center">
              {canEidt ? (
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={saveLoading}>
                    保存
                  </Button>
                  <MarginBar inline left>
                    <Button type="danger" onClick={this.handleEditClick}>
                      取消
                    </Button>
                  </MarginBar>
                </Form.Item>
              ) : (
                <AuthComponent auth="edit-info">
                  <Button type="primary" className={styles.ml_10} onClick={this.handleEditClick}>
                    编辑
                  </Button>
                </AuthComponent>
              )}
            </Col>
          </Row>
        </Form>
        <Modal
          title="修改会员等级"
          visible={gradeVisible}
          onVisibleChange={this.changeGradeVisible}
          onOk={this.changeGradeSubmit}
        >
          <Form {...formItemLayoutNormal}>
            <Form.Item label="会员等级">
              {getFieldDecorator('levelId', {
                initialValue: levelId,
                rules: [
                  {
                    required: !!gradeVisible,
                    message: '请选择会员等级',
                  },
                ],
              })(
                <Select placeholder="请选择">
                  {(levelList || []).map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="备注">
              {getFieldDecorator('remark', {
                initialValue: remark,
              })(<Input.TextArea rows={3} />)}
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}

export default ProfileBaseForm;
