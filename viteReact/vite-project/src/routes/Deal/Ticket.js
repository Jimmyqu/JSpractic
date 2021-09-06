import { Component } from 'react';
import moment from 'moment';
import { stringify } from 'qs';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Card } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import IconFont from '@/components/Icon';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import DealCancelModal from '@/components/Modal/DealCancelModal';
import {
  formatDate,
  formatHM,
  formatMoneyLen2,
  formatDateTime,
  formatPayWay,
  formatModel,
  formatColorWrapper,
  formatSeatData,
  formatStudyList,
} from '@/utils/format';
import { getPageQuery, modelMapToOption, print } from '@/utils/utils';
import AuthComponent from '@/components/AuthComponent';
import OrderPrint from '@/components/OrderPrint';
import ReplaceSeatDrawer from './ReplaceSeatDrawer';

@connect(({ venue, pubticket, deal, loading }) => ({
  venue,
  pubticket,
  deal,
  printFetching: loading.effects['print/fetch'],
}))
class Ticket extends Component {
  /**
   * 生成不同链接效果的 render
   */
  // eslint-disable-next-line react/sort-comp
  genLinkWrapperRender =
    (render = value => value, genQuery = () => {}, isIgnore = () => false) =>
    (...args) => {
      const [, record] = args;
      const v = render(...args);
      if (isIgnore(...args)) {
        return v;
      }
      return (
        <span className="link" onClick={() => this.handleToCheckLogs(record, genQuery(...args))}>
          {v}
        </span>
      );
    };

  numRender = value => formatColorWrapper()(value);

  columns = [
    {
      title: '票务订单号',
      dataIndex: 'dealTicket.id',
      width: 90,
    },
    {
      title: '主订单号',
      dataIndex: 'deal.id',
      width: 90,
    },
    {
      title: '订单状态',
      dataIndex: 'dealTicket.dealState',
      render: value => {
        const {
          pubticket: { DealStatus },
        } = this.props;
        return formatModel(DealStatus, value);
      },
      width: 90,
    },
    {
      title: '会员姓名',
      dataIndex: 'deal.pubRealName',
      width: 90,
    },
    {
      title: '会员手机号',
      dataIndex: 'deal.pubMobile',
      width: 130,
    },
    {
      title: '入场人员/学员信息',
      dataIndex: 'dealTicket.dealTicketStudyList',
      render: formatStudyList,
      width: 260,
    },
    {
      title: '票名',
      dataIndex: 'dealTicket.ticketName',
      width: 180,
    },
    {
      title: '服务名称',
      // TODO 服务名称 现在未返回 待接口
      dataIndex: 'payInfo.payStatusName',
      width: 130,
    },
    {
      title: '主订单支付总价',
      dataIndex: 'payInfo.payTotalAmount',
      render: formatMoneyLen2,
      collect: true,
      width: 140,
    },
    {
      title: '支付方式',
      dataIndex: 'payInfo.payList',
      render: (_, record) => formatPayWay(record),
      width: 130,
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
      title: '数量',
      dataIndex: 'dealTicket.salesNum',
      collect: true,
      width: 60,
    },
    {
      title: '单价',
      dataIndex: 'dealTicket.ticketPrice',
      render: formatMoneyLen2,
      collect: true,
      width: 60,
    },
    {
      title: '总价',
      dataIndex: 'dealTicket.ticketTotalPrice',
      render: formatMoneyLen2,
      collect: true,
      width: 60,
    },
    {
      title: '座位号',
      dataIndex: 'dealTicket.seatDataName',
      render: formatSeatData,
      width: 170,
    },
    {
      title: '演出/可用日期',
      dataIndex: 'dealTicket.orderDate',
      render: (value, { dealTicket: { calendarType } }) => {
        const {
          pubticket: { CalendarTypes },
        } = this.props;
        if (calendarType === CalendarTypes.VALIDITYSCHEDULE.key) {
          return null;
        }
        return formatDate(value);
      },
      width: 110,
    },
    {
      title: '开始时间',
      dataIndex: 'dealTicket.startTime',
      render: (value, { dealTicket: { calendarType } }) => {
        const {
          pubticket: { CalendarTypes },
        } = this.props;
        if (calendarType === CalendarTypes.VALIDITYSCHEDULE.key) {
          return null;
        }
        return formatHM(value);
      },
      width: 80,
    },
    {
      title: '场馆/场地',
      dataIndex: 'dealTicket.platformName',
      width: 130,
    },
    {
      title: '排期日程类型',
      dataIndex: 'dealTicket.calendarType',
      render: value => {
        const {
          pubticket: { CalendarTypes },
        } = this.props;
        return formatModel(CalendarTypes, value);
      },
      width: 110,
    },
    {
      title: '有效期(始)',
      dataIndex: 'dealTicket.fromDate',
      render: (value, { dealTicket: { calendarType } }) => {
        const {
          pubticket: { CalendarTypes },
        } = this.props;
        if (calendarType === CalendarTypes.FIXEDSCHEDULE.key) {
          return null;
        }
        return formatDate(value);
      },
      width: 130,
    },
    {
      title: '有效期(止)',
      dataIndex: 'dealTicket.toDate',
      render: (value, { dealTicket: { calendarType } }) => {
        const {
          pubticket: { CalendarTypes },
        } = this.props;
        if (calendarType === CalendarTypes.FIXEDSCHEDULE.key) {
          return null;
        }
        return formatDate(value);
      },
      width: 130,
    },
    {
      title: '类型',
      dataIndex: 'dealTicket.professionalId',
      render: value => {
        const {
          venue: { ProfessionTypes },
        } = this.props;
        return formatModel(ProfessionTypes, value);
      },
      width: 90,
    },
    {
      title: '营销中心',
      dataIndex: 'deal.salesName',
      width: 180,
    },
    {
      title: '支付订单号',
      dataIndex: 'payInfo.payOrderId',
      width: 230,
    },
    {
      title: '订单备注',
      dataIndex: 'deal.userMessage',
      width: 130,
    },
    {
      title: '商家留言',
      dataIndex: 'deal.sellerMessage',
      width: 130,
    },
    {
      title: '取消原因',
      dataIndex: 'deal.cancelMessage',
      width: 120,
    },
    {
      title: '核验状态',
      dataIndex: 'dealTicket.checkState',
      render: value => {
        const {
          pubticket: { CheckStatus },
        } = this.props;
        return formatModel(CheckStatus, value);
      },
      width: 80,
    },
    {
      title: '核验数',
      children: [
        {
          title: '已核验数',
          dataIndex: 'dealTicket.checkNum',
          render: this.genLinkWrapperRender(
            this.numRender,
            (value, record) => {
              const {
                dealTicket: { dealId },
              } = record;
              return {
                dealId,
              };
            },
            value => value === 0
          ),
          width: 80,
        },
        {
          title: '未核验数',
          render: (value, { dealTicket: { salesNum, checkNum } }) => formatColorWrapper()(salesNum - checkNum),
          width: 80,
        },
      ],
    },
    {
      title: '核验人',
      dataIndex: 'dealTicket.checkName',
      render: (value, { dealTicket: { checkMobile } }) => `${value || ''}${checkMobile ? '/' : ''}${checkMobile || ''}`,
      width: 180,
    },
    {
      title: '核验时间',
      dataIndex: 'dealTicket.checkDate',
      render: formatDateTime,
      width: 180,
    },
    {
      title: '更新人',
      dataIndex: 'deal.updateRealName',
      width: 120,
    },
    {
      title: '更新时间',
      dataIndex: 'dealTicket.updateTime',
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
      dataIndex: 'dealTicket.createTime',
      render: formatDateTime,
      width: 180,
    },
    {
      title: '业务来源',
      dataIndex: 'deal.srvName',
      width: 110,
    },
    {
      title: '单位名称',
      dataIndex: 'dealTicket.companyName',
      width: 150,
    },
  ];

  formSearch = {
    fields: [
      {
        label: '订单状态',
        name: 'dealState',
        mode: 'multiple',
        options: (() => {
          const {
            pubticket: { DealStatus },
          } = this.props;
          return modelMapToOption(DealStatus);
        })(),
        type: ItemTypes.Select,
      },
      {
        label: '核验状态',
        name: 'checkState',
        options: (() => {
          const {
            pubticket: { CheckStatus },
          } = this.props;
          return modelMapToOption(CheckStatus);
        })(),
        initialValue: (() => {
          const { checkState } = getPageQuery();
          if (checkState) {
            return +checkState;
          }
        })(),
        type: ItemTypes.Select,
      },
      {
        label: '主订单号',
        name: 'dealId',
      },
      {
        label: '票务订单号',
        name: 'id',
        defHidden: true,
      },
      {
        label: '票务名称',
        name: 'ticketName',
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
      {
        label: '座位号',
        name: 'seatDataName',
        placeholder: '请填写座位号数字',
        defHidden: true,
      },
      {
        label: '会员手机号',
        name: 'publicMobile',
        defHidden: true,
      },
      {
        label: '会员姓名',
        name: 'publicRealName',
        defHidden: true,
      },
      {
        label: '入场人员手机号',
        name: 'pubStudyMobile',
        defHidden: true,
      },
      {
        label: '入场人员姓名',
        name: 'pubStudyRealName',
        defHidden: true,
      },
      [
        {
          label: '演出日期(始)',
          name: 'startOrderDate',
          placeholder: '开始',
          initialValue: (() => {
            const { analysisStartDate } = getPageQuery();
            if (analysisStartDate) {
              return moment(+analysisStartDate);
            }
          })(),
          type: ItemTypes.DatePickerRangeStart,
          defHidden: true,
        },
        {
          label: '演出日期(止)',
          name: 'endOrderDate',
          placeholder: '结束',
          initialValue: (() => {
            const { analysisEndDate } = getPageQuery();
            if (analysisEndDate) {
              return moment(+analysisEndDate);
            }
          })(),
          type: ItemTypes.DatePickerRangeEnd,
          defHidden: true,
        },
      ],
      [
        {
          label: '有效期(始)',
          name: 'fromDate',
          placeholder: '开始',
          type: ItemTypes.DatePickerRangeStart,
          defHidden: true,
        },
        {
          label: '有效期(止)',
          name: 'toDate',
          placeholder: '结束',
          type: ItemTypes.DatePickerRangeEnd,
          defHidden: true,
        },
      ],
      [
        {
          label: '更新时间(始)',
          name: 'startDate',
          placeholder: '开始',
          type: ItemTypes.DatePickerRangeStart,
          defHidden: true,
        },
        {
          label: '更新时间(止)',
          name: 'endDate',
          placeholder: '结束',
          type: ItemTypes.DatePickerRangeEnd,
          defHidden: true,
        },
      ],
      {
        label: '业务来源编号',
        name: 'srvId',
        defHidden: true,
      },
      {
        label: '服务名称',
        name: 'pubServiceName',
        defHidden: true,
      },
    ],
  };

  state = {
    selectedRows: undefined,

    dcModalVisible: false,

    replaceSeatDealId: null,

    // 订单查询的临时存储
    tempDealInfo: null,
  };

  operation = () => {
    const {
      dispatch,
      deal: { PayStatus, DealStatus, DealShippingStatus },
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
            const { dealState, dealPayState } = rows[0].deal;
            if (dealState === DealStatus.BOOKING.key) {
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
            const { dealState, dealPayState } = rows[0].deal;
            if (dealState === DealStatus.BOOKING.key) {
              return false;
            }
            return dealPayState === PayStatus.UNPAID.key;
          },
          action: () => {
            const { selectedRows } = this.state;
            const { deal, dealTicket } = selectedRows[0];
            window.open(`/basic/ticket/sell/${dealTicket.dataId}/summary?id=${deal.id}`);
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
            const { dealState, dealAddress, dealShippingState } = rows[0].deal;
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
          text: '改价',
          auth: 'edit-amount-btn',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const { dealState, dealPayState } = rows[0].deal;
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
            const { deal, dealTicket } = selectedRows[0];
            print({
              deal,
              dealTicketList: [dealTicket],
            });
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
        {
          text: '换座',
          type: 'danger',
          auth: 'change-seat',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const {
              deal,
              dealTicket,
              // 订单没存
              // pushSeat
            } = rows[0];
            // return pushSeat && dealTicket?.seatDataId && deal?.dealState === DealStatus.BUY_TICKET.key;
            return dealTicket?.seatDataId && deal?.dealState === DealStatus.BUY_TICKET.key;
          },
          action: () => {
            const { selectedRows } = this.state;
            this.setState({
              replaceSeatDealId: selectedRows[0]?.deal?.id,
            });
          },
        },
      ],
    };
  };

  handleToCheckLogs = (record, query) => {
    const finalQuery = {
      ...query,
    };

    const { dispatch } = this.props;
    dispatch(
      push({
        pathname: '/basic/device/logs',
        search: stringify(finalQuery),
      })
    );
  };

  goToSummary = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    const { deal, dealTicket } = selectedRows[0];
    dispatch(
      push({
        pathname: `/basic/ticket/sell/${dealTicket.dataId}/summary`,
        search: `id=${deal.id}`,
      })
    );
  };

  handleDealCancelVisibleChange = visible => {
    this.setState({
      dcModalVisible: visible,
    });
  };

  handleDoDealCancel = () => {
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

  handleReplaceSeatDrawerVisibleChange = visible => {
    if (!visible) {
      this.setState({
        replaceSeatDealId: null,
      });
    }
  };

  handlePrintLoadData = data => {
    this.setState({
      tempDealInfo: data,
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
    const { selectedRows = [], dcModalVisible, replaceSeatDealId, tempDealInfo } = this.state;
    const printId = selectedRows?.[0]?.deal?.dealPayState === PayStatus.HASPAID.key ? selectedRows[0].deal.id : null;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Datatable
            select="multi"
            onSelectedChange={this.handleSelectedChange}
            url="/dealTicket/dataList.do"
            columns={this.columns}
            // https://ant.design/components/table-cn/#%E6%B3%A8%E6%84%8F
            rowKey={record => record.dealTicket.id}
            formSearch={this.formSearch}
            operation={this.operation()}
            onInit={this.handleTableInit}
            onBeforeLoadData={this.handleBeforeLoadData}
            // onLoadData={this.handleLoadData}
          />
        </Card>
        <DealCancelModal
          dealId={((selectedRows[0] || {}).deal || {}).id}
          visible={dcModalVisible}
          onVisibleChange={this.handleDealCancelVisibleChange}
          onOk={this.handleDoDealCancel}
        />
        {/* //FIXME 选行即加载的方式性能非常不好，但疑似受限于 https://github.com/facebook/react/issues/16734 ，只能先这样 */}
        <AuthComponent auth="print">
          <OrderPrint id={printId} onlyPrint onLoadData={this.handlePrintLoadData} />
        </AuthComponent>
        {/* 与换座按钮权限一致 */}
        <AuthComponent auth="change-seat">
          <ReplaceSeatDrawer
            dealId={replaceSeatDealId}
            // 利用OrderPrint的加载，避免重复调用
            dealInfo={tempDealInfo?.deal?.id === replaceSeatDealId ? tempDealInfo : null}
            onVisibleChange={this.handleReplaceSeatDrawerVisibleChange}
            onOk={() => {
              this.table.reload();
            }}
          />
        </AuthComponent>
      </PageHeaderLayout>
    );
  }
}

export default Ticket;
