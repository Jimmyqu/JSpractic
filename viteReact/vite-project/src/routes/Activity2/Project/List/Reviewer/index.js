import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, message } from 'antd';
import Datatable from '@/components/Datatable';
import { modal } from '@/utils/feedback';
import ChangeSelectReviewerModal from './ChangeSelectReviewerModal';
import ModifySmsConfigModal from './ModifySmsConfigModal';

export default ({ configId }) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState();
  const [isModifySms, setIsModifySms] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [listRows, setListRows] = useState();
  const [table, setTableInit] = useState();

  const columns = useMemo(
    () => [
      {
        title: '编号',
        dataIndex: 'id',
        width: 90,
      },
      {
        title: '用户编号',
        dataIndex: 'sysUserId',
        width: 90,
      },
      {
        title: '姓名',
        dataIndex: 'realName',
        width: 90,
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        width: 90,
      },
      {
        title: '备注',
        dataIndex: 'descr',
        width: 90,
      },
      {
        title: '更新人',
        dataIndex: 'updateRealName',
        width: 90,
      },
      {
        title: '更新时间',
        dataIndex: 'gmtModified',
        width: 90,
      },
      {
        title: '创建人',
        dataIndex: 'createRealName',
        width: 90,
      },
      {
        title: '创建时间',
        dataIndex: 'gmtCreate',
        width: 90,
      },
      {
        title: '单位名称',
        dataIndex: 'companyName',
        width: 90,
      },
    ],
    []
  );

  const formSearch = useMemo(
    () => ({
      fields: [
        {
          label: '用户名',
          name: 'realName',
        },
        {
          label: '手机号',
          name: 'mobile',
        },
      ],
    }),
    []
  );

  const operation = useMemo(
    () => ({
      buttons: [
        {
          text: '添加',
          auth: 'add-reviewer',
          action() {
            setVisible(true);
          },
        },
        {
          text: '修改',
          type: 'primary',
          auth: 'edit-reviewer',
          forRow: 'multi',
          action() {
            setIsModifySms(true);
          },
        },
        {
          text: '删除',
          type: 'danger',
          auth: 'del-reviewer',
          forRow: 'multi',
          action() {
            modal.confirm('确认删除所选数据吗', {
              async onOk() {
                await dispatch({
                  type: 'activity2/delReviewer',
                  payload: selectedRows.map(item => item.id),
                });
                message.success('删除成功');
                setVisible(false);
                table.reload();
              },
            });
          },
        },
      ],
    }),
    [selectedRows, table]
  );

  return (
    <Card bordered={false}>
      <Datatable
        pagination={false}
        select="multi"
        onLoadData={setListRows}
        onSelectedChange={(_, rows) => {
          setSelectedRows(rows);
        }}
        url={`/reportAuditUser/auditUserList.do?reportCompanyListId=${configId}`}
        columns={columns}
        rowKey="id"
        formSearch={formSearch}
        operation={operation}
        onInit={setTableInit}
      />
      <ChangeSelectReviewerModal
        configId={configId}
        selectedIds={listRows?.map(item => item.sysUserId)}
        visible={visible}
        onVisibleChange={setVisible}
        onOk={() => {
          message.success('添加成功');
          setVisible(false);
          table.reload();
        }}
      />
      <ModifySmsConfigModal
        auditIds={selectedRows}
        visible={isModifySms}
        onVisibleChange={setIsModifySms}
        onOk={() => {
          message.success('修改成功');
          setIsModifySms(false);
          table.reload();
        }}
      />
    </Card>
  );
};
