import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Input, DatePicker, Alert } from 'antd';
import { formItemLayoutNormal } from '@/utils/utils';
import Modal from '.';

const { RangePicker } = DatePicker;

@Form.create()
@connect()
class BanModal extends Component {
  static propTypes = {
    userInfo: PropTypes.shape({
      id: PropTypes.number,
      realName: PropTypes.string,
      mobile: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
  };

  sure = arg => {
    const {
      form,
      onOk,
      userInfo: { id },
      dispatch,
    } = this.props;
    form.validateFields(async (err, formValues) => {
      if (err) {
        return;
      }

      const formData = formValues;
      const {
        limitedDate: [limitedStartDate, limitedEndDate],
      } = formData;
      delete formData.limitedDate;

      arg.deepCallOk(() => {
        return dispatch({
          type: 'global/addBanUser',
          payload: {
            ...formData,
            publicAccountId: id,
            limitedStartDate: limitedStartDate.valueOf(),
            limitedEndDate: limitedEndDate.valueOf(),
          },
        }).then(() => {
          onOk(arg, formValues);
        });
      });
    });
    return false;
  };

  render() {
    const { onOk, form, userInfo, ...restProps } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal title="加入黑名单" {...restProps} onOk={this.sure}>
        <Form {...formItemLayoutNormal}>
          <Form.Item label="会员">
            <Input disabled value={`${userInfo.realName}/${userInfo.mobile}`} />
          </Form.Item>
          <Form.Item label="限制日期">
            {getFieldDecorator('limitedDate', {
              rules: [
                {
                  required: true,
                  message: '请选择限制日期',
                },
              ],
            })(<RangePicker />)}
          </Form.Item>
          <Form.Item label="原因">
            {getFieldDecorator('limitedReason', {
              rules: [
                {
                  required: true,
                  message: '请填写限制原因',
                },
              ],
            })(<Input.TextArea />)}
          </Form.Item>
          <Form.Item colon={false} label="&nbsp;">
            <Alert message="加入黑名单后用户将无法下单" type="warning" />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default BanModal;
