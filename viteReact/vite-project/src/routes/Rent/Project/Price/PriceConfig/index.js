import { useState, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Card, message } from 'antd';
import Datatable from '@/components/Datatable';
import { formatMoneyLen2, formatDateTime } from '@/utils/format';
import { modal } from '@/utils/feedback';
import EditContent from './EditContent';

export default function ({ priceGroupId }) {
  const dispatch = useDispatch();
  const [table, setTableInit] = useState();
  const [showContentMode, setShowContentMode] = useState();
  const [selectedRows, setSelectedRows] = useState();

  const cancelContent = useCallback(() => {
    setShowContentMode(null);
  }, []);

  const handleEditOrNewFormSubmit = useCallback(() => {
    cancelContent();
    table.reload();
  }, [table]);

  const onSelectedChange = useCallback((_, rows) => {
    setSelectedRows(rows);
    setShowContentMode(rows == null || rows.length === 0 ? null : showContentMode);
  }, []);

  const columns = useMemo(
    () => [
      {
        title: '编号',
        dataIndex: 'id',
        width: 100,
      },
      {
        title: '开始时间',
        dataIndex: 'startDate',
        render: formatDateTime,
        width: 170,
      },
      {
        title: '结束时间',
        dataIndex: 'endDate',
        render: formatDateTime,
        width: 170,
      },
      {
        title: '价格分组',
        dataIndex: 'priceGroupId',
        width: 90,
      },
      {
        title: '租金',
        dataIndex: 'rentalAmount',
        render: formatMoneyLen2,
        width: 90,
      },
      {
        title: '押金',
        dataIndex: 'depositAmount',
        render: formatMoneyLen2,
        width: 90,
      },
      {
        title: '备注',
        dataIndex: 'descr',
        width: 180,
      },
      {
        title: '排序',
        dataIndex: 'ranks',
        width: 60,
      },
      {
        title: '更新人',
        dataIndex: 'updateRealName',
        width: 130,
      },
      {
        title: '更新时间',
        dataIndex: 'gmtModified',
        render: formatDateTime,
        width: 170,
      },
      {
        title: '创建人',
        dataIndex: 'createRealName',
        width: 130,
      },
      {
        title: '创建时间',
        dataIndex: 'gmtCreate',
        render: formatDateTime,
        width: 170,
      },
    ],
    []
  );

  const operation = useMemo(
    () => ({
      buttons: [
        {
          auth: 'edit-price-config',
          text: '添加',
          icon: 'plus',
          action() {
            setShowContentMode(1);
          },
        },
        {
          auth: 'edit-price-config',
          text: '编辑',
          icon: 'edit',
          forRow: 'single',
          action() {
            setShowContentMode(2);
          },
        },
        {
          auth: 'delete-price-config',
          text: '删除',
          type: 'danger',
          icon: 'delete',
          forRow: 'multi',
          action() {
            modal.confirm('您确定要删除所选数据吗？', {
              onOk: async () => {
                await dispatch({
                  type: 'rent/deleteLeasePriceConfig',
                  payload: (selectedRows || []).map(item => item.id),
                });
                message.success('删除成功');
                table.reload();
              },
            });
          },
        },
      ],
    }),
    [showContentMode, selectedRows]
  );

  return (
    <Card bordered={false}>
      <Datatable
        select="multi"
        url={`/leasePriceConfig/dataList.do?priceGroupId=${priceGroupId}`}
        columns={columns}
        rowKey="id"
        operation={operation}
        onInit={setTableInit}
        onSelectedChange={onSelectedChange}
        content={(() => {
          switch (showContentMode) {
            case 1:
            case 2:
              return (
                <EditContent
                  isEdit={showContentMode === 2}
                  cancel={cancelContent}
                  sure={handleEditOrNewFormSubmit}
                  priceGroupId={priceGroupId}
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
