import { Component } from 'react';
import moment from 'moment';
import { stringify } from 'qs';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Link } from 'react-router-dom';
import { Card, Tabs, Popover, Icon } from 'antd';
import Datatable, { ButtonTypes, ItemTypes, SearchForm } from '@/components/Datatable';
import { formatMoney, formatColorWrapper, formatModel, formatDate } from '@/utils/format';
import { isNumber, modelMapToOption } from '@/utils/utils';
import MarginBar from '@/components/MarginBar';

const { TabPane } = Tabs;

@connect(({ venue, deal, pubuser, pubaccount, analysis }) => ({
  venue,
  deal,
  pubuser,
  pubaccount,
  analysis,
}))
class AnalysisFinanceSummaryPubAccount extends Component {
  state = {
    tabKey: 'summaryAll',
    formData: undefined,
    tableMapping: {}, // {tabKey: {table,formData, ...other}}
    tableLoading: false,
  };

  // eslint-disable-next-line react/sort-comp
  moneyRender = value => formatColorWrapper(formatMoney)(value);

  feeRender = value => formatColorWrapper(formatMoney)(value, 0);

  /**
   * 生成不同链接效果的 render
   */
  genLinkWrapperRender =
    (render = value => value, genQuery = () => {}, isIgnore = () => false) =>
    (...args) => {
      const [, record] = args;
      const { salesId } = record;
      const v = render(...args);
      if (salesId == null || isIgnore(...args)) {
        return v;
      }
      return (
        <span className="link" onClick={() => this.handleToDetail(record, genQuery(...args))}>
          {v}
        </span>
      );
    };

  /**
   * 生成不同链接效果的 render
   */
  genLinkWrapperRender2 =
    (render = value => value, genQuery = () => {}, isIgnore = () => false, path) =>
    (...args) => {
      const [, record] = args;
      const v = render(...args);
      if (isIgnore(...args)) {
        return v;
      }
      return (
        <span className="link" onClick={() => this.handleToDetail(record, genQuery(...args), path)}>
          {v}
        </span>
      );
    };

  columns = [
    {
      title: '营销中心',
      dataIndex: 'salesName',
      width: 150,
    },
    {
      title: '充值',
      children: [
        {
          title: (() => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return PayWayTypes.WECHAT.value;
          })(),
          dataIndex: 'rechargeWechat',
          render: this.genLinkWrapperRender(
            this.moneyRender,
            () => {
              const {
                deal: { PayWayTypes },
              } = this.props;
              return {
                isFinanceflow: true,
                payMode: PayWayTypes.WECHAT.key,
              };
            },
            value => !isNumber(value) || value === 0
          ),
          width: 110,
        },
        {
          title: (() => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return PayWayTypes.ZFB.value;
          })(),
          dataIndex: 'rechargeZfb',
          render: this.genLinkWrapperRender(
            this.moneyRender,
            () => {
              const {
                deal: { PayWayTypes },
              } = this.props;
              return {
                isFinanceflow: true,
                payMode: PayWayTypes.ZFB.key,
              };
            },
            value => !isNumber(value) || value === 0
          ),
          width: 110,
        },
        {
          title: (() => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return PayWayTypes.BANKCARD.value;
          })(),
          dataIndex: 'rechargeBankCard',
          render: this.genLinkWrapperRender(
            this.moneyRender,
            () => {
              const {
                deal: { PayWayTypes },
              } = this.props;
              return {
                isFinanceflow: true,
                payMode: PayWayTypes.BANKCARD.key,
              };
            },
            value => !isNumber(value) || value === 0
          ),
          width: 110,
        },
        {
          title: (() => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return PayWayTypes.BANKTRANSFER.value;
          })(),
          dataIndex: 'rechargeBankTransfer',
          render: this.genLinkWrapperRender(
            this.moneyRender,
            () => {
              const {
                deal: { PayWayTypes },
              } = this.props;
              return {
                isFinanceflow: true,
                payMode: PayWayTypes.BANKTRANSFER.key,
              };
            },
            value => !isNumber(value) || value === 0
          ),
          width: 110,
        },
        {
          title: (() => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return PayWayTypes.CASH.value;
          })(),
          dataIndex: 'rechargeCash',
          render: this.genLinkWrapperRender(
            this.moneyRender,
            () => {
              const {
                deal: { PayWayTypes },
              } = this.props;
              return {
                isFinanceflow: true,
                payMode: PayWayTypes.CASH.key,
              };
            },
            value => !isNumber(value) || value === 0
          ),
          width: 110,
        },
      ],
    },
    {
      title: '消费',
      children: [
        {
          title: '账户',
          dataIndex: 'consumePublicAccount',
          render: this.genLinkWrapperRender(
            this.moneyRender,
            () => {
              const {
                deal: { PayWayTypes },
              } = this.props;
              return {
                payMode: PayWayTypes.ACCOUNT.key,
              };
            },
            value => !isNumber(value) || value === 0
          ),
          width: 110,
        },
        {
          title: (() => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return PayWayTypes.CREDIT.value;
          })(),
          dataIndex: 'consumePublicCredit',
          render: this.genLinkWrapperRender(
            this.moneyRender,
            () => {
              const {
                deal: { PayWayTypes },
              } = this.props;
              return {
                payMode: PayWayTypes.CREDIT.key,
              };
            },
            value => !isNumber(value) || value === 0
          ),
          width: 110,
        },
      ],
    },
    {
      title: '账户提现',
      children: [
        {
          title: (() => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return PayWayTypes.WECHAT.value;
          })(),
          dataIndex: 'publicAccountWithdrawWechat',
          render: this.moneyRender,
          width: 110,
        },
        {
          title: (() => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return PayWayTypes.ZFB.value;
          })(),
          dataIndex: 'publicAccountWithdrawZfb',
          render: this.moneyRender,
          width: 110,
        },
        // {
        //   title: (() => {
        //     const {
        //       deal: { PayWayTypes },
        //     } = this.props;
        //     return PayWayTypes.BANKCARD.value;
        //   })(),
        //   dataIndex: 'publicAccountWithdrawBankCard',
        //   render: this.moneyRender,
        //   width: 110,
        // },
        {
          title: (() => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return PayWayTypes.BANKTRANSFER.value;
          })(),
          dataIndex: 'publicAccountWithdrawBankTransfer',
          render: this.moneyRender,
          width: 110,
        },
        {
          title: (() => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return PayWayTypes.CASH.value;
          })(),
          dataIndex: 'publicAccountWithdrawCash',
          render: this.moneyRender,
          width: 110,
        },
      ],
    },
    {
      title: '服务折现',
      children: [
        {
          title: (() => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return PayWayTypes.WECHAT.value;
          })(),
          dataIndex: 'publicServiceWithdrawWechat',
          render: this.moneyRender,
          width: 110,
        },
        {
          title: (() => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return PayWayTypes.ZFB.value;
          })(),
          dataIndex: 'publicServiceWithdrawZfb',
          render: this.moneyRender,
          width: 110,
        },
        // {
        //   title: (() => {
        //     const {
        //       deal: { PayWayTypes },
        //     } = this.props;
        //     return PayWayTypes.BANKCARD.value;
        //   })(),
        //   dataIndex: 'publicServiceWithdrawBankCard',
        //   render: this.moneyRender,
        //   width: 110,
        // },
        {
          title: (() => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return PayWayTypes.BANKTRANSFER.value;
          })(),
          dataIndex: 'publicServiceWithdrawBankTransfer',
          render: this.moneyRender,
          width: 110,
        },
        {
          title: (() => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return PayWayTypes.CASH.value;
          })(),
          dataIndex: 'publicServiceWithdrawCash',
          render: this.moneyRender,
          width: 110,
        },
      ],
    },
    {
      title: '还款',
      children: [
        {
          title: '白条还款',
          dataIndex: 'repaymentPublicCredit',
          render: this.moneyRender,
          width: 110,
        },
      ],
    },
    {
      title: '取消订单退回',
      children: [
        {
          title: '退回账户',
          dataIndex: 'accountToAccount',
          render: this.moneyRender,
          width: 110,
        },
        {
          title: '微信退回账户',
          dataIndex: 'wechatToAccount',
          render: this.moneyRender,
          width: 120,
        },
        {
          title: '支付宝退回账户',
          dataIndex: 'zfbToAccount',
          render: this.moneyRender,
          width: 120,
        },
      ],
    },
  ];

  columns2 = [
    {
      title: '会员信息',
      children: [
        {
          title: '会员编号',
          dataIndex: 'pubAccountId',
          render: value => (value ? <Link to={`/basic/pub/info/${value}`}>{value}</Link> : value),
          width: 110,
        },
        {
          title: '会员姓名',
          dataIndex: 'realName',
          width: 110,
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
      ],
    },
    {
      title: (
        <Popover content="本期剩余金额=上期剩余金额+本期充值金额-本期消费金额+退单-提现+微信转账户+支付宝转账户">
          <span>
            账户（预存）金额 <Icon type="question-circle" />
          </span>
        </Popover>
      ),
      children: [
        {
          title: '上期剩余余额',
          dataIndex: 'amountAfterSurplus',
          render: this.moneyRender,
          collect: true,
          width: 110,
        },
        {
          title: '本期充值金额',
          dataIndex: 'amountRecharge',
          render: this.genLinkWrapperRender2(
            this.moneyRender,
            (value, record) => {
              const {
                pubaccount: { DealStatus },
              } = this.props;
              const { mobile } = record;
              return {
                isFinanceflow: true,
                dealState: DealStatus.DEAL_RECHARGE_COMPLETED.key,
                pubMobile: mobile,
              };
            },
            value => !isNumber(value) || value === 0,
            '../../../basic/deal/account'
          ),
          collect: true,
          width: 110,
        },
        {
          title: '本期消费金额',
          dataIndex: 'amountPay',
          render: this.genLinkWrapperRender2(
            this.moneyRender,
            (value, record) => {
              const {
                deal: { PayWayTypes },
              } = this.props;
              const { mobile } = record;
              return {
                isFinanceflow: true,
                payMode: PayWayTypes.ACCOUNT.key,
                mobile,
              };
            },
            value => !isNumber(value) || value === 0
          ),
          collect: true,
          width: 110,
        },
        {
          title: '本期退单金额',
          dataIndex: 'amountRefund',
          render: this.genLinkWrapperRender2(
            this.moneyRender,
            (value, record) => {
              const { mobile } = record;
              const {
                analysis: { ActionTypes },
              } = this.props;
              return {
                isFinanceflow: true,
                operationActions: ActionTypes.DEAL_CANCEL.key,
                mobile,
              };
            },
            value => !isNumber(value) || value === 0,
            '../detail'
          ),
          collect: true,
          width: 110,
        },
        {
          title: '本期提现金额',
          dataIndex: 'amountWithdraw',
          render: this.genLinkWrapperRender2(
            this.moneyRender,
            (value, record) => {
              const { mobile } = record;
              const {
                analysis: { ActionTypes },
              } = this.props;
              return {
                isFinanceflow: true,
                operationActions: ActionTypes.PUBACCOUNT_WITHDRAW.key,
                mobile,
              };
            },
            value => !isNumber(value) || value === 0,
            '../detail'
          ),
          collect: true,
          width: 110,
        },
        {
          title: '微信转账户金额',
          dataIndex: 'wechatToAccount',
          render: this.moneyRender,
          collect: true,
          width: 130,
        },
        {
          title: '支付宝转账户金额',
          dataIndex: 'alipayToAccount',
          render: this.moneyRender,
          collect: true,
          width: 130,
        },
        {
          title: '本期剩余余额',
          dataIndex: 'amountSurplus',
          render: this.moneyRender,
          collect: true,
          width: 110,
        },
      ],
    },
    {
      title: '白条',
      children: [
        {
          title: '上期剩余额度',
          dataIndex: 'creditAfterSurplus',
          render: this.moneyRender,
          collect: true,
          width: 130,
        },
        {
          title: '本期剩余额度',
          dataIndex: 'creditSurplus',
          render: this.moneyRender,
          collect: true,
          width: 130,
        },
        {
          title: '本期支付额度',
          dataIndex: 'creditPay',
          render: this.moneyRender,
          collect: true,
          width: 110,
        },
        {
          title: '本期退款额度',
          dataIndex: 'creditRefund',
          render: this.moneyRender,
          collect: true,
          width: 110,
        },
        {
          title: '本期还款额度',
          dataIndex: 'creditRepayment',
          render: this.moneyRender,
          collect: true,
          width: 110,
        },
        {
          title: '本期增加额度',
          dataIndex: 'creditAdd',
          render: this.moneyRender,
          collect: true,
          width: 110,
        },
        {
          title: '本期减少额度',
          dataIndex: 'creditSub',
          render: this.moneyRender,
          collect: true,
          width: 110,
        },
      ],
    },
    {
      title: '积分',
      children: [
        {
          title: '本期剩余积分',
          dataIndex: 'feeSurplus',
          render: this.feeRender,
          collect: true,
          width: 110,
        },
        {
          title: '上期剩余积分',
          dataIndex: 'feeAfterSurplus',
          render: this.feeRender,
          collect: true,
          width: 110,
        },
        {
          title: '本期支付积分',
          dataIndex: 'feePay',
          render: this.feeRender,
          collect: true,
          width: 110,
        },
        {
          title: '本期退回积分',
          dataIndex: 'feeRefund',
          render: this.feeRender,
          collect: true,
          width: 110,
        },
        {
          title: '本期增加积分',
          dataIndex: 'feeAdd',
          render: this.feeRender,
          collect: true,
          width: 110,
        },
        {
          title: '本期减少积分',
          dataIndex: 'feeSub',
          render: this.feeRender,
          collect: true,
          width: 110,
        },
      ],
    },
  ];

  dateColumns = [
    {
      title: '日期',
      dataIndex: 'analysisStartDate',
      render: formatDate,
      width: 150,
    },
    ...this.columns2.slice(1),
  ];

  formSearch = {
    externalUsed: true,
    onSearch: formData => {
      this.setState(
        () => ({
          formData,
        }),
        () => {
          if (this.formSearch.externalUsed) {
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
        initialValue: (() => {
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
          type: ItemTypes.DatePickerRangePreset,
        },
        {
          name: 'analysisStartDate',
          initialValue: moment(),
          label: '创建时间(始)',
          type: ItemTypes.DatePickerRangeStart,
        },
        {
          name: 'analysisEndDate',
          initialValue: moment(),
          label: '创建时间(止)',
          type: ItemTypes.DatePickerRangeEnd,
        },
      ],
      {
        label: '会员类型',
        name: 'pubAccountType',
        placeholder: '默认全部',
        options: (() => {
          const {
            pubuser: { PubAccountTypes },
          } = this.props;
          return modelMapToOption(PubAccountTypes);
        })(),
        type: ItemTypes.Select,
      },
      {
        label: '会员姓名',
        name: 'realName',
      },
      {
        label: '会员手机号',
        name: 'mobile',
      },
      {
        label: '会员编号',
        name: 'pubAccountId',
        defHidden: true,
      },
      {
        label: '显示顺序',
        name: 'sortRule',
        options: [
          { key: 'amountAfterSurplus', text: '上期剩余金额' },
          { key: 'amountSurplus', text: '本期剩余余额' },
          { key: 'amountPay', text: '本期消费金额' },
          { key: 'amountRefund', text: '本期退单金额' },
        ],
        type: ItemTypes.Select,
        defHidden: true,
      },
    ],
  };

  formSearch2 = {
    ...this.formSearch,
    fields: this.formSearch.fields.slice(1),
  };

  operation = {
    export: {
      ignoreSum: true,
    },
    buttons: [
      {
        auth: 'export-pubaccount',
        btnType: ButtonTypes.Export,
      },
    ],
  };

  operation2 = {
    export: {
      settings: {
        pubAccountId: {
          // override
          render: value => value,
        },
      },
    },
    buttons: [
      {
        auth: 'export-pubaccount',
        btnType: ButtonTypes.Export,
      },
      {
        btnType: ButtonTypes.SummaryTotal,
      },
    ],
  };

  handleToDetail = (record, query, path) => {
    const { dispatch } = this.props;
    const { formData } = this.state;
    const { salesIds, analysisStartDate, analysisEndDate } = formData || {};
    const { salesId } = record;

    const finalQuery = {
      salesIds: salesId >= 0 ? salesId : (salesIds || []).join(','),
      ...query,
    };

    const startDate = analysisStartDate;
    const endDate = analysisEndDate ? moment(analysisEndDate).subtract(1, 'days').valueOf() : undefined;
    if (query.isFinanceflow) {
      Object.assign(finalQuery, {
        analysisStartDate: startDate,
        analysisEndDate: endDate,
      });
    } else {
      Object.assign(finalQuery, {
        consumeStartDate: startDate,
        consumeEndDate: endDate,
      });
    }

    delete finalQuery.isFinanceflow;

    dispatch(
      push({
        pathname: path || '../detail',
        search: stringify(finalQuery),
      })
    );
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
        if (this.formSearch.externalUsed) {
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

  render() {
    const {
      venue: { currentItem },
    } = this.props;
    const { tabKey, tableLoading } = this.state;
    const search = tabKey === 'summaryAll' ? this.formSearch : this.formSearch2;
    return (
      <>
        <MarginBar bottom={12}>
          <Card bordered={false}>
            <SearchForm config={search} tableLoading={tableLoading} />
          </Card>
        </MarginBar>

        {/* 初始的时候currentItem会延后点，列表要求professionalIds参数必填 */}
        <Card bordered={false} loading={currentItem == null}>
          <Tabs defaultActiveKey={tabKey} activeKey={tabKey} onChange={this.onTabChange}>
            <TabPane tab="账户汇总" key="summaryAll">
              <Datatable
                pagination={false}
                url="/analysis/finance/publicAccountSubitemSummary.do"
                columns={this.columns}
                rowKey={({ salesId, salesName }) => `${salesId}-${salesName}`}
                formSearch={this.formSearch}
                operation={this.operation}
                onTableLoadingStateChange={this.onTableLoadingStateChange}
                onInit={this.handleTableInit}
              />
            </TabPane>
            <TabPane tab="个人账户汇总" key="payMode">
              <Datatable
                url="/analysis/finance/publicAccountBusinessSummary.do"
                summaryUrl="/analysis/finance/publicAccountBusinessSummary/total.do"
                columns={this.columns2}
                rowKey="id"
                formSearch={this.formSearch}
                operation={this.operation2}
                onTableLoadingStateChange={this.onTableLoadingStateChange}
                onInit={this.handleTableInit}
              />
            </TabPane>
            <TabPane tab="按日期账户总结存" key="dateMode">
              <Datatable
                url="/analysis/finance/publicAccountBusinessSummary/dailyTotal.do"
                columns={this.dateColumns}
                rowKey="id"
                formSearch={this.formSearch}
                operation={this.operation}
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

export default AnalysisFinanceSummaryPubAccount;
