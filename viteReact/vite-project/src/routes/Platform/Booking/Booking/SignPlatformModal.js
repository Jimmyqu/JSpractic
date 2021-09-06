import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Input, Button, Spin } from 'antd';
import Modal from '@/components/Modal';

export default function (props) {
  const { onOk, visible, ...restProps } = props;
  const fetching = useSelector(state => state.loading.effects['global/queryByCode']);
  const [inputValue, setInputValue] = useState('');

  let textInput;

  function focus() {
    if (textInput) {
      textInput.focus();
    }
  }

  function press(value) {
    setInputValue('');
    onOk(value);
  }

  useEffect(() => {
    if (visible) {
      setInputValue('');
      focus();
    }
  }, [visible]);

  return (
    <Modal
      title="签到核验"
      visible={visible}
      {...restProps}
      footer={[
        <Button key="cancel" link="cancel" disabled={fetching}>
          关闭
        </Button>,
        <Button key="primary" type="primary" disabled={fetching || !inputValue} onClick={() => press(inputValue)}>
          确认
        </Button>,
      ]}
    >
      <Spin spinning={!!fetching} tip="请稍后...">
        <Input
          placeholder="请打开扫码枪扫描订单二维码或手工输入验证码"
          size="large"
          value={inputValue}
          ref={input => {
            textInput = input;
            focus();
          }}
          onChange={e => setInputValue(e.target.value)}
          onPressEnter={e => press(e.target.value)}
        />
      </Spin>
    </Modal>
  );
}
