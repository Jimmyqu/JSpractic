import { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Card, message } from 'antd';
import Datatable from '@/components/Datatable';
import LevelView from '@/components/LevelView';
import { formatDateTime } from '@/utils/format';
import { modal } from '@/utils/feedback';
import PriceConfigView from './PriceConfig';
import EditContent from './EditContent';

function Price(props, { pushView }) {
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
        title: '价格分组名称',
        dataIndex: 'priceGroupName',
        width: 150,
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
        title: '创建人',
        dataIndex: 'createRealName',
        width: 150,
      },
      {
        title: '创建时间',
        dataIndex: 'gmtCreate',
        render: formatDateTime,
        width: 170,
      },
      {
        title: '更新时间',
        dataIndex: 'gmtModified',
        render: formatDateTime,
        width: 170,
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
          auth: 'edit-price',
          text: '添加',
          icon: 'plus',
          action() {
            setShowContentMode(1);
          },
        },
        {
          auth: 'edit-price',
          text: '编辑',
          icon: 'edit',
          forRow: 'single',
          action() {
            setShowContentMode(2);
          },
        },
        {
          auth: 'delete-price',
          text: '删除',
          type: 'danger',
          icon: 'delete',
          forRow: 'multi',
          action() {
            modal.confirm('您确定要删除所选数据吗？', {
              onOk: async () => {
                await dispatch({
                  type: 'rent/deleteLeasePriceGroup',
                  payload: (selectedRows || []).map(item => item.id),
                });
                message.success('删除成功');
                table.reload();
              },
            });
          },
        },
        {
          auth: 'price-config',
          text: '价格配置',
          type: 'primary',
          forRow: 'single',
          action() {
            pushView(
              <LevelView.SubView title="价格配置">
                <PriceConfigView priceGroupId={selectedRows[0].id} />
              </LevelView.SubView>
            );
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
        url="/leasePriceGroup/dataList.do"
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
                <EditContent isEdit={showContentMode === 2} cancel={cancelContent} sure={handleEditOrNewFormSubmit} />
              );
            default:
              return null;
          }
        })()}
      />
    </Card>
  );
}

Price.contextTypes = {
  pushView: PropTypes.func,
};

export default Price;
