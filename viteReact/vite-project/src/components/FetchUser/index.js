import { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, Divider, Form, Select, Spin } from 'antd';
import { isMobile } from '@/utils/utils';
import CreateUserModal from './CreateUserModal';

@connect(({ pubuser, orderprocessing, loading }) => ({
  pubuser,
  orderprocessing,
  fetchLoading: loading.effects['pubuser/fetchUserByKey'],
}))
@Form.create()
class User extends Component {
  timeout = null;

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

  state = {
    visible: false,
    searchValue: null,
    mobileForCreate: null,
  };

  componentDidMount() {
    const { onInit, dispatch, form } = this.props;
    if (typeof onInit === 'function') {
      onInit({
        setIndividualUser: (callback = () => {}) => {
          dispatch({
            type: 'orderprocessing/updateUser',
            payload: {
              isIndividual: true,
            },
          }).then(({ pubAccountId }) => {
            this.setState(
              () => ({
                searchValue: '',
              }),
              () => {
                // 使表单的select选中，searchValue是刚才的
                form.setFieldsValue({
                  pubAccountId,
                });
                this.handleSelectChange(pubAccountId);
                setTimeout(callback, 0);
              }
            );
          });
        },
      });
    }
  }

  getList() {
    const { searchValue, mobileForCreate } = this.state;
    const key = searchValue || mobileForCreate;
    const {
      deal = {},
      pubuser: { userFetchMapping },
    } = this.props;
    return !key && deal.pubAccountId
      ? [
          {
            id: deal.pubAccountId,
            mobile: deal.pubMobile,
            realName: deal.pubRealName,
          },
        ]
      : userFetchMapping[key] || [];
  }

  fetch = (dataType, value) => {
    this.setState({
      searchValue: value,
    });
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    if (value == null || value.trim().length === 0) {
      return;
    }

    this.timeout = setTimeout(() => {
      const { dispatch } = this.props;
      const params = {};
      if (dataType === 0) {
        params.realName = value;
      } else if (dataType === 1) {
        params.mobile = value;
      }
      dispatch({
        type: 'pubuser/fetchUserByKey',
        payload: params,
      }).then(list => {
        if (list && list.length === 0 && dataType === 1 && isMobile(value)) {
          this.setState({
            visible: true,
            mobileForCreate: value,
          });
        }
      });
    }, 1000);
  };

  handleSelectChange = id => {
    const { onChange, deal = {} } = this.props;
    const list = this.getList();
    const { realName, mobile } = list.find(item => item.id === id);
    if (onChange) {
      onChange({
        ...deal,
        pubAccountId: id,
        pubMobile: mobile,
        pubRealName: realName,
      });
    }
  };

  handleVisibleChange = visible => {
    this.setState({
      visible,
    });
  };

  handleCreateUser = ({ close }, formData) => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'pubuser/createUser',
      payload: formData,
    }).then(userInfo => {
      // 使表单的select选中，searchValue是刚才的
      form.setFieldsValue({
        pubAccountId: userInfo.id,
      });
      this.handleSelectChange(userInfo.id);
      close();
    });
  };

  render() {
    const { fetchLoading, form, deal = {} } = this.props;

    const { mobileForCreate, visible } = this.state;

    const { getFieldDecorator } = form;

    const list = this.getList();

    const tempId = form.getFieldValue('pubAccountId') || deal.pubAccountId;

    return (
      <Card>
        <CreateUserModal
          mobile={mobileForCreate}
          visible={visible}
          onVisibleChange={this.handleVisibleChange}
          onOk={this.handleCreateUser}
        />
        <h2 className="text-center">请输入会员姓名或手机号进行下一步</h2>
        <Divider />
        <Form {...this.formItemLayout}>
          <Form.Item label="会员姓名">
            {getFieldDecorator('pubAccountId', {
              initialValue: deal.pubAccountId,
              rules: [
                {
                  required: true,
                  message: '请选择会员手机或会员姓名',
                },
              ],
            })(
              <Select
                placeholder="请输入"
                showSearch
                onSearch={value => this.fetch(0, value)}
                defaultActiveFirstOption={false}
                filterOption={false}
                optionLabelProp="realname"
                notFoundContent={fetchLoading ? <Spin /> : undefined}
                onChange={this.handleSelectChange}
              >
                {list.map(item => (
                  <Select.Option key={item.id} value={item.id} realname={item.realName}>
                    {item.realName}/{item.mobile}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="会员手机号">
            {getFieldDecorator('pubAccountId', {
              initialValue: deal.pubAccountId,
              rules: [
                {
                  required: true,
                  message: '请选择会员手机号',
                },
              ],
            })(
              <Select
                placeholder="请输入"
                showSearch
                onSearch={value => this.fetch(1, value)}
                defaultActiveFirstOption={false}
                filterOption={false}
                optionLabelProp="mobile"
                notFoundContent={fetchLoading ? <Spin /> : undefined}
                onChange={this.handleSelectChange}
              >
                {list.map(item => (
                  <Select.Option key={item.id} value={item.id} mobile={item.mobile}>
                    {item.realName}/{item.mobile}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Form>
        {tempId && (
          <div className="text-center">
            <Link to={`/basic/pub/info/${tempId}`}>去完善更多信息</Link>
          </div>
        )}
      </Card>
    );
  }
}

export default User;
