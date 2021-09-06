import { Component } from 'react';
import { Card, Button } from 'antd';
import { stringify } from 'qs';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import classNames from 'classnames';
import moment from 'moment';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import { formatMoney, formatColorWrapper, formatHM, decodeMoney, formatDate, formatModel } from '@/utils/format';
import MarginBar from '@/components/MarginBar';
import { getPageQuery, isNumber, modelMapToOption } from '@/utils/utils';
import MemoTimeline from './MemoTimeline';

@connect(({ venue, deal, pubticket, analysis }) => ({
  venue,
  deal,
  pubticket,
  analysis,
}))
class AnalysisBusinessSummaryTicket extends Component {
  state = {
    chartData: undefined,
    dataList: undefined,
    formData: undefined,
    tableLoading: false,
    chartType: 1,
    chartsHidden: false,
  };

  /**
   * 生成不同链接效果的 render
   */
  // eslint-disable-next-line react/sort-comp
  genLinkWrapperRender =
    (render = value => value, genQuery = () => {}, isIgnore = () => false, pathname = '../detail/ticket') =>
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
    '/basic/deal/ticket'
  );

  columns = [
    {
      title: '活动票务信息',
      children: [
        {
          title: '票务名称',
          dataIndex: 'ticketName',
          render: this.genLinkWrapperRender(
            value => value,
            (value, record) => {
              const { salesId, ticketId } = record;
              return {
                salesIds: salesId,
                ticketId,
              };
            }
          ),
          width: 200,
        },
        {
          title: '排期编号',
          dataIndex: 'scheduleId',
          width: 80,
        },
        {
          title: '排期明细编号',
          dataIndex: 'scheduleDetailId',
          // render: this.genLinkWrapperRender(
          //   value => value,
          //   (value, record) => {
          //     const { salesId, professionalId, platformId } = record;
          //     return {
          //       salesIds: salesId, // key是多个
          //       professionalId, // 单个
          //       platformId, // 单个
          //     };
          //   }
          // ),
          width: 110,
        },
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
          width: 140,
        },
        {
          title: '场地名称',
          dataIndex: 'platformName',
          render: this.genLinkWrapperRender(
            value => value,
            (value, record) => {
              const { salesId, ticketId, platformId } = record;
              return {
                salesIds: salesId,
                ticketId,
                platformId,
              };
            }
          ),
          width: 150,
        },
        {
          title: '演出日期',
          dataIndex: 'orderDate',
          render: (value, { calendarType }) => {
            const {
              pubticket: { CalendarTypes },
            } = this.props;
            if (calendarType === CalendarTypes.VALIDITYSCHEDULE.key) {
              return null;
            }
            return formatDate(value);
          },
          width: 130,
        },
        {
          title: '开始时间',
          dataIndex: 'startTime',
          render: (value, { calendarType }) => {
            const {
              pubticket: { CalendarTypes },
            } = this.props;
            if (calendarType === CalendarTypes.VALIDITYSCHEDULE.key) {
              return null;
            }
            return formatHM(value);
          },
          width: 80,
        },
        {
          title: '排期日程类型',
          dataIndex: 'calendarType',
          render: value => {
            const {
              pubticket: { CalendarTypes },
            } = this.props;
            return formatModel(CalendarTypes, value);
          },
          width: 110,
        },
        {
          title: '有效期(始)',
          dataIndex: 'fromDate',
          render: (value, { calendarType }) => {
            const {
              pubticket: { CalendarTypes },
            } = this.props;
            if (calendarType === CalendarTypes.FIXEDSCHEDULE.key) {
              return null;
            }
            return formatDate(value);
          },
          width: 130,
        },
        {
          title: '有效期(止)',
          dataIndex: 'toDate',
          render: (value, { calendarType }) => {
            const {
              pubticket: { CalendarTypes },
            } = this.props;
            if (calendarType === CalendarTypes.FIXEDSCHEDULE.key) {
              return null;
            }
            return formatDate(value);
          },
          width: 130,
        },
        // {
        //   title: '结束时间',
        //   dataIndex: 'endTime',
        //   render: formatHM,
        //   width: 80,
        // },
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
              const { salesId, ticketId, platformId } = record;
              const {
                analysis: { ActionTypes },
              } = this.props;
              return {
                salesIds: salesId, // key是多个
                ticketId, // 单个
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
              const { salesId, ticketId, platformId } = record;
              const {
                analysis: { ActionTypes },
              } = this.props;
              return {
                salesIds: salesId, // key是多个
                ticketId, // 单个
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
  ];

  formSearch = {
    getContainer: () => this.formNode,
    onSearch: formData => {
      this.setState({
        formData,
      });
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
        label: '票务名称',
        name: 'ticketName',
      },
      {
        label: '排期编号',
        name: 'scheduleId',
      },
      {
        label: '排期明细编号',
        name: 'scheduleDetailId',
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
    const dataList = analysisTimeSpinnerDealVOList || [];
    this.setState(
      () => ({
        dataList,
      }),
      () => {
        this.handleChartTypeSwitch(true);
      }
    );
  };

  handleChartTypeSwitch = inited => {
    if (this.isUnmounted) {
      return;
    }
    const { dataList, chartType } = this.state;
    let newChartType;
    if (inited) {
      newChartType = chartType;
    } else {
      newChartType = chartType === 1 ? 2 : 1;
    }
    this.setState({
      chartType: newChartType,
      // analysisSportPlatformDealSummaryList 的数量 是一整天拆分的时间间隔数量，如果是24个则表示每个一小时
      chartData: dataList.map(({ dealNum, checkoutTransactionPrice, timeSpinner }) => ({
        x: timeSpinner,
        // y1: chartType === 1 ? checkoutTransactionPrice : dealNum,
        y1: newChartType === 1 ? decodeMoney(checkoutTransactionPrice) : dealNum,
        // y1: Math.ceil(Math.random() * 9),
      })),
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
    const { chartData, chartType, tableLoading, chartsHidden } = this.state;
    return (
      <>
        <MarginBar bottom>
          <Card bordered={false}>
            <div
              ref={node => {
                this.formNode = node;
              }}
            />
          </Card>
        </MarginBar>
        <MarginBar bottom>
          <Card bordered={false}>
            <Datatable
              url="/analysis/exerciseTicket/summary.do"
              pagination={false}
              bodyScroll={false}
              dataSourceRender={this.dataSourceRender}
              columns={this.columns}
              rowKey="scheduleDetailId"
              formSearch={this.formSearch}
              operation={this.operation}
              onLoadData={this.handleLoadData}
              onTableLoadingStateChange={this.onTableLoadingStateChange}
            />
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

export default AnalysisBusinessSummaryTicket;
