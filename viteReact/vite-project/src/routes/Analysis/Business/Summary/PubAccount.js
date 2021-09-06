import { Component } from 'react';
import { Card, Button } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import moment from 'moment';
import { stringify } from 'qs';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import { formatMoney, formatColorWrapper, decodeMoney } from '@/utils/format';
import { div } from '@/commons/lib/math';
import MarginBar from '@/components/MarginBar';
import { getPageQuery, modelMapToOption } from '@/utils/utils';
import MemoTimeline from './MemoTimeline';

@connect(({ venue, deal, pubaccount, analysis }) => ({
  venue,
  deal,
  pubaccount,
  analysis,
}))
class AnalysisBusinessSummaryPubAccount extends Component {
  state = {
    chartData: undefined,
    dataList: undefined,
    tableLoading: false,
    chartType: 1,
    chartsHidden: false,

    formData: undefined,
  };

  // eslint-disable-next-line react/sort-comp
  moneyRender = value => formatColorWrapper(formatMoney)(value);

  columns = [
    {
      title: '营销中心',
      dataIndex: 'salesName',
      render: (value, { salesId }) => {
        if (salesId) {
          const { formData } = this.state;
          return (
            <Link
              to={`../detail/pubaccount?${stringify({
                ...formData,
                salesIds: salesId,
              })}`}
            >
              {value}
            </Link>
          );
        }
        return value;
      },
      width: 200,
    },
    {
      title: '充值金额',
      dataIndex: 'rechargeMoney',
      render: this.moneyRender,
      width: 150,
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.CASH.value;
      })(),
      dataIndex: 'payCash',
      render: this.moneyRender,
      width: 150,
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.BANKCARD.value;
      })(),
      dataIndex: 'payBankCard',
      render: this.moneyRender,
      width: 150,
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.BANKTRANSFER.value;
      })(),
      dataIndex: 'payBankTransfer',
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
    onSearch: formData => {
      this.setState({
        formData,
      });
    },
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
        auth: 'export-pubaccount',
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
      chartData: dataList.map(
        (
          { dealNum, payBankCard, payBankTransfer, payCash, payWechat, payZfb, timeSpinner } //  rechargeMoney,
        ) =>
          newChartType === 1
            ? {
                x: timeSpinner,
                // y1: chartType === 1 ? checkoutTransactionPrice : dealNum,
                y1: decodeMoney(payWechat),
                y2: decodeMoney(payZfb),
                y3: decodeMoney(payBankCard),
                y4: decodeMoney(payBankTransfer),
                y5: decodeMoney(payCash),
                // y1: Math.ceil(Math.random() * 9),
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
              url="/analysis/publicAccount/summary.do"
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
                    y3: '银行卡刷卡',
                    y4: '银行卡转账',
                    y5: '现金',
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

export default AnalysisBusinessSummaryPubAccount;
