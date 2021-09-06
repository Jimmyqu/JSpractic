import { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Alert, Input, Form, message } from 'antd';
import MarginBar from '@/components/MarginBar';
import Item, { ItemTypes, genClassComposeStateChangeHandler } from '@/components/Datatable/Item';
import { modal } from '@/utils/feedback';
import { isSameDay, formItemLayoutFull } from '@/utils/utils';
import Modal from '.';
import { MsgTag } from './DealCancelModal';
import style from './deal-cancel.less';

@connect(({ pubplatform }) => ({
  pubplatform,
}))
@Form.create()
class PlatformLockedCancelModal extends Component {
  handleComposeStateChange = genClassComposeStateChangeHandler.call(this);

  lockCancelMessages = ['已修好', '活动已取消', '赛事已取消', '下错了'];

  state = {
    selectedMsg: undefined,
    composeStateMapping: {},
    lockDateList: undefined,
  };

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { visible: nextVisible } = nextProps;
    const { visible } = this.props;
    if (nextVisible !== visible) {
      this.setState({
        composeStateMapping: {},
      });
      const { dispatchData, withDateRange, dispatch } = nextProps;
      if (nextVisible && withDateRange) {
        const { id: platformForeverId } = dispatchData.payload;
        dispatch({
          type: 'pubplatform/fetchFoeverLockedExcludeDate',
          payload: platformForeverId,
        }).then(data => {
          const { lockDateList } = data || {};
          this.setState({
            lockDateList,
          });
        });
      }
    }
  }

  getExcludeDate = value => {
    const { lockDateList } = this.state;
    if (lockDateList == null) {
      return false;
    }
    return lockDateList.some(item => isSameDay(item, value));
  };

  handleChange = msg => {
    this.setState({
      selectedMsg: msg,
    });
    const { form } = this.props;
    form.setFieldsValue({
      cancelMessage: null,
    });
  };

  handleMessageChange = () => {
    this.setState({
      selectedMsg: null,
    });
  };

  sure = arg => {
    const { deepCallOk } = arg;
    const { onOk, dispatch, dispatchData, form } = this.props;
    const { selectedMsg } = this.state;
    form.validateFieldsAndScroll((err, formData) => {
      if (err) {
        return;
      }
      const { startDate, endDate, cancelMessage } = formData;
      modal.confirm('确定要取消该时段锁场吗？', {
        onOk: () => {
          deepCallOk(() => {
            return dispatch({
              ...dispatchData,
              payload: {
                ...dispatchData.payload,
                ...formData,
                startDate: startDate ? startDate.valueOf() : null,
                endDate: endDate ? endDate.valueOf() : null,
                cancelMessage: cancelMessage || selectedMsg,
              },
            }).then(() => {
              message.success('取消成功');
              onOk(arg);
            });
          });
        },
      });
    });
    return false;
  };

  render() {
    const { dispatchData, onOk, form, withDateRange, ...restProps } = this.props;
    const { selectedMsg, composeStateMapping } = this.state;
    return (
      <Modal title="取消锁场" {...restProps} onOk={this.sure}>
        <Alert message="取消锁场，是指已选场地，选定时间段中的锁场信息，按日期删除！" type="info" />
        <Form>
          {withDateRange && (
            <Form.Item {...formItemLayoutFull} label="取消时段" className="form-item-pair" labelAlign="left" required>
              <Form.Item>
                {form.getFieldDecorator('startDate', {
                  initialValue: moment(withDateRange[0]),
                  rules: [
                    {
                      required: true,
                      message: '请选择课程开始时间',
                    },
                  ],
                })(
                  <Item
                    compose="1"
                    type={ItemTypes.DatePickerRangeStart}
                    form={form}
                    min={withDateRange[0]}
                    disabledDate={this.getExcludeDate}
                    composeStateMapping={composeStateMapping}
                    handleComposeStateChange={this.handleComposeStateChange}
                  />
                )}
              </Form.Item>
              <span>-</span>
              <Form.Item>
                {form.getFieldDecorator('endDate', {
                  initialValue: moment(withDateRange[1]),
                  rules: [
                    {
                      required: true,
                      message: '请选择课程结束时间',
                    },
                  ],
                })(
                  <Item
                    compose="1"
                    type={ItemTypes.DatePickerRangeEnd}
                    form={form}
                    max={withDateRange[1]}
                    disabledDate={this.getExcludeDate}
                    composeStateMapping={composeStateMapping}
                    handleComposeStateChange={this.handleComposeStateChange}
                  />
                )}
              </Form.Item>
            </Form.Item>
          )}

          <Form.Item className={style.tagContainer}>
            {this.lockCancelMessages.map(msg => (
              <MarginBar key={msg} top inline>
                <MsgTag handleChange={this.handleChange} message={msg} selectedMsg={selectedMsg} />
              </MarginBar>
            ))}
          </Form.Item>

          <Form.Item>
            {form.getFieldDecorator('cancelMessage', {
              rules: [
                selectedMsg == null && {
                  required: true,
                  message: '请填写取消原因',
                },
              ].filter(Boolean),
            })(<Input.TextArea placeholder="请选择或者手动在这里输入" rows={4} onChange={this.handleMessageChange} />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default PlatformLockedCancelModal;
