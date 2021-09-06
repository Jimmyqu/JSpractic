import { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Card } from 'antd';
import moment from 'moment';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import IconFont from '@/components/Icon';
import DealCancelModal from '@/components/Modal/DealCancelModal';
import { formatMoneyLen2, formatDateTime, formatPayWay, formatModel } from '@/utils/format';
import { modelMapToOption, print, getPageQuery } from '@/utils/utils';
import AuthComponent from '@/components/AuthComponent';
import OrderPrint from '@/components/OrderPrint';
import LockerRefundModal from '@/components/Modal/LockerRefundModal';

@connect(({ venue, deal, loading }) => ({
  venue,
  deal,
  printFetching: loading.effects['print/fetch'],
}))
class MainDeal extends Component {
  columns = [
    {
      title: '主订单号',
      dataIndex: 'deal.id',
      width: 90,
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
      width: 80,
    },
    {
      title: '会员姓名',
      dataIndex: 'deal.pubRealName',
      width: 80,
    },
    {
      title: '会员手机号',
      dataIndex: 'deal.pubMobile',
      width: 130,
    },
    {
      title: '订单总价',
      dataIndex: 'payInfo.dealTotalAmount',
      render: formatMoneyLen2,
      collect: true,
      width: 80,
    },
    {
      title: '支付总价',
      dataIndex: 'payInfo.payTotalAmount',
      render: formatMoneyLen2,
      collect: true,
      width: 80,
    },
    {
      title: '支付方式',
      dataIndex: 'payInfo.payList',
      render: (_, record) => formatPayWay(record),
      width: 120,
    },
    {
      title: '支付信息',
      dataIndex: 'payInfo.payDescription',
      width: 170,
    },
    {
      title: '退款信息',
      dataIndex: 'payInfo.refundDescription',
      width: 170,
    },
    {
      title: '是否改价',
      dataIndex: 'deal.changePrice',
      render: value => {
        const {
          deal: { ChangePriceTypes },
        } = this.props;
        return value ? ChangePriceTypes.Change.value : ChangePriceTypes.UnChange.value;
      },
      width: 90,
    },
    {
      title: '订单信息',
      dataIndex: 'deal.descr',
      width: 500,
    },
    {
      title: '订单备注',
      dataIndex: 'deal.userMessage',
      width: 100,
    },
    {
      title: '商家留言',
      dataIndex: 'deal.sellerMessage',
      width: 100,
    },
    {
      title: '取消原因',
      dataIndex: 'deal.cancelMessage',
      width: 120,
    },
    {
      title: '营销中心',
      dataIndex: 'deal.salesName',
      width: 150,
    },
    {
      title: '更新人',
      dataIndex: 'deal.updateRealName',
      width: 120,
    },
    {
      title: '更新时间',
      dataIndex: 'deal.updateTime',
      render: formatDateTime,
      width: 180,
    },
    {
      title: '创建人',
      dataIndex: 'deal.createRealName',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'deal.createTime',
      render: formatDateTime,
      width: 180,
    },
    {
      title: '支付时间',
      dataIndex: 'payInfo.createTime',
      render: formatDateTime,
      width: 180,
    },
    {
      title: '退款时间',
      dataIndex: 'payInfo.cancelFinishTime',
      render: formatDateTime,
      width: 180,
    },
    {
      title: '业务来源',
      dataIndex: 'deal.srvName',
      width: 130,
    },
    {
      title: '单位名称',
      dataIndex: 'deal.companyName',
      width: 150,
    },
  ];

  formSearch = {
    fields: [
      {
        label: '主订单号',
        name: 'dealId',
      },
      {
        label: '会员手机号',
        name: 'pubMobile',
      },
      {
        label: '会员姓名',
        name: 'pubRealName',
        defHidden: true,
      },
      {
        label: '订单状态',
        name: 'dealState',
        mode: 'multiple',
        options: (() => {
          const {
            deal: { DealStatus },
          } = this.props;
          return modelMapToOption(DealStatus);
        })(),
        initialValue: (() => {
          const { analysisStartDate, analysisEndDate, dealState } = getPageQuery();
          if ((analysisStartDate || analysisEndDate || dealState) && dealState) {
            return dealState
              .split(',')
              .filter(id => id)
              .map(id => +id);
          }
        })(),
        type: ItemTypes.Select,
      },
      {
        label: '营销中心',
        name: 'salesId',
        initialValue: (() => {
          const { salesId } = getPageQuery();
          if (salesId) {
            return +salesId;
          }
        })(),
        type: ItemTypes.CascaderVenue,
        defHidden: true,
      },
      // {
      //   label: '支付方式',
      //   name: 'payMode',
      //   options: (() => {
      //     const {
      //       deal: { PayModeTypesWithOutGroup },
      //     } = this.props;
      //     return modelMapToOption(PayModeTypesWithOutGroup);
      //   })(),
      //   type: ItemTypes.Select,
      //   defHidden: true,
      // },
      {
        label: '订单信息',
        name: 'descr',
        defHidden: true,
      },
      {
        label: '订单备注',
        name: 'userMessage',
        defHidden: true,
      },
      {
        label: '商家留言',
        name: 'sellerMessage',
        defHidden: true,
      },
      {
        label: '取消原因',
        name: 'cancelMessage',
        defHidden: true,
      },
      [
        {
          label: '更新时间(始)',
          name: 'startUpdateTime',
          placeholder: '开始',
          initialValue: (() => {
            const { analysisStartDate, analysisEndDate, dealState } = getPageQuery();
            if ((analysisStartDate || analysisEndDate || dealState) && analysisStartDate) {
              return moment(+analysisStartDate);
            }
          })(),
          type: ItemTypes.DatePickerRangeStart,
          defHidden: true,
        },
        {
          label: '更新时间(止)',
          name: 'endUpdateTime',
          placeholder: '结束',
          initialValue: (() => {
            const { analysisStartDate, analysisEndDate, dealState } = getPageQuery();
            if ((analysisStartDate || analysisEndDate || dealState) && analysisEndDate) {
              return moment(+analysisEndDate);
            }
          })(),
          type: ItemTypes.DatePickerRangeEnd,
          defHidden: true,
        },
      ],
      {
        label: '业务来源编号',
        name: 'srvId',
        defHidden: true,
      },
      // [
      //   {
      //     label: '创建时间(始)',
      //     name: 'startCreateDate',
      //     placeholder: '开始',
      //     type: ItemTypes.DatePickerRangeStart,
      //     defHidden: true,
      //   },
      //   {
      //     label: '创建时间(止)',
      //     name: 'endCreateDate',
      //     placeholder: '结束',
      //     type: ItemTypes.DatePickerRangeEnd,
      //     defHidden: true,
      //   },
      // ],
      {
        label: '创建人',
        name: 'createRealName',
        defHidden: true,
      },
      {
        label: '更新人',
        name: 'updateRealName',
        defHidden: true,
      },
      {
        label: '是否改价',
        name: 'ChangePrice',
        options: (() => {
          const {
            deal: { ChangePriceTypes },
          } = this.props;
          return modelMapToOption(ChangePriceTypes);
        })(),
        type: ItemTypes.Select,
        defHidden: true,
      },
    ],
  };

  state = {
    selectedRows: undefined,

    dcModalVisible: false,
    sendbackModalVisible: false,
  };

  operation = () => {
    const {
      dispatch,
      deal: { PayStatus, DealStatus, DealShippingStatus, SubSeqTypes },
      printFetching,
    } = this.props;
    return {
      buttons: [
        {
          text: '去支付',
          icon: <IconFont type="pay" />,
          auth: 'pay',
          type: 'danger',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const { dealState, dealPayState, subDealType } = rows[0].deal;
            if (
              dealState === DealStatus.BOOKING.key ||
              subDealType?.some(
                dealType =>
                  dealType === SubSeqTypes.DEAL_WITHDRAW.key ||
                  dealType === SubSeqTypes.DEAL_PUBLICCREDIT.key ||
                  dealType === SubSeqTypes.DEAL_MARKETING_MEMBER.key
              )
            ) {
              return false;
            }
            return dealPayState === PayStatus.UNPAID.key;
          },
          action: () => {
            this.goToSummary();
          },
        },
        {
          text: '编辑',
          auth: 'edit',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const { dealState, dealPayState, subDealType } = rows[0].deal;
            if (dealState === DealStatus.BOOKING.key) {
              return false;
            }
            if (dealPayState === PayStatus.UNPAID.key) {
              //  服务人员没有单独的购买渠道，依附定场，有服务人员一定有定场
              return subDealType?.some(
                dealType =>
                  dealType === SubSeqTypes.DEAL_PLATFORM.key ||
                  dealType === SubSeqTypes.DEAL_ITEM.key ||
                  dealType === SubSeqTypes.DEAL_SERVICEPUB.key ||
                  dealType === SubSeqTypes.DEAL_TICKET.key ||
                  dealType === SubSeqTypes.DEAL_COURSE.key
              );
            }
            return false;
          },
          action: () => {
            const { selectedRows } = this.state;
            const { dealPlatformList, dealItemList, dealServicePubList, dealTicketList, dealCourseList, deal } =
              selectedRows[0];
            //  服务人员没有单独的购买渠道，依附定场，有服务人员一定有定场
            if (dealPlatformList && dealPlatformList.length > 0) {
              window.open(`/basic/platform/booking/booking?id=${deal.id}`);
              return;
            }
            if (dealItemList && dealItemList.length > 0) {
              dispatch(
                push({
                  pathname: '/basic/mall/sell/mall',
                  search: `id=${deal.id}`,
                })
              );
              return;
            }
            if (dealServicePubList && dealServicePubList.length > 0) {
              dispatch(
                push({
                  pathname: `/basic/pub/pubservice/${dealServicePubList[0].serviceId}/sell`,
                  search: `id=${deal.id}`,
                })
              );
              return;
            }
            if (dealTicketList && dealTicketList.length > 0) {
              dispatch(
                push({
                  pathname: `/basic/ticket/sell/${dealTicketList[0].dataId}/user`,
                  search: `id=${deal.id}`,
                })
              );
              return;
            }
            if (dealCourseList && dealCourseList.length > 0) {
              dispatch(
                push({
                  pathname: `/basic/course/sell/${dealCourseList[0].courseDataId}/user`,
                  search: `id=${deal.id}`,
                })
              );
            }
          },
        },
        {
          text: '取消订单',
          icon: <IconFont type="cancel" />,
          auth: 'remove',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const { deal, dealLeaseList } = rows[0];
            // 租赁订单用另一个按钮
            if (dealLeaseList && dealLeaseList.length > 0) {
              return false;
            }
            const { dealState, dealAddress, dealShippingState } = deal;
            return !(
              dealState === DealStatus.CANCEL.key ||
              dealState === DealStatus.REFUNDED.key ||
              dealState === DealStatus.BOOKING.key ||
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
          text: '取消订单',
          icon: <IconFont type="cancel" />,
          auth: 'remove',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const { deal, dealLeaseList } = rows[0];
            // 租赁订单用另一个按钮
            if (dealLeaseList == null || dealLeaseList.length === 0) {
              return false;
            }
            const { dealState, dealPayState } = deal;
            if (
              dealState === DealStatus.CANCEL.key ||
              dealState === DealStatus.REFUNDED.key ||
              dealState === DealStatus.BOOKING.key
            ) {
              return false;
            }
            return dealPayState === PayStatus.UNPAID.key;
          },
          action: () => {
            this.handleSendbackModalVisible(true);
          },
        },
        {
          text: '归还/退款',
          type: 'primary',
          icon: <IconFont type="cancel" />,
          auth: 'remove',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const { deal, dealLeaseList } = rows[0];
            // 租赁订单用另一个按钮
            if (dealLeaseList == null || dealLeaseList.length === 0) {
              return false;
            }
            const { dealState, dealPayState } = deal;
            if (
              dealState === DealStatus.CANCEL.key ||
              dealState === DealStatus.REFUNDED.key ||
              dealState === DealStatus.BOOKING.key
            ) {
              return false;
            }
            return dealPayState === PayStatus.HASPAID.key;
          },
          action: () => {
            this.handleSendbackModalVisible(true);
          },
        },
        {
          text: '改价',
          auth: 'edit-amount-btn',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const { deal, dealLeaseList } = rows[0];
            if (dealLeaseList && dealLeaseList.length > 0) {
              return false;
            }
            const { dealState, dealPayState } = deal;
            return dealPayState === PayStatus.UNPAID.key || dealState === DealStatus.BOOKING.key;
          },
          action: () => {
            this.goToSummary();
          },
        },
        {
          text: '发货',
          auth: 'deliver',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const dealInfo = rows[0] || {};
            const { dealAddress, dealShippingState } = dealInfo.deal || {};
            return dealAddress && dealShippingState === DealShippingStatus.WAIT_SEND.key;
          },
          action: () => {
            const { selectedRows } = this.state;
            dispatch(
              push({
                pathname: '/basic/logistics/shipping',
                search: `id=${selectedRows[0].deal.id}`,
              })
            );
          },
        },
        {
          text: '打印',
          icon: <IconFont type="print" />,
          loading: printFetching,
          auth: 'print',
          forRow: rows => {
            return rows.length === 1 && rows[0].deal.dealPayState === PayStatus.HASPAID.key;
          },
          action: () => {
            const { selectedRows } = this.state;
            print(selectedRows[0]);
          },
        },
        {
          text: '打印预览',
          icon: <IconFont type="print" />,
          auth: 'print',
          forRow: rows => {
            return rows.length === 1 && rows[0].deal.dealPayState === PayStatus.HASPAID.key;
          },
          action: () => {
            const { selectedRows } = this.state;
            dispatch(push(`./${selectedRows[0].deal.id}/print`));
          },
        },
        {
          auth: 'export',
          btnType: ButtonTypes.Export,
        },
        {
          text: '订单详情',
          icon: <IconFont type="menu-deal-main" />,
          forRow: 'single',
          action: () => {
            const { selectedRows } = this.state;
            dispatch(push(`./${selectedRows[0].deal.id}/detail`));
          },
        },
      ],
    };
  };

  goToSummary = () => {
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
  };

  handleDealCancelVisibleChange = visible => {
    this.setState({
      dcModalVisible: visible,
    });
  };

  handleSendbackModalVisible = visible => {
    this.setState({
      sendbackModalVisible: visible,
    });
  };

  handleDoDealCancel = () => {
    this.handleSendbackModalVisible(false);
    this.table.reload();
  };

  handleTableInit = table => {
    this.table = table;
  };

  handleSelectedChange = (_, rows) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSelectedChange = (_, rows) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleBeforeLoadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deal/breakPolling',
    });
  };

  render() {
    const {
      deal: { PayStatus },
    } = this.props;
    const { selectedRows = [], dcModalVisible, sendbackModalVisible } = this.state;
    const selectedDealId = selectedRows?.[0]?.deal?.id;
    const printId = selectedRows?.[0]?.deal?.dealPayState === PayStatus.HASPAID.key ? selectedDealId : null;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Datatable
            select="multi"
            onSelectedChange={this.handleSelectedChange}
            url="/deal/dataList.do"
            columns={this.columns}
            // https://ant.design/components/table-cn/#%E6%B3%A8%E6%84%8F
            rowKey={record => record.deal.id}
            formSearch={this.formSearch}
            operation={this.operation()}
            onInit={this.handleTableInit}
            onBeforeLoadData={this.handleBeforeLoadData}
          />
        </Card>
        <DealCancelModal
          dealId={selectedDealId}
          visible={dcModalVisible}
          onVisibleChange={this.handleDealCancelVisibleChange}
          onOk={this.handleDoDealCancel}
        />
        <LockerRefundModal
          visible={sendbackModalVisible}
          dealId={selectedDealId}
          onVisibleChange={this.handleSendbackModalVisible}
          onOk={this.handleDoDealCancel}
        />
        {/* //FIXME 选行即加载的方式性能非常不好，但疑似受限于 https://github.com/facebook/react/issues/16734 ，只能先这样 */}
        <AuthComponent auth="print">
          <OrderPrint id={printId} onlyPrint />
        </AuthComponent>
      </PageHeaderLayout>
    );
  }
}

export default MainDeal;
