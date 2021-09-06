import { Component } from 'react';
import { Card, Tooltip, Icon, Row, Col, Tabs } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { stringify } from 'qs';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import SearchForm from '@/components/Datatable/SearchForm';
import IconFont from '@/components/Icon';
import ChartCard from '@/components/Charts/ChartCard';
import Field from '@/components/Charts/Field';
import MarginBar from '@/components/MarginBar';
import { formatMoney, formatColorWrapper } from '@/utils/format';
import { isNumber, modelMapToOption } from '@/utils/utils';

const { TabPane } = Tabs;

@connect(({ venue, deal, analysis }) => ({
  venue,
  deal,
  analysis,
}))
class AnalysisFinanceSummaryPayMode extends Component {
  idx = 0;

  state = {
    loading: false,
    totalSummaryList: [],
    tabKey: 'financeFlow',

    formData: undefined,

    tableMapping: {}, // {tabKey: {table,formData}}
  };

  topColResponsiveProps = {
    xs: 24,
    sm: 24,
    md: 24,
    lg: 8,
    xl: 8,
    style: { marginBottom: 12 },
  };

  typesTitles = {
    103: '是指所有现金流收入的汇总（消费+预存+还款）',
    104: '是指所有现金流退款的汇总（消费+预存+还款）',
  };

  // eslint-disable-next-line react/sort-comp
  spRender = (value, { _sp }) => (_sp ? <span>&nbsp;</span> : value);

  spMoneyRender = (value, { _sp }) => (_sp ? <span>&nbsp;</span> : formatColorWrapper(formatMoney)(value));

  /**
   * 生成不同链接效果的 render
   */
  genLinkWrapperRender =
    (render = value => value, genQuery = () => {}, isIgnore = () => false) =>
    (...args) => {
      const [, record] = args;
      const { salesId, _sp } = record;
      if (_sp) {
        return this.spRender(...args);
      }
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

  columns = [
    {
      title: '营销中心',
      dataIndex: 'salesName',
      render: (value, { _sp }) => (_sp ? <span>&nbsp;</span> : value),
      width: 120,
    },
    {
      title: '资金来源',
      // dataIndex: 'incomeName',
      noRowSpan: true,
      render: (_, record) => {
        const { incomeName, incomeType } = record;
        const {
          analysis: { ActionTypes },
        } = this.props;
        if (
          incomeName &&
          (incomeType === ActionTypes.DEAL_CHECKOUT.key || incomeType === ActionTypes.DEAL_CANCEL.key)
        ) {
          return (
            <>
              <span className="link" onClick={() => this.handleToDetail(record)}>
                {incomeName}
              </span>
              &nbsp;
              <Tooltip title={this.typesTitles[incomeType]}>
                <Icon type="question-circle" theme="twoTone" />
              </Tooltip>
            </>
          );
        }
        return incomeName;
      },
      width: 80,
    },
    {
      title: '汇总',
      dataIndex: 'summaryTotal',
      render: this.genLinkWrapperRender(
        this.spMoneyRender,
        () => {
          return {};
        },
        value => !isNumber(value) || value === 0
      ),
      noRowSpan: true,
      width: 80,
    },
    {
      title: '现金流',
      children: [
        {
          title: '小计',
          dataIndex: 'incomeTotal',
          render: this.genLinkWrapperRender(
            this.spMoneyRender,
            () => {
              const {
                deal: { PayWayTypes },
              } = this.props;
              return {
                payMode: [
                  PayWayTypes.WECHAT.key,
                  PayWayTypes.ZFB.key,
                  PayWayTypes.BANKCARD.key,
                  PayWayTypes.BANKTRANSFER.key,
                  PayWayTypes.CASH.key,
                ].join(','),
              };
            },
            value => !isNumber(value) || value === 0
          ),
          width: 80,
        },
        {
          title: (() => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return PayWayTypes.WECHAT.value;
          })(),
          dataIndex: 'incomeWechat',
          render: this.genLinkWrapperRender(
            this.spMoneyRender,
            () => {
              const {
                deal: { PayWayTypes },
              } = this.props;
              return {
                payMode: PayWayTypes.WECHAT.key,
              };
            },
            value => !isNumber(value) || value === 0
          ),
          width: 80,
        },
        {
          title: (() => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return PayWayTypes.ZFB.value;
          })(),
          dataIndex: 'incomeZfb',
          render: this.genLinkWrapperRender(
            this.spMoneyRender,
            () => {
              const {
                deal: { PayWayTypes },
              } = this.props;
              return {
                payMode: PayWayTypes.ZFB.key,
              };
            },
            value => !isNumber(value) || value === 0
          ),
          width: 80,
        },
        {
          title: (() => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return PayWayTypes.BANKCARD.value;
          })(),
          dataIndex: 'incomeBankCard',
          render: this.genLinkWrapperRender(
            this.spMoneyRender,
            () => {
              const {
                deal: { PayWayTypes },
              } = this.props;
              return {
                payMode: PayWayTypes.BANKCARD.key,
              };
            },
            value => !isNumber(value) || value === 0
          ),
          width: 90,
        },
        {
          title: (() => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return PayWayTypes.BANKTRANSFER.value;
          })(),
          dataIndex: 'incomeBankTransfer',
          render: this.genLinkWrapperRender(
            this.spMoneyRender,
            () => {
              const {
                deal: { PayWayTypes },
              } = this.props;
              return {
                payMode: PayWayTypes.BANKTRANSFER.key,
              };
            },
            value => !isNumber(value) || value === 0
          ),
          width: 90,
        },
        {
          title: (() => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return PayWayTypes.CASH.value;
          })(),
          dataIndex: 'incomeCash',
          render: this.genLinkWrapperRender(
            this.spMoneyRender,
            () => {
              const {
                deal: { PayWayTypes },
              } = this.props;
              return {
                payMode: PayWayTypes.CASH.key,
              };
            },
            value => !isNumber(value) || value === 0
          ),
          width: 80,
        },
        // {
        //   title: '账户消费金额',
        //   dataIndex: 'incomeAccount',
        //   render: this.spMoneyRender,
        // },
      ],
    },
    {
      title: '账户/预存',
      children: [
        {
          title: '账户金额',
          dataIndex: 'incomeAccount',
          render: this.genLinkWrapperRender(
            this.spMoneyRender,
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
          width: 90,
        },
        {
          title: '服务储值金额',
          dataIndex: 'incomeServiceAccount',
          render: this.genLinkWrapperRender(
            this.spMoneyRender,
            () => {
              const {
                deal: { PayWayTypes },
              } = this.props;
              return {
                payMode: PayWayTypes.PUBSERVICE.key,
              };
            },
            value => !isNumber(value) || value === 0
          ),
          width: 110,
        },
        {
          title: '服务计费金额',
          dataIndex: 'incomeAnalysisCalcPrice',
          render: this.genLinkWrapperRender(
            this.spMoneyRender,
            () => {
              const {
                deal: { PayWayTypes },
              } = this.props;
              return {
                payMode: PayWayTypes.PUBSERVICE.key,
              };
            },
            value => !isNumber(value) || value === 0
          ),
          width: 110,
        },
        {
          title: '服务抵扣金额',
          dataIndex: 'incomeServiceAccountDiscount',
          render: this.genLinkWrapperRender(
            this.spMoneyRender,
            () => {
              const {
                deal: { PayWayTypes },
              } = this.props;
              return {
                payMode: PayWayTypes.PUBSERVICE.key,
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
          dataIndex: 'incomeCreditCash',
          render: this.genLinkWrapperRender(
            this.spMoneyRender,
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
          width: 80,
        },
      ],
    },
    {
      title: (
        <>
          取消订单退回&nbsp;
          <Tooltip key="icon" title="属于特殊退款的类型，退回的金额将充值到会员账户余额中">
            <Icon type="info-circle" theme="twoTone" />
          </Tooltip>
        </>
      ),
      children: [
        {
          title: '小计',
          dataIndex: 'toAccountTotal',
          render: this.spMoneyRender,
          width: 80,
        },
        {
          title: '微信退回账户',
          dataIndex: 'wechatToAccount',
          render: this.spMoneyRender,
          width: 110,
        },
        {
          title: '支付宝退回账户',
          dataIndex: 'zfbToAccount',
          render: this.spMoneyRender,
          width: 120,
        },
      ],
    },
    {
      title: '账户提现/服务折现',
      children: [
        {
          title: '小计',
          dataIndex: 'withdrawTotal',
          render: this.spMoneyRender,
          width: 80,
        },
        {
          title: (() => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return PayWayTypes.CASH.value;
          })(),
          dataIndex: 'withdrawCash',
          render: this.spMoneyRender,
          width: 80,
        },
        {
          title: (() => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return PayWayTypes.BANKTRANSFER.value;
          })(),
          dataIndex: 'withdrawBank',
          render: this.spMoneyRender,
          width: 90,
        },
        {
          title: (() => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return PayWayTypes.WECHAT.value;
          })(),
          dataIndex: 'withdrawWechat',
          render: this.spMoneyRender,
          width: 80,
        },
        {
          title: (() => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return PayWayTypes.ZFB.value;
          })(),
          dataIndex: 'withdrawZfb',
          render: this.spMoneyRender,
          width: 80,
        },
      ],
    },
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
          // initialValue: 2,
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
        label: '操作终端',
        name: 'srvType',
        options: (() => {
          const {
            deal: { SrvTypes },
          } = this.props;
          return modelMapToOption(SrvTypes);
        })(),
        type: ItemTypes.Select,
      },
    ],
  };

  operation = {
    export: {
      ignoreSum: true,
    },
    buttons: [
      {
        auth: 'export-paymode',
        btnType: ButtonTypes.Export,
      },
    ],
  };

  handleToDetail = (record, query) => {
    const {
      dispatch,
      analysis: { ActionTypes },
    } = this.props;
    const { formData, tabKey } = this.state;
    const { salesIds, analysisStartDate, analysisEndDate } = formData || {};
    const { incomeType, salesId } = record;

    const finalQuery = {
      salesIds: salesId >= 0 ? salesId : (salesIds || []).join(','),
      operationActions: incomeType === ActionTypes.DEAL_SUMMARY.key ? null : incomeType,
      ...query,
    };

    const startDate = analysisStartDate;
    const endDate = analysisEndDate ? moment(analysisEndDate).subtract(1, 'days').valueOf() : undefined;
    if (tabKey === 'financeFlow') {
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

    dispatch(
      push({
        pathname: '../detail',
        search: stringify(finalQuery),
      })
    );
  };

  dataSourceRender = dataList => {
    return (dataList || []).reduce((prev, current, i, list) => {
      const tempList = [...prev, this.buildRow(current, 0), this.buildRow(current, 1), this.buildRow(current, 2)];
      return [
        ...tempList,
        ...(i < list.length - 1 && tempList.length > 0
          ? [
              {
                id: i,
                _sp: true,
              },
            ]
          : []),
      ];
    }, []);
  };

  buildRow = (item, i) => {
    const { analysisFinanceSummaryList, ...other } = item;
    return {
      id: `${i}-${other.salesId}`,
      ...other,
      ...(analysisFinanceSummaryList || {})[i],
    };
  };

  handleLoadData = (list, result) => {
    this.setState({
      totalSummaryList: (result[result.length - 1] || {}).analysisFinanceSummaryList || [],
    });
  };

  onTableLoadingStateChange = loading => {
    this.setState({
      loading,
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
        if (this.formSearch.externalUsed) {
          const { formData } = this.state;
          table.handleFormSearch(formData);
        }
      }
    );
  };

  render() {
    const { tabKey, loading, totalSummaryList } = this.state;
    return (
      <>
        <MarginBar bottom={this.topColResponsiveProps.style.marginBottom}>
          <Card bordered={false}>
            <SearchForm config={this.formSearch} tableLoading={loading} />
          </Card>
        </MarginBar>

        <Card bordered={false}>
          <Tabs defaultActiveKey={tabKey} activeKey={tabKey} onChange={this.onTabChange}>
            <TabPane tab="现金流水" key="financeFlow">
              <Row gutter={16}>
                <Col {...this.topColResponsiveProps}>
                  <ChartCard
                    bordered={false}
                    avatar={<ChartCardAvatarIcon type="stat-collection" />}
                    title="收款(合计)"
                    loading={loading}
                    total={formatMoney((totalSummaryList[0] || {}).incomeTotal)}
                    footer={<Field label="订单数量" value={(totalSummaryList[0] || {}).incomeDealNum || 0} />}
                    // contentHeight={46}
                  >
                    {/*  */}
                  </ChartCard>
                </Col>
                <Col {...this.topColResponsiveProps}>
                  <ChartCard
                    bordered={false}
                    avatar={<ChartCardAvatarIcon type="stat-refund" />}
                    title="退款(合计)"
                    loading={loading}
                    total={formatMoney((totalSummaryList[1] || {}).incomeTotal)}
                    footer={<Field label="订单数量" value={(totalSummaryList[1] || {}).incomeDealNum || 0} />}
                    // contentHeight={46}
                  >
                    {/*  */}
                  </ChartCard>
                </Col>
                <Col {...this.topColResponsiveProps}>
                  <ChartCard
                    bordered={false}
                    avatar={<ChartCardAvatarIcon type="stat-payment" />}
                    title="实际收款(合计)"
                    loading={loading}
                    total={formatMoney((totalSummaryList[2] || {}).incomeTotal)}
                    footer={<Field label="订单数量" value={(totalSummaryList[2] || {}).incomeDealNum || 0} />}
                    // contentHeight={46}
                  >
                    {/*  */}
                  </ChartCard>
                </Col>
              </Row>

              <Datatable
                pagination={false}
                bodyScroll={false}
                url="/analysis/finance/incomeSummary.do"
                dataSourceRender={this.dataSourceRender}
                columns={[...this.columns.slice(0, 4), ...this.columns.slice(5)]}
                rowSpanByValue={record => record.salesId}
                rowKey="id"
                formSearch={this.formSearch}
                operation={this.operation}
                onLoadData={this.handleLoadData}
                onTableLoadingStateChange={this.onTableLoadingStateChange}
                onInit={this.handleTableInit}
                scroll={{ x: 1400 }}
              />
            </TabPane>
            <TabPane tab="消费收入" key="consume">
              <Datatable
                pagination={false}
                bodyScroll={false}
                url="/analysis/finance/consumeSummary.do"
                dataSourceRender={this.dataSourceRender}
                columns={this.columns.slice(0, -2)}
                rowSpanByValue={record => record.salesId}
                rowKey="id"
                formSearch={this.formSearch}
                operation={this.operation}
                // onLoadData={this.handleLoadData}
                onTableLoadingStateChange={this.onTableLoadingStateChange}
                onInit={this.handleTableInit}
                scroll={{ x: 1400 }}
              />
            </TabPane>
          </Tabs>
        </Card>
      </>
    );
  }
}

export default AnalysisFinanceSummaryPayMode;

const ChartCardAvatarIcon = props => <IconFont {...props} style={{ fontSize: 48 }} />;
