import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Select } from 'antd';
import { formItemLayoutNormal } from '@/utils/utils';
import { checkIDCardNumber, checkNumber } from '@/commons/lib/validator';
import Modal from '.';

function BindingSimpleModal({ onOk, userId, dataId, relType, form, ...restProps }) {
  const { getFieldDecorator, validateFieldsAndScroll, getFieldValue, validateFields } = form;
  const dispatch = useDispatch();
  const { MagneticCardTypes } = useSelector(state => state.pubticket);

  const icType = getFieldValue('icType');
  const useIDCard = icType === MagneticCardTypes.IDCard.key;

  useEffect(() => {
    if (icType != null) {
      validateFields(['icNo']);
    }
  }, [useIDCard]);

  return (
    <Modal
      title="绑定IC/物理卡"
      {...restProps}
      onOk={arg => {
        validateFieldsAndScroll(async (err, formData) => {
          if (err) {
            return;
          }

          const formValues = {
            ...formData,
            userId,
            dataId,
            relType,
          };

          arg.deepCallOk(() => {
            return dispatch({
              type: 'global/addICCardBinding',
              payload: formValues,
            }).then(() => {
              onOk(arg, formValues);
            });
          });
        });
        return false;
      }}
    >
      <Form {...formItemLayoutNormal}>
        <Form.Item label="绑定卡号">
          {getFieldDecorator('icNo', {
            rules: [
              {
                required: true,
                message: '请填写卡号',
              },
              useIDCard && {
                message: '请输入合法的身份证号码',
                validator: checkIDCardNumber,
              },
            ].filter(Boolean),
          })(<Input placeholder="卡号" />)}
        </Form.Item>
        <Form.Item label="绑定物理卡号">
          {getFieldDecorator('icPhysicsNo', {
            rules: [
              getFieldValue('icPhysicsNo') && {
                message: '请填写正确的物理卡号',
                validator: checkNumber,
              },
            ].filter(Boolean),
          })(<Input placeholder="卡号" />)}
        </Form.Item>
        <Form.Item label="卡类型">
          {getFieldDecorator('icType', {
            rules: [
              {
                required: true,
                message: '请选择卡类型',
              },
            ],
          })(
            <Select placeholder="卡类型">
              {Object.values(MagneticCardTypes).map(item => (
                <Select.Option key={item.key} value={item.key}>
                  {item.value}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="备注">{getFieldDecorator('descr')(<Input.TextArea placeholder="备注" rows={3} />)}</Form.Item>
      </Form>
    </Modal>
  );
}

export default Form.create()(BindingSimpleModal);
