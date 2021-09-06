import { Component } from 'react';
import { stringify } from 'qs';
import { Card, Button, Tabs } from 'antd';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import classNames from 'classnames';
import moment from 'moment';
import Datatable, { ButtonTypes, ItemTypes, SearchForm } from '@/components/Datatable';
import { formatMoney, formatColorWrapper, decodeMoney, formatModel } from '@/utils/format';
import MarginBar from '@/components/MarginBar';
import { getPageQuery, isNumber, modelMapToOption } from '@/utils/utils';

import MemoTimeline from './MemoTimeline';

@connect(({ venue, deal, pubcourse, analysis }) => ({
  venue,
  deal,
  pubcourse,
  analysis,
}))
class AnalysisBusinessSummaryCourse extends Component {
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
    (render = value => value, genQuery = () => {}, isIgnore = () => false, pathname = '../detail/course') =>
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

  columns = [
    {
      title: '营销中心',
      dataIndex: 'salesName',
      width: 150,
    },
    {
      title: '课程类型',
      dataIndex: 'courseType',
      render: value => {
        const {
          pubcourse: { CourseTypes },
        } = this.props;
        return formatModel(CourseTypes, value);
      },
      width: 110,
    },
    {
      title: '项目类型',
      dataIndex: 'professionalId',
      render: value => {
        const {
          venue: { ProfessionTypes },
        } = this.props;
        return formatModel(ProfessionTypes, value);
      },
      width: 80,
    },
    {
      title: '课程编号',
      dataIndex: 'courseId',
      width: 80,
    },
    {
      title: '课程名称',
      dataIndex: 'courseName',
      render: this.genLinkWrapperRender(
        value => value,
        (value, record) => {
          const { salesId, courseId } = record;
          return {
            salesIds: salesId,
            courseId,
          };
        }
      ),
      width: 200,
    },
    // {
    //   title: '课程开始时间',
    //   dataIndex: 'courseStartTime',
    //   render: formatDateTime,
    //   width: 190,
    // },
    // {
    //   title: '课程结束时间',
    //   dataIndex: 'courseEndTime',
    //   render: formatDateTime,
    //   width: 190,
    // },
    {
      title: '课程单价',
      dataIndex: 'unitPrice',
      render: this.moneyRender,
      width: 90,
    },
    {
      title: '已预约人数',
      dataIndex: 'bookingNum',
      render: this.numRender,
      width: 130,
    },
    {
      title: '已结算人数',
      dataIndex: 'checkoutStudyNum',
      render: this.numRender,
      width: 130,
    },
    {
      title: '已结算订单数',
      dataIndex: 'checkoutNum',
      render: this.genLinkWrapperRender(
        this.numRender,
        (value, record) => {
          const { salesId, courseId } = record;
          const {
            analysis: { ActionTypes },
          } = this.props;
          return {
            salesIds: salesId,
            courseId,
            type: ActionTypes.DEAL_CHECKOUT.key,
          };
        },
        value => !isNumber(value) || value === 0
      ),
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
      title: '未结算人数',
      dataIndex: 'unpaidStudyNum',
      render: this.numRender,
      width: 130,
    },
    {
      title: '未结算数',
      dataIndex: 'unpaidNum',
      render: this.genLinkWrapperRender(
        this.numRender,
        (value, record) => {
          const { salesId, courseId } = record;
          const {
            analysis: { ActionTypes },
          } = this.props;
          return {
            salesIds: salesId,
            courseId,
            type: ActionTypes.DEAL_ADD.key,
          };
        },
        value => !isNumber(value) || value === 0
      ),
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
    // {
    //   title: '库存',
    //   children: [
    //     {
    //       title: '总发售张数',
    //       dataIndex: 'abc', // FIXME 字段未知
    //       render: this.numRender,
    //       width: 110,
    //     },
    //     {
    //       title: '剩余张数',
    //       dataIndex: 'efg', // FIXME 字段未知
    //       render: this.numRender,
    //       width: 110,
    //     },
    //   ],
    // },
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
        // professionalFieldName: 'professionalIds',
        // platformFieldName: 'platformIds',
        initialValue: (() => {
          const { salesIds, orderStartDate, orderEndDate, analysisStartDate, analysisEndDate } = getPageQuery();
          if (salesIds || orderStartDate || orderEndDate || analysisStartDate || analysisEndDate) {
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
        label: '项目类型',
        name: 'professionalId',
        options: (() => {
          const {
            venue: { ProfessionTypes },
          } = this.props;
          return modelMapToOption(ProfessionTypes);
        })(),
        initialValue: (() => {
          const { professionalIds } = getPageQuery();
          if (professionalIds) {
            return +professionalIds;
          }
        })(),
        type: ItemTypes.Select,
      },
      {
        label: '课程类型',
        name: 'courseType',
        options: (() => {
          const {
            pubcourse: { CourseTypes },
          } = this.props;
          return modelMapToOption(CourseTypes);
        })(),
        type: ItemTypes.Select,
      },
      {
        label: '课程名称',
        name: 'courseName',
      },
      {
        label: '课程编号',
        name: 'courseId',
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
        defHidden: true,
      },
      // [
      //   {
      //     label: '课程日期（始）',
      //     name: 'classStartDate',
      //     placeholder: '开始时间',
      //     type: ItemTypes.DatePickerRangeStart,
      //     defHidden: true,
      //   },
      //   {
      //     label: '课程日期（止）',
      //     name: 'classEndDate',
      //     placeholder: '结束时间',
      //     type: ItemTypes.DatePickerRangeEnd,
      //     defHidden: true,
      //   },
      // ],
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
            const { salesIds, orderStartDate, orderEndDate, analysisStartDate, analysisEndDate } = getPageQuery();
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
            const { salesIds, orderStartDate, orderEndDate, analysisStartDate, analysisEndDate } = getPageQuery();
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
    ],
  };

  operation = {
    buttons: [
      {
        auth: 'export-course',
        btnType: ButtonTypes.Export,
      },
    ],
  };

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleToDetail = (record, query, pathname) => {
    const { formData } = this.state;
    const { analysisStartDate, analysisEndDate } = formData || {};

    const finalQuery = {
      ...query,
      analysisStartDate,
      analysisEndDate: analysisEndDate ? moment(analysisEndDate).subtract(1, 'days').valueOf() : undefined,
    };

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
          <Card bordered={false}>
            <Tabs defaultActiveKey={tabKey} activeKey={tabKey} onChange={this.onTabChange}>
              <Tabs.TabPane tab="现金流水" key="financeFlow">
                <Datatable
                  url="/analysis/course/summary.do?queryType=0"
                  pagination={false}
                  bodyScroll={false}
                  dataSourceRender={this.dataSourceRender}
                  columns={this.columns}
                  rowKey="courseId"
                  formSearch={this.formSearch}
                  operation={this.operation}
                  onLoadData={this.handleLoadData}
                  onTableLoadingStateChange={this.onTableLoadingStateChange}
                  onInit={this.handleTableInit}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="消费收入" key="consume">
                <Datatable
                  url="/analysis/course/summary.do?queryType=1"
                  pagination={false}
                  bodyScroll={false}
                  dataSourceRender={this.dataSourceRender}
                  columns={[
                    ...this.columns,
                    {
                      title: '已到人数',
                      dataIndex: 'arriveNum',
                      render: this.genLinkWrapperRender(
                        this.numRender,
                        (value, record) => {
                          const { salesId, courseName } = record;
                          return {
                            salesId,
                            courseName,
                          };
                        },
                        value => !isNumber(value) || value === 0,
                        '/basic/deal/course'
                      ),
                      width: 130,
                    },
                    {
                      title: '未到人数',
                      dataIndex: 'notArriveNum',
                      render: this.numRender,
                      width: 130,
                    },
                  ]}
                  rowKey="courseId"
                  formSearch={this.formSearch}
                  operation={this.operation}
                  onLoadData={this.handleLoadData}
                  onTableLoadingStateChange={this.onTableLoadingStateChange}
                  onInit={this.handleTableInit}
                />
              </Tabs.TabPane>
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

export default AnalysisBusinessSummaryCourse;
