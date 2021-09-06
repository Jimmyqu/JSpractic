import { Component } from 'react';
import moment from 'moment';
import { stringify } from 'qs';
import { Card, message } from 'antd';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import Datatable, { ButtonTypes, ItemTypes, matchDynamicHeader, RenderTypes } from '@/components/Datatable';
import { formatColorWrapper, formatDate, formatDateTime, formatMoney } from '@/utils/format';
import { modelMapToOption } from '@/utils/utils';

@connect(({ venue, analysis, deal, global, pubservice }) => ({
  venue,
  analysis,
  deal,
  pubservice,
  RelTypes: global.RelTypes,
}))
class AnalysisBusinessIncomeBiz extends Component {
  state = {
    data: undefined,
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
      const { itemId, isTotalRow } = record;
      const v = render(...args);
      if (isTotalRow || itemId <= 0 || isIgnore(...args)) {
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
      title: '项目',
      dataIndex: 'itemName',
      width: 120,
    },
    {
      title: '业务',
      dataIndex: 'businessName',
      width: 120,
    },
    {
      dynamicHeaderPlaceType: '182',
      noRowSpan: true,
      render: this.genLinkWrapperRender(
        (value, record, rowIndex, { render }) => this.matchRender(render)(value, record, rowIndex),
        (value, record, rowIndex, { dynamicPropertyVO }) => {
          const { salesId } = dynamicPropertyVO || {};
          const { businessType, itemId } = record;
          const {
            RelTypes,
            pubservice: { AnalysisCalcStatus, ServiceTagTypes, categoryList },
            venue: { ProfessionTypes },
          } = this.props;
          // 游泳下的培训课程跳转
          if (RelTypes.COURSE.key === businessType && itemId === ProfessionTypes.SPORTS_SWIMING.key) {
            const salesIds = salesId > 0 ? salesId : '';
            return {
              salesIds,
              buySalesId: salesIds,
              serviceCategoryId: categoryList.find(item => item.value === '游泳').key,
              analysisCalcState: AnalysisCalcStatus.Done.key,
              serviceTag: ServiceTagTypes.TRAINING_COURSE.key,
            };
          }
          if (salesId > 0) {
            return {
              salesIds: salesId,
            };
          }
        },
        (value, record) => {
          if (value === 0) {
            return true; // 忽略
          }
          const { businessType, itemId } = record;
          const {
            RelTypes,
            venue: { ProfessionTypes },
          } = this.props;
          return RelTypes.COURSE.key === businessType && itemId !== ProfessionTypes.SPORTS_SWIMING.key; // 忽略
        }
      ),
      width: 110,
    },
  ];

  formSearch = {
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
          label: '创建时间(始)',
          initialValue: moment(),
          type: ItemTypes.DatePickerRangeStart,
        },
        {
          name: 'analysisEndDate',
          label: '创建时间(止)',
          initialValue: moment(),
          type: ItemTypes.DatePickerRangeEnd,
        },
      ],
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
        auth: 'export3',
        btnType: ButtonTypes.Export,
      },
    ],
  };

  handleToDetail = (record, query) => {
    const { formData } = this.state;
    const { businessType, itemId } = record;
    const { analysisStartDate, analysisEndDate } = formData || {};

    const finalQuery = {
      ...query,
      analysisStartDate,
      analysisEndDate: analysisEndDate ? moment(analysisEndDate).subtract(1, 'days').valueOf() : undefined,
    };

    const { RelTypes, dispatch } = this.props;

    const pathMapping = {
      // 就这几种
      [RelTypes.SPORTPLATFORM.key]: '../summary/platform',
      [RelTypes.DEALSERVICEUSER.key]: '../summary/serviceuser',
      [RelTypes.COMMONCATEGORY_ITEM.key]: '../summary/item',
      [RelTypes.SPORTPLATFORMTICKET.key]: '../summary/spticket',
      [RelTypes.COURSE.key]: '/basic/pub/pubservicesold',
      [RelTypes.PUBSERVICE.key]: '../summary/pubservice',
    };

    if (
      [RelTypes.SPORTPLATFORM.key, RelTypes.DEALSERVICEUSER.key, RelTypes.SPORTPLATFORMTICKET.key].includes(
        businessType
      )
    ) {
      Object.assign(finalQuery, {
        professionalIds: itemId,
        queryType: 1,
      });
    }

    const path = pathMapping[businessType];

    if (path == null) {
      message.warn('业务类型数据有误，无法完成链接跳转');
      return;
    }

    dispatch(
      push({
        pathname: path,
        search: stringify(finalQuery),
      })
    );
  };

  dataSourceRender = data => {
    const { analysisDataSummaryList: dataList } = data || {};
    return (dataList || []).reduce((prev, current) => {
      const { analysisItemDataSummaryList } = current;
      const tempList = [...prev, ...(analysisItemDataSummaryList || []).map((_, j) => this.buildRow(current, j))];
      // return tempList.concat(
      //   i < list.length - 1 && tempList.length > 0
      //     ? [
      //         {
      //           id: i,
      //           _sp: true,
      //         },
      //       ]
      //     : []
      // );
      return tempList;
    }, []);
  };

  buildRow = (item, i) => {
    const { analysisItemDataSummaryList, ...other } = item;
    return {
      id: `${i}-${other.itemId}`,
      ...other,
      ...(analysisItemDataSummaryList || [])[i],
    };
  };

  handleLoadData = (list, result) => {
    this.setState({
      data: result,
    });
  };

  spRender = (value, { _sp }) => (_sp ? <span>&nbsp;</span> : value);

  spMoneyRender = (value, { _sp }) => (_sp ? <span>&nbsp;</span> : formatColorWrapper(formatMoney)(value));

  spDateRender = (value, { _sp }) => (_sp ? <span>&nbsp;</span> : formatDate(value));

  spDateTimeRender = (value, { _sp }) => (_sp ? <span>&nbsp;</span> : formatDateTime(value));

  matchRender = renderType => {
    switch (renderType) {
      case RenderTypes.Money.key:
        return this.spMoneyRender;
      case RenderTypes.Date.key:
        return this.spDateRender;
      case RenderTypes.DateTime.key:
        return this.spDateTimeRender;
      default:
        return this.spRender;
    }
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'pubservice/fetchServiceCategory',
    });
  }

  render() {
    const { data } = this.state;
    const columns = matchDynamicHeader(this.columns, data ? data.dynamicHeaderList : [], this.matchRender);
    return (
      <Card bordered={false}>
        <Datatable
          pagination={false}
          url="/analysis/incomeSummary/comprehensiveIncomeSummary.do"
          dataSourceRender={this.dataSourceRender}
          columns={columns}
          onLoadData={this.handleLoadData}
          rowSpanByValue={record => record.itemId}
          rowKey="id"
          formSearch={this.formSearch}
          operation={this.operation}
        />
      </Card>
    );
  }
}

export default AnalysisBusinessIncomeBiz;
