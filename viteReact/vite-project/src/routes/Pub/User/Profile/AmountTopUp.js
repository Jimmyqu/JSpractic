import { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Form, Input, Button, Select, Row, Col, Divider } from 'antd';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import AmountInput from '@/components/Amount/Input';
import MarginBar from '@/components/MarginBar';
import Modal from '@/components/Modal';
import { formatMoney, encodeMoney, decodeMoney, formatModel } from '@/utils/format';
import { getPageQuery } from '@/utils/utils';
import { checkMobile } from '@/commons/lib/validator';
import Forbidden from '@/routes/Exception/403';

@connect(({ pubuser, venue, deal, loading }) => ({
  pubuser,
  venue,
  deal,
  submiting: loading.effects['pubuser/topUpAmount'],
}))
@Form.create()
class ProfileAmountTopUp extends Component {
  formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
      md: { span: 10 },
    },
  };

  itemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 17 },
    },
  };

  submitFormLayout = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 10, offset: 7 },
    },
  };

  tabList = [
    {
      key: 'topup',
      tab: '账户充值',
      auth: 'tab-inner-topup',
    },
    {
      key: 'withdraw',
      tab: '余额提现',
      auth: 'tab-inner-withdraw',
    },
  ].filter(item => {
    const { isAuthorized } = this.context;
    return isAuthorized(item.auth);
  });

  static contextTypes = {
    isAuthorized: PropTypes.func,
  };

  state = {
    tabKey: getPageQuery().tab || 'topup',
    formValues: undefined,
    modalProps: {
      visible: false,
      onVisibleChange: visible => {
        if (this.isUnmounted) {
          return;
        }
        const { modalProps: props } = this.state;
        this.setState({
          modalProps: {
            ...props,
            visible,
          },
        });
      },
    },
  };

  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { id: pubAccountId } = params || {};
    dispatch({
      type: 'pubuser/fetch',
      payload: pubAccountId,
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  submit = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFieldsAndScroll((err, formValues) => {
      if (err) {
        return;
      }
      const { modalProps } = this.state;
      this.setState({
        formValues,
        modalProps: {
          ...modalProps,
          visible: true,
        },
      });
    });
  };

  toDealAccount = () => {
    const { dispatch, form } = this.props;
    const salesId = form.getFieldValue('salesId');
    dispatch(
      push({
        pathname: '/basic/deal/account',
        search: `?sales-id=${salesId}`,
      })
    );
  };

  onTabChange = key => {
    const { form } = this.props;
    this.setState({
      tabKey: key,
    });
    form.resetFields();
  };

  payModeChange = payWay => {
    const {
      deal: { PayWayTypes },
      form,
    } = this.props;
    if (payWay === PayWayTypes.CASH.key) {
      form.setFieldsValue({
        withdrawAccount: undefined,
      });
    }
  };

  topupSure = () => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { formValues } = this.state;
    const { id: pubAccountId } = params || {};
    return dispatch({
      type: 'pubuser/topUpAmount',
      payload: {
        ...formValues,
        amountAvail: encodeMoney(formValues.amountAvail),
        publicAccountId: pubAccountId,
      },
    }).then(id => {
      if (id) {
        dispatch(
          push({
            pathname: `/basic/deal/${id}/summary`,
          })
        );
      }
      return false;
    });
  };

  withdrawSure = () => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { formValues } = this.state;
    const { id: pubAccountId } = params || {};
    return dispatch({
      type: 'pubuser/withdrawAmount',
      payload: {
        ...formValues,
        withdrawAmount: encodeMoney(formValues.withdrawAmount),
        publicAccountId: pubAccountId,
      },
    }).then(id => {
      if (id) {
        dispatch(push('./dealflow'));
        return;
      }
      return false;
    });
  };

  render() {
    const {
      form,
      pubuser,
      venue,
      match: { params },
      deal: { PayWayTypes },
      submiting,
    } = this.props;
    const { id: pubAccountId } = params || {};
    const { getFieldDecorator } = form;
    const { userInfoCache = {} } = pubuser;
    const viewUserInfo = userInfoCache[pubAccountId] || {};
    // const { publicAccount = {}, publicUserBasic = {} } = viewUserInfo;
    const { publicAccount = {} } = viewUserInfo;
    const { formValues = {}, modalProps, tabKey } = this.state;

    const withdrawMode = form.getFieldValue('withdrawMode');
    const accountDis = withdrawMode === PayWayTypes.CASH.key;

    const useTabKey = this.tabList.some(item => item.key === tabKey) ? tabKey : null;

    return (
      <Card tabList={this.tabList} activeTabKey={useTabKey} onTabChange={this.onTabChange}>
        {(() => {
          switch (useTabKey) {
            case 'topup':
              return (
                <>
                  <Form onSubmit={this.submit}>
                    <Form.Item {...this.formItemLayout} label="账户名">
                      <Input disabled value={publicAccount.realName} />
                    </Form.Item>
                    <Form.Item {...this.formItemLayout} label="可用余额">
                      <Input disabled value={formatMoney(publicAccount.amountAvail)} />
                    </Form.Item>
                    <Form.Item {...this.formItemLayout} label="营销中心">
                      {getFieldDecorator('salesId', {
                        initialValue: (venue.currentVenue || {}).id,
                      })(
                        <Select>
                          {(venue.list || []).map(item => (
                            <Select.Option key={item.id} value={item.id}>
                              {item.salesName}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                    <Form.Item {...this.formItemLayout} label="充值金额">
                      {getFieldDecorator('amountAvail', {
                        rules: [
                          {
                            required: true,
                            message: '请填写金额',
                          },
                          {
                            message: '充值金额必须大于0',
                            validator(rule, value, fn) {
                              if (value > 0) {
                                fn();
                                return;
                              }
                              fn([new Error('invalid')]);
                            },
                          },
                        ],
                      })(<AmountInput min={0} precision={2} fullWidth />)}
                    </Form.Item>
                    <Form.Item {...this.formItemLayout} label="备注">
                      {getFieldDecorator('descr', {})(<Input.TextArea rows={4} placeholder="备注" />)}
                    </Form.Item>
                    <Form.Item {...this.submitFormLayout}>
                      <Button type="primary" htmlType="submit" loading={submiting}>
                        充值
                      </Button>
                      <MarginBar left inline>
                        <Button onClick={this.toDealAccount}>查看充值记录</Button>
                      </MarginBar>
                    </Form.Item>
                  </Form>
                  <Modal {...modalProps} title="请核对充值信息" onOk={this.topupSure}>
                    <Form>
                      <Form.Item {...this.itemLayout} label="账户名">
                        <Input disabled value={publicAccount.realName} />
                      </Form.Item>
                      <Form.Item {...this.itemLayout} label="场馆名称">
                        <Input
                          disabled
                          value={((venue.list || []).find(item => item.id === formValues.salesId) || {}).salesName}
                        />
                      </Form.Item>
                      <Form.Item {...this.itemLayout} label="充值金额">
                        <Input disabled value={formValues.amountAvail} />
                      </Form.Item>
                    </Form>
                  </Modal>
                </>
              );
            case 'withdraw':
              return (
                <>
                  <Form onSubmit={this.submit}>
                    <Row>
                      <Col {...this.formItemLayout.labelCol} className="text-right" style={{ paddingRight: 4 }}>
                        会员姓名
                      </Col>
                      <Col {...this.formItemLayout.wrapperCol}>{publicAccount.realName}</Col>
                    </Row>
                    <Row>
                      <Col {...this.formItemLayout.labelCol} className="text-right" style={{ paddingRight: 4 }}>
                        会员手机
                      </Col>
                      <Col {...this.formItemLayout.wrapperCol}>{publicAccount.mobile}</Col>
                    </Row>
                    <Row>
                      <Col {...this.formItemLayout.labelCol} className="text-right" style={{ paddingRight: 4 }}>
                        账户可用余额
                      </Col>
                      <Col {...this.formItemLayout.wrapperCol}>{formatMoney(publicAccount.amountAvail)}</Col>
                    </Row>
                    <Divider />
                    <Form.Item {...this.formItemLayout} label="营销中心">
                      {getFieldDecorator('salesId', {
                        initialValue: (venue.currentVenue || {}).id,
                      })(
                        <Select>
                          {(venue.list || []).map(item => (
                            <Select.Option key={item.id} value={item.id}>
                              {item.salesName}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                    <Form.Item {...this.formItemLayout} label="提现金额">
                      {getFieldDecorator('withdrawAmount', {
                        initialValue: decodeMoney(publicAccount.amountAvail),
                        rules: [
                          {
                            required: true,
                            message: '请填写金额',
                          },
                          {
                            message: '提现额度必须大于0',
                            validator(rule, value, fn) {
                              if (value > 0) {
                                fn();
                                return;
                              }
                              fn([new Error('invalid')]);
                            },
                          },
                          {
                            message: '提现额度不能超过可用余额',
                            validator(rule, value, fn) {
                              if (encodeMoney(value) > publicAccount.amountAvail) {
                                fn([new Error('invalid')]);
                                return;
                              }
                              fn();
                            },
                          },
                        ],
                      })(<AmountInput min={0} max={decodeMoney(publicAccount.amountAvail)} precision={2} fullWidth />)}
                    </Form.Item>
                    <Form.Item {...this.formItemLayout} label="收款方">
                      {getFieldDecorator('withdrawRealName', {
                        initialValue: publicAccount.realName,
                        rules: [
                          {
                            required: true,
                            message: '请填写收款方',
                          },
                        ],
                      })(<Input placeholder="收款方" />)}
                    </Form.Item>
                    <Form.Item {...this.formItemLayout} label="收款方手机号">
                      {getFieldDecorator('withdrawMobile', {
                        initialValue: publicAccount.mobile,
                        rules: [
                          {
                            required: true,
                            message: '请填写收款方手机号',
                          },
                          {
                            min: 11,
                            max: 11,
                            message: '请输入合法的手机号码!',
                            validator: checkMobile,
                          },
                        ],
                      })(<Input placeholder="收款方手机号" />)}
                    </Form.Item>
                    <Form.Item {...this.formItemLayout} label="提现支付方式">
                      {getFieldDecorator('withdrawMode', {
                        rules: [
                          {
                            required: true,
                            message: '请选择提现支付方式',
                          },
                        ],
                      })(
                        <Select placeholder="提现支付方式" onChange={this.payModeChange}>
                          {[PayWayTypes.CASH, PayWayTypes.BANKTRANSFER, PayWayTypes.WECHAT, PayWayTypes.ZFB].map(
                            item => (
                              <Select.Option key={item.key} value={item.key}>
                                {item.value}
                              </Select.Option>
                            )
                          )}
                        </Select>
                      )}
                    </Form.Item>
                    <Form.Item {...this.formItemLayout} label="提现账户">
                      {getFieldDecorator('withdrawAccount', {
                        rules: accountDis
                          ? null
                          : [
                              {
                                required: true,
                                message: '请填写提现账户',
                              },
                            ],
                      })(<Input placeholder="提现账户" disabled={accountDis} />)}
                    </Form.Item>
                    <Form.Item {...this.formItemLayout} label="提现原因">
                      {getFieldDecorator('descr', {
                        rules: [
                          {
                            required: true,
                            message: '请填写提现原因',
                          },
                        ],
                      })(<Input.TextArea rows={4} placeholder="提现原因" />)}
                    </Form.Item>
                    <Form.Item {...this.submitFormLayout}>
                      <Button type="primary" htmlType="submit" loading={submiting}>
                        确认提现
                      </Button>
                    </Form.Item>
                  </Form>
                  <Modal {...modalProps} title="请核对提现信息" onOk={this.withdrawSure}>
                    <Row>
                      <Col span={6} className="text-right">
                        账户名：
                      </Col>
                      <Col span={18}>{publicAccount.realName}</Col>
                    </Row>
                    <Row>
                      <Col span={6} className="text-right">
                        账户手机号：
                      </Col>
                      <Col span={18}>{publicAccount.mobile}</Col>
                    </Row>
                    <Divider />
                    <Row>
                      <Col span={6} className="text-right">
                        营销中心：
                      </Col>
                      <Col span={18}>
                        {((venue.list || []).find(item => item.id === formValues.salesId) || {}).salesName}
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6} className="text-right">
                        提现金额：
                      </Col>
                      <Col span={18}>{formatMoney(encodeMoney(formValues.withdrawAmount))}</Col>
                    </Row>
                    <Row>
                      <Col span={6} className="text-right">
                        收款方：
                      </Col>
                      <Col span={18}>{formValues.withdrawRealName}</Col>
                    </Row>
                    <Row>
                      <Col span={6} className="text-right">
                        收款方手机号：
                      </Col>
                      <Col span={18}>{formValues.withdrawMobile}</Col>
                    </Row>
                    <Row>
                      <Col span={6} className="text-right">
                        提现支付方式：
                      </Col>
                      <Col span={18}>{formatModel(PayWayTypes, formValues.withdrawMode)}</Col>
                    </Row>
                    {formValues.withdrawAccount && (
                      <Row>
                        <Col span={6} className="text-right">
                          提现账户：
                        </Col>
                        <Col span={18}>{formValues.withdrawAccount}</Col>
                      </Row>
                    )}
                    <Row>
                      <Col span={6} className="text-right">
                        提现原因：
                      </Col>
                      <Col span={18}>{formValues.descr}</Col>
                    </Row>
                  </Modal>
                </>
              );
            default:
              return <Forbidden />;
          }
        })()}
      </Card>
    );
  }
}

export default ProfileAmountTopUp;
