import { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Tabs, Form, Icon, Input, Select, Button, Row, Col } from 'antd';
import { checkMobile, checkPassword } from '@/commons/lib/validator';
import { isMobile, getPageQuery } from '@/utils/utils';
import { appStore } from '@/commons/lib/store';
import { RSAEncrypt } from '@/commons/lib/security';
import { notification } from '@/utils/feedback';
import styles from './login.less';

const storeKey = 'sms-verify-timeout';
const t = 60;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/checkSmsForForgot'] || loading.effects['login/changePwdForForgot'],
  fetchSysUserListIng: loading.effects['login/sysUser'],
  smsSending: loading.effects['login/sendSms'],
}))
@Form.create()
class ForgotPage extends Component {
  state = {
    timeout: Math.max(appStore.get(storeKey) || 0, 0),
    authCode: getPageQuery().auth,
  };

  componentDidMount() {
    const { timeout } = this.state;
    if (timeout > 0) {
      this.tick();
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      form,
      login: { sysUserList: nextList },
      location: nextLocation,
    } = nextProps;

    const {
      login: { sysUserList },
      location,
    } = this.props;

    if (location !== nextLocation) {
      const { auth } = getPageQuery();
      this.setState({
        authCode: auth,
      });
    }
    if (nextList === sysUserList) {
      return;
    }
    const onlyOneSysUserId = nextList && nextList.length === 1;
    if (onlyOneSysUserId) {
      setTimeout(() => {
        form.setFieldsValue({
          companyId: nextList[0].companyId,
        });
      }, 0);
    }
  }

  // onTabChange = type => {
  //   this.setState({ type });
  // };

  onUserNameChange = event => {
    const userNameValue = String(event.target.value);
    const { dispatch } = this.props;
    if (userNameValue.length === 11) {
      dispatch({
        type: 'login/sysUser',
        payload: {
          mobile: userNameValue,
        },
      });
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const { authCode } = this.state;

    form.validateFields(async (err, values) => {
      if (err) {
        return;
      }
      if (authCode) {
        await dispatch({
          type: 'login/changePwdForForgot',
          payload: {
            opwd: RSAEncrypt(values.opwd),
            pwd: RSAEncrypt(values.pwd),
            smsCode: authCode,
          },
        });
        // login/logout具备跳到登录页的功能
        dispatch({
          type: 'login/logout',
        });
        return;
      }
      const code = await dispatch({
        type: 'login/checkSmsForForgot',
        payload: values,
      });
      if (!code) {
        notification.error('未能成功获取到重置密码的授权码');
        return;
      }
      dispatch(
        push({
          // pathname: '/user/forgot',
          search: `auth=${code}`,
        })
      );
    });
  };

  storeTime = sec => {
    this.setState({
      timeout: sec,
    });
    appStore.put(storeKey, sec);
  };

  tick = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      const { timeout } = this.state;
      const tm = timeout - 1;
      this.storeTime(tm);
      if (tm > 0) {
        this.tick();
      }
    }, 1000 * 1);
  };

  sendSms = () => {
    const { form, dispatch } = this.props;
    form.validateFields(['mobile', 'companyId'], async (err, values) => {
      if (err) {
        return;
      }
      await dispatch({
        type: 'login/sendSms',
        payload: values,
      });
      this.storeTime(t);
      this.tick();
    });
  };

  render() {
    const {
      login: { sysUserList },
      submitting,
      fetchSysUserListIng,
      smsSending,
      form,
    } = this.props;
    const { timeout, authCode } = this.state;

    const onlyOneSysUserId = sysUserList && sysUserList.length === 1;

    const mobile = form.getFieldValue('mobile');
    const companyId = form.getFieldValue('companyId');
    const useSelect = sysUserList && sysUserList.length > 0 && isMobile(mobile);
    return (
      <div className={styles.login}>
        <Tabs defaultActiveKey="forgot" className={styles.tabs}>
          <Tabs.TabPane tab="忘记密码" key="forgot">
            <Form onSubmit={this.handleSubmit}>
              {authCode ? (
                <>
                  <Form.Item>
                    {form.getFieldDecorator('opwd', {
                      rules: [
                        {
                          required: true,
                          message: '请填写',
                        },
                        {
                          message: `请输入字母数字组合的8-16位密码`,
                          isPwdLimit8: true,
                          validator: checkPassword,
                        },
                      ],
                    })(<Input.Password size="large" prefix={<Icon type="lock" />} placeholder="新密码" />)}
                  </Form.Item>
                  <Form.Item>
                    {form.getFieldDecorator('pwd', {
                      rules: [
                        {
                          message: `请输入字母数字组合的8-16位密码`,
                          isPwdLimit8: true,
                          validator: checkPassword,
                        },
                        {
                          message: '两次密码不一致',
                          validator: (rule, value, fn) => {
                            if (value === form.getFieldValue('opwd')) {
                              fn();
                              return;
                            }
                            fn([new Error('invalid')]);
                          },
                        },
                      ],
                    })(<Input.Password size="large" prefix={<Icon type="lock" />} placeholder="确认新密码" />)}
                  </Form.Item>
                  <Form.Item>
                    <Button size="large" type="primary" htmlType="submit" loading={submitting}>
                      确认修改
                    </Button>
                  </Form.Item>
                </>
              ) : (
                <>
                  <Form.Item>
                    {form.getFieldDecorator('mobile', {
                      rules: [
                        {
                          required: true,
                          message: '请填写正确的手机号',
                          validator: checkMobile,
                        },
                      ],
                    })(
                      <Input
                        size="large"
                        prefix={<Icon type="user" />}
                        placeholder="手机号"
                        onChange={this.onUserNameChange}
                      />
                    )}
                  </Form.Item>
                  {useSelect && (
                    <Form.Item
                      className={classNames({
                        hidden: onlyOneSysUserId,
                      })}
                    >
                      {form.getFieldDecorator('companyId', {
                        rules: [
                          {
                            required: true,
                            message: '请选择单位',
                          },
                        ],
                      })(
                        <Select size="large" placeholder="请选择单位">
                          {(sysUserList || []).map(item => (
                            <Select.Option value={item.companyId} key={item.companyId}>
                              {item.companyName}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  )}
                  <Form.Item>
                    <Row gutter={8}>
                      <Col span={16}>
                        {form.getFieldDecorator('smsCode', {
                          rules: [
                            {
                              required: true,
                              message: '请输入验证码',
                            },
                          ],
                        })(<Input size="large" prefix={<Icon type="lock" />} placeholder="验证码" />)}
                      </Col>
                      <Col span={8}>
                        <Button
                          size="large"
                          className={styles.smsSender}
                          loading={smsSending}
                          disabled={fetchSysUserListIng || timeout > 0 || !isMobile(mobile) || !companyId}
                          onClick={this.sendSms}
                        >
                          {timeout > 0 ? `剩余${timeout}s` : '获取验证码'}
                        </Button>
                      </Col>
                    </Row>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      size="large"
                      type="primary"
                      htmlType="submit"
                      loading={fetchSysUserListIng || submitting}
                      disabled={smsSending}
                    >
                      {(() => {
                        if (fetchSysUserListIng) {
                          return '加载单位';
                        }
                        if (submitting) {
                          return '验证中';
                        }
                        return '下一步';
                      })()}
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form>
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}

export default ForgotPage;
