import { Form, Select, Input } from 'antd';
import CountInput from '@/components/CountInput';
import Modal from '@/components/Modal';
import MarginBar from '@/components/MarginBar';
import { formItemLayoutNormal } from '@/utils/utils';

function CorrectStock({ onOk, form, ...restProps }) {
  const { getFieldDecorator } = form;

  const sure = ({ deepCallOk }) => {
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      deepCallOk(onOk, {
        ...formData,
      });
    });
    return false;
  };

  return (
    <Modal title="更正库存" {...restProps} onOk={sure}>
      <div className="text-center red">注：更正库存是指减去多余的库存数量</div>
      <MarginBar top>
        <Form {...formItemLayoutNormal}>
          <Form.Item label="更正库存类型">
            <Select placeholder="更正库存类型" defaultValue="0">
              <Select.Option key="0">减少</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="更正数量">
            {getFieldDecorator('num', {
              rules: [
                {
                  message: '请填写更正数量',
                  validator(rule, value, fn) {
                    if (value > 0) {
                      fn();
                      return;
                    }
                    fn([new Error('invalid')]);
                  },
                },
              ],
            })(<CountInput fullWidth min={1} placeholder="0" />)}
          </Form.Item>
          <Form.Item label="备注">
            {getFieldDecorator('descr')(<Input.TextArea placeholder="请填写" rows={3} />)}
          </Form.Item>
        </Form>
      </MarginBar>
    </Modal>
  );
}

export default Form.create()(CorrectStock);
