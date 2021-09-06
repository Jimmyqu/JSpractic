import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Card, message } from 'antd';
import Datatable from '@/components/Datatable';
import LevelView from '@/components/LevelView';
import { modal } from '@/utils/feedback';
import { formatDateTime } from '@/utils/format';
import AuditNodeGroupUser from './AuditNodeGroupUser';
import EditContent from './AuditNodeGroupEditContent';

function AuditNodeGroup({ groupId, auditConfigId }, { pushView }) {
  const dispatch = useDispatch();
  const deleting = useSelector(state => state.loading.effects['pubserviceuser/delAuditNodeGroup']);
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
        title: '审核分组',
        dataIndex: 'groupName',
        width: 150,
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
          auth: 'node-group-add',
          text: '添加',
          disabled: deleting,
          action() {
            setShowContentMode(1);
          },
        },
        {
          auth: 'node-group-edit',
          text: '修改',
          forRow: 'single',
          disabled: deleting,
          action() {
            setShowContentMode(2);
          },
        },
        {
          auth: 'node-group-remove',
          type: 'danger',
          text: '删除',
          forRow: 'multi',
          loading: deleting,
          action() {
            modal.confirm('确认删除所选数据吗？', {
              async onOk() {
                await dispatch({
                  type: 'pubserviceuser/delAuditNodeGroup',
                  payload: selectedRows.map(item => item.id),
                });
                message.success('删除成功');
                table.reload();
              },
            });
          },
        },
        {
          auth: 'node-group-reviewer',
          text: '审核人',
          forRow: 'single',
          action() {
            pushView(
              <LevelView.SubView title="审核人">
                <AuditNodeGroupUser auditConfigId={auditConfigId} groupId={selectedRows[0].id} />
              </LevelView.SubView>
            );
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
        url={`/auditGroup/dataList.do?groupId=${groupId || ''}`}
        columns={columns}
        rowKey="id"
        // formSearch={formSearch}
        operation={operation}
        onInit={setTableInit}
        content={(() => {
          switch (showContentMode) {
            case 1:
            case 2:
              return (
                <EditContent
                  edit={showContentMode === 2}
                  cancel={cancelContent}
                  sure={() => {
                    message.success(`${showContentMode === 2 ? '修改' : '添加'}成功`);
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
}

AuditNodeGroup.contextTypes = {
  pushView: PropTypes.func,
};

export default AuditNodeGroup;
