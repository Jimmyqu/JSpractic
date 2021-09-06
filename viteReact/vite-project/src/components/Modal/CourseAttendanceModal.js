import { useDispatch } from 'react-redux';
import { Form, Input, Select, message } from 'antd';
import { formItemLayoutNormal } from '@/utils/utils';
import Modal from '.';

function CourseAttendanceModal({ form, data, onOk = () => {}, ...restProps }) {
  const dispatch = useDispatch();
  const { publicStudyCourseId } = data || {};

  const type = form.getFieldValue('type');
  return (
    <Modal
      title="考勤"
      {...restProps}
      onOk={arg => {
        const { deepCallOk } = arg;
        form.validateFieldsAndScroll(async (err, formData) => {
          if (err) {
            return;
          }
          const { type: caseKey, ...values } = formData;
          deepCallOk(() =>
            dispatch({
              type: 'pubcourse/batchSign',
              payload: {
                ...values,
                [[null, 'signIn', 'signOut', 'eventTime'][caseKey]]: Date.now(),
                ids: [publicStudyCourseId],
              },
            }).then(() => {
              message.success('考勤成功');
              onOk();
            })
          );
        });
        return false;
      }}
    >
      <Form {...formItemLayoutNormal}>
        <Form.Item label="考勤类型">
          {form.getFieldDecorator('type', {
            rules: [
              {
                required: true,
                message: '请选择考勤类型',
              },
            ],
          })(
            <Select placeholder="请选择">
              <Select.Option value={1}>签到</Select.Option>
              <Select.Option value={2}>签退</Select.Option>
              <Select.Option value={3}>其他事件</Select.Option>
            </Select>
          )}
        </Form.Item>
        {type === 3 && (
          <Form.Item label="事件标签">
            {form.getFieldDecorator('eventTag', {
              rules: [
                {
                  required: true,
                  message: '请选择事件标签',
                },
              ],
            })(
              <Select placeholder="请选择">
                <Select.Option value="迟到">迟到</Select.Option>
                <Select.Option value="早退">早退</Select.Option>
                <Select.Option value="请假">请假</Select.Option>
                <Select.Option value="旷课">旷课</Select.Option>
                <Select.Option value="其他">其他</Select.Option>
              </Select>
            )}
          </Form.Item>
        )}
        <Form.Item label="备注/说明">
          {form.getFieldDecorator('eventDescr')(<Input.TextArea placeholder="请填写" />)}
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default Form.create()(CourseAttendanceModal);
