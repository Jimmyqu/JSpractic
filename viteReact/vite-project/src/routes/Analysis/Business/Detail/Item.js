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
  formatPayWayFromList,
  formatModel,
  formatMoneyLen0,
} from '@/utils/format';
import { getPageQuery, modelMapToOption } from '@/utils/utils';

@connect(({ venue, deal, pubitem, analysis }) => ({
  venue,
  deal,
  pubitem,
  analysis,
}))
class AnalysisBusinessDetailItem extends Component {
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
      title: '订单状态',
      dataIndex: 'analysisItem.dealState',
      render: value => {
        const {
          pubitem: { DealStatus },
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
      dataIndex: 'analysisItem.salesName',
      width: 200,
    },
    {
      title: '商品名称',
      dataIndex: 'analysisItem.itemName',
      width: 150,
    },
    {
      title: '库存编号',
      dataIndex: 'analysisItem.itemStockId',
      width: 100,
    },
    {
      title: '商品数量',
      dataIndex: 'analysisItem.itemNum',
      noRowSpan: true,
      collect: true,
      width: 80,
    },
    {
      title: '商品单位',
      dataIndex: 'analysisItem.itemUnit',
      width: 80,
    },
    {
      title: '销售单价',
      dataIndex: 'analysisItem.itemPrice',
      render: this.moneyRender,
      noRowSpan: true,
      collect: true,
      width: 80,
    },
    {
      title: '销售总价',
      dataIndex: 'analysisItem.itemTotalPrice',
      render: this.moneyRender,
      noRowSpan: true,
      collect: true,
      width: 80,
    },
    {
      title: '成交单价',
      dataIndex: 'analysisItem.transactionPrice',
      render: this.moneyRender,
      noRowSpan: true,
      collect: true,
      width: 80,
    },
    {
      title: '成交总价',
      dataIndex: 'analysisItem.transactionTotalPrice',
      render: this.moneyRender,
      noRowSpan: true,
      collect: true,
      width: 80,
    },
    // {
    //   title: '现金流水金额',
    //   dataIndex: 'analysisItem.cashFlowAmount',
    //   noRowSpan: true,
    //   collect: true,
    //   render: this.moneyRender,
    //   width: 120,
    // },
    // {
    //   title: '消费收入金额',
    //   dataIndex: 'analysisItem.consumeFlowAmount',
    //   noRowSpan: true,
    //   collect: true,
    //   render: this.moneyRender,
    //   width: 120,
    // },
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
      title: '主订单支付总价',
      dataIndex: 'analysisDeal.payPaidAmount',
      render: this.moneyRender,
      collect: true,
      width: 140,
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
      width: 80,
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
      width: 80,
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
      width: 80,
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
          title: '会员服务名称',
          dataIndex: 'analysisPublicService.serviceName',
          width: 170,
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
      width: 60,
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
            itemId,
            orderStartDate,
            orderEndDate,
            analysisStartDate,
            analysisEndDate,
            itemStockId,
          } = getPageQuery();
          if (
            type ||
            salesIds ||
            itemId ||
            orderStartDate ||
            orderEndDate ||
            analysisStartDate ||
            analysisEndDate ||
            itemStockId
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
          label: '操作时间（始）',
          name: 'analysisStartDate',
          placeholder: '操作开始时间',
          initialValue: (() => {
            const {
              type,
              salesIds,
              itemId,
              orderStartDate,
              orderEndDate,
              analysisStartDate,
              analysisEndDate,
              itemStockId,
            } = getPageQuery();
            if (
              type ||
              salesIds ||
              itemId ||
              orderStartDate ||
              orderEndDate ||
              analysisStartDate ||
              analysisEndDate ||
              itemStockId
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
          label: '操作时间（止）',
          name: 'analysisEndDate',
          initialValue: (() => {
            const {
              type,
              salesIds,
              itemId,
              orderStartDate,
              orderEndDate,
              analysisStartDate,
              analysisEndDate,
              itemStockId,
            } = getPageQuery();
            if (
              type ||
              salesIds ||
              itemId ||
              orderStartDate ||
              orderEndDate ||
              analysisStartDate ||
              analysisEndDate ||
              itemStockId
            ) {
              if (analysisEndDate) {
                return moment(+analysisEndDate);
              }
              return;
            }
            return moment();
          })(),
          placeholder: '操作结束时间',
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
            pubitem: { DealStatus },
          } = this.props;
          return modelMapToOption(DealStatus);
        })(),
        type: ItemTypes.Select,
      },
      {
        label: '商品名称',
        name: 'itemName',
        defHidden: true,
      },
      {
        label: '商品编号',
        name: 'itemId',
        initialValue: (() => {
          const { itemId } = getPageQuery();
          return itemId;
        })(),
        defHidden: true,
      },
      {
        label: '库存编号',
        name: 'itemStockId',
        initialValue: (() => {
          const { itemStockId } = getPageQuery();
          return itemStockId;
        })(),
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
        label: '主订单号',
        name: 'dealId',
        defHidden: true,
      },
    ],
  };

  operation = {
    buttons: [
      {
        auth: 'export-item',
        btnType: ButtonTypes.Export,
      },
    ],
  };

  render() {
    return (
      <Card bordered={false}>
        <Datatable
          url="/analysis/item/detail.do"
          columns={this.columns}
          rowKey={record => record.analysisItem.id}
          formSearch={this.formSearch}
          operation={this.operation}
          rowSpanByValue={record => `${record.analysisDeal.dealId}-${record.analysisDeal.operationAction}`}
        />
      </Card>
    );
  }
}

export default AnalysisBusinessDetailItem;
