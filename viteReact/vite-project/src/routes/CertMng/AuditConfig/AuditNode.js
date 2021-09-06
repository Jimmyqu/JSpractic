import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Card, message } from 'antd';
import Datatable from '@/components/Datatable';
import LevelView from '@/components/LevelView';
import { modal } from '@/utils/feedback';
import { formatModel, formatBoolean, formatDateTime } from '@/utils/format';
import AuditNodeGroup from './AuditNodeGroup';
import EditContent from './AuditNodeEditContent';

function AuditNode(props, { pushView }) {
  const { auditConfigId } = props;
  const dispatch = useDispatch();
  const { AuditNodeTypes } = useSelector(state => state.pubserviceuser);
  const deleting = useSelector(state => state.loading.effects['pubserviceuser/delAuditNode']);
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
        title: '审核节点名称',
        dataIndex: 'auditTitle',
        width: 150,
      },
      {
        title: '审核分组编号',
        dataIndex: 'groupId',
        width: 130,
      },
      {
        title: '审核节点',
        dataIndex: 'auditType',
        render: value =>
          (value || []).map((flow, i) => <div key={flow}>{`${i + 1}. ${formatModel(AuditNodeTypes, flow)}`}</div>),
        width: 130,
      },
      {
        title: '是否发送通知',
        dataIndex: 'sendMessage',
        render: formatBoolean,
        width: 130,
      },
      {
        title: '流程顺序',
        dataIndex: 'ranks',
        width: 90,
      },
      {
        title: '更新人',
        dataIndex: 'updateRealName',
        width: 150,
      },
      {
        title: '备注',
        dataIndex: 'descr',
        width: 200,
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
          auth: 'node-add',
          text: '添加',
          disabled: deleting,
          action() {
            setShowContentMode(1);
          },
        },
        {
          auth: 'node-edit',
          text: '修改',
          forRow: 'single',
          disabled: deleting,
          action() {
            setShowContentMode(2);
          },
        },
        {
          auth: 'node-remove',
          type: 'danger',
          text: '删除',
          forRow: 'multi',
          loading: deleting,
          action() {
            modal.confirm('确认删除所选数据吗？', {
              async onOk() {
                await dispatch({
                  type: 'pubserviceuser/delAuditNode',
                  payload: selectedRows.map(item => item.id),
                });
                message.success('删除成功');
                table.reload();
              },
            });
          },
        },
        {
          auth: 'audit-group',
          text: '审核分组',
          type: 'primary',
          forRow: 'single',
          action() {
            pushView(
              <LevelView.SubView title="审核分组">
                <AuditNodeGroup auditConfigId={auditConfigId} groupId={selectedRows[0].groupId} />
              </LevelView.SubView>
            );
          },
        },
        {
          auth: 'audit-group',
          text: '审核分组',
          forRow: rows => rows == null || rows.length !== 1,
          action() {
            pushView(
              <LevelView.SubView title="审核分组">
                <AuditNodeGroup auditConfigId={auditConfigId} />
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
        url={`/auditNode/dataList.do?configId=${auditConfigId || ''}`}
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
                  auditConfigId={auditConfigId}
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

AuditNode.contextTypes = {
  pushView: PropTypes.func,
};

export default AuditNode;
