import { useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, message } from 'antd';
import Datatable, { ItemTypes } from '@/components/Datatable';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { formatDateHM, formatModel } from '@/utils/format';
import { modelMapToOption } from '@/utils/utils';
import { modal } from '@/utils/feedback';
import EditContent from './EditContent';

export default function () {
  const [showContentMode, setShowContentMode] = useState();
  const [selectedRows, setSelectedRows] = useState();
  const [table, setTableInit] = useState();
  const { PayWayTypes } = useSelector(state => state.deal);
  const { RefundModeTypes, LeaseTypes } = useSelector(state => state.rent);
  const saving = useSelector(state => state.loading.effects['rent/editOrAddLeaseConfig']);
  const deleting = useSelector(state => state.loading.effects['rent/deleteLeaseConfig']);
  const dispatch = useDispatch();

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

  const formSearch = useMemo(
    () => ({
      fields: [
        {
          label: '退款方式',
          name: 'refundMode',
          options: modelMapToOption(RefundModeTypes),
          type: ItemTypes.Select,
        },
        {
          label: '租赁类别',
          name: 'leaseType',
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
        title: '租赁类型',
        dataIndex: 'leaseType',
        render: value => formatModel(LeaseTypes, value),
        width: 90,
      },
      {
        title: '支付方式',
        dataIndex: 'payMode',
        render: value =>
          (value.includes(PayWayTypes.GROUP.key)
            ? [...value.filter(i => i !== PayWayTypes.GROUP.key), PayWayTypes.WECHAT.key, PayWayTypes.ZFB.key]
            : value || []
          )
            .map(key => formatModel(PayWayTypes, key))
            .join(', '),
        width: 120,
      },
      {
        title: '退款方式',
        dataIndex: 'refundMode',
        render: value => formatModel(RefundModeTypes, value),
        width: 90,
      },
      // {
      //   title: '延迟退款时间(小时)',
      //   dataIndex: 'refundTime',
      //   rende: value => moment().hour(value),
      //   width: 150,
      // },
      {
        title: '备注',
        dataIndex: 'descr',
        width: 150,
      },
      {
        title: '排序',
        dataIndex: 'ranks',
        width: 70,
      },
      {
        title: '更新人',
        dataIndex: 'updateRealName',
        width: 90,
      },
      {
        title: '更新时间',
        dataIndex: 'gmtModified',
        render: formatDateHM,
        width: 130,
      },
      {
        title: '创建人',
        dataIndex: 'createRealName',
        width: 90,
      },
      {
        title: '创建时间',
        dataIndex: 'gmtCreate',
        render: formatDateHM,
        width: 130,
      },
      {
        title: '创建单位',
        dataIndex: 'companyName',
        width: 130,
      },
    ],
    []
  );

  const operation = useMemo(
    () => ({
      buttons: [
        {
          auth: 'add',
          text: '添加',
          icon: 'plus',
          disabled: deleting || saving,
          action() {
            setShowContentMode(1);
          },
        },
        {
          auth: 'edit',
          text: '修改',
          icon: 'edit',
          forRow: 'single',
          disabled: deleting || saving,
          action() {
            setShowContentMode(2);
          },
        },
        {
          auth: 'remove',
          text: '删除',
          type: 'danger',
          icon: 'delete',
          forRow: 'multi',
          loading: deleting,
          disabled: saving,
          action() {
            modal.confirm('你确定要删除所选数据吗？', {
              onOk: async () => {
                await dispatch({
                  type: 'rent/deleteLeaseConfig',
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
    [showContentMode, selectedRows, deleting, saving]
  );

  return (
    <PageHeaderLayout>
      <Card bordered={false}>
        <Datatable
          select="multi"
          url="/leaseConfig/list.do"
          columns={columns}
          rowKey="id"
          pagination={false}
          formSearch={formSearch}
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
    </PageHeaderLayout>
  );
}
