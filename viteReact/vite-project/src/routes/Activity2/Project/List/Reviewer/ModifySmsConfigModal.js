import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Input, Switch } from 'antd';
import Modal from '@/components/Modal';
import { formItemLayoutNormal } from '@/utils/utils';

const ModifySmsConfigModal = ({ auditIds, onOk, selectedIds, form, ...restProps }) => {
  const dispatch = useDispatch();
  const saving = useSelector(state => state.loading.effects['activity2/modifySmsConfig']);
  const [isRecieveMessage, setIsRecieveMessage] = useState(false);
  const [descr, setDescr] = useState('');

  useEffect(() => {
    setIsRecieveMessage(auditIds.some(item => item.receiveMessage === true));
  }, [auditIds.some(item => item.receiveMessage === true)]);

  return (
    <Modal
      title="编辑短信配置"
      width={768}
      {...restProps}
      footer={[<Button key="close" link="cancel" disabled={saving} />, <Button key="ok" link="ok" loading={saving} />]}
      onOk={arg => {
        return dispatch({
          type: 'activity2/modifySmsConfig',
          payload: {
            auditUserIds: auditIds.map(item => item.id),
            descr,
            isRecieveMessage,
          },
        }).then(() => {
          onOk(arg);
        });
      }}
    >
      <Form {...formItemLayoutNormal}>
        <Form.Item label="是否接受通知">
          <Switch checked={isRecieveMessage} onChange={() => setIsRecieveMessage(!isRecieveMessage)} />
        </Form.Item>
        <Form.Item label="备注">
          <Input.TextArea placeholder="最多输入500字" onChange={e => setDescr(e.target.value)} maxLength="500" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModifySmsConfigModal;
