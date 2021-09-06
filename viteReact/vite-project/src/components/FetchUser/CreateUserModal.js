import { Component } from 'react';
import { Form, Input } from 'antd';
import Modal from '@/components/Modal';
import MarginBar from '@/components/MarginBar';
import { formItemLayoutNormal } from '@/utils/utils';

@Form.create()
class CreateUserModal extends Component {
  sure = ({ deepCallOk }) => {
    const { onOk, form, mobile } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      deepCallOk(onOk, {
        mobile,
        ...formData,
      });
    });
    return false;
  };

  render() {
    const { form, mobile, onOk, ...restProps } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Modal title="创建用户" {...restProps} onOk={this.sure}>
        未检索到相关用户，现在创建？
        <MarginBar top>
          <Form {...formItemLayoutNormal}>
            <Form.Item label="手机号">
              <Input value={mobile} disabled />
            </Form.Item>
            <Form.Item label="姓名">
              {getFieldDecorator('realName', {
                rules: [
                  {
                    required: true,
                    message: '请填写姓名',
                  },
                ],
              })(<Input />)}
            </Form.Item>
          </Form>
        </MarginBar>
      </Modal>
    );
  }
}

export default CreateUserModal;
