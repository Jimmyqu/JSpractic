import { Component } from 'react';
import { stringify } from 'qs';
import { Card, Tabs, Tooltip, Icon } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import SearchForm from '@/components/Datatable/SearchForm';
import MarginBar from '@/components/MarginBar';
import { formatColorWrapper, formatMoney } from '@/utils/format';
import { modelMapToOption } from '@/utils/utils';

const { TabPane } = Tabs;

@connect(({ venue, deal, analysis }) => ({
  venue,
  deal,
  analysis,
}))
class AnalysisBusinessIncomePlatform extends Component {
  state = {
    loading: false,
    tabKey: 'financeFlow',

    formData: undefined,

    tableMapping: {}, // {tabKey: {table,formData}}
  };

  // eslint-disable-next-line react/sort-comp
  spRender = (value, { _sp }) => (_sp ? <span>&nbsp;</span> : value);

  spMoneyRender = (value, { _sp }) => (_sp ? <span>&nbsp;</span> : formatColorWrapper(formatMoney)(value));

  /**
   * 生成不同链接效果的money render
   */
  genMoneyLinkRender = (salesIds, payMode, actions) => {
    return (...args) => {
      const [value, record] = args;
      const { _sp } = record;
      if (_sp) {
        return this.spRender(...args);
      }
      const v = this.spMoneyRender(...args);
      if (value <= 0) {
        return v;
      }
      return (
        <span className="link" onClick={() => this.handleToDetail(record, salesIds, payMode, actions)}>
          {v}
        </span>
      );
    };
  };

  columns = [
    {
      title: '营销中心',
      dataIndex: 'salesName',
      width: 130,
    },
    {
      title: '日期',
      dataIndex: 'analysisDate',
      width: 110,
    },
    {
      title: '营销中心合计',
      dataIndex: 'salesTotal',
      noRowSpan: true,
      render: (value, recode, rowIndex) => {
        const { salesId } = recode;
        return this.genMoneyLinkRender(salesId > 0 ? [salesId] : undefined)(value, recode, rowIndex);
      },
      width: 110,
    },
    {
      title: '现金流',
      children: [
        {
          title: '小计',
          dataIndex: 'incomeTotal',
          render: (value, recode, rowIndex) => {
            const { salesId } = recode;
            return this.genMoneyLinkRender(salesId > 0 ? [salesId] : undefined)(value, recode, rowIndex);
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
          dataIndex: 'incomeWechat',
          render: (value, recode, rowIndex) => {
            const { salesId } = recode;
            const {
              deal: { PayWayTypes },
            } = this.props;
            return this.genMoneyLinkRender(salesId > 0 ? [salesId] : undefined, PayWayTypes.WECHAT.key)(
              value,
              recode,
              rowIndex
            );
          },
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
          render: (value, recode, rowIndex) => {
            const { salesId } = recode;
            const {
              deal: { PayWayTypes },
            } = this.props;
            return this.genMoneyLinkRender(salesId > 0 ? [salesId] : undefined, PayWayTypes.ZFB.key)(
              value,
              recode,
              rowIndex
            );
          },
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
          render: (value, recode, rowIndex) => {
            const { salesId } = recode;
            const {
              deal: { PayWayTypes },
            } = this.props;
            return this.genMoneyLinkRender(salesId > 0 ? [salesId] : undefined, PayWayTypes.BANKCARD.key)(
              value,
              recode,
              rowIndex
            );
          },
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
          render: (value, recode, rowIndex) => {
            const { salesId } = recode;
            const {
              deal: { PayWayTypes },
            } = this.props;
            return this.genMoneyLinkRender(salesId > 0 ? [salesId] : undefined, PayWayTypes.BANKTRANSFER.key)(
              value,
              recode,
              rowIndex
            );
          },
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
          render: (value, recode, rowIndex) => {
            const { salesId } = recode;
            const {
              deal: { PayWayTypes },
            } = this.props;
            return this.genMoneyLinkRender(salesId > 0 ? [salesId] : undefined, PayWayTypes.CASH.key)(
              value,
              recode,
              rowIndex
            );
          },
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
          render: (value, recode, rowIndex) => {
            const { salesId } = recode;
            const {
              deal: { PayWayTypes },
            } = this.props;
            return this.genMoneyLinkRender(salesId > 0 ? [salesId] : undefined, PayWayTypes.ACCOUNT.key)(
              value,
              recode,
              rowIndex
            );
          },
          width: 90,
        },
        {
          title: '服务储值金额',
          dataIndex: 'incomeServiceAccount',
          render: this.spMoneyRender,
          width: 110,
        },
        {
          title: '服务计费金额',
          dataIndex: 'incomeAnalysisCalcPrice',
          render: this.spMoneyRender,
          width: 110,
        },
        {
          title: '服务抵扣金额',
          dataIndex: 'incomeServiceAccountDiscount',
          render: (value, recode, rowIndex) => {
            const { salesId } = recode;
            const {
              deal: { PayWayTypes },
            } = this.props;
            return this.genMoneyLinkRender(salesId > 0 ? [salesId] : undefined, PayWayTypes.PUBSERVICE.key)(
              value,
              recode,
              rowIndex
            );
          },
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
          render: (value, recode, rowIndex) => {
            const { salesId } = recode;
            const {
              deal: { PayWayTypes },
            } = this.props;
            return this.genMoneyLinkRender(salesId > 0 ? [salesId] : undefined, PayWayTypes.CREDIT.key)(
              value,
              recode,
              rowIndex
            );
          },
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
          render: (value, recode, rowIndex) => {
            const { salesId } = recode;
            const {
              deal: { PayWayTypes },
            } = this.props;
            return this.genMoneyLinkRender(salesId > 0 ? [salesId] : undefined, PayWayTypes.WECHAT_TO_ACCOUNT.key)(
              value,
              recode,
              rowIndex
            );
          },
          width: 110,
        },
        {
          title: '支付宝退回账户',
          dataIndex: 'zfbToAccount',
          render: (value, recode, rowIndex) => {
            const { salesId } = recode;
            const {
              deal: { PayWayTypes },
            } = this.props;
            return this.genMoneyLinkRender(salesId > 0 ? [salesId] : undefined, PayWayTypes.ZFB_TO_ACCOUNT.key)(
              value,
              recode,
              rowIndex
            );
          },
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
          render: (value, recode, rowIndex) => {
            const { salesId } = recode;
            const {
              analysis: { ActionTypes },
            } = this.props;
            return this.genMoneyLinkRender(salesId > 0 ? [salesId] : undefined, null, [
              ActionTypes.PUBACCOUNT_WITHDRAW.key,
              ActionTypes.PUBSERVICEACCOUNT_WITHDRAW.key,
            ])(value, recode, rowIndex);
          },
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
          render: (value, recode, rowIndex) => {
            const { salesId } = recode;
            const {
              deal: { PayWayTypes },
              analysis: { ActionTypes },
            } = this.props;
            return this.genMoneyLinkRender(salesId > 0 ? [salesId] : undefined, PayWayTypes.CASH.key, [
              ActionTypes.PUBACCOUNT_WITHDRAW.key,
              ActionTypes.PUBSERVICEACCOUNT_WITHDRAW.key,
            ])(value, recode, rowIndex);
          },
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
          render: (value, recode, rowIndex) => {
            const { salesId } = recode;
            const {
              deal: { PayWayTypes },
              analysis: { ActionTypes },
            } = this.props;
            return this.genMoneyLinkRender(salesId > 0 ? [salesId] : undefined, PayWayTypes.BANKTRANSFER.key, [
              ActionTypes.PUBACCOUNT_WITHDRAW.key,
              ActionTypes.PUBSERVICEACCOUNT_WITHDRAW.key,
            ])(value, recode, rowIndex);
          },
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
          render: (value, recode, rowIndex) => {
            const { salesId } = recode;
            const {
              deal: { PayWayTypes },
              analysis: { ActionTypes },
            } = this.props;
            return this.genMoneyLinkRender(salesId > 0 ? [salesId] : undefined, PayWayTypes.WECHAT.key, [
              ActionTypes.PUBACCOUNT_WITHDRAW.key,
              ActionTypes.PUBSERVICEACCOUNT_WITHDRAW.key,
            ])(value, recode, rowIndex);
          },
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
          render: (value, recode, rowIndex) => {
            const { salesId } = recode;
            const {
              deal: { PayWayTypes },
              analysis: { ActionTypes },
            } = this.props;
            return this.genMoneyLinkRender(salesId > 0 ? [salesId] : undefined, PayWayTypes.ZFB.key, [
              ActionTypes.PUBACCOUNT_WITHDRAW.key,
              ActionTypes.PUBSERVICEACCOUNT_WITHDRAW.key,
            ])(value, recode, rowIndex);
          },
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
        label: '类型显示',
        name: 'displayType',
        options: (() => {
          const {
            analysis: { DisplayTypes },
          } = this.props;
          return modelMapToOption(DisplayTypes);
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
        auth: 'export1',
        btnType: ButtonTypes.Export,
      },
    ],
  };

  handleToDetail = (record, salesIds, payMode, actions) => {
    const { dispatch } = this.props;
    const { tabKey, formData } = this.state;
    const { displayType, analysisStartDate, analysisEndDate } = formData || {};
    const { startDate: sd, endDate: ed } = record;

    const toBiz = payMode == null && actions == null;

    // 数据没有时间则表示合计，使用表单查询时间
    const useFormDate = sd == null && ed == null;

    const startDate = useFormDate ? analysisStartDate : sd;
    // 结束日期在查询表单时都加了一天
    let endDate;
    if (useFormDate) {
      endDate = analysisEndDate ? moment(analysisEndDate).subtract(1, 'days').valueOf() : undefined;
    } else {
      endDate = ed;
    }

    const sIds = (salesIds || formData.salesIds).join(',');
    const consume = tabKey === 'consume';

    dispatch(
      push(
        toBiz
          ? {
              pathname: './biz',
              search: stringify({
                queryType: consume ? 1 : 0,
                displayType,
                salesIds: sIds,
                analysisStartDate: startDate,
                analysisEndDate: endDate,
              }),
            }
          : {
              pathname: '/analysis/finance/detail',
              search: stringify({
                payMode,
                operationActions: (actions || []).join(','),
                salesIds: sIds,
                ...(consume
                  ? {
                      consumeStartDate: startDate,
                      consumeEndDate: endDate,
                    }
                  : {
                      analysisStartDate: startDate,
                      analysisEndDate: endDate,
                    }),
              }),
            }
      )
    );
  };

  dataSourceRender = dataList => {
    return (dataList || []).reduce((prev, current, i, list) => {
      const { analysisItemDataSummaryList } = current;
      const tempList = [...prev, ...(analysisItemDataSummaryList || []).map((_, j) => this.buildRow(current, j))];
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
    const { analysisItemDataSummaryList, ...other } = item;
    return {
      id: `${i}-${other.salesId}`,
      ...other,
      ...(analysisItemDataSummaryList || [])[i],
    };
  };

  handleLoadData = (list, result) => {
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
    const { tabKey, loading } = this.state;

    return (
      <>
        <MarginBar bottom={12}>
          <Card bordered={false}>
            <SearchForm config={this.formSearch} tableLoading={loading} />
          </Card>
        </MarginBar>

        <Card bordered={false}>
          <Tabs defaultActiveKey={tabKey} activeKey={tabKey} onChange={this.onTabChange}>
            <TabPane tab="现金流水" key="financeFlow">
              <Datatable
                tableId="financeFlow"
                pagination={false}
                url="/analysis/incomeSummary/salesIncomeSummary.do?queryType=0"
                dataSourceRender={this.dataSourceRender}
                columns={[...this.columns.slice(0, 4), ...this.columns.slice(5)]}
                rowKey="id"
                rowSpanByValue={record => record.salesId}
                formSearch={this.formSearch}
                operation={this.operation}
                onLoadData={this.handleLoadData}
                onTableLoadingStateChange={this.onTableLoadingStateChange}
                onInit={this.handleTableInit}
              />
            </TabPane>
            <TabPane tab="消费收入" key="consume">
              <Datatable
                tableId="consume"
                pagination={false}
                url="/analysis/incomeSummary/salesIncomeSummary.do?queryType=1"
                dataSourceRender={this.dataSourceRender}
                columns={this.columns.slice(0, -2)}
                rowKey="id"
                rowSpanByValue={record => record.salesId}
                formSearch={this.formSearch}
                operation={this.operation}
                onLoadData={this.handleLoadData}
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

export default AnalysisBusinessIncomePlatform;
