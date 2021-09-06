import { useState, useMemo } from 'react';
import { Form, Button, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { formatModel } from '@/utils/format';
import { modal } from '@/utils/feedback';
import Datatable, { ItemTypes } from '@/components/Datatable';
import Modal from '@/components/Modal';
import { modelMapToOption } from '@/utils/utils';

function MobilePoolModal({
  onVisibleChange,
  messagePushConfigId,
  authStatus,
  selectPushType,
  fetchMessageInfo,
  ...restProps
}) {
  const dispatch = useDispatch();
  const { MsgAccountType, UserSource, PushType } = useSelector(state => state.message);
  const [selectRows, setSelectRows] = useState([]);
  const [table, setTableInit] = useState();
  const updateing = useSelector(state => state.loading.effects['message/updateSubmit']);

  const columns = useMemo(
    () => [
      {
        title: '序号',
        dataIndex: 'id',
        width: 80,
      },
      {
        title: selectPushType === PushType.WeChat.key ? '人员类型' : '会员类型',
        dataIndex: 'pubAccountType',
        render: value => formatModel(MsgAccountType, value),
        width: 120,
      },
      {
        title: '手机号码',
        dataIndex: 'mobile',
        width: 130,
      },
      {
        title: '会员姓名',
        dataIndex: 'realName',
        width: 100,
      },
      {
        title: '会员编号',
        dataIndex: 'pubAccountId',
        width: 100,
      },
      {
        title: '号码来源',
        dataIndex: 'userSource',
        render: value => formatModel(UserSource, value),
        width: 130,
      },
    ],
    []
  );

  const formSearch = useMemo(
    () => ({
      fields: [
        {
          label: '手机号',
          name: 'mobile',
        },
        {
          label: selectPushType === PushType.WeChat.key ? '人员类型' : '会员类型',
          name: 'pubAccountType',
          placeholder: '默认全部',
          options: modelMapToOption(MsgAccountType),
          type: ItemTypes.Select,
        },
        {
          label: '会员编号',
          name: 'pubAccountId',
        },
        {
          label: '会员姓名',
          name: 'realName',
        },
        {
          label: '号码来源',
          name: 'userSource',
          options: modelMapToOption(UserSource),
          type: ItemTypes.Select,
        },
      ],
    }),
    []
  );

  return (
    <Modal
      title="号码池列表"
      width={1024}
      onVisibleChange={onVisibleChange}
      {...restProps}
      footer={[
        <Button key="cancel" link="cancel" disabled={updateing}>
          取消
        </Button>,
      ]}
    >
      <Datatable
        select="multi"
        pagination={false}
        personalization={false}
        onSelectedChange={(_, rows) => {
          setSelectRows(rows);
        }}
        url={`/messageReceiveUser/dataList.do?messagePushConfigId=${messagePushConfigId}&authStatus=${authStatus}`}
        columns={columns}
        onInit={setTableInit}
        rowKey="id"
        operation={{
          buttons: [
            {
              text: '删除',
              type: 'danger',
              icon: 'delete',
              forRow: 'multi',
              async action() {
                modal.confirm('确认删除吗？', {
                  onOk: async () => {
                    await dispatch({
                      type: 'message/delByIds',
                      payload: {
                        ids: selectRows.map(item => item.id).join(','),
                      },
                    });
                    message.success('删除成功');
                    table.reload();
                    fetchMessageInfo();
                  },
                });
              },
            },
          ],
        }}
        formSearch={formSearch}
      />
    </Modal>
  );
}

export default Form.create()(MobilePoolModal);
