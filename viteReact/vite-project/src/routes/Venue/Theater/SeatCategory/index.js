import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, message } from 'antd';
import Datatable, { ItemTypes } from '@/components/Datatable';
import { formatDateTime, formatModel } from '@/utils/format';
import { modelMapToOption } from '@/utils/utils';
import { modal } from '@/utils/feedback';
import EditContent from './EditContent';
import styles from './index.less';

export default ({ salesId, dataId }) => {
  const dispatch = useDispatch();
  const SeatCategoryTypes = useSelector(state => state.pubticket.SeatCategoryTypes);
  const [selectedRows, setSelectedRows] = useState();
  const [showContentMode, setShowContentMode] = useState();
  const [table, setTableInit] = useState();

  const columns = useMemo(
    () => [
      {
        title: '编号',
        dataIndex: 'id',
        width: 90,
      },
      {
        title: '数据类型',
        dataIndex: 'relType',
        width: 90,
      },
      {
        title: '数据编号',
        dataIndex: 'dataId',
        width: 90,
      },
      {
        title: '数据名称',
        dataIndex: 'dataName',
        width: 110,
      },
      {
        title: '营销中心编号',
        dataIndex: 'salesId',
        width: 110,
      },
      {
        title: '营销中心名称',
        dataIndex: 'salesName',
        width: 170,
      },
      {
        title: '分类类型',
        dataIndex: 'categoryType',
        render: value => formatModel(SeatCategoryTypes, value),
        width: 90,
      },
      {
        title: '分类名称',
        dataIndex: 'categoryName',
        width: 150,
      },
      {
        title: '颜色',
        dataIndex: 'categoryColor',
        render: value => {
          if (value == null) {
            return null;
          }
          return (
            <span>
              {value}
              &nbsp;
              <span
                className={styles.colorBlock}
                style={{
                  background: value,
                }}
              >
                &nbsp;
              </span>
            </span>
          );
        },
        width: 120,
      },
      {
        title: '排序',
        dataIndex: 'ranks',
        width: 90,
      },
      {
        title: '备注',
        dataIndex: 'descr',
        width: 200,
      },
      {
        title: '创建时间',
        dataIndex: 'gmtCreate',
        render: formatDateTime,
        width: 190,
      },
      {
        title: '更新时间',
        dataIndex: 'gmtModified',
        render: formatDateTime,
        width: 190,
      },
      {
        title: '更新人姓名',
        dataIndex: 'updateRealName',
        width: 130,
      },
      {
        title: '单位编号',
        dataIndex: 'companyId',
        width: 90,
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
          label: '分类名称',
          name: 'categoryName',
        },
        {
          label: '分类类型',
          name: 'categoryType',
          options: modelMapToOption(SeatCategoryTypes),
          type: ItemTypes.Select,
        },
      ],
    }),
    []
  );

  const operation = useMemo(
    () => ({
      buttons: [
        {
          auth: 'add-seat-category',
          text: '添加',
          action() {
            setShowContentMode(1);
          },
        },
        {
          auth: 'edit-seat-category',
          text: '修改',
          forRow: 'single',
          action() {
            setShowContentMode(2);
          },
        },
        {
          auth: 'del-seat-category',
          type: 'danger',
          text: '删除',
          forRow: 'multi',
          action() {
            modal.confirm('您确认要删除所选数据吗？', {
              onOk: async () => {
                await dispatch({
                  type: 'pubticket/delSeatCategoryByIds',
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
    [selectedRows]
  );

  return (
    <Card bordered={false}>
      <Datatable
        select="multi"
        onSelectedChange={(_, rows) => {
          setSelectedRows(rows);
          setShowContentMode(rows == null || rows.length === 0 ? null : showContentMode);
        }}
        url={`/seatCategory/seatCategoryList.do?salesId=${salesId}&dataId=${dataId}`}
        columns={columns}
        formSearch={formSearch}
        operation={operation}
        rowKey="id"
        onInit={setTableInit}
        content={(() => {
          switch (showContentMode) {
            case 1:
            case 2:
              return (
                <EditContent
                  salesId={salesId}
                  dataId={dataId}
                  edit={showContentMode === 2}
                  cancel={() => setShowContentMode(null)}
                  sure={() => {
                    message.success('操作成功');
                    setShowContentMode(null);
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
