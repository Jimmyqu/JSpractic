import { Component } from 'react';
import { stringify } from 'qs';
import { Card, Button, Tabs } from 'antd';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import classNames from 'classnames';
import moment from 'moment';
import Datatable, { ButtonTypes, ItemTypes, SearchForm } from '@/components/Datatable';
import { formatMoney, formatColorWrapper, formatHM, decodeMoney, formatModel } from '@/utils/format';
import MarginBar from '@/components/MarginBar';
import { getPageQuery, isNumber, modelMapToOption } from '@/utils/utils';
import MemoTimeline from './MemoTimeline';

const { TabPane } = Tabs;

@connect(({ venue, deal, pubticket, analysis }) => ({
  venue,
  deal,
  pubticket,
  analysis,
}))
class AnalysisBusinessSummarySpTicket extends Component {
  state = {
    tabKey: ['financeFlow', 'consume'][getPageQuery().queryType || 0],
    formData: undefined,
    tableMapping: {}, // {tabKey: {table,formData, ...other}}
    tableLoading: false,

    chartType: 1,
    chartsHidden: false,
  };

  /**
   * 生成不同链接效果的 render
   */
  // eslint-disable-next-line react/sort-comp
  genLinkWrapperRender =
    (render = value => value, genQuery = () => {}, isIgnore = () => false, pathname = '../detail/spticket') =>
    (...args) => {
      const [, record] = args;
      const { salesId } = record;
      const v = render(...args);
      if (salesId == null || isIgnore(...args)) {
        return v;
      }
      return (
        <span className="link" onClick={() => this.handleToDetail(record, genQuery(...args), pathname)}>
          {v}
        </span>
      );
    };

  moneyRender = value => formatColorWrapper(formatMoney)(value);

  numRender = value => formatColorWrapper()(value);

  checkRender = this.genLinkWrapperRender(
    this.numRender,
    (value, record) => {
      const { salesId } = record;
      const {
        pubticket: { CheckStatus },
      } = this.props;
      return {
        salesId,
        checkState: CheckStatus.CHECKED.key,
      };
    },
    value => isNumber(value) && value === 0,
    '/basic/deal/spticket'
  );

  columns = [
    {
      title: '体育票务信息',
      children: [
        {
          title: '营销中心',
          dataIndex: 'salesName',
          render: this.genLinkWrapperRender(
            value => value,
            (value, record) => {
              const { salesId } = record;
              return {
                salesIds: salesId,
              };
            }
          ),
          width: 150,
        },
        {
          title: '场地类型',
          dataIndex: 'professionalId',
          render: this.genLinkWrapperRender(
            value => {
              const {
                venue: { ProfessionTypes },
              } = this.props;
              return formatModel(ProfessionTypes, value);
            },
            (value, record) => {
              const { salesId } = record;
              return {
                salesIds: salesId, // key是多个
                professionalId: value, // 单个
              };
            }
          ),
          width: 80,
        },
        {
          title: '场地',
          dataIndex: 'platformName',
          render: this.genLinkWrapperRender(
            (value, { platformParentName }) => `${platformParentName || ''}${platformParentName ? '-' : ''}${value}`,
            (value, record) => {
              const { salesId, professionalId, platformId } = record;
              return {
                salesIds: salesId, // key是多个
                professionalId, // 单个
                platformId, // 单个
              };
            }
          ),
          width: 150,
        },
        // {
        //   title: '票务日期',
        //   dataIndex: 'orderDate',
        //   render: formatDate,
        //   width: 140,
        // },
        {
          title: '开始时间',
          dataIndex: 'startTime',
          render: formatHM,
          width: 80,
        },
        {
          title: '结束时间',
          dataIndex: 'endTime',
          render: formatHM,
          width: 80,
        },
        {
          title: '票单价',
          dataIndex: 'ticketPrice',
          render: this.moneyRender,
          width: 90,
        },
      ],
    },
    {
      title: '销售',
      children: [
        {
          title: '已结算订单数',
          dataIndex: 'checkoutNum',
          render: this.genLinkWrapperRender(
            this.numRender,
            (value, record) => {
              const { salesId, professionalId, platformId } = record;
              const {
                analysis: { ActionTypes },
              } = this.props;
              return {
                salesIds: salesId, // key是多个
                professionalId, // 单个
                platformId, // 单个
                type: ActionTypes.DEAL_CHECKOUT.key,
              };
            },
            value => !isNumber(value) || value === 0
          ),
          width: 130,
        },
        {
          title: '已结算张数',
          dataIndex: 'checkoutSheetsNum',
          render: this.numRender,
          width: 130,
        },
        {
          title: '已结算原价',
          dataIndex: 'checkoutOriginalPrice',
          render: this.moneyRender,
          width: 130,
        },
        {
          title: '已结算成交价',
          dataIndex: 'checkoutTransactionPrice',
          render: this.moneyRender,
          width: 130,
        },
        // {
        //   title: '现金流水金额',
        //   dataIndex: 'cashFlowAmount',
        //   render: this.moneyRender,
        //   width: 130,
        // },
        // {
        //   title: '消费收入金额',
        //   dataIndex: 'consumeFlowAmount',
        //   render: this.moneyRender,
        //   width: 130,
        // },
        {
          title: '未结算订单数',
          dataIndex: 'unpaidNum',
          render: this.genLinkWrapperRender(
            this.numRender,
            (value, record) => {
              const { salesId, professionalId, platformId } = record;
              const {
                analysis: { ActionTypes },
              } = this.props;
              return {
                salesIds: salesId, // key是多个
                professionalId, // 单个
                platformId, // 单个
                type: ActionTypes.DEAL_ADD.key,
              };
            },
            value => !isNumber(value) || value === 0
          ),
          width: 130,
        },
        {
          title: '未结算张数',
          dataIndex: 'unpaidSheetsNum',
          render: this.numRender,
          width: 130,
        },
        {
          title: '未结算原价',
          dataIndex: 'unpaidOriginalPrice',
          render: this.moneyRender,
          width: 130,
        },
        {
          title: '未结算成交价',
          dataIndex: 'unpaidTransactionPrice',
          render: this.moneyRender,
          width: 130,
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
      [
        {
          label: '营销中心',
          placeholder: '默认全部营销中心',
          name: 'salesIds',
          mode: 'multiple',
          professionalFieldName: 'professionalIds',
          platformFieldName: 'platformIds',
          initialValue: (() => {
            const { queryType, salesIds, professionalIds, analysisStartDate, analysisEndDate } = getPageQuery();
            if (queryType || salesIds || professionalIds || analysisStartDate || analysisEndDate) {
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
        {
          label: '场地类型',
          placeholder: '默认全部场地类型',
          name: 'professionalIds',
          platformFieldName: 'platformIds',
          mode: 'multiple',
          initialValue: (() => {
            const {
              venue: { currentItem, itemList },
            } = this.props;
            const { queryType, salesIds, professionalIds, analysisStartDate, analysisEndDate } = getPageQuery();
            if (queryType || salesIds || professionalIds || analysisStartDate || analysisEndDate) {
              if (professionalIds) {
                return (professionalIds || '')
                  .split(',')
                  .filter(id => {
                    if (id) {
                      const first = itemList.find(item => item.itemId === +id);
                      return first && first.itemType === 2;
                    }
                    return false;
                  })
                  .map(id => +id);
              }
              return;
            }
            if (currentItem == null || currentItem.itemType !== 2) {
              // 第一个场地票务类型
              if (itemList == null) {
                return null;
              }
              const first = itemList.find(item => item.itemType === 2);
              return first ? [first.itemId] : undefined;
            }
            return [currentItem.itemId];
          })(),
          optionsFilter: item => item.itemType === 2,
          type: ItemTypes.CascaderProfessional,
        },
        {
          label: '场地',
          placeholder: '默认全部场地',
          name: 'platformIds',
          mode: 'multiple',
          type: ItemTypes.CascaderPlatform,
        },
      ],
      [
        {
          name: 'presetDate',
          // initialValue: 2,
          type: ItemTypes.DatePickerRangePreset,
          defHidden: true,
        },
        {
          label: '统计开始日期',
          name: 'analysisStartDate',
          initialValue: (() => {
            const { queryType, salesIds, professionalIds, analysisStartDate, analysisEndDate } = getPageQuery();
            if (queryType || salesIds || professionalIds || analysisStartDate || analysisEndDate) {
              if (analysisStartDate) {
                return moment(+analysisStartDate);
              }
              return;
            }
            return moment();
          })(),
          type: ItemTypes.DatePickerRangeStart,
          defHidden: true,
        },
        {
          label: '统计结束日期',
          name: 'analysisEndDate',
          initialValue: (() => {
            const { queryType, salesIds, professionalIds, analysisStartDate, analysisEndDate } = getPageQuery();
            if (queryType || salesIds || professionalIds || analysisStartDate || analysisEndDate) {
              if (analysisEndDate) {
                return moment(+analysisEndDate);
              }
              return;
            }
            return moment();
          })(),
          type: ItemTypes.DatePickerRangeEnd,
          defHidden: true,
        },
      ],
      [
        {
          label: '开始时间段',
          name: 'startTime',
          type: ItemTypes.TimePickerRangeStart2,
          defHidden: true,
        },
        {
          label: '结束时间段',
          name: 'endTime',
          type: ItemTypes.TimePickerRangeEnd2,
          defHidden: true,
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
        defHidden: true,
      },
    ],
  };

  operation = {
    buttons: [
      {
        auth: 'export-spticket',
        btnType: ButtonTypes.Export,
      },
    ],
  };

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleToDetail = (record, query, pathname) => {
    const { tabKey, formData } = this.state;
    const { analysisStartDate, analysisEndDate } = formData || {};

    const finalQuery = {
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
        orderStartDate: startDate,
        orderEndDate: endDate,
      });
    }
    const { dispatch } = this.props;
    dispatch(
      push({
        pathname,
        search: stringify(finalQuery),
      })
    );
  };

  dataSourceRender = data => {
    const { analysisBusinessDataSummaryList } = data || {};
    return analysisBusinessDataSummaryList;
  };

  handleLoadData = (list, result) => {
    if (this.isUnmounted) {
      return;
    }
    const { analysisTimeSpinnerDealVOList } = result || {};
    const chartDataResultList = analysisTimeSpinnerDealVOList || [];
    this.setState(
      ({ tabKey, tableMapping }) => {
        const info = tableMapping[tabKey] || {};
        return {
          tableMapping: {
            ...tableMapping,
            [tabKey]: {
              ...info,
              data: result,
              chartDataResultList,
            },
          },
        };
      },
      () => {
        this.handleChartTypeSwitch(true);
      }
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

  handleChartTypeSwitch = inited => {
    if (this.isUnmounted) {
      return;
    }
    const { tabKey, tableMapping, chartType } = this.state;
    const info = tableMapping[tabKey] || {};
    let newChartType;
    if (inited) {
      newChartType = chartType;
    } else {
      newChartType = chartType === 1 ? 2 : 1;
    }
    // analysisSportPlatformDealSummaryList 的数量 是一整天拆分的时间间隔数量，如果是24个则表示每个一小时
    const chartData = (info.chartDataResultList || []).map(({ dealNum, checkoutTransactionPrice, timeSpinner }) => ({
      x: timeSpinner,
      // y1: chartType === 1 ? checkoutTransactionPrice : dealNum,
      y1: newChartType === 1 ? decodeMoney(checkoutTransactionPrice) : dealNum,
      // y1: Math.ceil(Math.random() * 9),
    }));
    this.setState({
      chartType: newChartType,
      tableMapping: {
        ...tableMapping,
        [tabKey]: {
          ...info,
          chartData,
        },
      },
    });
  };

  onTableLoadingStateChange = loading => {
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      tableLoading: loading,
    });
  };

  handleChartVisibleChange = () => {
    if (this.isUnmounted) {
      return;
    }
    this.setState(
      ({ chartsHidden }) => ({
        chartsHidden: !chartsHidden,
      }),
      () => {
        window.dispatchEvent(new Event('resize'));
      }
    );
  };

  render() {
    const {
      venue: { currentItem },
    } = this.props;
    const { tabKey, tableMapping, chartType, tableLoading, chartsHidden } = this.state;

    const { chartData } = tableMapping[tabKey] || {};
    return (
      <>
        <MarginBar bottom={12}>
          <Card bordered={false}>
            <SearchForm config={this.formSearch} tableLoading={tableLoading} />
          </Card>
        </MarginBar>

        <MarginBar bottom>
          {/* 初始的时候currentItem会延后点，列表要求professionalIds参数必填 */}
          <Card bordered={false} loading={currentItem == null}>
            <Tabs defaultActiveKey={tabKey} activeKey={tabKey} onChange={this.onTabChange}>
              <TabPane tab="现金流水" key="financeFlow">
                <Datatable
                  tableId="financeFlow"
                  url="/analysis/sportPlatformTicket/summary.do?queryType=0"
                  pagination={false}
                  bodyScroll={false}
                  dataSourceRender={this.dataSourceRender}
                  columns={this.columns}
                  rowKey="platformId"
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
                  url="/analysis/sportPlatformTicket/summary.do?queryType=1"
                  pagination={false}
                  bodyScroll={false}
                  dataSourceRender={this.dataSourceRender}
                  columns={[
                    ...this.columns,
                    {
                      title: '核验',
                      children: [
                        {
                          title: '已核验张数',
                          dataIndex: 'checkNum',
                          render: this.checkRender,
                          width: 130,
                        },
                        {
                          title: '未核验张数',
                          dataIndex: 'unprovenNum',
                          render: this.numRender,
                          width: 130,
                        },
                      ],
                    },
                  ]}
                  rowKey="platformId"
                  formSearch={this.formSearch}
                  operation={this.operation}
                  onLoadData={this.handleLoadData}
                  onTableLoadingStateChange={this.onTableLoadingStateChange}
                  onInit={this.handleTableInit}
                />
              </TabPane>
            </Tabs>
          </Card>
        </MarginBar>

        <Card
          title="交易订单趋势图"
          bordered={false}
          loading={tableLoading}
          extra={
            <>
              {!chartsHidden && (
                <Button onClick={() => this.handleChartTypeSwitch()}>
                  查看订单{chartType === 1 ? '数' : '金额'}趋势图
                </Button>
              )}
              <MarginBar left inline>
                <Button onClick={this.handleChartVisibleChange}>{chartsHidden ? '显示' : '收起'}趋势图</Button>
              </MarginBar>
            </>
          }
        >
          <MemoTimeline
            className={classNames({
              hidden: chartsHidden,
            })}
            height={300}
            data={chartData}
            titleMap={{ y1: chartType === 1 ? '金额(元)' : '订单数' }}
            yAxis="y1"
          />
        </Card>
      </>
    );
  }
}

export default AnalysisBusinessSummarySpTicket;
