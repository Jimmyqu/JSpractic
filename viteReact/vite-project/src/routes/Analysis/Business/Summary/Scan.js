import { Component } from 'react';
import { Card, Button } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import classNames from 'classnames';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import { formatMoney, formatColorWrapper, decodeMoney } from '@/utils/format';
import { div } from '@/commons/lib/math';
import MarginBar from '@/components/MarginBar';
import { getPageQuery } from '@/utils/utils';
import MemoTimeline from './MemoTimeline';

@connect(({ venue, deal, analysis }) => ({
  venue,
  deal,
  analysis,
}))
class AnalysisBusinessSummaryScan extends Component {
  state = {
    chartData: undefined,
    dataList: undefined,
    tableLoading: false,
    chartType: 1,
    chartsHidden: false,
  };

  // eslint-disable-next-line react/sort-comp
  moneyRender = value => formatColorWrapper(formatMoney)(value);

  columns = [
    {
      title: '营销中心',
      dataIndex: 'salesName',
      width: 200,
    },
    {
      title: '扫码收款金额',
      dataIndex: 'scanCodeCheckoutMoney',
      render: this.moneyRender,
      width: 150,
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.ZFB.value;
      })(),
      dataIndex: 'payZfb',
      render: this.moneyRender,
      width: 150,
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.WECHAT.value;
      })(),
      dataIndex: 'payWechat',
      render: this.moneyRender,
      width: 150,
    },
    // {
    //   title: '现金流水金额',
    //   dataIndex: 'cashFlowAmount',
    //   render: this.moneyRender,
    //   width: 150,
    // },
    // {
    //   title: '消费收入金额',
    //   dataIndex: 'consumeFlowAmount',
    //   render: this.moneyRender,
    //   width: 150,
    // },
  ];

  formSearch = {
    getContainer: () => this.formNode,
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
    ],
  };

  operation = {
    buttons: [
      {
        auth: 'export-scan',
        btnType: ButtonTypes.Export,
      },
    ],
  };

  componentWillUnmount() {
    this.isUnmounted = true;
  }

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
      chartData: dataList.map(({ dealNum, payWechat, payZfb, timeSpinner }) =>
        newChartType === 1
          ? {
              x: timeSpinner,
              y1: decodeMoney(payWechat),
              y2: decodeMoney(payZfb),
            }
          : {
              x: timeSpinner,
              y1: dealNum,
            }
      ),
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
              url="/analysis/scanCode/summary.do"
              pagination={false}
              bodyScroll={false}
              dataSourceRender={this.dataSourceRender}
              columns={this.columns}
              rowKey="salesId"
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
            titleMap={
              chartType === 1
                ? {
                    y1: '微信',
                    y2: '支付宝',
                  }
                : { y1: '订单数' }
            }
            yAxis="y1"
          />
        </Card>
      </>
    );
  }
}

export default AnalysisBusinessSummaryScan;
