import omit from 'omit.js';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, message, Button, Alert } from 'antd';
import MarginBar from '@/components/MarginBar';
import { checkPassword } from '@/commons/lib/validator';
import { RSAEncrypt } from '@/commons/lib/security';
import { formItemLayoutFull } from '@/utils/utils';
import Modal from '.';

function ChangePasswordModal(props) {
  const { form, onOk, type, id, changePwdForce, ...restProps } = props;

  const dispatch = useDispatch();
  const { sysUser } = useSelector(state => state.user.currentUser);
  const saving = useSelector(state => state.loading.effects['user/changeMypwd']);

  const { sysUserId } = sysUser || {};
  return (
    <Modal
      title="修改密码"
      {...restProps}
      footer={changePwdForce ? [<Button key="ok" link="ok" loading={saving} />] : undefined}
      onCancel={
        changePwdForce
          ? () => {
              message.warn('系统已进行网络安全升级，请更改密码后再使用');
            }
          : undefined
      }
      onOk={arg => {
        const { deepCallOk } = arg;
        form.validateFieldsAndScroll(async (err, formData) => {
          if (err) {
            return;
          }
          const values = omit(formData, ['qPwd']);
          deepCallOk(() =>
            dispatch({
              type: 'user/changeMypwd',
              payload: {
                opwd: RSAEncrypt(values.opwd),
                pwd: RSAEncrypt(values.pwd),
                id: sysUserId,
              },
            }).then(() => {
              message.success('修改成功');
              dispatch({
                type: 'login/logout',
              });
            })
          );
        });
        return false;
      }}
    >
      {changePwdForce && (
        <MarginBar bottom>
          <Alert message="温馨提示：系统已进行网络安全升级，请更改密码后再使用" type="warning" showIcon />
        </MarginBar>
      )}
      <Form {...formItemLayoutFull}>
        <Form.Item label="旧密码">
          {form.getFieldDecorator('opwd', {
            rules: [
              {
                required: true,
                message: '请填写',
              },
            ],
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item label="新密码">
          {form.getFieldDecorator('pwd', {
            rules: [
              {
                required: true,
                message: '请填写',
              },
              {
                message: `请输入字母数字组合的8-16位密码`,
                isPwdLimit8: true,
                validator: checkPassword,
              },
            ],
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item label="重复新密码">
          {form.getFieldDecorator('qPwd', {
            rules: [
              {
                required: true,
                message: '请填写',
              },
              {
                message: `请输入字母数字组合的8-16位密码`,
                isPwdLimit8: true,
                validator: checkPassword,
              },
              {
                message: '两次密码不一致',
                validator: (rule, value, fn) => {
                  if (value === form.getFieldValue('pwd')) {
                    fn();
                    return;
                  }
                  fn([new Error('invalid')]);
                },
              },
            ],
          })(<Input.Password />)}
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default Form.create()(ChangePasswordModal);
