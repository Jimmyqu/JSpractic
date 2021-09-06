import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Card } from 'antd';
import Datatable from '@/components/Datatable';
import { formatDateTime, formatModel } from '@/utils/format';

export default ({ dataId }) => {
  const { AuditNodeTypes } = useSelector(state => state.pubserviceuser);
  const columns = useMemo(
    () => [
      {
        title: '时间',
        dataIndex: 'gmtCreate',
        render: formatDateTime,
        width: 170,
      },
      {
        title: '流程名称',
        dataIndex: 'auditTitle',
        width: 130,
      },
      {
        title: '审核状态',
        dataIndex: 'auditType',
        render: value => formatModel(AuditNodeTypes, value),
        width: 130,
      },
      {
        title: '审核分组',
        dataIndex: 'groupName',
        width: 130,
      },
      {
        title: '审核人',
        dataIndex: 'realName',
        width: 130,
      },
      {
        title: '审核备注',
        dataIndex: 'auditDescription',
        width: 250,
      },
    ],
    []
  );
  return (
    <Card bordered={false}>
      <Datatable
        url={`/auditLog/dataList.do?dataId=${dataId}`}
        columns={columns}
        rowKey="id"
        // formSearch={formSearch}
        // operation={operation}
        // onInit={setTableInit}
      />
    </Card>
  );
};
