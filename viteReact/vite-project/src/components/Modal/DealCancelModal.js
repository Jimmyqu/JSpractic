import { Component } from 'react';
import { connect } from 'react-redux';
import { Alert, Tag, Input, Form, message } from 'antd';
import MarginBar from '@/components/MarginBar';
import { modal } from '@/utils/feedback';
import Modal from '.';
import style from './deal-cancel.less';

const { CheckableTag } = Tag;

@connect(({ deal, loading }) => ({
  deal,
  isloading: loading.effects['deal/delete'],
  isMutliloading: loading.effects['deal/deleteMulti'],
}))
class DealCancelModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMsg: props.initialSelectedMsg,
      textAreaValue: undefined,
      area: {
        validateStatus: null,
        errorMsg: null,
      },
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { visible: nextVisible } = nextProps;
    const { visible, dispatch } = this.props;
    if (visible && !nextVisible) {
      dispatch({
        type: 'deal/breakPolling',
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'deal/breakPolling',
    });
  }

  handleChange = msg => {
    this.setState(
      () => ({
        selectedMsg: msg,
        textAreaValue: null,
      }),
      () => {
        this.chkValidateStatus();
      }
    );
  };

  handleTextAreaChange = e => {
    const textAreaValue = e.target.value;
    this.setState(
      () => ({
        selectedMsg: null,
        textAreaValue,
      }),
      () => {
        this.chkValidateStatus();
      }
    );
  };

  sure = arg => {
    const {
      onSure,
      onOk,
      dealId,
      dispatch,
      isloading,
      isMutliloading,
      confirmMessage = '确定要取消订单吗？',
    } = this.props;
    const { deepCallOk } = arg;
    if (this.chkValidateStatus()) {
      if (onSure) {
        return onSure(arg);
      }
      modal.confirm(confirmMessage, {
        onOk: () => {
          const { selectedMsg, textAreaValue } = this.state;
          const msg = selectedMsg || textAreaValue;
          deepCallOk(() => {
            if (Array.isArray(dealId)) {
              dispatch({
                type: 'deal/deleteMulti',
                payload: {
                  dealIds: dealId,
                  cancelMessage: msg,
                },
              }).then(() => {
                message.success('操作成功');
                onOk(arg, {
                  dealId,
                  message: msg,
                });
              });
              return;
            }
            return dispatch({
              type: 'deal/delete',
              payload: {
                dealId,
                cancelMessage: msg,
              },
            }).then(() => {
              message.success('操作成功');
              onOk();
            });
          });
        },
        confirmLoading: isloading || isMutliloading,
      });
    }
    return false;
  };

  chkValidateStatus() {
    const { selectedMsg, textAreaValue } = this.state;
    const error =
      (selectedMsg == null || selectedMsg.trim().length === 0) &&
      (textAreaValue == null || textAreaValue.trim().length === 0);
    this.setState({
      area: error
        ? {
            validateStatus: 'error',
            errorMsg: '请填写取消原因，或者选择一个取消原因',
          }
        : {},
    });
    return !error;
  }

  render() {
    const {
      dealId,
      onOk,
      cancelMessageList = [
        '下错单了',
        '临时有事，来不了了',
        '多买了',
        '不想要了',
        '订单信息不符',
        '下雨了',
        '场地维修',
        '活动占用场地',
      ],
      deal,
      alertMessage = '取消订单后将自动退款',
      ...restProps
    } = this.props;
    const { selectedMsg, textAreaValue, area } = this.state;
    return (
      <Modal title={`订单号：${dealId}`} {...restProps} onOk={this.sure}>
        <Form>
          <Alert message={`${alertMessage}，请点击选择或填写原因`} type="info" />
          <Form.Item className={style.tagContainer}>
            {cancelMessageList.map(msg => (
              <MarginBar key={msg} top inline>
                <MsgTag handleChange={this.handleChange} message={msg} selectedMsg={selectedMsg} />
              </MarginBar>
            ))}
          </Form.Item>
          <Form.Item validateStatus={area.validateStatus} help={area.errorMsg}>
            <Input.TextArea
              placeholder="请选择或者手动在这里输入"
              rows={4}
              value={textAreaValue}
              onChange={this.handleTextAreaChange}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const MsgTag = ({ message: msg, selectedMsg, handleChange }) => {
  return (
    <CheckableTag onChange={() => handleChange(msg)} checked={selectedMsg === msg}>
      {msg}
    </CheckableTag>
  );
};

export { MsgTag };

export default DealCancelModal;
