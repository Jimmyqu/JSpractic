import { useState, useMemo } from 'react';
import { Form, Button, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { formatModel } from '@/utils/format';
import Datatable, { ItemTypes } from '@/components/Datatable';
import Modal from '@/components/Modal';
import { modelMapToOption } from '@/utils/utils';

function UserListModal({
  onVisibleChange,
  messagePushConfigId,
  fetchMessageInfo,
  authStatus,
  selectPushType,
  ...restProps
}) {
  const dispatch = useDispatch();
  const { MsgAccountType, PushType } = useSelector(state => state.message);
  const [selectRows, setSelectRows] = useState([]);
  const addUsering = useSelector(state => state.loading.effects['message/addUser']);

  const columns = useMemo(
    () => [
      {
        title: '姓名',
        dataIndex: 'realName',
        width: 100,
      },
      {
        title: '手机号码',
        dataIndex: 'mobile',
        width: 130,
      },
      {
        title: '单位名称',
        dataIndex: 'companyName',
        width: 200,
      },
      {
        title: '会员类型',
        dataIndex: 'pubAccountType',
        render: value => formatModel(MsgAccountType, value),
        width: 120,
      },
      {
        title: '会员编号',
        dataIndex: 'id',
        width: 100,
      },
    ],
    []
  );

  const formSearch = useMemo(
    () => ({
      fields: [
        {
          label: '真实姓名',
          name: 'realName',
        },
        {
          label: '手机号',
          name: 'mobile',
        },
        {
          label: '会员类型',
          name: 'pubAccountType',
          placeholder: '默认全部',
          options: modelMapToOption(MsgAccountType),
          type: ItemTypes.Select,
        },
        {
          label: '会员编号',
          name: 'id',
        },
      ],
    }),
    []
  );

  return (
    <Modal
      title="选择会员"
      width={1024}
      onVisibleChange={onVisibleChange}
      {...restProps}
      footer={[
        <Button key="cancel" link="cancel" disabled={addUsering}>
          取消
        </Button>,
        <Button key="ok" link="ok" disabled={selectRows.length === 0 || addUsering}>
          提交
        </Button>,
      ]}
      onOk={arg => {
        arg.deepCallOk(() => {
          return dispatch({
            type: 'message/addUser',
            payload: {
              ids: selectRows.map(item => item.id).join(','),
              messagePushConfigId,
            },
          }).then(() => {
            fetchMessageInfo();
            message.success('添加成功');
          });
        });
        return false;
      }}
    >
      <Datatable
        select="multi"
        personalization={false}
        onSelectedChange={(_, rows) => {
          setSelectRows(rows);
        }}
        url={`/publicAccount/dataList.do?emptyOpendId=${selectPushType === PushType.WeChat.key ? 1 : 0}`}
        columns={columns}
        rowKey="id"
        formSearch={formSearch}
      />
    </Modal>
  );
}

export default Form.create()(UserListModal);
