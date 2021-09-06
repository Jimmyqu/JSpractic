import { Component } from 'react';
import { Card } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import {
  formatMoney,
  formatColorWrapper,
  formatDateTime,
  formatSrvId,
  formatSubSeq,
  formatPayWayFromList,
  formatModel,
  formatMoneyLen0,
} from '@/utils/format';
import DataContent from '@/components/PubServiceCard/DataContent';
import { getPageQuery, modelMapToOption } from '@/utils/utils';

@connect(({ venue, deal, pubservice, analysis }) => ({
  venue,
  deal,
  pubservice,
  analysis,
}))
class AnalysisBusinessDetailPubService extends Component {
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
      dataIndex: 'analysisPublicService.dealState',
      render: value => {
        const {
          pubservice: { DealStatus },
        } = this.props;
        return formatModel(DealStatus, value);
      },
      width: 100,
    },
    {
      title: '订单类型',
      dataIndex: 'analysisDeal.subDealType',
      render: formatSubSeq,
      width: 120,
    },
    {
      title: '营销中心',
      dataIndex: 'analysisDeal.salesName',
      width: 210,
    },
    {
      title: '服务编号',
      dataIndex: 'analysisPublicService.serviceId',
      width: 100,
    },
    {
      title: '服务分类',
      dataIndex: 'analysisPublicService.serviceCategoryName',
      width: 110,
    },
    {
      title: '会员服务名称',
      dataIndex: 'analysisPublicService.serviceName',
      width: 250,
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
      title: '服务销售储值金额',
      dataIndex: 'analysisPublicService.serviceAmount',
      render: this.moneyRender,
      noRowSpan: true,
      collect: true,
      width: 130,
    },
    {
      title: '销售单价',
      dataIndex: 'analysisPublicService.servicePrice',
      render: this.moneyRender,
      noRowSpan: true,
      collect: true,
      width: 100,
    },
    {
      title: '成交单价',
      dataIndex: 'analysisPublicService.transactionPrice',
      render: this.moneyRender,
      noRowSpan: true,
      collect: true,
      width: 100,
    },
    // {
    //   title: '现金流水金额',
    //   dataIndex: 'analysisPublicService.cashFlowAmount',
    //   render: this.moneyRender,
    //   noRowSpan: true,
    //   collect: true,
    //   width: 120,
    // },
    // {
    //   title: '消费收入金额',
    //   dataIndex: 'analysisPublicService.consumeFlowAmount',
    //   render: this.moneyRender,
    //   noRowSpan: true,
    //   collect: true,
    //   width: 120,
    // },
    {
      title: '成交总价',
      dataIndex: 'analysisPublicService.transactionTotalPrice',
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
    // {
    //   title: '会员服务',
    //   children: [
    //     {
    //       title: '会员服务名称',
    //       dataIndex: 'analysisPublicService.serviceName',
    //     },
    //     {
    //       title: '服务账户',
    //       dataIndex: 'analysisDeal.payServiceAccount',
    //     },
    //     {
    //       title: '服务内容',
    //       dataIndex: 'analysisPublicService.analysisPublicServiceDataList',
    //       render: (value, { analysisPublicService }) => {
    //         const { serviceUseMode } = analysisPublicService || {};
    //         return <DataContent pubServiceDataList={value} serviceUseMode={serviceUseMode} />;
    //       },
    //     },
    //     {
    //       title: '服务计费金额',
    //       dataIndex: 'analysisDeal.payServiceCalcPrice',
    //       render: this.moneyRender,
    //       width: 90,
    //     },
    //     {
    //       title: '服务抵扣金额',
    //       dataIndex: 'analysisDeal.payServiceAccountDiscount',
    //       render: this.moneyRender,
    //     },
    //   ],
    // },
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
      width: 60,
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
      width: 90,
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
      width: 120,
    },
    {
      title: '商家留言',
      dataIndex: 'analysisDeal.sellerMessage',
      width: 120,
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

  formSearch = () => {
    const {
      type,
      salesIds,
      serviceId,
      pubAccountId,
      orderStartDate,
      orderEndDate,
      analysisStartDate,
      analysisEndDate,
      payMode,
      publicAccountMobile,
    } = getPageQuery();
    const {
      pubservice: { DealStatus, categoryList },
      venue: { currentVenue },
      deal: { PayStatus, PayModeTypesWithOutGroup },
      analysis: { ActionTypes },
    } = this.props;
    return {
      fields: [
        {
          label: '营销中心',
          placeholder: '默认全部营销中心',
          name: 'salesIds',
          mode: 'multiple',
          initialValue: (() => {
            if (
              type ||
              salesIds ||
              serviceId ||
              pubAccountId ||
              orderStartDate ||
              orderEndDate ||
              analysisStartDate ||
              analysisEndDate ||
              payMode
            ) {
              return (salesIds || '')
                .split(',')
                .filter(id => id)
                .map(id => +id);
            }
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
            label: '操作时间(始)',
            name: 'analysisStartDate',
            placeholder: '操作开始日期',
            initialValue: (() => {
              if (
                type ||
                salesIds ||
                serviceId ||
                pubAccountId ||
                orderStartDate ||
                orderEndDate ||
                analysisStartDate ||
                analysisEndDate ||
                payMode
              ) {
                if (analysisStartDate) {
                  return moment(+analysisStartDate);
                }
                return;
              }
              return moment();
            })(),
            type: ItemTypes.DatePickerRangeStart,
          },
          {
            label: '操作时间(止)',
            name: 'analysisEndDate',
            initialValue: (() => {
              if (
                type ||
                salesIds ||
                serviceId ||
                pubAccountId ||
                orderStartDate ||
                orderEndDate ||
                analysisStartDate ||
                analysisEndDate ||
                payMode
              ) {
                if (analysisEndDate) {
                  return moment(+analysisEndDate);
                }
                return;
              }
              return moment();
            })(),
            placeholder: '操作结束日期',
            type: ItemTypes.DatePickerRangeEnd,
          },
        ],
        {
          label: '支付状态',
          name: 'dealPayState',
          options: modelMapToOption(PayStatus),
          initialValue: (() => {
            if (type) {
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
          options: modelMapToOption(PayModeTypesWithOutGroup),
          initialValue: (() => {
            if (payMode) {
              return payMode
                .split(',')
                .filter(id => id)
                .map(id => +id);
            }
          })(),
          type: ItemTypes.Select,
        },
        {
          label: '订单状态',
          name: 'dealState',
          options: modelMapToOption(DealStatus),
          type: ItemTypes.Select,
        },
        {
          label: '服务分类',
          name: 'serviceCategoryId',
          options: modelMapToOption(categoryList),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '服务编号',
          name: 'serviceId',
          initialValue: serviceId,
          defHidden: true,
        },
        {
          label: '会员编号',
          name: 'pubAccountId',
          initialValue: pubAccountId,
          defHidden: true,
        },
        {
          label: '会员手机号',
          name: 'pubMobile',
          initialValue: publicAccountMobile,
          defHidden: true,
        },
        {
          label: '会员姓名',
          name: 'pubRealName',
          defHidden: true,
        },
        {
          label: '主订单号',
          name: 'dealId',
          defHidden: true,
        },
      ],
    };
  };

  operation = {
    buttons: [
      {
        auth: 'export-pubservice',
        btnType: ButtonTypes.Export,
      },
    ],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'pubservice/fetchServiceCategory',
    });
  }

  render() {
    return (
      <Card bordered={false}>
        <Datatable
          url="/analysis/publicService/detail.do"
          columns={this.columns}
          rowKey={record => record.analysisPublicService.id}
          formSearch={this.formSearch()}
          operation={this.operation}
          rowSpanByValue={record => `${record.analysisDeal.dealId}-${record.analysisDeal.operationAction}`}
        />
      </Card>
    );
  }
}

export default AnalysisBusinessDetailPubService;
