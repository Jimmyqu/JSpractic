import { useState } from 'react';
// import PropTypes from 'prop-types';
import { Button } from 'antd';
import AFRManager from '@/components/AFRManager';
import Modal from '.';

export default function (props) {
  const { onOk, type, id, justFile, ...restProps } = props;

  const [title, setTitle] = useState('');

  return (
    <Modal
      title={title}
      width={800}
      {...restProps}
      footer={<Button key="close" link="cancel" />}
      // onOk={arg => {
      // }}
    >
      <AFRManager
        onTitleUpdate={str => setTitle(str)}
        headStyle={{ display: 'none' }}
        type={type}
        id={id}
        justFile={justFile}
        onSave={onOk}
      />
    </Modal>
  );
}
