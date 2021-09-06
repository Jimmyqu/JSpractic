import { Form, Select, message, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { formItemLayoutNormal } from '@/utils/utils';
import Modal from '@/components/Modal';

function ExamineModal({ messagePushConfigId, form, onOk = () => {}, ...restProps }) {
  const dispatch = useDispatch();
  const { AuthStatus } = useSelector(state => state.message);
  const { getFieldDecorator, validateFieldsAndScroll } = form;

  return (
    <Modal
      title="审核"
      {...restProps}
      onOk={arg => {
        validateFieldsAndScroll(async (err, formData) => {
          if (err) {
            return;
          }

          arg.deepCallOk(() => {
            return dispatch({
              type: 'message/runSend',
              payload: {
                ...formData,
                messagePushConfigId,
              },
            }).then(() => {
              message.success('提交成功');
              onOk();
            });
          });
        });
        return false;
      }}
    >
      <Form {...formItemLayoutNormal}>
        <Form.Item label="审核">
          {getFieldDecorator('authStatus', {
            rules: [
              {
                required: true,
                message: '请选择审核状态',
              },
            ],
          })(
            <Select placeholder="请选择">
              {Object.values(AuthStatus).map(
                item =>
                  item.key !== AuthStatus.Examineing.key &&
                  item.key !== AuthStatus.Editing.key && (
                    <Select.Option key={item.key} value={item.key}>
                      {item.value}
                    </Select.Option>
                  )
              )}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="备注">{getFieldDecorator('descr')(<Input.TextArea placeholder="备注" rows={3} />)}</Form.Item>
      </Form>
    </Modal>
  );
}

export default Form.create()(ExamineModal);
