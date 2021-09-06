import { Component } from 'react';
import { connect } from 'react-redux';
import { Alert, Input, Form, message } from 'antd';
import MarginBar from '@/components/MarginBar';
import Modal from '.';
import { MsgTag } from './DealCancelModal';
import style from './deal-cancel.less';

@connect(({ booking }) => ({
  booking,
}))
class PlatformLockModal extends Component {
  state = {
    selectedMsg: undefined,
    lockMessage: undefined,
    sellerMessage: undefined,
    area: {
      validateStatus: null,
      errorMsg: null,
    },
  };

  lockMessages = ['场地维修', '活动占场', '赛事占场', '无灯光', '漏雨', '接待', '锁场', '闭馆'];

  handleChange = msg => {
    this.setState(
      () => ({
        selectedMsg: msg,
        lockMessage: null,
      }),
      () => {
        this.chkValidateStatus();
      }
    );
  };

  handlelockMessageChange = e => {
    const lockMessage = e.target.value;
    this.setState(
      () => ({
        selectedMsg: null,
        lockMessage,
      }),
      () => {
        this.chkValidateStatus();
      }
    );
  };

  handleSellerMessageChange = e => {
    this.setState({
      sellerMessage: e.target.value,
    });
  };

  sure = arg => {
    const { deepCallOk } = arg;
    if (this.chkValidateStatus()) {
      const { onOk, lockId, list, dispatch } = this.props;
      const { selectedMsg, lockMessage, sellerMessage } = this.state;
      const msg = selectedMsg || lockMessage;
      deepCallOk(() => {
        return dispatch(
          lockId
            ? {
                type: 'booking/changeBookingLock',
                payload: {
                  lockId,
                  saveVOList: list,
                  lockMessage: msg,
                  sellerMessage,
                },
              }
            : {
                type: 'booking/bookingLock',
                payload: {
                  saveVOList: list,
                  lockMessage: msg,
                  sellerMessage,
                },
              }
        ).then(() => {
          message.success(`${lockId ? '修改' : ''}锁场成功`);
          onOk(arg, lockId);
        });
      });
    }
    return false;
  };

  chkValidateStatus() {
    const { selectedMsg, lockMessage } = this.state;
    const error =
      (selectedMsg == null || selectedMsg.trim().length === 0) &&
      (lockMessage == null || lockMessage.trim().length === 0);
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
    const { lockId, onOk, ...restProps } = this.props;
    const { selectedMsg, lockMessage, sellerMessage, area } = this.state;
    return (
      <Modal title={lockId ? '修改锁场' : '锁场'} {...restProps} onOk={this.sure}>
        <Form>
          <Alert message=" 锁场后不可在预订，仅对内显示锁场，手机端将显示灰色已预订" type="info" />
          <Form.Item className={style.tagContainer}>
            {this.lockMessages.map(msg => (
              <MarginBar key={msg} top inline>
                <MsgTag handleChange={this.handleChange} message={msg} selectedMsg={selectedMsg} />
              </MarginBar>
            ))}
          </Form.Item>
          <Form.Item label="备注" validateStatus={area.validateStatus} help={area.errorMsg}>
            <Input.TextArea
              placeholder="请选择或者手动在这里输入（限50个字符）"
              rows={4}
              value={lockMessage}
              maxLength={50}
              onChange={this.handlelockMessageChange}
            />
          </Form.Item>
          <Form.Item label="商家留言">
            <Input.TextArea
              placeholder="限16个字符，客户端将显示"
              rows={4}
              value={sellerMessage}
              maxLength={16}
              onChange={this.handleSellerMessageChange}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default PlatformLockModal;
