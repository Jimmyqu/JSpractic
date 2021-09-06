import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Select, message } from 'antd';
import CountInput from '@/components/CountInput';
import Modal from '@/components/Modal';
import { formItemLayoutNormal, isNumber } from '@/utils/utils';
import { formatDate, formatHM } from '@/utils/format';

function EditSalesQuotaModal({ form, referData, date, onOk, ...restProps }) {
  const dispatch = useDispatch();
  const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
  const { courseDataId, classStartTime, classEndTime, singleBookingSurplusNum } = referData || {};

  const surplusNum = singleBookingSurplusNum || 0;

  const operation = getFieldValue('operation');

  const max = operation === 1 ? surplusNum : undefined;

  useEffect(() => {
    setFieldsValue({
      num: 0,
    });
  }, [operation]);

  return (
    <Modal
      title="调整名额"
      {...restProps}
      onOk={arg => {
        const { deepCallOk } = arg;
        form.validateFieldsAndScroll(async (err, formData) => {
          if (err) {
            return;
          }
          deepCallOk(() =>
            dispatch({
              type: 'pubcourse/updateCourseSurplusNum',
              payload: {
                ...formData,
                courseDataId,
              },
            }).then(() => {
              message.success('修改成功');
              onOk(arg, formData);
            })
          );
        });
        return false;
      }}
    >
      <Form {...formItemLayoutNormal}>
        <Form.Item label="已选择时间">
          <span className="red">
            {formatDate(date)} {formatHM(classStartTime)}-{formatHM(classEndTime)}
          </span>
        </Form.Item>
        <Form.Item label="当前剩余名额">{surplusNum}</Form.Item>
        <Form.Item label="调整类型">
          {getFieldDecorator('operation', {
            rules: [
              {
                required: true,
                message: '请选择调整类型',
              },
            ],
          })(
            <Select placeholder="请选择">
              <Select.Option value={0}>增加人数</Select.Option>
              <Select.Option value={1}>减少人数</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="调整数量">
          {getFieldDecorator('num', {
            rules: [
              {
                required: true,
                message: '请填写调整数量',
              },
              {
                message: '调整数量不能为0',
                validator: (rule, value, fn) => {
                  if (!isNumber(value) || value > 0) {
                    fn();
                    return;
                  }
                  fn([new Error('invalid')]);
                },
              },
            ],
          })(<CountInput placeholder="请填写调整数量" max={max} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default Form.create()(EditSalesQuotaModal);
