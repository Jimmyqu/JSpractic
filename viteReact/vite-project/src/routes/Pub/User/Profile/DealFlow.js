import { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Card } from 'antd';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import IconFont from '@/components/Icon';
import DealCancelModal from '@/components/Modal/DealCancelModal';
import { formatDateTime, formatMoneyLen2, formatPayWay, formatModel } from '@/utils/format';
import { modelMapToOption } from '@/utils/utils';

@connect(({ payment, deal, venue }) => ({
  payment,
  deal,
  venue,
}))
class ProfileDealFlow extends Component {
  columns = [
    {
      title: '主订单号',
      dataIndex: 'deal.id',
      width: 100,
    },
    {
      title: '订单状态',
      dataIndex: 'deal.dealState',
      render: value => {
        const {
          deal: { DealStatus },
        } = this.props;
        return formatModel(DealStatus, value);
      },
      width: 100,
    },
    {
      title: '支付状态',
      dataIndex: 'deal.dealPayState',
      render: value => {
        const {
          deal: { PayStatus },
        } = this.props;
        if (value == null) {
          return PayStatus.UNPAID.value;
        }
        return formatModel(PayStatus, value);
      },
      width: 100,
    },
    {
      title: '订单信息',
      dataIndex: 'deal.descr',
      width: 350,
    },
    {
      title: '支付信息',
      dataIndex: 'payInfo.payDescription',
      width: 200,
    },
    {
      title: '退款信息',
      dataIndex: 'payInfo.refundDescription',
      width: 200,
    },
    {
      title: '订单总额',
      dataIndex: 'payInfo.dealTotalAmount',
      render: formatMoneyLen2,
      collect: true,
      width: 100,
    },
    {
      title: '实付金额',
      dataIndex: 'payInfo.payTotalAmount',
      render: formatMoneyLen2,
      collect: true,
      width: 100,
    },
    {
      title: '支付方式',
      dataIndex: 'payInfo.payList',
      render: (_, record) => formatPayWay(record),
      width: 120,
    },
    {
      title: '会员姓名',
      dataIndex: 'deal.pubRealName',
      width: 100,
    },
    {
      title: '会员电话',
      dataIndex: 'deal.pubMobile',
      width: 100,
    },
    {
      title: '营销中心',
      dataIndex: 'deal.salesName',
      width: 200,
    },
    {
      title: '订单备注',
      dataIndex: 'deal.userMessage',
      width: 120,
    },
    {
      title: '商家留言',
      dataIndex: 'deal.sellerMessage',
      width: 120,
    },
    {
      title: '取消原因',
      dataIndex: 'deal.cancelMessage',
      width: 120,
    },
    {
      title: '创建人',
      dataIndex: 'deal.createRealName',
      width: 130,
    },
    {
      title: '更新时间',
      dataIndex: 'deal.updateTime',
      render: formatDateTime,
      width: 190,
    },
    {
      title: '创建时间',
      dataIndex: 'deal.createTime',
      render: formatDateTime,
      width: 190,
    },
  ];

  formSearch = {
    fields: [
      {
        label: '营销中心',
        name: 'salesId',
        type: ItemTypes.CascaderVenue,
      },
      {
        label: '支付状态',
        name: 'dealPayState',
        options: (() => {
          const {
            deal: { PayStatus },
          } = this.props;
          return modelMapToOption(PayStatus);
        })(),
        type: ItemTypes.Select,
      },
      // {
      //   label: '支付方式',
      //   name: 'payNewModes',
      //   mode: 'multiple',
      //   options: (() => {
      //     const {
      //       deal: { PayModeTypesWithOutGroup },
      //     } = this.props;
      //     return modelMapToOption(PayModeTypesWithOutGroup);
      //   })(),
      //   type: ItemTypes.Select,
      // },
      {
        label: '主订单号',
        name: 'dealId',
      },
      [
        {
          label: '开始创建时间',
          name: 'startCreateTime',
          placeholder: '开始时间',
          type: ItemTypes.DatePickerRangeStart,
          defHidden: true,
        },
        {
          label: '结束创建时间',
          name: 'endCreateTime',
          placeholder: '结束时间',
          type: ItemTypes.DatePickerRangeEnd,
          defHidden: true,
        },
      ],
    ],
  };

  operation = {
    buttons: [
      {
        type: 'primary',
        text: '去支付',
        icon: <IconFont type="pay" />,
        forRow: rows => {
          const {
            deal: { PayStatus, DealStatus },
          } = this.props;
          if (rows.length !== 1) {
            return false;
          }
          const { dealState, dealPayState } = rows[0].deal;
          if (dealState === DealStatus.BOOKING.key) {
            return false;
          }
          return dealPayState === PayStatus.UNPAID.key;
        },
        action: () => {
          const { dispatch } = this.props;
          const { selectedRows } = this.state;
          const { dealPlatformList, dealItemList, dealServicePubList, dealTicketList, dealCourseList, deal } =
            selectedRows[0];
          if (dealPlatformList && dealPlatformList.length > 0) {
            dispatch(
              push({
                pathname: '/basic/platform/booking/summary',
                search: `id=${deal.id}`,
              })
            );
            return;
          }
          if (dealItemList && dealItemList.length > 0) {
            dispatch(
              push({
                pathname: '/basic/mall/sell/summary',
                search: `id=${deal.id}`,
              })
            );
            return;
          }
          if (dealServicePubList && dealServicePubList.length > 0) {
            dispatch(
              push({
                pathname: `/basic/pub/pubservice/${dealServicePubList[0].serviceId}/summary`,
                search: `id=${deal.id}`,
              })
            );
            return;
          }
          if (dealTicketList && dealTicketList.length > 0) {
            dispatch(
              push({
                pathname: `/basic/ticket/sell/${dealTicketList[0].dataId}/summary`,
                search: `id=${deal.id}`,
              })
            );
            return;
          }
          if (dealCourseList && dealCourseList.length > 0) {
            dispatch(
              push({
                pathname: `/basic/course/sell/${dealCourseList[0].courseDataId}/summary`,
                search: `id=${deal.id}`,
              })
            );
            return;
          }
          dispatch(
            push({
              pathname: `/basic/deal/${deal.id}/summary`,
            })
          );
        },
      },
      {
        text: '取消订单',
        icon: <IconFont type="cancel" />,
        forRow: rows => {
          const {
            deal: { DealStatus, DealShippingStatus, SubSeqTypes },
          } = this.props;
          if (rows.length !== 1) {
            return false;
          }
          const { dealState, dealAddress, dealShippingState, subDealType } = rows[0].deal;
          if (subDealType.includes(SubSeqTypes.DEAL_WITHDRAW.key)) {
            return false;
          }
          return !(
            dealState === DealStatus.CANCEL.key ||
            dealState === DealStatus.REFUNDED.key ||
            (dealAddress &&
              (dealShippingState === DealShippingStatus.WAIT_CONSIGNEE.key ||
                dealShippingState === DealShippingStatus.CONFIRM_CONSIGNEE.key))
          );
        },
        action: () => {
          this.handleDealCancelVisibleChange(true);
        },
      },
      {
        text: '打印',
        icon: <IconFont type="print" />,
        auth: 'print',
        forRow: rows => {
          const {
            deal: { PayStatus },
          } = this.props;
          return rows.length === 1 && rows[0].deal.dealPayState === PayStatus.HASPAID.key;
        },
        action: () => {
          const { dispatch } = this.props;
          const { selectedRows } = this.state;
          dispatch(push(`/basic/deal/${selectedRows[0].deal.id}/print`));
        },
      },
      {
        text: '订单详情',
        icon: <IconFont type="menu-deal-main" />,
        forRow: 'single',
        action: () => {
          const { dispatch } = this.props;
          const { selectedRows } = this.state;
          dispatch(push(`/basic/deal/${selectedRows[0].deal.id}/detail`));
        },
      },
      {
        auth: 'export',
        btnType: ButtonTypes.Export,
      },
    ],
  };

  state = {
    selectedRows: undefined,

    dcModalVisible: false,
  };

  handleSelectedChange = (_, rows) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleTableInit = table => {
    this.table = table;
  };

  handleDealCancelVisibleChange = visible => {
    this.setState({
      dcModalVisible: visible,
    });
  };

  handleDoDealCancel = () => {
    this.table.reload();
  };

  handleBeforeLoadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deal/breakPolling',
    });
  };

  render() {
    const {
      match: { params },
    } = this.props;
    const { id: pubAccountId } = params || {};

    const { selectedRows = [], dcModalVisible } = this.state;
    return (
      <Card bordered={false}>
        <Datatable
          select="multi"
          url={`/deal/dataList.do?pubAccountId=${pubAccountId}`}
          onSelectedChange={this.handleSelectedChange}
          columns={this.columns}
          rowKey={record => (record.deal || {}).id}
          formSearch={this.formSearch}
          operation={this.operation}
          onInit={this.handleTableInit}
          onBeforeLoadData={this.handleBeforeLoadData}
        />
        <DealCancelModal
          dealId={((selectedRows[0] || {}).deal || {}).id}
          visible={dcModalVisible}
          onVisibleChange={this.handleDealCancelVisibleChange}
          onOk={this.handleDoDealCancel}
        />
      </Card>
    );
  }
}

export default ProfileDealFlow;
