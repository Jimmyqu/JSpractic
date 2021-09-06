import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'antd';
import Modal from '@/components/Modal';
import Datatable from '@/components/Datatable';

export default ({ configId, onOk, selectedIds, ...restProps }) => {
  const dispatch = useDispatch();
  const saving = useSelector(state => state.loading.effects['activity2/addReviewer']);
  const [selectedRows, setSelectedRows] = useState();

  const columns = useMemo(
    () => [
      {
        title: '真实姓名',
        dataIndex: 'realName',
        width: 150,
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        width: 130,
      },
      {
        title: '单位',
        dataIndex: 'companyName',
        width: 200,
      },
    ],
    []
  );

  const formSearch = useMemo(
    () => ({
      col: {
        sm: 24,
        md: 8,
      },
      fields: [
        {
          label: '姓名',
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

  return (
    <Modal
      title="关联人员"
      width={768}
      {...restProps}
      footer={[
        <Button key="close" link="cancel" disabled={saving} />,
        <Button key="ok" link="ok" disabled={!(selectedRows?.length > 0)} loading={saving} />,
      ]}
      onOk={arg => {
        return dispatch({
          type: 'activity2/addReviewer',
          payload: {
            id: configId,
            sysUserIds: selectedRows.filter(item => !selectedIds?.includes(item.id)).map(item => item.id),
          },
        }).then(() => {
          onOk(arg);
        });
      }}
    >
      <Datatable
        pagination={false}
        select="multi"
        onLoadData={list => {
          setSelectedRows(
            selectedIds
              ?.map(sysUserId => {
                return list?.find(item => item.id === sysUserId);
              })
              .filter(Boolean)
          );
        }}
        onSelectedChange={(_, rows) => {
          setSelectedRows(rows);
        }}
        rowSelection={{
          selectedRows,
          checkboxShouldBeDisable: record => {
            return selectedIds?.includes(record.id);
          },
        }}
        url={`/reportAuditUser/sysUserList.do?reportCompanyListId=${configId}`}
        columns={columns}
        rowKey="id"
        formSearch={formSearch}
        // operation={operation}
        // onInit={this.handleTableInit}
      />
    </Modal>
  );
};
