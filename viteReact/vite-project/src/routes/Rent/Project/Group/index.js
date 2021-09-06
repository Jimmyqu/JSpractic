import { useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, message } from 'antd';
import Datatable, { ItemTypes } from '@/components/Datatable';
import ColorPicker from '@/components/Form/FormItem/ColorPicker';
import { formatModel, formatDateTime } from '@/utils/format';
import { modelMapToOption } from '@/utils/utils';
import { modal } from '@/utils/feedback';
import EditContent from './EditContent';

export default function ({ fetchGroupList }) {
  const dispatch = useDispatch();
  const [table, setTableInit] = useState();
  const [showContentMode, setShowContentMode] = useState();
  const [selectedRows, setSelectedRows] = useState();
  const { ProfessionTypes } = useSelector(state => state.venue);
  const { RefundModeTypes, LeaseTypes, RentGroupStates } = useSelector(state => state.rent);

  const cancelContent = useCallback(() => {
    setShowContentMode(null);
  }, []);

  const handleEditOrNewFormSubmit = useCallback(() => {
    cancelContent();
    table.reload();
    fetchGroupList();
  }, [table, fetchGroupList]);

  const onSelectedChange = useCallback((_, rows) => {
    setSelectedRows(rows);
    setShowContentMode(rows == null || rows.length === 0 ? null : showContentMode);
  }, []);

  const formSearch = useMemo(
    () => ({
      fields: [
        {
          label: '退款方式',
          name: 'refundMode',
          placeholder: '请选择',
          options: modelMapToOption(RefundModeTypes),
          type: ItemTypes.Select,
        },
        {
          label: '租赁类别',
          name: 'leaseType',
          placeholder: '请选择',
          options: modelMapToOption(LeaseTypes),
          type: ItemTypes.Select,
        },
      ],
    }),
    []
  );

  const columns = useMemo(
    () => [
      {
        title: '编号',
        dataIndex: 'id',
        width: 100,
      },
      {
        title: '父级编号',
        dataIndex: 'parentId',
        width: 100,
      },
      {
        title: '租赁类别',
        dataIndex: 'leaseType',
        render: value => formatModel(LeaseTypes, value),
        width: 100,
      },
      {
        title: '分组名称',
        dataIndex: 'groupName',
        width: 150,
      },
      {
        title: '分组状态',
        dataIndex: 'groupState',
        render: value => formatModel(RentGroupStates, value),
        width: 100,
      },
      {
        title: '颜色',
        dataIndex: 'groupColor',
        render: value => (value ? <ColorPicker value={value} disabled /> : null),
        width: 150,
      },
      {
        title: '营销中心',
        dataIndex: 'salesName',
        width: 150,
      },
      {
        title: '项目',
        dataIndex: 'professionalId',
        render: value => formatModel(ProfessionTypes, value),
        width: 80,
      },
      {
        title: '列 x 行',
        dataIndex: 'projectRows',
        render: (value, { projectCols }) => `${projectCols} x ${value}`,
        width: 80,
      },
      {
        title: '备注',
        dataIndex: 'descr',
        width: 200,
      },
      {
        title: '排序',
        dataIndex: 'ranks',
        width: 80,
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
          auth: 'edit-group',
          text: '添加',
          icon: 'plus',
          action() {
            setShowContentMode(1);
          },
        },
        {
          auth: 'edit-group',
          text: '编辑',
          icon: 'edit',
          forRow: 'single',
          action() {
            setShowContentMode(2);
          },
        },
        {
          auth: 'delete-group',
          text: '删除',
          type: 'danger',
          icon: 'delete',
          forRow: 'multi',
          action() {
            modal.confirm('您确定要删除选择的数据吗？', {
              onOk: async () => {
                await dispatch({
                  type: 'rent/deleteLeaseGroup',
                  payload: (selectedRows || []).map(item => item.id),
                });
                message.success('删除成功');
                table.reload();
                fetchGroupList();
              },
            });
          },
        },
      ],
    }),
    [showContentMode, selectedRows, fetchGroupList]
  );

  return (
    <Card bordered={false}>
      <Datatable
        select="multi"
        url="/leaseGroup/dataList.do"
        columns={columns}
        rowKey="id"
        formSearch={formSearch}
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
                  fetchGroupList={fetchGroupList}
                  cancel={cancelContent}
                  sure={handleEditOrNewFormSubmit}
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
