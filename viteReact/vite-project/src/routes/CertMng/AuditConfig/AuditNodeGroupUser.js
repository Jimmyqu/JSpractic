import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, message } from 'antd';
import Datatable from '@/components/Datatable';
import { modal } from '@/utils/feedback';
import { formatDateTime, formatBoolean } from '@/utils/format';
import AddContent from './AuditNodeGroupUserAddContent';
import EditContent from './AuditNodeGroupUserEditContent';

export default props => {
  const { groupId, auditConfigId } = props;
  const dispatch = useDispatch();
  const deleting = useSelector(state => state.loading.effects['pubserviceuser/delAuditNodeGroupUserByIds']);
  const [table, setTableInit] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [showContentMode, setShowContentMode] = useState();

  function cancelContent() {
    setShowContentMode(null);
  }

  const columns = useMemo(
    () => [
      {
        title: '编号',
        dataIndex: 'id',
        width: 100,
      },
      {
        title: '用户编号',
        dataIndex: 'sysUserId',
        width: 100,
      },
      {
        title: '姓名',
        dataIndex: 'realName',
        width: 150,
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        width: 130,
      },
      {
        title: '是否接收通知',
        dataIndex: 'receiveMessage',
        render: formatBoolean,
        width: 130,
      },
      {
        title: '备注',
        dataIndex: 'descr',
        width: 200,
      },
      {
        title: '更新人',
        dataIndex: 'updateRealName',
        width: 150,
      },
      {
        title: '更新时间',
        dataIndex: 'gmtModified',
        render: formatDateTime,
        width: 190,
      },
      {
        title: '创建人',
        dataIndex: 'createRealName',
        width: 150,
      },
      {
        title: '创建时间',
        dataIndex: 'gmtCreate',
        render: formatDateTime,
        width: 190,
      },
      {
        title: '单位名称',
        dataIndex: 'companyName',
        width: 150,
      },
    ],
    []
  );

  const operation = useMemo(
    () => ({
      buttons: [
        {
          auth: 'node-group-user-add',
          text: '添加',
          disabled: deleting,
          action() {
            setShowContentMode(1);
          },
        },
        {
          auth: 'node-group-user-edit',
          text: '修改',
          forRow: 'single',
          disabled: deleting,
          action() {
            setShowContentMode(2);
          },
        },
        {
          auth: 'node-group--user-remove',
          type: 'danger',
          text: '删除',
          forRow: 'multi',
          loading: deleting,
          action() {
            modal.confirm('确认删除所选数据吗？', {
              async onOk() {
                await dispatch({
                  type: 'pubserviceuser/delAuditNodeGroupUserByIds',
                  payload: selectedRows.map(item => item.id),
                });
                message.success('删除成功');
                table.reload();
              },
            });
          },
        },
      ],
    }),
    [selectedRows, deleting]
  );

  return (
    <Card bordered={false}>
      <Datatable
        select="multi"
        onSelectedChange={(_, rows) => {
          setSelectedRows(rows);
        }}
        url={`/auditGroupUser/dataList.do?groupId=${groupId || ''}`}
        columns={columns}
        rowKey="id"
        // formSearch={formSearch}
        operation={operation}
        onInit={setTableInit}
        content={(() => {
          switch (showContentMode) {
            case 1:
              return (
                <AddContent
                  groupId={groupId}
                  auditConfigId={auditConfigId}
                  cancel={cancelContent}
                  sure={() => {
                    message.success('关联成功');
                    cancelContent();
                    table.reload();
                  }}
                />
              );
            case 2:
              return (
                <EditContent
                  cancel={cancelContent}
                  sure={() => {
                    message.success('编辑成功');
                    cancelContent();
                    table.reload();
                  }}
                />
              );
            default:
              return null;
          }
        })()}
      />
    </Card>
  );
};
