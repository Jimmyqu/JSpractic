import { Component } from 'react';
import { stringify } from 'qs';
import { Card, Button } from 'antd';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import classNames from 'classnames';
import moment from 'moment';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import { formatMoney, decodeMoney, formatColorWrapper } from '@/utils/format';
import MarginBar from '@/components/MarginBar';
import { getPageQuery, isNumber, modelMapToOption } from '@/utils/utils';
import MemoTimeline from './MemoTimeline';

@connect(({ venue, deal, analysis }) => ({
  venue,
  deal,
  analysis,
}))
class AnalysisBusinessSummaryCredit extends Component {
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
    (render = value => value, genQuery = () => {}, path, isIgnore = () => false) =>
    (...args) => {
      const [, record] = args;
      const { salesId } = record;
      const v = render(...args);
      if (salesId == null || isIgnore(...args)) {
        return v;
      }
      return (
        <span className="link" onClick={() => this.handleToDetail(record, genQuery(...args), path)}>
          {v}
        </span>
      );
    };

  moneyRender = value => formatColorWrapper(formatMoney)(value);

  columns = [
    {
      title: '营销中心',
      dataIndex: 'salesName',
      width: 200,
    },
    {
      title: '还款金额',
      dataIndex: 'repaymentMoney',
      render: this.genLinkWrapperRender(
        this.moneyRender,
        (value, record) => {
          const { salesId } = record;
          return {
            salesIds: salesId,
            payMode: undefined,
          };
        },
        '../detail/credit',
        value => !isNumber(value) || value === 0
      ),
      width: 150,
    },
    {
      title: '白条使用额度',
      dataIndex: 'useMoney',
      render: this.genLinkWrapperRender(
        this.moneyRender,
        (value, record) => {
          const { salesId } = record;
          return {
            salesIds: salesId,
          };
        },
        '/analysis/finance/detail',
        value => !isNumber(value) || value === 0
      ),
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
        auth: 'export-credit',
        btnType: ButtonTypes.Export,
      },
    ],
  };

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleToDetail = (record, query, path) => {
    const {
      deal: { PayWayTypes },
      dispatch,
    } = this.props;
    const { formData } = this.state;
    const { analysisStartDate, analysisEndDate } = formData || {};

    const finalQuery = {
      payMode: PayWayTypes.CREDIT.key,
      ...query,
      analysisStartDate,
      analysisEndDate: analysisEndDate ? moment(analysisEndDate).subtract(1, 'days').valueOf() : undefined,
    };

    dispatch(
      push({
        pathname: path,
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
      chartData: dataList.map(({ dealNum, repaymentMoney, timeSpinner }) => ({
        x: timeSpinner,
        // y1: chartType === 1 ? checkoutTransactionPrice : dealNum,
        y1: newChartType === 1 ? decodeMoney(repaymentMoney) : dealNum,
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
              url="/analysis/publicCredit/summary.do"
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
            titleMap={{ y1: chartType === 1 ? '金额(元)' : '订单数' }}
            yAxis="y1"
          />
        </Card>
      </>
    );
  }
}

export default AnalysisBusinessSummaryCredit;
