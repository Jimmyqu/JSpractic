import { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Input, Form, message } from 'antd';
import { modal } from '@/utils/feedback';
import Modal from '.';

@connect(({ pubinvoice }) => ({
  pubinvoice,
}))
@Form.create()
class InvoiceCancelModal extends Component {
  formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  static propTypes = {
    invoiceId: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
  };

  static defaultProps = {
    invoiceId: undefined,
  };

  sure = arg => {
    const { form, dispatch, invoiceId, onOk } = this.props;
    form.validateFieldsAndScroll((err, formData) => {
      if (err) {
        return;
      }
      const { deepCallOk } = arg;
      modal.confirm('确定要作废吗？', {
        onOk: () => {
          deepCallOk(() => {
            return dispatch({
              type: 'pubinvoice/cancelInvoice',
              payload: {
                ...formData,
                invoiceListIds: invoiceId,
              },
            }).then(() => {
              message.success('作废成功');
              onOk(arg, {
                ...formData,
                invoiceId,
              });
            });
          });
        },
      });
    });

    return false;
  };

  render() {
    const { invoiceId, onOk, form, ...restProps } = this.props;
    return (
      <Modal title={`作废发票：${invoiceId}`} {...restProps} onOk={this.sure}>
        <Form {...this.formItemLayout}>
          <Form.Item label="作废说明">
            {form.getFieldDecorator('cancelNote', {
              rules: [
                {
                  required: true,
                  message: '请填写作废说明',
                },
              ],
            })(<Input.TextArea rows={4} />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default InvoiceCancelModal;
