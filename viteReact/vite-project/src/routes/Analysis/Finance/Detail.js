import { Component } from 'react';
import { connect } from 'react-redux';
import { Card } from 'antd';
import moment from 'moment';
import { stringify } from 'qs';
import { push } from 'connected-react-router';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import DataContent from '@/components/PubServiceCard/DataContent';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { getPageQuery, modelMapToOption } from '@/utils/utils';
import {
  formatDateTime,
  formatMoney,
  formatColorWrapper,
  formatSrvId,
  formatModel,
  formatMoneyLen0,
  formatPayWayFromList,
} from '@/utils/format';

@connect(({ venue, deal, pubservice, analysis }) => ({
  venue,
  deal,
  pubservice,
  analysis,
}))
class AnalysisFinanceDetail extends Component {
  idx = 1;

  // eslint-disable-next-line react/sort-comp
  moneyRender = value => formatColorWrapper(formatMoney)(value);

  handleToDetail = (record, path, query, newWindow) => {
    const { dispatch } = this.props;
    if (newWindow) {
      window.open(`${path}`);
      return;
    }
    dispatch(
      push({
        pathname: path,
        search: stringify(query),
      })
    );
  };

  columns = [
    {
      title: '主订单号',
      dataIndex: 'analysisDeal.dealId',
      width: 80,
      render: (v, r) => {
        return (
          <span className="link" onClick={() => this.handleToDetail(r, `../../../basic/deal/${v}/detail`, {}, true)}>
            {v}
          </span>
        );
      },
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
      width: 80,
    },
    {
      title: '会员编号',
      dataIndex: 'analysisDeal.publicAccountId',
      render: (v, r) => {
        return (
          <span className="link" onClick={() => this.handleToDetail(r, `../../../basic/pub/info/${v}/base`, {}, true)}>
            {v}
          </span>
        );
      },
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
      width: 120,
    },
    {
      title: '营销中心',
      dataIndex: 'analysisDeal.salesName',
      width: 150,
    },
    {
      title: '订单信息',
      dataIndex: 'analysisDeal.dealDetail',
      width: 350,
    },
    {
      title: '订单状态',
      dataIndex: 'analysisDeal.dealState',
      render: value => {
        const {
          deal: { DealStatus },
        } = this.props;
        return formatModel(DealStatus, value);
      },
      width: 80,
    },
    {
      title: '订单总金额',
      dataIndex: 'analysisDeal.payTotalAmount',
      render: this.moneyRender,
      collect: true,
      width: 100,
    },
    {
      title: '支付总金额',
      dataIndex: 'analysisDeal.payPaidAmount',
      render: this.moneyRender,
      collect: true,
      width: 100,
    },
    {
      title: '计费总金额',
      dataIndex: 'analysisDeal.payCalcPaidAmount',
      render: this.moneyRender,
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
      title: '支付状态',
      dataIndex: 'analysisDeal.dealPayState',
      render: value => {
        const {
          deal: { PayStatus },
        } = this.props;
        if (value == null) {
          return PayStatus.UNPAID.value;
        }
        return formatModel(PayStatus, value);
      },
      width: 80,
    },
    {
      title: '是否改价',
      dataIndex: 'analysisDeal.changePrice',
      render: value => {
        const {
          deal: { ChangePriceTypes },
        } = this.props;
        return value ? ChangePriceTypes.Change.value : ChangePriceTypes.UnChange.value;
      },
      width: 80,
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
          title: '会员服务名称',
          dataIndex: 'analysisPublicService.serviceName',
          width: 210,
        },
        {
          title: '会员服务账户编号',
          dataIndex: 'analysisDeal.publicServiceAccountId',
          render: (v, r) => {
            const {
              analysisDeal: { salesId },
            } = r;
            return (
              <>
                {v.map(item => {
                  return (
                    <span
                      key={item}
                      className="link"
                      onClick={() =>
                        this.handleToDetail(r, `../../../basic/pub/pubservicesold`, {
                          pubServiceAccountId: item,
                          buySalesId: salesId,
                        })
                      }
                    >
                      {item}
                    </span>
                  );
                })}
              </>
            );
          },
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
        {
          title: '服务记入方式',
          dataIndex: 'analysisDeal.analysisWriteMode',
          render: value => {
            const {
              pubservice: { AnalysisWriteModeTypes },
            } = this.props;
            return formatModel(AnalysisWriteModeTypes, value);
          },
          width: 110,
        },
      ],
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
        return PayWayTypes.CREDIT.value;
      })(),
      dataIndex: 'analysisDeal.payCredit',
      render: this.moneyRender,
      collect: true,
      width: 70,
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
      render: (v, r) => {
        return (
          <span
            className="link"
            onClick={() => this.handleToDetail(r, `../finance/tpdetail/wechatpay`, { payWechatId: v })}
          >
            {v}
          </span>
        );
      },
      width: 150,
    },
    {
      title: '支付宝商家订单号',
      dataIndex: 'analysisDeal.payZfbId',
      render: (v, r) => {
        return (
          <span className="link" onClick={() => this.handleToDetail(r, `../finance/tpdetail/alipay`, { payZfbId: v })}>
            {v}
          </span>
        );
      },
      width: 150,
    },
    {
      title: '订单备注',
      dataIndex: 'analysisDeal.userMessage',
      width: 110,
    },
    {
      title: '商家留言',
      dataIndex: 'analysisDeal.sellerMessage',
      width: 110,
    },
    // {
    //   title: '备注',
    //   dataIndex: 'analysisDeal.descr',
    //   width: 110,
    // },
    {
      title: '取消原因',
      dataIndex: 'analysisDeal.cancelMessage',
      width: 100,
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
    {
      title: '业务来源',
      dataIndex: 'analysisDeal.srvName',
      width: 150,
    },
    {
      title: '操作终端',
      dataIndex: 'analysisDeal.srvId',
      render: formatSrvId,
      width: 80,
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
            operationActions,
            salesIds,
            payMode,
            analysisStartDate,
            analysisEndDate,
            consumeStartDate,
            consumeEndDate,
            mobile,
            dealId,
          } = getPageQuery();
          if (
            operationActions ||
            salesIds ||
            payMode ||
            analysisStartDate ||
            analysisEndDate ||
            consumeStartDate ||
            consumeEndDate ||
            mobile ||
            dealId
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
          label: '统计开始日期',
          name: 'analysisStartDate',
          placeholder: '操作开始日期',
          initialValue: (() => {
            const {
              operationActions,
              salesIds,
              payMode,
              analysisStartDate,
              analysisEndDate,
              consumeStartDate,
              consumeEndDate,
              mobile,
              dealId,
            } = getPageQuery();
            if (
              operationActions ||
              salesIds ||
              payMode ||
              analysisStartDate ||
              analysisEndDate ||
              consumeStartDate ||
              consumeEndDate ||
              mobile ||
              dealId
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
          label: '统计结束日期',
          name: 'analysisEndDate',
          initialValue: (() => {
            const {
              operationActions,
              salesIds,
              payMode,
              analysisStartDate,
              analysisEndDate,
              consumeStartDate,
              consumeEndDate,
              mobile,
              dealId,
            } = getPageQuery();
            if (
              operationActions ||
              salesIds ||
              payMode ||
              analysisStartDate ||
              analysisEndDate ||
              consumeStartDate ||
              consumeEndDate ||
              mobile ||
              dealId
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
        label: '主订单号',
        name: 'dealId',
        initialValue: (() => {
          const { dealId } = getPageQuery();
          return dealId;
        })(),
      },
      {
        label: '订单类型',
        name: 'subDealTypes',
        mode: 'multiple',
        options: (() => {
          const {
            deal: { SubSeqTypes },
          } = this.props;
          const ignoreList = new Set([SubSeqTypes.DEAL_PUBLICCREDIT, SubSeqTypes.DEAL_WITHDRAW]);
          return Object.values(SubSeqTypes)
            .filter(item => !ignoreList.has(item))
            .map(item => ({
              key: item.key,
              text: item.value,
            }));
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
        initialValue: (() => {
          const { payMode } = getPageQuery();
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
        options: (() => {
          const {
            deal: { DealStatus },
          } = this.props;
          return modelMapToOption(DealStatus);
        })(),
        initialValue: (() => {
          const { dealState } = getPageQuery();
          if (dealState) {
            return +dealState;
          }
        })(),
        type: ItemTypes.Select,
        defHidden: true,
      },
      {
        label: '操作类型',
        name: 'operationActions',
        mode: 'multiple',
        options: (() => {
          const {
            analysis: { ActionTypes },
          } = this.props;
          return [
            ActionTypes.DEAL_CHECKOUT,
            ActionTypes.DEAL_CANCEL,
            ActionTypes.PUBACCOUNT_WITHDRAW,
            ActionTypes.PUBSERVICEACCOUNT_WITHDRAW,
          ].map(item => ({
            key: item.key,
            text: item.value,
          }));
        })(),
        initialValue: (() => {
          const { operationActions } = getPageQuery();
          if (operationActions) {
            return (operationActions || '')
              .split(',')
              .filter(t => t)
              .map(t => +t);
          }
        })(),
        type: ItemTypes.Select,
        defHidden: true,
      },
      {
        label: '会员手机号',
        name: 'pubMobile',
        initialValue: (() => {
          const { mobile } = getPageQuery();
          return mobile;
        })(),
        defHidden: true,
      },
      {
        label: '会员姓名',
        name: 'pubRealName',
        defHidden: true,
      },
      {
        label: '订单信息',
        name: 'dealDetail',
        defHidden: true,
      },
      {
        label: '业务来源名称',
        name: 'srvName',
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
          label: '消费开始日期',
          name: 'consumeStartDate',
          placeholder: '操作开始日期',
          initialValue: (() => {
            const { consumeStartDate } = getPageQuery();
            if (consumeStartDate) {
              return moment(+consumeStartDate);
            }
          })(),
          type: ItemTypes.DatePickerRangeStart,
          defHidden: true,
        },
        {
          label: '消费结束日期',
          name: 'consumeEndDate',
          initialValue: (() => {
            const { consumeEndDate } = getPageQuery();
            if (consumeEndDate) {
              return moment(+consumeEndDate);
            }
          })(),
          placeholder: '操作结束日期',
          type: ItemTypes.DatePickerRangeEnd,
          defHidden: true,
        },
      ],
      {
        label: '会员服务账户编号',
        name: 'pubServiceAccountId',
        defHidden: true,
      },
      {
        label: '会员服务名称',
        name: 'publicServiceName',
        initialValue: (() => {
          const { serviceName } = getPageQuery();
          return serviceName;
        })(),
        defHidden: true,
      },
      {
        label: '服务记入方式',
        name: 'analysisWriteMode',
        options: (() => {
          const {
            pubservice: { AnalysisWriteModeTypes },
          } = this.props;
          return modelMapToOption(AnalysisWriteModeTypes);
        })(),
        type: ItemTypes.Select,
        defHidden: true,
      },
      {
        label: '服务计费方式',
        name: 'analysisCalcMode',
        options: (() => {
          const {
            pubservice: { AnalysisCalcModeTypes },
          } = this.props;
          return modelMapToOption(AnalysisCalcModeTypes);
        })(),
        type: ItemTypes.Select,
        defHidden: true,
      },
      {
        label: '操作终端',
        name: 'srvType',
        options: (() => {
          const {
            deal: { SrvTypes },
          } = this.props;
          return modelMapToOption(SrvTypes);
        })(),
        initialValue: (() => {
          const { srvType } = getPageQuery();
          if (srvType) {
            return +srvType;
          }
        })(),
        type: ItemTypes.Select,
        defHidden: true,
      },
      {
        label: '创建人',
        name: 'createRealName',
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

  operation = {
    buttons: [
      {
        auth: 'export',
        btnType: ButtonTypes.Export,
      },
    ],
  };

  render() {
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Datatable
            url="/analysis/finance/detail.do"
            columns={this.columns}
            rowKey={record => record.analysisDeal.id}
            formSearch={this.formSearch}
            operation={this.operation}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default AnalysisFinanceDetail;
