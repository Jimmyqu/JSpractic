import { Component } from 'react';
import { stringify } from 'qs';
import { Card } from 'antd';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import { formatMoney, formatColorWrapper } from '@/utils/format';
import MarginBar from '@/components/MarginBar';
import { getPageQuery, isNumber, modelMapToOption } from '@/utils/utils';

@connect(({ venue, deal, pubitem, analysis, store }) => ({
  venue,
  deal,
  pubitem,
  analysis,
  store,
}))
class AnalysisBusinessSummaryItem extends Component {
  state = {
    formData: undefined,
  };

  /**
   * 生成不同链接效果的 render
   */
  // eslint-disable-next-line react/sort-comp
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

  genLinkWrapperRenderForFlow =
    (render = value => value, genQuery = () => {}, isIgnore = () => false) =>
    (...args) => {
      const [, record] = args;
      const { salesId } = record;
      const v = render(...args);
      if (salesId == null || isIgnore(...args)) {
        return v;
      }
      return (
        <span className="link" onClick={() => this.handleToDetailForFlow(record, genQuery(...args))}>
          {v}
        </span>
      );
    };

  moneyRender = value => formatColorWrapper(formatMoney)(value);

  numRender = value => formatColorWrapper()(value);

  columns = [
    {
      title: '商品信息',
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
          title: '库存编号',
          dataIndex: 'itemStockId',
          render: value => <Link to={`../detail/item?itemStockId=${value}`}>{value}</Link>,
          width: 110,
        },
        {
          title: '商品编号',
          dataIndex: 'itemId',
          render: this.genLinkWrapperRender(
            value => value,
            (value, record) => {
              const { salesId } = record;
              return {
                salesIds: salesId,
                itemId: value,
              };
            }
          ),
          width: 110,
        },
        {
          title: '商品名称',
          dataIndex: 'itemName',
          render: this.genLinkWrapperRender(
            value => value,
            (value, record) => {
              const { salesId, itemId } = record;
              return {
                salesIds: salesId,
                itemId,
              };
            }
          ),
          width: 200,
        },
      ],
    },
    {
      title: '已结算',
      collect: true,
      children: [
        {
          title: '商品原价',
          dataIndex: 'marketPrice',
          render: this.moneyRender,
          width: 90,
        },
        {
          title: '进货价',
          dataIndex: 'buyPrice',
          render: this.moneyRender,
          width: 90,
        },
        {
          title: '销售价（原单价）',
          dataIndex: 'salesPrice',
          render: this.moneyRender,
          width: 150,
        },
        {
          title: '已结算订单数',
          dataIndex: 'checkoutDealNum',
          render: this.genLinkWrapperRender(
            this.numRender,
            (value, record) => {
              const { salesId, itemId } = record;
              const {
                analysis: { ActionTypes },
              } = this.props;
              return {
                salesIds: salesId,
                itemId,
                type: ActionTypes.DEAL_CHECKOUT.key,
              };
            },
            value => !isNumber(value) || value === 0
          ),
          width: 110,
        },
        {
          title: '已结算商品件数',
          dataIndex: 'checkoutItemNum',
          render: this.numRender,
          width: 120,
        },
        {
          title: '已结算总原价',
          dataIndex: 'checkoutTotalPrice',
          render: this.moneyRender,
          width: 120,
        },
        {
          title: '已结算总成交价',
          dataIndex: 'checkoutTransactionTotalPrice',
          render: this.moneyRender,
          width: 120,
        },
        // {
        //   title: '现金流水金额',
        //   dataIndex: 'cashFlowAmount',
        //   render: this.moneyRender,
        //   width: 120,
        // },
        // {
        //   title: '消费收入金额',
        //   dataIndex: 'consumeFlowAmount',
        //   render: this.moneyRender,
        //   width: 120,
        // },
      ],
    },
    {
      title: '未结算',
      collect: true,
      children: [
        {
          title: '未结算订单数',
          dataIndex: 'unpaidDealNum',
          render: this.genLinkWrapperRender(
            this.numRender,
            (value, record) => {
              const { salesId, itemId } = record;
              const {
                analysis: { ActionTypes },
              } = this.props;
              return {
                salesIds: salesId,
                itemId,
                type: ActionTypes.DEAL_ADD.key,
              };
            },
            value => !isNumber(value) || value === 0
          ),
          width: 120,
        },
        {
          title: '未结算商品件数',
          dataIndex: 'unpaidItemNum',
          render: this.numRender,
          width: 120,
        },
        {
          title: '未结算总原价',
          dataIndex: 'unpaidTotalPrice',
          render: this.moneyRender,
          width: 120,
        },
        {
          title: '未结算总成交价',
          dataIndex: 'unpaidTransactionTotalPrice',
          render: this.moneyRender,
          width: 120,
        },
      ],
    },
    {
      title: '库存',
      collect: true,
      children: [
        {
          title: '上期库存',
          dataIndex: 'stockAfterNum',
          render: this.numRender,
          width: 110,
        },
        {
          title: '本期入库数',
          dataIndex: 'inNum',
          render: this.genLinkWrapperRenderForFlow(
            this.numRender,
            () => {
              const {
                store: { StockTypes },
              } = this.props;
              return {
                stockType: StockTypes.STOCKIN.key,
              };
            },
            value => !isNumber(value) || value === 0
          ),
          width: 110,
        },
        {
          title: '本期调拨入库',
          dataIndex: 'carryInNum',
          render: this.genLinkWrapperRenderForFlow(
            this.numRender,
            () => {
              const {
                store: { StockTypes },
              } = this.props;
              return {
                stockType: StockTypes.CARRYIN.key,
              };
            },
            value => !isNumber(value) || value === 0
          ),
          width: 110,
        },
        {
          title: '本期调拨出库',
          dataIndex: 'carryOutNum',
          render: this.genLinkWrapperRenderForFlow(
            this.numRender,
            () => {
              const {
                store: { StockTypes },
              } = this.props;
              return {
                stockType: StockTypes.CARRYOUT.key,
              };
            },
            value => !isNumber(value) || value === 0
          ),
          width: 110,
        },
        {
          title: '本期报损数',
          dataIndex: 'breakageNum',
          render: this.genLinkWrapperRenderForFlow(
            this.numRender,
            () => {
              const {
                store: { StockTypes },
              } = this.props;
              return {
                stockType: StockTypes.BREAKAGE.key,
              };
            },
            value => !isNumber(value) || value === 0
          ),
          width: 110,
        },
        // {
        //   title: '本期修正库存',
        //   dataIndex: 'abc',
        //   width: 110,
        // },
        {
          title: '本期出库数',
          dataIndex: 'outNum',
          render: this.genLinkWrapperRenderForFlow(
            this.numRender,
            () => {
              const {
                store: { StockTypes },
              } = this.props;
              return {
                stockType: StockTypes.STOCKOUT.key,
              };
            },
            value => !isNumber(value) || value === 0
          ),
          width: 110,
        },
        {
          title: '本期盘盈',
          dataIndex: 'stockProfitNum',
          render: this.numRender,
          width: 110,
        },
        {
          title: '本期盘亏',
          dataIndex: 'stockLossNum',
          render: this.numRender,
          width: 110,
        },
        {
          title: '本期退货数',
          dataIndex: 'refundNum',
          render: this.genLinkWrapperRenderForFlow(
            this.numRender,
            () => {
              const {
                store: { StockTypes },
              } = this.props;
              return {
                stockType: StockTypes.DEALRETURN.key,
              };
            },
            value => !isNumber(value) || value === 0
          ),
          width: 110,
        },
        {
          title: '更正库存',
          dataIndex: 'stockFixNum',
          render: this.numRender,
          width: 110,
        },
        {
          title: '本期库存数',
          dataIndex: 'stockNum',
          render: this.numRender,
          width: 110,
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
          name: 'presetDate2',
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
        label: '商品编号',
        name: 'itemId',
      },
      {
        label: '库存编号',
        name: 'itemStockId',
      },
      {
        label: '商品名称',
        name: 'itemName',
      },
      // {
      //   label: '操作终端',
      //   name: 'srvType',
      //   options: (() => {
      //     const {
      //       deal: { SrvTypes },
      //     } = this.props;
      //     return modelMapToOption(SrvTypes);
      //   })(),
      //   type: ItemTypes.Select,
      //   defHidden: true,
      // },
      {
        label: '显示顺序',
        name: 'queryType',
        placeholder: '默认营销中心',
        options: (() => {
          const {
            pubitem: { QueryTypes },
          } = this.props;
          return modelMapToOption(QueryTypes);
        })(),
        initialValue: (() => {
          const {
            pubitem: { QueryTypes },
          } = this.props;
          return QueryTypes.BY_SALEID.key;
        })(),
        type: ItemTypes.Select,
      },
    ],
  };

  operation = {
    export: {
      settings: {
        itemStockId: {
          // override
          render: value => value,
        },
      },
    },
    buttons: [
      {
        auth: 'export-item',
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
        pathname: '../detail/item',
        search: stringify(finalQuery),
      })
    );
  };

  handleToDetailForFlow = (record, query) => {
    const { formData } = this.state;
    const { itemId, itemStockId, salesId } = record;
    const { analysisStartDate, analysisEndDate } = formData || {};

    const finalQuery = {
      ...query,
      itemId,
      salesId,
      itemStockId,
      createStartTime: analysisStartDate,
      createEndTime: analysisEndDate ? moment(analysisEndDate).subtract(1, 'days').valueOf() : undefined,
    };

    const { dispatch } = this.props;
    dispatch(
      push({
        pathname: '/basic/mall/stockflow',
        search: stringify(finalQuery),
      })
    );
  };

  render() {
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
              url="/analysis/item/itemBusinessSummary.do"
              columns={this.columns}
              rowKey={record => `${record.salesId}-${record.itemId}`}
              formSearch={this.formSearch}
              operation={this.operation}
            />
          </Card>
        </MarginBar>
      </>
    );
  }
}

export default AnalysisBusinessSummaryItem;
