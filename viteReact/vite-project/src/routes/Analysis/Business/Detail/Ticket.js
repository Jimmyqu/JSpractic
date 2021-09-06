import { Component } from 'react';
import { Card } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import DataContent from '@/components/PubServiceCard/DataContent';
import {
  formatMoney,
  formatColorWrapper,
  formatDateTime,
  formatSrvId,
  formatSubSeq,
  formatDate,
  formatHM,
  formatPayWayFromList,
  formatModel,
  formatMoneyLen0,
  formatSeatData,
} from '@/utils/format';
import { getPageQuery, modelMapToOption } from '@/utils/utils';

@connect(({ venue, deal, pubticket, analysis }) => ({
  venue,
  deal,
  pubticket,
  analysis,
}))
class AnalysisBusinessDetailTicket extends Component {
  // eslint-disable-next-line react/sort-comp
  moneyRender = value => formatColorWrapper(formatMoney)(value);

  columns = [
    {
      title: '主订单号',
      dataIndex: 'analysisDeal.dealId',
      width: 100,
    },
    {
      title: '操作类型',
      dataIndex: 'analysisDeal.operationAction',
      render: value => {
        const {
          analysis: { ActionTypes },
        } = this.props;
        return formatModel(ActionTypes, value);
      },
      width: 100,
    },
    {
      title: '会员编号',
      dataIndex: 'analysisDeal.publicAccountId',
      width: 100,
    },
    {
      title: '会员姓名',
      dataIndex: 'analysisDeal.publicAccountRealName',
      width: 100,
    },
    {
      title: '会员手机号',
      dataIndex: 'analysisDeal.publicAccountMobile',
      width: 130,
    },
    {
      title: '支付状态',
      dataIndex: 'analysisDeal.dealPayState',
      render: value => {
        const {
          deal: { PayStatus },
        } = this.props;
        return formatModel(PayStatus, value);
      },
      width: 100,
    },
    {
      title: '订单状态',
      dataIndex: 'analysisExerciseTicket.dealState',
      render: value => {
        const {
          pubticket: { DealStatus },
        } = this.props;
        return formatModel(DealStatus, value);
      },
      width: 100,
    },
    {
      title: '订单类型',
      dataIndex: 'analysisDeal.subDealType',
      render: formatSubSeq,
      width: 90,
    },
    {
      title: '营销中心',
      dataIndex: 'analysisDeal.salesName',
      width: 210,
    },
    {
      title: '票务名称',
      dataIndex: 'analysisExerciseTicket.ticketName',
      width: 150,
    },
    {
      title: '票务时间',
      render: (_, { analysisExerciseTicket: { calendarType, orderDate, startTime, fromDate } }) => {
        const {
          pubticket: { CalendarTypes },
        } = this.props;
        if (calendarType === CalendarTypes.FIXEDSCHEDULE.key) {
          return `${formatDate(orderDate)} ${formatHM(startTime)}`;
        }
        if (calendarType === CalendarTypes.VALIDITYSCHEDULE.key) {
          return formatDate(fromDate || null);
        }
        return null;
      },
      width: 150,
    },
    // {
    //   title: '结束时间',
    //   render: (_, { analysisExerciseTicket: { calendarType, orderDate, endTime, toDate } }) => {
    //     const {
    //       pubticket: { CalendarTypes },
    //     } = this.props;
    //     if (calendarType === CalendarTypes.FIXEDSCHEDULE.key && endTime) {
    //       return `${formatDate(orderDate)} ${formatHM(endTime)}`;
    //     }
    //     if (calendarType === CalendarTypes.VALIDITYSCHEDULE.key) {
    //       return formatDate(toDate || null);
    //     }
    //     return null;
    //   },
    //   width: 100,
    // },
    {
      title: '排期编号',
      dataIndex: 'analysisExerciseTicket.scheduleDetailId',
      width: 100,
    },
    {
      title: '区域座位号',
      dataIndex: 'analysisExerciseTicket.seatDataName',
      render: formatSeatData,
      width: 170,
    },
    {
      title: '数量',
      dataIndex: 'analysisExerciseTicket.salesNum',
      render: formatColorWrapper(),
      noRowSpan: true,
      collect: true,
      width: 80,
    },
    {
      title: '票单价',
      dataIndex: 'analysisExerciseTicket.ticketPrice',
      render: this.moneyRender,
      noRowSpan: true,
      collect: true,
      width: 70,
    },
    {
      title: '票总价',
      dataIndex: 'analysisExerciseTicket.ticketTotalPrice',
      render: this.moneyRender,
      noRowSpan: true,
      collect: true,
      width: 70,
    },
    {
      title: '票成交单价',
      dataIndex: 'analysisExerciseTicket.transactionPrice',
      render: this.moneyRender,
      noRowSpan: true,
      collect: true,
      width: 100,
    },
    // {
    //   title: '现金流水金额',
    //   dataIndex: 'analysisExerciseTicket.cashFlowAmount',
    //   render: this.moneyRender,
    //   noRowSpan: true,
    //   collect: true,
    //   width: 120,
    // },
    // {
    //   title: '消费收入金额',
    //   dataIndex: 'analysisExerciseTicket.consumeFlowAmount',
    //   render: this.moneyRender,
    //   noRowSpan: true,
    //   collect: true,
    //   width: 120,
    // },
    {
      title: '成交总价',
      dataIndex: 'analysisExerciseTicket.transactionTotalPrice',
      render: this.moneyRender,
      noRowSpan: true,
      collect: true,
      width: 100,
    },
    {
      title: '支付方式',
      dataIndex: 'analysisDeal.payNewMode',
      render: formatPayWayFromList,
      width: 120,
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.WECHAT.value;
      })(),
      dataIndex: 'analysisDeal.payWechat',
      render: this.moneyRender,
      collect: true,
      width: 70,
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.ZFB.value;
      })(),
      dataIndex: 'analysisDeal.payZfb',
      render: this.moneyRender,
      collect: true,
      width: 70,
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.CASH.value;
      })(),
      dataIndex: 'analysisDeal.payCash',
      render: this.moneyRender,
      collect: true,
      width: 70,
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.BANKCARD.value;
      })(),
      dataIndex: 'analysisDeal.payBankCard',
      render: this.moneyRender,
      collect: true,
      width: 90,
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.BANKTRANSFER.value;
      })(),
      dataIndex: 'analysisDeal.payBankTransfer',
      render: this.moneyRender,
      collect: true,
      width: 90,
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.ACCOUNT.value;
      })(),
      dataIndex: 'analysisDeal.payAccount',
      render: this.moneyRender,
      collect: true,
      width: 100,
    },
    {
      title: '会员服务',
      children: [
        {
          title: '会员服务编号',
          dataIndex: 'analysisExerciseTicket.pubServiceId',
          width: 130,
        },
        {
          title: '会员服务名称',
          dataIndex: 'analysisPublicService.serviceName',
          width: 150,
        },
        {
          title: '服务账户',
          dataIndex: 'analysisDeal.payServiceAccount',
          render: this.moneyRender,
          collect: true,
          width: 100,
        },
        {
          title: '服务内容',
          dataIndex: 'analysisPublicService.analysisPublicServiceDataList',
          render: (value, { analysisPublicService }) => {
            const { serviceUseMode } = analysisPublicService || {};
            return <DataContent pubServiceDataList={value} serviceUseMode={serviceUseMode} />;
          },
          width: 250,
        },
        {
          title: '服务计费金额',
          dataIndex: 'analysisDeal.payServiceCalcPrice',
          render: this.moneyRender,
          collect: true,
          width: 110,
        },
        {
          title: '服务抵扣金额',
          dataIndex: 'analysisDeal.payServiceAccountDiscount',
          render: this.moneyRender,
          collect: true,
          width: 110,
        },
      ],
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.WECHAT_TO_ACCOUNT.value;
      })(),
      dataIndex: 'analysisDeal.payWechatToAccount',
      render: this.moneyRender,
      collect: true,
      width: 140,
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.ZFB_TO_ACCOUNT.value;
      })(),
      dataIndex: 'analysisDeal.payZfbToAccount',
      render: this.moneyRender,
      collect: true,
      width: 140,
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.CREDIT.value;
      })(),
      dataIndex: 'analysisDeal.payCredit',
      render: this.moneyRender,
      collect: true,
      width: 80,
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.POINTS.value;
      })(),
      dataIndex: 'analysisDeal.payFee',
      render: formatColorWrapper(formatMoneyLen0),
      collect: true,
      width: 80,
    },
    {
      title: '微信商户单号',
      dataIndex: 'analysisDeal.payWechatId',
      width: 230,
    },
    {
      title: '支付宝商家订单号',
      dataIndex: 'analysisDeal.payZfbId',
      width: 220,
    },
    {
      title: '订单备注',
      dataIndex: 'analysisDeal.userMessage',
      width: 100,
    },
    {
      title: '商家留言',
      dataIndex: 'analysisDeal.sellerMessage',
      width: 100,
    },
    // {
    //   title: '备注',
    //   dataIndex: 'analysisDeal.descr',
    //   width: 100,
    // },
    {
      title: '取消原因',
      dataIndex: 'analysisDeal.cancelMessage',
      width: 120,
    },
    {
      title: '创建人',
      dataIndex: 'analysisDeal.createRealName',
      width: 120,
    },
    {
      title: '操作时间',
      dataIndex: 'analysisDeal.gmtCreate',
      render: formatDateTime,
      width: 170,
    },
    // {
    //   title: '支付时间',
    //   dataIndex: 'analysisDeal.a',
    //   render: formatDateTime,
    // },
    // {
    //   title: '核销时间',
    //   dataIndex: 'analysisDeal.checkDate',
    //   render: formatDateTime,
    //   width: 150,
    // },

    {
      title: '业务来源',
      dataIndex: 'analysisDeal.srvName',
      width: 130,
    },
    {
      title: '操作终端',
      dataIndex: 'analysisDeal.srvId',
      render: formatSrvId,
      width: 100,
    },
  ];

  formSearch = {
    fields: [
      {
        label: '营销中心',
        placeholder: '默认全部营销中心',
        name: 'salesIds',
        mode: 'multiple',
        initialValue: (() => {
          const {
            type,
            salesIds,
            ticketId,
            platformId,
            orderStartDate,
            orderEndDate,
            analysisStartDate,
            analysisEndDate,
          } = getPageQuery();
          if (
            type ||
            salesIds ||
            ticketId ||
            platformId ||
            orderStartDate ||
            orderEndDate ||
            analysisStartDate ||
            analysisEndDate
          ) {
            return (salesIds || '')
              .split(',')
              .filter(id => id)
              .map(id => +id);
          }
          const {
            venue: { currentVenue },
          } = this.props;
          return [currentVenue.id];
        })(),
        type: ItemTypes.CascaderVenue,
      },
      [
        {
          name: 'presetDate',
          // initialValue: 2,
          type: ItemTypes.DatePickerRangePreset,
        },
        {
          label: '票务时间（始）',
          name: 'orderStartDate',
          placeholder: '票务开始时间',
          initialValue: (() => {
            const {
              type,
              salesIds,
              ticketId,
              platformId,
              orderStartDate,
              orderEndDate,
              analysisStartDate,
              analysisEndDate,
            } = getPageQuery();
            if (
              type ||
              salesIds ||
              ticketId ||
              platformId ||
              orderStartDate ||
              orderEndDate ||
              analysisStartDate ||
              analysisEndDate
            ) {
              if (orderStartDate) {
                return moment(+orderStartDate);
              }
              return;
            }
            return moment();
          })(),
          type: ItemTypes.DatePickerRangeStart,
        },
        {
          label: '票务时间（止）',
          name: 'orderEndDate',
          initialValue: (() => {
            const {
              type,
              salesIds,
              ticketId,
              platformId,
              orderStartDate,
              orderEndDate,
              analysisStartDate,
              analysisEndDate,
            } = getPageQuery();
            if (
              type ||
              salesIds ||
              ticketId ||
              platformId ||
              orderStartDate ||
              orderEndDate ||
              analysisStartDate ||
              analysisEndDate
            ) {
              if (orderEndDate) {
                return moment(+orderEndDate);
              }
              return;
            }
            return moment();
          })(),
          placeholder: '票务结束时间',
          type: ItemTypes.DatePickerRangeEnd,
        },
      ],
      {
        label: '支付状态',
        name: 'dealPayState',
        options: (() => {
          const {
            deal: { PayStatus },
          } = this.props;
          return modelMapToOption(PayStatus);
        })(),
        initialValue: (() => {
          const { type } = getPageQuery();
          if (type) {
            const {
              deal: { PayStatus },
              analysis: { ActionTypes },
            } = this.props;
            switch (+type) {
              case ActionTypes.DEAL_CHECKOUT.key:
                return PayStatus.HASPAID.key;
              case ActionTypes.DEAL_CANCEL.key:
                return PayStatus.REFUNDED.key;
              case ActionTypes.DEAL_ADD.key:
                return PayStatus.UNPAID.key;
              default:
            }
          }
        })(),
        type: ItemTypes.Select,
      },
      {
        label: '支付方式',
        name: 'payNewModes',
        mode: 'multiple',
        options: (() => {
          const {
            deal: { PayModeTypesWithOutGroup },
          } = this.props;
          return modelMapToOption(PayModeTypesWithOutGroup);
        })(),
        type: ItemTypes.Select,
      },
      {
        label: '订单状态',
        name: 'dealState',
        options: (() => {
          const {
            pubticket: { DealStatus },
          } = this.props;
          return modelMapToOption(DealStatus);
        })(),
        type: ItemTypes.Select,
      },
      {
        label: '主订单号',
        name: 'dealId',
        defHidden: true,
      },
      [
        {
          name: 'presetDate2',
          // initialValue: 2,
          type: ItemTypes.DatePickerRangePreset,
          defHidden: true,
        },
        {
          label: '操作时间（始）',
          name: 'analysisStartDate',
          placeholder: '操作开始时间',
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
          label: '操作时间（止）',
          name: 'analysisEndDate',
          placeholder: '操作结束时间',
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
      {
        label: '票务编号',
        name: 'ticketId',
        initialValue: (() => {
          const { ticketId } = getPageQuery();
          if (ticketId) {
            return ticketId;
          }
        })(),
        defHidden: true,
      },
      {
        label: '场地编号',
        name: 'platformId',
        initialValue: (() => {
          const { platformId } = getPageQuery();
          if (platformId) {
            return platformId;
          }
        })(),
        defHidden: true,
      },
      {
        label: '票务名称',
        name: 'ticketName',
        defHidden: true,
      },
      {
        label: '区域座位号',
        name: 'seatDataName',
        defHidden: true,
      },
      {
        label: '会员手机号',
        name: 'pubMobile',
        defHidden: true,
      },
      {
        label: '会员姓名',
        name: 'pubRealName',
        defHidden: true,
      },
      {
        label: '会员服务编号',
        name: 'pubServiceId',
        defHidden: true,
      },
      {
        label: '会员服务名称',
        name: 'pubServiceName',
        defHidden: true,
      },
    ],
  };

  operation = {
    buttons: [
      {
        auth: 'export-ticket',
        btnType: ButtonTypes.Export,
      },
    ],
  };

  render() {
    return (
      <Card bordered={false}>
        <Datatable
          url="/analysis/exerciseTicket/detail.do"
          columns={this.columns}
          rowKey={record => record.analysisExerciseTicket.id}
          formSearch={this.formSearch}
          operation={this.operation}
          rowSpanByValue={record => `${record.analysisDeal.dealId}-${record.analysisDeal.operationAction}`}
        />
      </Card>
    );
  }
}

export default AnalysisBusinessDetailTicket;
