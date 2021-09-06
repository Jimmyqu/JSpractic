import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Modal from '@/components/Modal';
import CountInput from '@/components/CountInput';

export default function ({ onOk = () => {}, data, ...restProps }) {
  const dispatch = useDispatch();
  const { id, ranks } = data || {};
  const [value, setValue] = useState(ranks || 0);

  useEffect(() => {
    setValue(ranks);
  }, [ranks]);

  return (
    <Modal
      title="修改验证顺序"
      width={320}
      {...restProps}
      onOk={arg => {
        return dispatch({
          type: 'pubservice/changePubServiceRank',
          payload: {
            publicServiceAccountId: id,
            ranks: value,
          },
        }).then(() => {
          onOk(arg);
        });
      }}
    >
      <CountInput fullWidth size="large" value={value} onChange={setValue} />
    </Modal>
  );
}
