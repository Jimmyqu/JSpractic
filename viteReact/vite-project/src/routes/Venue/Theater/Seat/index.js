import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, message } from 'antd';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import { formatDateTime, formatModel } from '@/utils/format';
import { modal } from '@/utils/feedback';
import { useSeatCategory } from '@/utils/hooks';
import { modelMapToOption } from '@/utils/utils';
import EditContent from './EditContent';

export default ({ salesId, dataId }) => {
  const dispatch = useDispatch();
  const { SeatTypes, SeatFeatTypes } = useSelector(state => state.pubticket);
  const [floorList, areaList, levelList, fetching] = useSeatCategory(salesId, dataId);
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
        title: '楼层名称',
        dataIndex: 'floorCategoryName',
        width: 150,
      },
      {
        title: '区域名称',
        dataIndex: 'areaCategoryName',
        width: 150,
      },
      {
        title: '等级名称',
        dataIndex: 'levelCategoryName',
        width: 150,
      },
      {
        title: '排数',
        dataIndex: 'rowsNum',
        width: 90,
      },
      {
        title: '排数名称',
        dataIndex: 'rowsName',
        width: 150,
      },
      {
        title: '座位号',
        dataIndex: 'seatValue',
        width: 90,
      },
      {
        title: '座位号名称',
        key: 'seatName',
        // 不直接使用seatName字段显示座位名称
        render: (_, { seatValue }) => `${seatValue}座`,
        width: 150,
      },
      {
        title: '座位类型',
        dataIndex: 'seatType',
        render: value => formatModel(SeatTypes, value),
        width: 150,
      },
      {
        title: '座位属性',
        dataIndex: 'seatProperty',
        render: value => formatModel(SeatFeatTypes, value),
        width: 150,
      },
      {
        title: '营销中心名称',
        dataIndex: 'salesName',
        width: 150,
      },
      {
        title: '座位号说明',
        dataIndex: 'seatDesc',
        width: 200,
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
        title: '创建人',
        dataIndex: 'createRealName',
        width: 130,
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
          label: '座位区域',
          name: 'areaCategoryId',
          options: areaList.map(item => ({
            key: item.id,
            text: item.categoryName,
          })),
          type: ItemTypes.Select,
        },
        {
          label: '楼层',
          name: 'floorCategoryId',
          options: floorList.map(item => ({
            key: item.id,
            text: item.categoryName,
          })),
          type: ItemTypes.Select,
        },
        {
          label: '排数',
          name: 'rowsNum',
        },
        {
          label: '等级',
          name: 'levelCategoryId',
          options: levelList.map(item => ({
            key: item.id,
            text: item.categoryName,
          })),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '座位类型',
          name: 'seatType',
          options: modelMapToOption(SeatTypes),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '座位属性',
          name: 'seatProperty',
          options: modelMapToOption(SeatFeatTypes),
          type: ItemTypes.Select,
          defHidden: true,
        },
      ],
    }),
    [areaList, floorList, levelList]
  );

  const operation = useMemo(
    () => ({
      buttons: [
        // {
        //   auth: 'add-seat',
        //   text: '添加',
        //   action() {
        //     setVisible(true);
        //   },
        // },
        {
          auth: 'edit-seat',
          type: 'primary',
          text: '修改',
          forRow: 'single',
          action() {
            setShowContentMode(2);
          },
        },
        {
          auth: 'del-seat',
          type: 'danger',
          text: '删除',
          forRow: 'multi',
          action() {
            modal.confirm('您确认要删除所选数据吗？', {
              onOk: async () => {
                await dispatch({
                  type: 'pubticket/delSeatByIds',
                  payload: (selectedRows || []).map(item => item.id),
                });
                message.success('删除成功');
                table.reload();
              },
            });
          },
        },
        {
          auth: 'edit-seat-batch',
          text: '批量修改座位说明',
          forRow: 'multi',
          action() {
            setShowContentMode(1);
          },
        },
        {
          auth: 'export-seat',
          btnType: ButtonTypes.Export,
        },
      ],
    }),
    [selectedRows]
  );

  return (
    <Card bordered={false} loading={fetching}>
      <Datatable
        select="multi"
        onSelectedChange={(_, rows) => {
          setSelectedRows(rows);
          setShowContentMode(rows == null || rows.length === 0 ? null : showContentMode);
        }}
        url={`/seatNumber/seatNumberList.do?salesId=${salesId}&dataId=${dataId}`}
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
                  singleEdit={showContentMode === 2}
                  floorList={floorList}
                  areaList={areaList}
                  levelList={levelList}
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
