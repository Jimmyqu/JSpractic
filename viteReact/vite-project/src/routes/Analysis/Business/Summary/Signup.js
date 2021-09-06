import { Component } from 'react';
import { stringify } from 'qs';
import { Card, Button } from 'antd';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import classNames from 'classnames';
import moment from 'moment';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import { formatMoney, formatColorWrapper, formatDateTime, decodeMoney } from '@/utils/format';
import MarginBar from '@/components/MarginBar';
import { getPageQuery, isNumber, modelMapToOption } from '@/utils/utils';
import MemoTimeline from './MemoTimeline';

@connect(({ venue, deal, pubsignup, analysis }) => ({
  venue,
  deal,
  pubsignup,
  analysis,
}))
class AnalysisBusinessSummarySignup extends Component {
  state = {
    formData: undefined,
    chartData: undefined,
    dataList: undefined,
    tableLoading: false,
    chartType: 1,
    chartsHidden: false,
  };

  /**
   * 生成不同链接效果的 render
   */
  // eslint-disable-next-line react/sort-comp
  genLinkWrapperRender =
    (render = value => value, genQuery = () => {}, isIgnore = () => false) =>
    (...args) => {
      const [, record] = args;
      const { signupId } = record;
      const v = render(...args);
      if (signupId == null || isIgnore(...args)) {
        return v;
      }
      return (
        <span className="link" onClick={() => this.handleToDetail(record, genQuery(...args))}>
          {v}
        </span>
      );
    };

  moneyRender = value => formatColorWrapper(formatMoney)(value);

  numRender = value => formatColorWrapper()(value);

  columns = [
    {
      title: '报名信息',
      children: [
        {
          title: '报名编号',
          dataIndex: 'signupId',
          render: this.genLinkWrapperRender(
            value => value,
            value => {
              return {
                signupId: value,
              };
            }
          ),
          width: 120,
        },
        {
          title: '类型',
          dataIndex: 'objectType',
          width: 80,
        },
        {
          title: '报名名称',
          dataIndex: 'objectName',
          width: 150,
        },
        {
          title: '报名方式',
          dataIndex: 'signupMode',
          width: 80,
        },
        {
          title: '报名单价',
          dataIndex: 'signupPrice',
          render: this.moneyRender,
          width: 80,
        },
        {
          title: '活动开始时间',
          dataIndex: 'objectStartDate',
          render: formatDateTime,
          width: 190,
        },
        {
          title: '活动结束时间',
          dataIndex: 'objectEndDate',
          render: formatDateTime,
          width: 190,
        },
        {
          title: '报名开始时间',
          dataIndex: 'signupStartDate',
          render: formatDateTime,
          width: 190,
        },
        {
          title: '报名截止时间',
          dataIndex: 'signupEndDate',
          render: formatDateTime,
          width: 190,
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
              const { signupId } = record;
              const {
                analysis: { ActionTypes },
              } = this.props;
              return {
                signupId,
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
          title: '未结算数',
          dataIndex: 'unpaidNum',
          render: this.genLinkWrapperRender(
            this.numRender,
            (value, record) => {
              const { signupId } = record;
              const {
                analysis: { ActionTypes },
              } = this.props;
              return {
                signupId,
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
        {
          title: '报名人数',
          dataIndex: 'signupNum',
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
        label: '类型',
        name: 'objectType',
        options: (() => {
          const {
            pubsignup: { EventTypes },
          } = this.props;
          return modelMapToOption(EventTypes);
        })(),
        type: ItemTypes.Select,
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
      {
        label: '报名名称',
        name: 'objectName',
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
    buttons: [
      {
        auth: 'export-signup',
        btnType: ButtonTypes.Export,
      },
    ],
  };

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleToDetail = (record, query) => {
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
        pathname: '../detail/signup',
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
              url="/analysis/signup/summary.do"
              pagination={false}
              bodyScroll={false}
              dataSourceRender={this.dataSourceRender}
              columns={this.columns}
              rowKey="signupId"
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

export default AnalysisBusinessSummarySignup;
