import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import Datatable from '@/components/Datatable';
import LevelView from '@/components/LevelView';
import { modal } from '@/utils/feedback';
import { formatDateTime, formatDate } from '@/utils/format';
import { getPageQuery, clearHMS } from '@/utils/utils';
import AuditNode from './AuditNode';
import EditContent from './AuditConfigEditContent';

function AuditConfig(props, { pushView }) {
  const { dataId } = getPageQuery();
  const dispatch = useDispatch();
  // const { Industries, Careers, ProfessionTypes } = useSelector(state => state.venue);
  const deleting = useSelector(state => state.loading.effects['pubserviceuser/delAuditCfg']);
  // const { CertFlowNodes, CertCfgStates } = useSelector(state => state.pubserviceuser);
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
        title: '审核标题',
        dataIndex: 'auditTitle',
        width: 150,
      },
      {
        title: '审核开始时间',
        dataIndex: 'startTime',
        render: formatDate,
        width: 130,
      },
      {
        title: '审核结束时间',
        dataIndex: 'endTime',
        render: value => {
          if (value == null) {
            return null;
          }
          const mmt = clearHMS(value);
          if (mmt.valueOf() === value) {
            return formatDate(mmt.subtract('1', 'days'));
          }
          return formatDate(value);
        },
        width: 130,
      },
      {
        title: '数据编号',
        dataIndex: 'dataId',
        width: 100,
      },
      {
        title: '备注',
        dataIndex: 'descr',
        width: 200,
      },
      {
        title: '排序',
        dataIndex: 'ranks',
        width: 90,
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

  const formSearch = useMemo(
    () => ({
      fields: [
        {
          label: '数据编号',
          name: 'dataId',
          initialValue: dataId,
        },
        {
          label: '审核标题',
          name: 'auditTitle',
        },
      ],
    }),
    []
  );

  const operation = useMemo(
    () => ({
      buttons: [
        {
          auth: 'add',
          text: '添加',
          disabled: deleting,
          action() {
            setShowContentMode(1);
          },
        },
        {
          auth: 'edit',
          text: '修改',
          forRow: 'single',
          disabled: deleting,
          action() {
            setShowContentMode(2);
          },
        },
        {
          auth: 'remove',
          type: 'danger',
          text: '删除',
          forRow: 'multi',
          loading: deleting,
          action() {
            modal.confirm('确认删除所选数据吗？', {
              async onOk() {
                await dispatch({
                  type: 'pubserviceuser/delAuditCfg',
                  payload: selectedRows.map(item => item.id),
                });
                message.success('删除成功');
                table.reload();
              },
            });
          },
        },
        {
          auth: 'audit-node',
          text: '审核流程',
          forRow: 'single',
          action() {
            pushView(
              <LevelView.SubView title="审核流程">
                <AuditNode auditConfigId={selectedRows[0].id} />
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
          setShowContentMode(rows == null || rows.length === 0 ? null : showContentMode);
        }}
        url="/auditConfig/dataList.do"
        columns={columns}
        rowKey="id"
        formSearch={formSearch}
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
                  dataId={+dataId || undefined}
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

AuditConfig.contextTypes = {
  pushView: PropTypes.func,
};

export default AuditConfig;
