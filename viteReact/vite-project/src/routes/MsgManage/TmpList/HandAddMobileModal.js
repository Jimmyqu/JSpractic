import { Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@/components/Modal';
import { isMobile } from '@/utils/utils';

const formItemLayout = {
  labelCol: { md: 3 },
  wrapperCol: { md: 21 },
};

function HandAddMobileModal({
  onVisibleChange,
  messagePushConfigId,
  fetchMessageInfo,
  onFail = () => {},
  form,
  ...restProps
}) {
  const dispatch = useDispatch();
  const { validateFieldsAndScroll, getFieldDecorator } = form;
  const saveing = useSelector(state => state.loading.effects['message/mobileLoad']);

  const saveMobileLoad = arg => {
    return dispatch({
      type: 'message/mobileLoad',
      payload: {
        mobiles: arg.mobiles,
        messagePushConfigId,
        isForce: arg.isForce,
      },
    }).then(result => {
      if (result.tips !== 200) {
        onFail({ ...result, onConfirm: () => saveMobileLoad({ ...arg, isForce: true }) });
      } else {
        fetchMessageInfo();
      }
    });
  };

  return (
    <Modal
      title="手动添加"
      width={700}
      onVisibleChange={onVisibleChange}
      {...restProps}
      footer={[<Button key="close" link="cancel" />, <Button key="ok" link="ok" disabled={saveing} />]}
      onOk={arg => {
        validateFieldsAndScroll(async (err, formData) => {
          if (err) {
            return;
          }
          arg.deepCallOk(() => {
            return saveMobileLoad({ ...arg, isForce: false, mobiles: formData.mobiles.replace(/\n/g, ',') });
          });
        });
        return false;
      }}
    >
      <Form {...formItemLayout}>
        <Form.Item label="手机号码">
          {getFieldDecorator('mobiles', {
            rules: [
              {
                required: true,
                message: '请填写手机号',
              },
              {
                message: '手机号码输入有误',
                validator: (rule, value, fn) => {
                  const mobiles = value.replace(/\n/g, ',').replace(/,$/gi, '').split(',');
                  const res = mobiles.every(item => {
                    return isMobile(item);
                  });
                  if (res) {
                    fn([]);
                  } else {
                    fn([new Error('invalid')]);
                  }
                },
              },
            ],
          })(<Input.TextArea placeholder="手动输入使用回车分割号码" rows={5} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default Form.create()(HandAddMobileModal);
