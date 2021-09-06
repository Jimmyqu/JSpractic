import { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Divider } from 'antd';
import Content from '@/components/Datatable/Content';
import Modal from '@/components/Modal';
import { formItemLayoutNormal } from '@/utils/utils';
import InfomationField from './InfomationField';
import InfomationFields from './InfomationFields';

@connect(({ loading }) => ({
  fetching: loading.effects['pubuser/fetch'],
}))
class WithdrawContentAbs extends Component {
  state = {
    formValues: undefined,
  };

  componentDidMount() {
    const { dispatch, selectedRows } = this.props;
    dispatch({
      type: 'pubuser/fetch',
      payload: selectedRows[0].pubAccountId,
    });
  }

  // componentWillUnmount() {
  //   this.isUnmounted = true;
  // }

  handleVisibleChange = visible => {
    if (visible) {
      return;
    }
    this.setState({
      formValues: null,
    });
  };

  doSure = () => {
    const { form } = this.props;
    form.validateFieldsAndScroll((err, formValues) => {
      if (err) {
        return;
      }
      this.setState({
        formValues,
      });
    });
  };

  withdrawSure = arg => {
    const { sure = result => result } = this.props;
    const { formValues } = this.state;
    return sure(arg, formValues);
  };

  render() {
    const {
      form,
      dispatch,
      submiting,
      fetching,
      cancel = () => {},
      sure,
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      chargeAmount,
      alertInfomation,
      beforeFormItems,
      formItems,
      confirmModalChildren,
      ...restProps
    } = this.props;
    const formItemLayout = formItemLayoutNormal;

    const { formValues } = this.state;

    return (
      <Content
        {...restProps}
        buttons={[
          {
            text: '取消',
            disabled: submiting,
            loading: fetching,
            action: cancel,
          },
          {
            text: '确认',
            type: 'primary',
            loading: submiting || fetching,
            action: this.doSure,
          },
        ]}
      >
        <Row>
          <Col md={12}>
            <Form {...formItemLayout}>
              {alertInfomation && <InfomationField data={alertInfomation} />}
              <Divider orientation="left">服务信息</Divider>
              <InfomationFields data={selectedRows[0]} />
              {beforeFormItems}
              <Divider />
              {formItems}
            </Form>
          </Col>
        </Row>

        <Modal
          visible={formValues != null}
          onVisibleChange={this.handleVisibleChange}
          title="请核对折现信息"
          onOk={this.withdrawSure}
        >
          {confirmModalChildren}
        </Modal>
      </Content>
    );
  }
}

export default WithdrawContentAbs;
