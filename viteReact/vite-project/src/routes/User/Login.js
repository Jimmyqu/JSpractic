import { Component } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Tabs, Form, Icon, Input, Select, Button } from 'antd';
import AliyunNocaptcha from '@/components/AliyunNocaptcha';
import Model from '@/components/Modal';
import { isMobile } from '@/utils/utils';
import { checkMobile } from '@/commons/lib/validator';
import { RSAEncrypt } from '@/commons/lib/security';
import styles from './login.less';

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'] || loading.effects['login/loginByAfs'],
  fetchSysUserListIng: loading.effects['login/sysUser'],
}))
@Form.create()
class LoginPage extends Component {
  state = {
    type: 'account',
    // autoLogin: true,
    afsCode: null,
  };

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      form,
      login: { sysUserList: nextList },
    } = nextProps;

    const {
      login: { sysUserList },
    } = this.props;

    if (nextList === sysUserList) {
      return;
    }
    const onlyOneSysUserId = nextList && nextList.length === 1;
    if (onlyOneSysUserId) {
      setTimeout(() => {
        form.setFieldsValue({
          sysUserId: nextList[0].sysUserId,
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
    form.validateFields(async (err, values) => {
      if (!err) {
        const afsCode = await dispatch({
          type: 'login/login',
          payload: {
            ...values,
            mobile: RSAEncrypt(values.mobile),
            pwd: RSAEncrypt(values.pwd),
          },
        });
        this.setState({
          afsCode,
        });
      }
    });
  };

  handleCaptchaVisibleChange = v => {
    if (!v) {
      this.setState({
        afsCode: null,
      });
    }
  };

  handleCaptchaSuccess = data => {
    const { dispatch } = this.props;
    const { type, afsCode } = this.state;
    this.setState({
      afsCode: null,
    });
    dispatch({
      type: 'login/loginByAfs',
      payload: {
        ...data,
        codeKey: afsCode,
        type,
      },
    });
  };

  render() {
    const {
      login: { sysUserList },
      submitting,
      fetchSysUserListIng,
      form,
    } = this.props;
    const { afsCode } = this.state;

    const onlyOneSysUserId = sysUserList && sysUserList.length === 1;
    const mobile = form.getFieldValue('mobile');
    const useSelect = sysUserList && sysUserList.length > 0 && isMobile(mobile);
    return (
      <div className={styles.login}>
        <Tabs defaultActiveKey="login" className={styles.tabs}>
          <Tabs.TabPane tab="用户登录" key="login">
            <Form onSubmit={this.handleSubmit}>
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
              <Form.Item>
                {form.getFieldDecorator('pwd', {
                  rules: [
                    {
                      required: true,
                      message: '请输入密码',
                    },
                  ],
                })(<Input.Password size="large" prefix={<Icon type="lock" />} placeholder="密码" />)}
              </Form.Item>
              {useSelect && (
                <Form.Item
                  className={classNames({
                    hidden: onlyOneSysUserId,
                  })}
                >
                  {form.getFieldDecorator('sysUserId', {
                    rules: [
                      {
                        required: true,
                        message: '请选择单位',
                      },
                    ],
                  })(
                    <Select
                      size="large"
                      placeholder="请选择单位"
                      showSearch
                      optionFilterProp="children"
                      // filterOption={(val, option) => {
                      //   console.log(val, option);
                      //   return false;
                      // }}
                    >
                      {(sysUserList || []).map(item => (
                        <Select.Option value={item.sysUserId} key={item.sysUserId}>
                          {item.companyName}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              )}
              <div className={classNames('text-right', styles.forgotLink)}>
                <Link to="forgot">忘记密码</Link>
              </div>
              <Form.Item>
                <Button size="large" type="primary" htmlType="submit" loading={fetchSysUserListIng || submitting}>
                  {(() => {
                    if (fetchSysUserListIng) {
                      return '加载单位';
                    }
                    if (submitting) {
                      return '登录中';
                    }
                    return '登录';
                  })()}
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
        </Tabs>
        <Model
          title="向右拖动滑块"
          width={340}
          visible={afsCode != null}
          centered
          onVisibleChange={this.handleCaptchaVisibleChange}
          footer={null}
        >
          <AliyunNocaptcha onSuccess={this.handleCaptchaSuccess} />
        </Model>
      </div>
    );
  }
}

export default LoginPage;
