import { Component } from 'react';
import { Card, Tabs } from 'antd';
import { Link } from 'react-router-dom';
import { stringify } from 'qs';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import moment from 'moment';
import Datatable, { ButtonTypes, ItemTypes, SearchForm, matchDynamicHeader, RenderTypes } from '@/components/Datatable';
import DataContent from '@/components/PubServiceCard/DataContent';
import {
  formatTimeDuration,
  formatMoney,
  formatColorWrapper,
  formatDate,
  formatModel,
  formatDateTime,
} from '@/utils/format';
import MarginBar from '@/components/MarginBar';
import { getPageQuery, isNumber, modelMapToOption } from '@/utils/utils';

const { TabPane } = Tabs;

const overrideSetting = {
  // override
  render: value => value,
};

@connect(({ venue, deal, pubuser, pubservice, analysis }) => ({
  venue,
  deal,
  pubuser,
  pubservice,
  analysis,
}))
class AnalysisBusinessSummaryPubService extends Component {
  state = {
    tabKey: ['financeFlow', 'balanceAll', 'dateAll', 'balance', 'consume'][getPageQuery().queryType || 0],
    formData: undefined,
    tableMapping: {}, // {tabKey: {table,formData, ...other}}
    tableLoading: false,
  };

  /**
   * 生成不同链接效果的 render
   */
  // eslint-disable-next-line react/sort-comp
  genLinkWrapperRender =
    (render = value => value, genQuery = () => {}, isIgnore = () => false, path, newWindow = false) =>
    (...args) => {
      const [, record] = args;
      const { serviceId, isTotalRow } = record;
      const v = render(...args);

      if ((serviceId !== null && !(serviceId > 0)) || isIgnore(...args) || isTotalRow) {
        return v;
      }
      return (
        <span className="link" onClick={() => this.handleToDetail(record, genQuery(...args), path, newWindow)}>
          {v}
        </span>
      );
    };

  moneyRender = value => formatColorWrapper(formatMoney)(value);

  numRender = value => formatColorWrapper()(value);

  dateRender = value => formatDate(value);

  dateTimeRender = value => formatDateTime(value);

  columns = [
    {
      title: '服务信息',
      children: [
        {
          title: '服务编号',
          dataIndex: 'serviceId',
          render: this.genLinkWrapperRender(
            value => (value > 0 ? value : null),
            (value, record) => {
              const { serviceId } = record;
              return {
                serviceId,
              };
            }
          ),
          width: 80,
        },
        {
          title: '服务名称',
          dataIndex: 'serviceName',
          width: 150,
        },
        {
          title: '服务分类',
          dataIndex: 'serviceCategoryName',
          width: 110,
        },
        {
          title: '有效期',
          dataIndex: 'serviceValid',
          render: (value, { serviceType, startDate, endDate }) => {
            const {
              pubservice: { ServiceTypes },
            } = this.props;
            switch (serviceType) {
              case ServiceTypes.DYNAMICINVISIBLE.key:
                return formatTimeDuration(value);
              case ServiceTypes.FIXATIONINVISIBLE.key:
                return `${formatDate(startDate)}至${formatDate(endDate)}`;
              default:
                return value;
            }
          },
          width: 120,
        },
        {
          title: '服务值使用方式',
          dataIndex: 'serviceUseMode',
          render: value => {
            const {
              pubservice: { PubServiceUseModeTypes },
            } = this.props;
            return formatModel(PubServiceUseModeTypes, value);
          },
          width: 140,
        },
        {
          title: '是否相加使用',
          dataIndex: 'serviceIsAdd',
          render: value => {
            const {
              pubservice: { PubServiceCalcTypes },
            } = this.props;
            return formatModel(PubServiceCalcTypes, value);
          },
          width: 130,
        },
        {
          title: '原价',
          dataIndex: 'servicePrice',
          render: this.moneyRender,
          collect: true,
          width: 80,
        },
        {
          title: '服务储值金额',
          dataIndex: 'serviceAmount',
          render: this.moneyRender,
          collect: true,
          width: 120,
        },
      ],
    },
    {
      title: '销售',
      children: [
        {
          title: '销售总储值金额',
          dataIndex: 'saleAmount',
          render: this.moneyRender,
          collect: true,
          width: 120,
        },
        {
          title: '销售张数',
          dataIndex: 'saleNum',
          render: this.genLinkWrapperRender(
            this.numRender,
            (value, record) => {
              const { serviceId } = record;
              return {
                serviceId,
              };
            },
            value => !isNumber(value) || value === 0
          ),
          collect: true,
          width: 80,
        },
        {
          title: '销售成交总金额',
          dataIndex: 'saleTransactionTotalAmount',
          render: this.moneyRender,
          collect: true,
          width: 120,
        },
        // {
        //   title: '现金流水金额',
        //   dataIndex: 'cashFlowAmount',
        //   render: this.moneyRender,
        //   collect: true,
        //   width: 120,
        // },
        // {
        //   title: '消费收入金额',
        //   dataIndex: 'consumeFlowAmount',
        //   render: this.moneyRender,
        //   collect: true,
        //   width: 120,
        // },
        {
          title: '销售服务内容',
          dataIndex: 'analysisPublicServicesDataSaleSummaryVOList',
          render: (value, { serviceUseMode }) => (
            <DataContent pubServiceDataList={value} serviceUseMode={serviceUseMode} />
          ),
          width: 250,
        },
      ],
    },
    {
      title: '消费',
      children: [
        {
          title: '消费总储值金额',
          dataIndex: 'consumptionAmount',
          render: this.moneyRender,
          collect: true,
          width: 120,
        },
        {
          title: '消费总订单数',
          dataIndex: 'consumptionDealNum',
          render: this.numRender,
          collect: true,
          width: 120,
        },
        {
          title: '抵扣金额',
          dataIndex: 'deductionAmount',
          render: this.moneyRender,
          collect: true,
          width: 80,
        },
        {
          title: '消费服务内容',
          dataIndex: 'analysisPublicServicesDataConsumptionSummaryVOList',
          render: (value, { serviceUseMode }) => (
            <DataContent pubServiceDataList={value} serviceUseMode={serviceUseMode} />
          ),
          width: 250,
        },
      ],
    },
  ];

  operation = {
    buttons: [
      {
        auth: 'export-pubservice-income',
        btnType: ButtonTypes.Export,
      },
    ],
  };

  columns2 = [
    {
      title: '编号',
      dataIndex: 'id',
      width: 105,
    },
    {
      title: '会员服务账户编号',
      dataIndex: 'pubServiceAccountId',
      render: value =>
        value ? <Link to={`/basic/pub/pubservicesold?pubServiceAccountId=${value}`}>{value}</Link> : null,
      width: 140,
    },
    {
      title: '会员编号',
      dataIndex: 'pubAccountId',
      render: value => (value ? <Link to={`/basic/pub/info/${value}`}>{value}</Link> : null),
      width: 90,
    },
    {
      title: '会员姓名',
      dataIndex: 'realName',
      width: 90,
    },
    {
      title: '会员手机号',
      dataIndex: 'mobile',
      width: 120,
    },
    {
      title: '会员类型',
      dataIndex: 'pubAccountType',
      render: value => {
        const {
          pubuser: { PubAccountTypes },
        } = this.props;
        return formatModel(PubAccountTypes, value);
      },
      width: 120,
    },
    {
      title: '服务分类',
      dataIndex: 'serviceCategoryName',
      width: 110,
    },
    {
      title: '服务编号',
      dataIndex: 'serviceId',
      render: this.genLinkWrapperRender(
        value => value,
        (value, record) => {
          const { pubAccountId } = record;
          return {
            serviceId: value,
            pubAccountId,
          };
        }
      ),
      width: 80,
    },
    {
      title: '项目类型',
      dataIndex: 'serviceItemList',
      width: 80,
    },
    {
      title: '服务名称',
      dataIndex: 'serviceName',
      width: 130,
    },
    {
      title: '服务标签',
      dataIndex: 'serviceTag',
      render: value => {
        const {
          pubservice: { ServiceTagTypes },
        } = this.props;
        return formatModel(ServiceTagTypes, value);
      },
      width: 90,
    },
    {
      title: '购买营销中心',
      dataIndex: 'buySalesName',
      width: 120,
    },
    {
      title: '计费方式',
      dataIndex: 'analysisCalcMode',
      render: value => {
        const {
          analysis: { AnalysisCalcModeTypes },
        } = this.props;
        return formatModel(AnalysisCalcModeTypes, value);
      },
      width: 90,
    },
    {
      title: '实付金额',
      dataIndex: 'buyTotalPrice',
      render: this.moneyRender,
      collect: true,
      width: 90,
    },
    {
      title: '储值金额(余额)',
      dataIndex: 'buyTotalServiceAmount',
      render: this.moneyRender,
      collect: true,
      width: 115,
    },
    {
      title: '有效期',
      key: 'yxq',
      render: (_, { startDate, endDate }) => {
        if (startDate && endDate) {
          return (
            <span className={endDate <= Date.now() ? 'red' : ''}>
              {formatDate(startDate)}至{formatDate(endDate)}
            </span>
          );
        }
        return '-';
      },
      width: 120,
    },
    {
      title: '累计购买张数',
      dataIndex: 'buyTotalNum',
      render: this.genLinkWrapperRender(
        this.numRender,
        (value, record) => {
          const { serviceId } = record;
          const {
            analysis: { ActionTypes },
          } = this.props;
          return {
            serviceId,
            name: 'totalNum',
            type: ActionTypes.DEAL_CHECKOUT.key,
          };
        },
        value => !isNumber(value) || value === 0
      ),
      collect: true,
      width: 120,
    },
    // {
    //   title: '本期购买张数',
    //   dataIndex: 'buyNum',
    //   render: this.genLinkWrapperRender(
    //     this.numRender,
    //     (value, record) => {
    //       const { serviceId } = record;
    //       const {
    //         analysis: { ActionTypes },
    //         deal: { PayWayTypes },
    //       } = this.props;
    //       return {
    //         serviceId,
    //         type: ActionTypes.DEAL_CHECKOUT.key,
    //         payMode: [
    //           PayWayTypes.CASH.key,
    //           PayWayTypes.ZFB.key,
    //           PayWayTypes.ACCOUNT.key,
    //           PayWayTypes.WECHAT.key,
    //           PayWayTypes.BANKTRANSFER.key,
    //           PayWayTypes.BANKCARD.key,
    //         ].join(','),
    //       };
    //     },
    //     value => !isNumber(value) || value === 0
    //   ),
    //   collect: true,
    //   width: 120,
    // },
    {
      title: '服务单位',
      dataIndex: 'serviceUnit',
      render: value => {
        const {
          pubservice: { PubServiceUnitTypes },
        } = this.props;
        return formatModel(PubServiceUnitTypes, value);
      },
      width: 100,
    },
    {
      title: '上期数剩余（开始日期前一日）',
      children: [
        {
          title: '计费金额',
          dataIndex: 'serviceAfterSurplusCalcPrice',
          render: this.moneyRender,
          width: 110,
        },
        {
          title: '值',
          dataIndex: 'serviceAfterSurplusValue',
          render: this.moneyRender,
          width: 110,
        },
        {
          title: '储值金额',
          dataIndex: 'serviceAfterSurplusAmount',
          render: this.moneyRender,
          width: 110,
        },
      ],
      collect: true,
    },
    {
      title: '本期购买',
      children: [
        {
          title: '计费金额',
          dataIndex: 'serviceBuyCalcPrice',
          render: this.moneyRender,
          width: 110,
        },
        {
          title: '值',
          dataIndex: 'serviceBuyValue',
          render: this.genLinkWrapperRender(
            this.moneyRender,
            (value, record) => {
              const { serviceId, mobile } = record;
              const {
                analysis: { ActionTypes },
              } = this.props;
              const { tabKey } = this.state;
              return tabKey !== 'balance'
                ? {
                    serviceId,
                    type: ActionTypes.DEAL_CHECKOUT.key,
                  }
                : {
                    serviceId,
                    type: ActionTypes.DEAL_CHECKOUT.key,
                    publicAccountMobile: mobile,
                  };
            },
            value => !isNumber(value) || value === 0,
            '../detail/pubservice',
            true
          ),
          width: 80,
        },
        {
          title: '储值金额',
          dataIndex: 'serviceBuyAmount',
          render: this.moneyRender,
          width: 110,
        },
      ],
      collect: true,
    },
    {
      title: '本期消费',
      children: [
        {
          title: '计费金额',
          dataIndex: 'servicePayCalcPrice',
          render: this.moneyRender,
          width: 110,
        },
        {
          title: '值',
          dataIndex: 'servicePayValue',
          render: this.genLinkWrapperRender(
            this.moneyRender,
            (value, record) => {
              const { serviceId, serviceName, mobile } = record;
              const {
                analysis: { ActionTypes },
              } = this.props;
              return {
                serviceId,
                operationActions: ActionTypes.DEAL_CHECKOUT.key,
                serviceName,
                mobile,
                queryType: '3',
              };
            },
            value => !isNumber(value) || value === 0,
            // eslint-disable-next-line react/destructuring-assignment
            this.state.tabKey !== 'balance' ? '/analysis/business/summary/pubservice' : '/analysis/finance/detail',
            true
          ),
          width: 80,
        },
        {
          title: '储值金额',
          dataIndex: 'servicePayAmount',
          render: this.moneyRender,
          width: 110,
        },
      ],
      collect: true,
    },
    {
      title: '本期折现（部分退款已计费）',
      children: [
        {
          title: '计费金额',
          dataIndex: 'serviceWithdrawCalcPrice',
          render: this.moneyRender,
          width: 110,
        },
        {
          title: '值',
          dataIndex: 'serviceWithdrawValue',
          render: this.genLinkWrapperRender(
            this.moneyRender,
            (value, record) => {
              const { serviceId, serviceName, mobile } = record;
              const {
                analysis: { ActionTypes },
              } = this.props;
              return {
                serviceId,
                operationActions: ActionTypes.PUBSERVICEACCOUNT_WITHDRAW.key,
                serviceName,
                mobile,
              };
            },
            value => !isNumber(value) || value === 0,
            '/analysis/finance/detail',
            true
          ),
          width: 80,
        },
        {
          title: '储值金额',
          dataIndex: 'serviceWithdrawAmount',
          render: this.moneyRender,
          width: 110,
        },
      ],
      collect: true,
    },
    {
      title: '本期退款（全额退款）',
      children: [
        {
          title: '计费金额',
          dataIndex: 'serviceRefundCalcPrice',
          render: this.moneyRender,
          width: 110,
        },
        {
          title: '值',
          dataIndex: 'serviceRefundValue',
          render: this.genLinkWrapperRender(
            this.moneyRender,
            (value, record) => {
              const { serviceId, serviceName, mobile } = record;
              const {
                analysis: { ActionTypes },
              } = this.props;
              return {
                serviceId,
                operationActions: ActionTypes.DEAL_CANCEL.key,
                serviceName,
                mobile,
              };
            },
            value => !isNumber(value) || value === 0,
            '/analysis/finance/detail',
            true
          ),
          width: 80,
        },
        {
          title: '储值金额',
          dataIndex: 'serviceRefundAmount',
          render: this.moneyRender,
          width: 110,
        },
      ],
      collect: true,
    },
    {
      title: '本期转赠',
      children: [
        {
          title: '计费金额',
          dataIndex: 'serviceGiveCalcPrice',
          render: this.moneyRender,
          width: 110,
        },
        {
          title: '值',
          dataIndex: 'serviceGiveValue',
          render: this.moneyRender,
          width: 110,
        },
        {
          title: '储值金额',
          dataIndex: 'serviceGiveAmount',
          render: this.moneyRender,
          width: 110,
        },
      ],
      collect: true,
    },
    {
      title: '本期领取',
      children: [
        {
          title: '计费金额',
          dataIndex: 'serviceReceiveCalcPrice',
          render: this.moneyRender,
          width: 110,
        },
        {
          title: '值',
          dataIndex: 'serviceReceiveValue',
          render: this.moneyRender,
          width: 110,
        },
        {
          title: '储值金额',
          dataIndex: 'serviceReceiveAmount',
          render: this.moneyRender,
          width: 110,
        },
      ],
      collect: true,
    },
    {
      title: '期末剩余（结束日期）',
      children: [
        {
          title: '计费金额',
          dataIndex: 'serviceSurplusCalcPrice',
          render: this.moneyRender,
          width: 110,
        },
        {
          title: '值',
          dataIndex: 'serviceSurplusValue',
          render: this.moneyRender,
          width: 110,
        },
        {
          title: '储值金额',
          dataIndex: 'serviceSurplusAmount',
          render: this.moneyRender,
          width: 110,
        },
      ],
      collect: true,
    },
  ];

  operation2 = {
    export: {
      settings: {
        pubServiceAccountId: overrideSetting,
        pubAccountId: overrideSetting,
      },
    },
    buttons: [
      {
        auth: 'export-pubservice-balance',
        btnType: ButtonTypes.Export,
      },
      {
        btnType: ButtonTypes.SummaryTotal,
      },
    ],
  };

  columns3 = this.columns2.filter(
    column =>
      ![
        'id',
        'pubAccountId',
        'pubServiceAccountId',
        'pubAccountType',
        'realName',
        'mobile',
        'buyTotalPrice',
        'startDate',
        'endDate',
      ].includes(column.dataIndex)
  );

  dateColumns = [
    {
      title: '日期',
      dataIndex: 'startDate',
      render: formatDate,
      width: 120,
    },
    {
      title: '累计购买张数',
      dataIndex: 'buyTotalNum',
      render: this.numRender,
      collect: true,
      width: 120,
    },
    {
      title: '本期购买张数',
      dataIndex: 'buyNum',
      render: this.numRender,
      collect: true,
      width: 120,
    },
    {
      title: '上期数剩余（开始日期前一日）',
      children: [
        {
          title: '计费金额',
          dataIndex: 'serviceAfterSurplusCalcPrice',
          render: this.moneyRender,
          width: 110,
        },
        {
          title: '值',
          dataIndex: 'serviceAfterSurplusValue',
          render: this.moneyRender,
          width: 110,
        },
        {
          title: '储值金额',
          dataIndex: 'serviceAfterSurplusAmount',
          render: this.moneyRender,
          width: 110,
        },
      ],
      collect: true,
    },
    {
      title: '本期购买',
      children: [
        {
          title: '计费金额',
          dataIndex: 'serviceBuyCalcPrice',
          render: this.moneyRender,
          width: 110,
        },
        {
          title: '值',
          dataIndex: 'serviceBuyValue',
          render: this.genLinkWrapperRender(
            this.moneyRender,
            () => {
              return {};
            },
            value => !isNumber(value) || value === 0,
            '../summary/pubservice',
            true
          ),
          width: 80,
        },
        {
          title: '储值金额',
          dataIndex: 'serviceBuyAmount',
          render: this.moneyRender,
          width: 110,
        },
      ],
      collect: true,
    },
    {
      title: '本期消费',
      children: [
        {
          title: '计费金额',
          dataIndex: 'servicePayCalcPrice',
          render: this.moneyRender,
          width: 110,
        },
        {
          title: '值',
          dataIndex: 'servicePayValue',
          render: this.genLinkWrapperRender(
            this.moneyRender,
            () => {
              const {
                analysis: { ActionTypes },
                deal: { PayWayTypes },
              } = this.props;
              return {
                operationActions: ActionTypes.DEAL_CHECKOUT.key,
                payMode: PayWayTypes.PUBSERVICE.key,
              };
            },
            value => !isNumber(value) || value === 0,
            '/analysis/finance/detail',
            true
          ),
          width: 80,
        },
        {
          title: '储值金额',
          dataIndex: 'servicePayAmount',
          render: this.moneyRender,
          width: 110,
        },
      ],
      collect: true,
    },
    {
      title: '本期折现（部分退款已计费）',
      children: [
        {
          title: '计费金额',
          dataIndex: 'serviceWithdrawCalcPrice',
          render: this.moneyRender,
          width: 110,
        },
        {
          title: '值',
          dataIndex: 'serviceWithdrawValue',
          render: this.genLinkWrapperRender(
            this.moneyRender,
            () => {
              const {
                analysis: { ActionTypes },
              } = this.props;
              return {
                operationActions: ActionTypes.PUBSERVICEACCOUNT_WITHDRAW.key,
              };
            },
            value => !isNumber(value) || value === 0,
            '/analysis/finance/detail',
            true
          ),
          width: 80,
        },
        {
          title: '储值金额',
          dataIndex: 'serviceWithdrawAmount',
          render: this.moneyRender,
          width: 110,
        },
      ],
      collect: true,
    },
    {
      title: '本期退款（全额退款）',
      children: [
        {
          title: '计费金额',
          dataIndex: 'serviceRefundCalcPrice',
          render: this.moneyRender,
          width: 110,
        },
        {
          title: '值',
          dataIndex: 'serviceRefundValue',
          render: this.genLinkWrapperRender(
            this.moneyRender,
            () => {
              const {
                analysis: { ActionTypes },
                deal: { PayWayTypes },
              } = this.props;
              return {
                operationActions: ActionTypes.DEAL_CANCEL.key,
                payMode: PayWayTypes.PUBSERVICE.key,
              };
            },
            value => !isNumber(value) || value === 0,
            '/analysis/finance/detail',
            true
          ),
          width: 80,
        },
        {
          title: '储值金额',
          dataIndex: 'serviceRefundAmount',
          render: this.moneyRender,
          width: 110,
        },
      ],
      collect: true,
    },
    {
      title: '本期转赠',
      children: [
        {
          title: '计费金额',
          dataIndex: 'serviceGiveCalcPrice',
          render: this.moneyRender,

          width: 110,
        },
        {
          title: '值',
          dataIndex: 'serviceGiveValue',
          render: this.moneyRender,
          width: 110,
        },
        {
          title: '储值金额',
          dataIndex: 'serviceGiveAmount',
          render: this.moneyRender,
          width: 110,
        },
      ],
      collect: true,
    },
    {
      title: '本期领取',
      children: [
        {
          title: '计费金额',
          dataIndex: 'serviceReceiveCalcPrice',
          render: this.moneyRender,
          width: 110,
        },
        {
          title: '值',
          dataIndex: 'serviceReceiveValue',
          render: this.moneyRender,
          width: 110,
        },
        {
          title: '储值金额',
          dataIndex: 'serviceReceiveAmount',
          render: this.moneyRender,
          width: 110,
        },
      ],
      collect: true,
    },
    {
      title: '期末剩余（结束日期）',
      children: [
        {
          title: '计费金额',
          dataIndex: 'serviceSurplusCalcPrice',
          render: this.moneyRender,
          width: 110,
        },
        {
          title: '值',
          dataIndex: 'serviceSurplusValue',
          render: this.moneyRender,
          width: 110,
        },
        {
          title: '储值金额',
          dataIndex: 'serviceSurplusAmount',
          render: this.moneyRender,
          width: 110,
        },
      ],
      collect: true,
    },
  ];

  operation3 = {
    buttons: [
      {
        auth: 'export-pubservice-balance-all',
        btnType: ButtonTypes.Export,
      },
    ],
  };

  columns4 = [
    {
      title: '主订单号',
      dataIndex: 'dealId',
      render: value => (value ? <Link to={`/basic/deal/${value}/detail`}>{value}</Link> : value),
      width: 110,
    },
    {
      title: '会员姓名',
      dataIndex: 'pubRealName',
      width: 110,
    },
    {
      title: '会员手机号',
      dataIndex: 'pubMobile',
      width: 120,
    },
    {
      title: '操作类型',
      dataIndex: 'operationAction',
      render: value => {
        const {
          analysis: { ActionTypes },
        } = this.props;
        return formatModel(ActionTypes, value);
      },
      width: 120,
    },
    {
      title: '服务编号',
      dataIndex: 'serviceId',
      width: 110,
    },
    {
      title: '会员服务名称',
      dataIndex: 'serviceName',
      width: 150,
    },
    {
      title: '服务分类',
      dataIndex: 'serviceCategoryName',
      width: 110,
    },
    {
      title: '消费值',
      dataIndex: 'consumptionValue',
      render: this.moneyRender,
      collect: true,
      width: 150,
    },
    {
      title: '消费合计',
      dataIndex: 'consumptionTotal',
      render: this.moneyRender,
      collect: true,
      width: 110,
    },
    {
      dynamicHeaderPlaceType: '188',
      collect: true,
      width: 90,
    },
  ];

  operation4 = {
    export: {
      settings: {
        dealId: {
          // override
          render: value => value,
        },
      },
    },
    buttons: [
      {
        auth: 'export-pubservice-consume',
        btnType: ButtonTypes.Export,
      },
    ],
  };

  externalUsed = true;

  formSearch = () => {
    const { salesIds, orderStartDate, orderEndDate, analysisStartDate, analysisEndDate, serviceId } = getPageQuery();
    const {
      venue: { currentVenue },
      pubservice: { ServiceTagTypes, AnalysisCalcModeTypes, AnalysisWriteModeTypes, categoryList },
      pubuser: { PubAccountTypes },
      deal: { SrvTypes },
    } = this.props;
    return {
      externalUsed: this.externalUsed,
      onSearch: formData => {
        this.setState(
          () => ({
            formData,
          }),
          () => {
            if (this.externalUsed) {
              const { tabKey } = this.state;
              this.onTabChange(tabKey); // 初始化的默认tab并不会触发onTabChange，而且初始时table还未ready，这里处理停留在某tab时重新查询
            }
          }
        );
      },
      fields: [
        {
          label: '营销中心',
          placeholder: '默认全部营销中心',
          name: 'salesIds',
          mode: 'multiple',
          // professionalFieldName: 'professionalIds',
          // platformFieldName: 'platformIds',
          initialValue: (() => {
            if (salesIds || orderStartDate || orderEndDate || analysisStartDate || analysisEndDate) {
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
            label: '统计开始日期',
            name: 'analysisStartDate',
            initialValue: (() => {
              if (salesIds || orderStartDate || orderEndDate || analysisStartDate || analysisEndDate) {
                if (analysisStartDate || orderStartDate) {
                  return moment(+analysisStartDate || +orderStartDate);
                }
                return;
              }
              return moment();
            })(),
            type: ItemTypes.DatePickerRangeStart,
          },
          {
            label: '统计结束日期',
            name: 'analysisEndDate',
            initialValue: (() => {
              if (salesIds || orderStartDate || orderEndDate || analysisStartDate || analysisEndDate) {
                if (analysisEndDate || orderEndDate) {
                  return moment(+analysisEndDate || +orderEndDate);
                }
                return;
              }
              return moment();
            })(),
            type: ItemTypes.DatePickerRangeEnd,
          },
        ],
        {
          label: '服务名称',
          name: 'serviceName',
        },
        {
          label: '服务编号',
          initialValue: serviceId,
          name: 'serviceId',
        },
        {
          label: '服务标签',
          name: 'serviceTag',
          options: modelMapToOption(ServiceTagTypes),
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
          label: '服务计费方式',
          name: 'analysisCalcMode',
          options: modelMapToOption(AnalysisCalcModeTypes),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '服务记入方式',
          name: 'analysisWriteMode',
          options: modelMapToOption(AnalysisWriteModeTypes),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '会员姓名',
          name: 'realName', // 服务销售不支持此字段查询
          defHidden: true,
        },
        {
          label: '会员手机号', // 服务销售不支持此字段查询
          name: 'mobile',
          defHidden: true,
        },
        {
          label: '会员类型',
          name: 'pubAccountType',
          placeholder: '默认全部',
          options: modelMapToOption(PubAccountTypes),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '会员服务账户编号', // 仅个人服务结存支持
          name: 'pubServiceAccountId',
          defHidden: true,
        },
        {
          label: '操作终端',
          name: 'srvType',
          options: modelMapToOption(SrvTypes),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '购买营销中心',
          name: 'buySalesId',
          options: (() => {
            const {
              venue: { list },
            } = this.props;
            return (list || []).map(item => ({
              key: item.id,
              text: item.salesName,
            }));
          })(),
          type: ItemTypes.Select,
          defHidden: true,
        },
      ],
    };
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'pubservice/fetchServiceCategory',
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleToDetail = (record, query, path, newWindow) => {
    const { formData, tabKey } = this.state;
    const { salesIds, analysisStartDate, analysisEndDate } = formData || {};

    const finalQuery = {
      ...query,
      salesIds: (salesIds || []).join(','),
      analysisStartDate,
      analysisEndDate: analysisEndDate ? moment(analysisEndDate).subtract(1, 'days').valueOf() : undefined,
    };

    if (tabKey === 'balanceAll') {
      delete finalQuery.pubAccountId;
    }

    if (tabKey === 'financeFlow') {
      delete finalQuery.salesIds;
    }

    // 这里特殊处理了累计购买张数
    if (query.name === 'totalNum' && (tabKey === 'balance' || tabKey === 'balanceAll')) {
      delete finalQuery.analysisStartDate;
      delete finalQuery.analysisEndDate;
      delete finalQuery.salesIds;
    }

    const { dispatch } = this.props;

    if (newWindow) {
      window.open(`${path}?${stringify(finalQuery)}`);
      return;
    }
    dispatch(
      push({
        pathname: path || '../detail/pubservice',
        search: stringify(finalQuery),
      })
    );
  };

  handleLoadDataPersonal = (list, result) => {
    if (this.isUnmounted) {
      return;
    }
    this.setState(({ tabKey, tableMapping }) => {
      const info = tableMapping[tabKey] || {};
      return {
        tableMapping: {
          ...tableMapping,
          [tabKey]: {
            ...info,
            data: result,
          },
        },
      };
    });
  };

  onTabChange = tabKey => {
    this.setState({
      tabKey,
    });
    const { formData: topFormData, tableMapping } = this.state;
    const info = tableMapping[tabKey];
    if (info == null) {
      return;
    }
    const { table, formData } = info;
    if (formData === topFormData) {
      // 条件无变化，不处理
      return;
    }
    this.setState({
      tableMapping: {
        ...tableMapping,
        [tabKey]: {
          ...info,
          formData: topFormData, // 更新当前tab的表单条件
        },
      },
    });
    table.handleFormSearch(topFormData);
  };

  handleTableInit = table => {
    this.setState(
      ({ tabKey, formData, tableMapping }) => ({
        tableMapping: {
          ...tableMapping,
          [tabKey]: {
            table,
            formData,
          },
        },
      }),
      () => {
        if (this.externalUsed) {
          const { formData } = this.state;
          table.handleFormSearch(formData);
        }
      }
    );
  };

  onTableLoadingStateChange = loading => {
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      tableLoading: loading,
    });
  };

  matchRender = renderType => {
    switch (renderType) {
      case RenderTypes.Money.key:
        return this.moneyRender;
      case RenderTypes.Date.key:
        return this.dateRender;
      case RenderTypes.DateTime.key:
        return this.dateTimeRender;
      default:
    }
  };

  render() {
    const {
      venue: { currentItem },
    } = this.props;
    const { tabKey, tableMapping, tableLoading } = this.state;

    const { data } = tableMapping[tabKey] || {};

    const columns4 = matchDynamicHeader(this.columns4, data ? data.data : [], this.matchRender);
    const formSearch = this.formSearch();
    return (
      <>
        <MarginBar bottom={12}>
          <Card bordered={false}>
            <SearchForm config={formSearch} tableLoading={tableLoading} />
          </Card>
        </MarginBar>

        {/* 初始的时候currentItem会延后点，列表要求professionalIds参数必填 */}
        <Card bordered={false} loading={currentItem == null}>
          <Tabs defaultActiveKey={tabKey} activeKey={tabKey} onChange={this.onTabChange}>
            <TabPane tab="总服务销售" key="financeFlow">
              <Datatable
                url="/analysis/publicService/summary.do"
                columns={this.columns}
                rowKey="serviceId"
                formSearch={formSearch}
                operation={this.operation}
                onTableLoadingStateChange={this.onTableLoadingStateChange}
                onInit={this.handleTableInit}
              />
            </TabPane>
            <TabPane tab="总服务结存" key="balanceAll">
              <Datatable
                url="/analysis/serviceAccount/summary.do"
                columns={this.columns3}
                rowKey="serviceId"
                formSearch={formSearch}
                operation={this.operation3}
                onTableLoadingStateChange={this.onTableLoadingStateChange}
                onInit={this.handleTableInit}
              />
            </TabPane>
            <TabPane tab="按日期总结存" key="dateAll">
              <Datatable
                url="/analysis/serviceAccount/personal/dailyTotal.do"
                columns={this.dateColumns}
                rowKey="serviceId"
                formSearch={formSearch}
                operation={this.operation3}
                onTableLoadingStateChange={this.onTableLoadingStateChange}
                onInit={this.handleTableInit}
              />
            </TabPane>
            <TabPane tab="个人服务结存" key="balance">
              <Datatable
                url="/analysis/serviceAccount/personal.do"
                summaryUrl="/analysis/serviceAccount/personal/total.do"
                columns={this.columns2}
                rowKey="id"
                formSearch={formSearch}
                operation={this.operation2}
                onTableLoadingStateChange={this.onTableLoadingStateChange}
                onInit={this.handleTableInit}
              />
            </TabPane>
            <TabPane tab="个人服务消费" key="consume">
              <Datatable
                url="/analysis/publicService/personal.do"
                columns={columns4}
                rowKey="id"
                formSearch={formSearch}
                operation={this.operation4}
                onLoadData={this.handleLoadDataPersonal}
                onTableLoadingStateChange={this.onTableLoadingStateChange}
                onInit={this.handleTableInit}
              />
            </TabPane>
          </Tabs>
        </Card>
      </>
    );
  }
}

export default AnalysisBusinessSummaryPubService;
