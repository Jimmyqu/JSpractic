import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, message, Button, InputNumber } from 'antd';
import Modal from '.';

const { TextArea } = Input;

export default function (props) {
  const {
    deal: { id, userMessage, sellerMessage, checkPersonNum },
    dealRefresh,
    SaveTypes,
    type,
    ...restProps
  } = props;
  const [current, setCurrent] = useState();
  const [okBtndisabled, setOkBtndisabled] = useState(true);
  const saving = useSelector(state => state.loading.effects['orderprocessing/saveMessage']);
  const dispatch = useDispatch();

  const handleTextAreaChange = value => {
    setCurrent(value);
    if (!value) {
      setOkBtndisabled(true);
      return;
    }
    setOkBtndisabled(false);
  };

  const handleSaveMessage = ({ deepCallOk }) => {
    deepCallOk(() => {
      const payload = {
        dealId: id,
        userMessage,
        sellerMessage,
        checkPersonNum,
      };
      switch (type) {
        case SaveTypes.userMessage:
          payload.userMessage = current;
          break;
        case SaveTypes.sellerMessage:
          payload.sellerMessage = current;
          break;
        case SaveTypes.checkPersonNum:
          payload.checkPersonNum = current;
          break;
        default:
      }
      return dispatch({
        type: 'orderprocessing/saveMessage',
        payload,
      }).then(() => {
        message.success('保存成功');
        dealRefresh(current);
      });
    });
    return false;
  };

  useEffect(() => {
    switch (type) {
      case SaveTypes.userMessage:
        handleTextAreaChange(userMessage);
        break;
      case SaveTypes.sellerMessage:
        handleTextAreaChange(sellerMessage);
        break;
      case SaveTypes.checkPersonNum:
        handleTextAreaChange(checkPersonNum);
        break;
      default:
    }
  }, [type]);

  let title;
  let maxLength;
  switch (type) {
    case SaveTypes.userMessage:
      maxLength = 50;
      title = '订单备注';
      break;
    case SaveTypes.sellerMessage:
      maxLength = 16;
      title = '商家留言';
      break;
    case SaveTypes.checkPersonNum:
      title = '入场人数';
      break;
    default:
  }
  return (
    <Modal
      {...restProps}
      title={title}
      width={530}
      loading={saving}
      footer={[<Button key="close" link="cancel" />, <Button key="ok" link="ok" disabled={okBtndisabled} />]}
      onOk={handleSaveMessage}
    >
      {type === SaveTypes.checkPersonNum ? (
        <InputNumber
          placeholder="请填写"
          min={0}
          precision={0}
          value={current}
          onChange={handleTextAreaChange}
          style={{ width: '120px' }}
        />
      ) : (
        <TextArea
          value={current}
          maxLength={maxLength}
          placeholder={`请填写${maxLength > 0 ? `，限${maxLength}个字符以内` : ''}`}
          onChange={e => handleTextAreaChange(e.target.value)}
          autoSize={{ minRows: 5, maxRows: 8 }}
        />
      )}
    </Modal>
  );
}
