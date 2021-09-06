import { useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import { Card, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import IconFont from '@/components/Icon';
import LockerRefundModal from '@/components/Modal/LockerRefundModal';
import { formatMoneyLen2, formatDateTime, formatModel, formatPayWay, formatSrvId } from '@/utils/format';
import { modelMapToOption } from '@/utils/utils';
import { modal } from '@/utils/feedback';

function RentDeal() {
  const [selectedRows, setSelectedRows] = useState();
  const [sendbackModalVisible, setSendbackModalVisible] = useState();
  const [table, setTableInit] = useState();
  const { ProfessionTypes } = useSelector(state => state.venue);
  const { DealStatus: MainDealStatus } = useSelector(state => state.deal);
  const { LeaseTypes, DealStatus } = useSelector(state => state.rent);
  const dispatch = useDispatch();

  const columns = useMemo(
    () => [
      {
        title: '租赁订单',
        dataIndex: 'dealLeaseVO.id',
        width: 90,
      },
      {
        title: '主订单号',
        dataIndex: 'deal.id',
        width: 90,
      },
      {
        title: '会员姓名',
        dataIndex: 'deal.pubRealName',
        width: 150,
      },
      {
        title: '手机号',
        dataIndex: 'deal.pubMobile',
        width: 130,
      },
      {
        title: '状态',
        dataIndex: 'dealLeaseVO.dealState',
        render: value => formatModel(DealStatus, value),
        width: 90,
      },
      {
        title: '类型',
        dataIndex: 'dealLeaseVO.leaseType',
        render: value => formatModel(LeaseTypes, value),
        width: 120,
      },
      {
        title: '名称',
        dataIndex: 'dealLeaseVO.projectName',
        width: 120,
      },
      {
        title: '编号',
        dataIndex: 'dealLeaseVO.projectId',
        width: 120,
      },
      {
        title: '总租金',
        dataIndex: 'dealLeaseVO.rentalTotalAmount',
        render: formatMoneyLen2,
        width: 90,
      },
      {
        title: '总押金',
        dataIndex: 'dealLeaseVO.depositTotalAmount',
        render: formatMoneyLen2,
        width: 90,
      },
      {
        title: '组别编号',
        dataIndex: 'dealLeaseVO.groupId',
        width: 90,
      },
      {
        title: '组别',
        dataIndex: 'dealLeaseVO.groupName',
        width: 120,
      },
      {
        title: '营销中心',
        dataIndex: 'deal.salesName',
        width: 150,
      },
      {
        title: '项目类型',
        dataIndex: 'dealLeaseVO.professionalId',
        render: value => formatModel(ProfessionTypes, value),
        width: 80,
      },
      {
        title: '支付方式',
        dataIndex: 'payInfo.payList',
        render: (_, record) => formatPayWay(record),
        width: 110,
      },
      {
        title: '支付信息',
        dataIndex: 'payInfo.payDescription',
        width: 250,
      },
      {
        title: '退款信息',
        dataIndex: 'payInfo.refundDescription',
        width: 250,
      },
      {
        title: '订单备注',
        dataIndex: 'deal.userMessage',
        width: 250,
      },
      {
        title: '商家留言',
        dataIndex: 'deal.sellerMessage',
        width: 250,
      },
      {
        title: '取消原因',
        dataIndex: 'deal.cancelMessage',
        width: 250,
      },
      {
        title: '使用时间',
        dataIndex: 'dealLeaseVO.startDate',
        render: formatDateTime,
        width: 170,
      },
      {
        title: '归还时间',
        dataIndex: 'dealLeaseVO.endDate',
        render: formatDateTime,
        width: 170,
      },
      {
        title: '支付时间',
        dataIndex: 'payInfo.createTime',
        render: formatDateTime,
        width: 170,
      },
      {
        title: '退款时间',
        dataIndex: 'dealLeaseVO.refundDate',
        render: (_, { dealLeaseVO: { endDate } }) => formatDateTime(endDate),
        width: 190,
      },
      // 没有字段
      // {
      //   title: '核验人',
      //   dataIndex: 'checkRealName',
      //   width: 130,
      // },
      {
        title: '更新人',
        dataIndex: 'deal.updateRealName',
        width: 120,
      },
      {
        title: '更新时间',
        dataIndex: 'dealLeaseVO.gmtModified',
        render: formatDateTime,
        width: 170,
      },
      {
        title: '创建人',
        dataIndex: 'deal.createRealName',
        width: 120,
      },
      {
        title: '创建时间',
        dataIndex: 'dealLeaseVO.gmtCreate',
        render: formatDateTime,
        width: 170,
      },
      {
        title: '业务来源',
        dataIndex: 'srvId',
        render: formatSrvId,
        width: 130,
      },
      {
        title: '创建单位',
        dataIndex: 'dealLeaseVO.companyName',
        width: 180,
      },
    ],
    []
  );

  const formSearch = useMemo(
    () => ({
      fields: [
        {
          label: '营销中心',
          name: 'salesId',
          type: ItemTypes.CascaderVenue,
        },
        {
          label: '项目',
          name: 'professionalId',
          options: modelMapToOption(ProfessionTypes),
          type: ItemTypes.Select,
        },
        {
          label: 'IC/物理卡号',
          placeholder: '请输入',
          name: 'projectNum',
        },
        {
          label: '名称',
          placeholder: '请输入',
          name: 'projectName',
          defHidden: true,
        },
        {
          label: '状态',
          name: 'dealState',
          options: modelMapToOption(DealStatus),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '组别',
          name: 'priceGroupId',
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '姓名',
          placeholder: '请输入',
          name: 'pubRealName',
          defHidden: true,
        },
        {
          label: '会员手机号',
          placeholder: '请输入',
          name: 'pubMobile',
          defHidden: true,
        },
        {
          label: '更新人',
          placeholder: '请输入',
          name: 'createRealName',
          defHidden: true,
        },
        [
          {
            label: '使用日期(始)',
            name: 'startDateSt',
            type: ItemTypes.DatePickerRangeStart,
            defHidden: true,
          },
          {
            label: '使用日期(止)',
            name: 'startDateEt',
            type: ItemTypes.DatePickerRangeEnd,
            defHidden: true,
          },
        ],
        [
          {
            label: '归还日期(始)',
            name: 'endDateSt',
            type: ItemTypes.DatePickerRangeStart,
            defHidden: true,
          },
          {
            label: '归还日期(止)',
            name: 'endDateEt',
            type: ItemTypes.DatePickerRangeEnd,
            defHidden: true,
          },
        ],
      ],
    }),
    []
  );

  const operation = useMemo(
    () => ({
      buttons: [
        {
          auth: 'refund',
          text: '归还/退款',
          type: 'primary',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const { deal, dealLeaseVO } = rows[0];
            const { dealState } = deal;
            if (
              dealState === MainDealStatus.CANCEL.key ||
              dealState === MainDealStatus.REFUNDED.key ||
              dealState === MainDealStatus.BOOKING.key
            ) {
              return false;
            }
            return dealLeaseVO?.dealState === DealStatus.LEASE_USED.key;
          },
          action: () => {
            setSendbackModalVisible(true);
          },
        },
        {
          auth: 'refund',
          text: '取消订单',
          icon: <IconFont type="cancel" />,
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const { deal, dealLeaseVO } = rows[0];
            const { dealState } = deal;
            if (
              dealState === MainDealStatus.CANCEL.key ||
              dealState === MainDealStatus.REFUNDED.key ||
              dealState === MainDealStatus.BOOKING.key
            ) {
              return false;
            }
            const { dealState: ds } = dealLeaseVO || {};
            return ds === DealStatus.LEASE_WAIT.key || ds === DealStatus.LEASE_PASS.key;
          },
          action: () => {
            setSendbackModalVisible(true);
          },
        },
        {
          auth: 'clean',
          text: '清柜',
          forRow: rows => {
            if (rows.length === 0) {
              return false;
            }
            return rows.every(({ dealLeaseVO }) => {
              const { cleanState, dealState } = dealLeaseVO || {};
              return cleanState !== 1 && dealState === DealStatus.LEASE_USED.key;
            });
          },
          action: () => {
            modal.confirm('您确定要对所选租赁订单执行清柜操作吗?', {
              onOk: async () => {
                await dispatch({
                  type: 'rent/batchSetClean',
                  payload: selectedRows.map(({ dealLeaseVO: { projectId } }) => projectId),
                });
                message.success('清柜成功');
                table.reload();
              },
            });
          },
        },
        {
          text: '订单详情',
          icon: <IconFont type="menu-deal-main" />,
          forRow: 'single',
          action: () => {
            dispatch(push(`./${selectedRows[0].deal.id}/detail`));
          },
        },
        {
          auth: 'export',
          btnType: ButtonTypes.Export,
        },
      ],
    }),
    [table, selectedRows]
  );

  const handleSelectedChange = useCallback((_, rows) => {
    setSelectedRows(rows);
  }, []);

  const dealId = selectedRows?.[0]?.deal?.id;

  return (
    <PageHeaderLayout>
      <Card bordered={false}>
        <Datatable
          select="multi"
          onSelectedChange={handleSelectedChange}
          url="/dealLease/dataList.do"
          columns={columns}
          rowKey={record => record.dealLeaseVO.id}
          formSearch={formSearch}
          operation={operation}
          onInit={setTableInit}
        />
      </Card>
      <LockerRefundModal
        visible={sendbackModalVisible}
        dealId={dealId}
        onVisibleChange={setSendbackModalVisible}
        onOk={() => {
          setSendbackModalVisible(false);
          table.reload();
        }}
      />
    </PageHeaderLayout>
  );
}

export default RentDeal;
