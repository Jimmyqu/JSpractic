import { Component } from 'react';
import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { stringify } from 'qs';
import classNames from 'classnames';
import { Card, Tabs, Tooltip, Icon } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import Datatable, { ButtonTypes, ItemTypes, matchDynamicHeader, RenderTypes } from '@/components/Datatable';
import SearchForm from '@/components/Datatable/SearchForm';
import MarginBar from '@/components/MarginBar';
import { formatColorWrapper, formatMoney, formatDate, formatDateTime } from '@/utils/format';
import { getPageQuery, modelMapToOption } from '@/utils/utils';
import { add } from '@/commons/lib/math';

const { TabPane } = Tabs;

const SpKey = '_服务抵扣金额_';

@connect(({ venue, deal, analysis, global, pubservice, pubwithdraw }) => ({
  venue,
  deal,
  analysis,
  pubservice,
  pubwithdraw,
  RelTypes: global.RelTypes,
}))
class AnalysisBusinessIncomeBiz extends Component {
  state = {
    loading: false,
    tabKey: ['financeFlow', 'consume'][getPageQuery().queryType || 0],

    formData: undefined,

    tableMapping: {}, // {tabKey: {table,formData}}
  };

  // eslint-disable-next-line react/sort-comp
  spRender = (value, { _sp }) => (_sp ? <span>&nbsp;</span> : value);

  spMoneyRender = (value, { _sp }) => (_sp ? <span>&nbsp;</span> : formatColorWrapper(formatMoney)(value));

  spDateRender = (value, { _sp }) => (_sp ? <span>&nbsp;</span> : formatDate(value));

  spDateTimeRender = (value, { _sp }) => (_sp ? <span>&nbsp;</span> : formatDateTime(value));

  warningRender = (type, { _sp, ...r }) => {
    if (_sp) {
      return <span>&nbsp;</span>;
    }
    const total = add(
      r.incomeServiceAccount,
      r.incomeCreditCash,
      r.incomeAccount,
      r.incomeAnalysisCalcPrice,
      r.incomeTotal
    );

    const isEqul = Number.isFinite(total) && r.businessTotal === total;
    return (
      <span
        className={classNames({
          red: !isEqul,
        })}
      >
        {formatMoney(type === 'total' ? total : r.businessTotal)}
      </span>
    );
  };

  /**
   * 生成不同链接效果的money render
   */
  genMoneyLinkRender = (relType, payMode, professionalId, isIgnore = () => false) => {
    return (...args) => {
      const [value, record] = args;
      const {
        pubwithdraw: { WithdrawTypes },
      } = this.props;
      const { _sp } = record;
      if (_sp) {
        return this.spRender(...args);
      }

      const v = this.spMoneyRender(...args);
      if (((value < 0 || isIgnore(...args)) && relType !== WithdrawTypes.PUBLIC_SERVICE_ACCOUNT.key) || value === 0) {
        return v;
      }
      return (
        <span className="link" onClick={() => this.handleToDetail(record, relType, payMode, professionalId)}>
          {v}
        </span>
      );
    };
  };

  columns = [
    {
      title: '营销中心',
      dataIndex: 'salesName',
      render: this.spRender,
      width: 120,
    },
    {
      title: '日期',
      dataIndex: 'analysisDate',
      render: this.spRender,
      width: 110,
    },
    {
      title: '业务',
      children: [
        {
          title: '小计',
          dataIndex: 'businessTotal',
          render: this.spMoneyRender,
          width: 90,
        },
        {
          title: '场地(小计)',
          dataIndex: 'businessSportPlatform',
          render: (...args) => {
            const { RelTypes } = this.props;
            return this.genMoneyLinkRender(RelTypes.ANALYSIS_SPORT_PLATFORM.key)(...args);
          },
          width: 90,
        },
        {
          dynamicHeaderPlaceType: '49',
          noRowSpan: true,
          render: (...args) => {
            const relType = args[3]?.dynamicPropertyVO;
            const { RelTypes } = this.props;
            return this.genMoneyLinkRender(RelTypes.ANALYSIS_SPORT_PLATFORM.key, null, relType)(...args);
          },
          width: 90,
        },
        {
          title: '场地票务(小计)',
          dataIndex: 'businessSportPlatformTicket',
          render: (...args) => {
            const { RelTypes } = this.props;
            return this.genMoneyLinkRender(RelTypes.ANALYSIS_SPORT_PLATFORM_TICKET.key)(...args);
          },
          width: 90,
        },
        {
          dynamicHeaderPlaceType: '216',
          noRowSpan: true,
          render: (...args) => {
            const relType = args[3]?.dynamicPropertyVO;
            const { RelTypes } = this.props;
            return this.genMoneyLinkRender(RelTypes.ANALYSIS_SPORT_PLATFORM_TICKET.key, null, relType)(...args);
          },
          width: 90,
        },
        {
          title: '会员服务(销售小计)',
          dataIndex: 'businessPublicService',
          render: (...args) => {
            const { RelTypes } = this.props;
            return this.genMoneyLinkRender(RelTypes.ANALYSIS_PUBLIC_SERVICE.key)(...args);
          },
          width: 120,
        },
        {
          dynamicHeaderPlaceType: '57',
          noRowSpan: true,
          // render: (...args) => {
          //   const [
          //     ,
          //     ,
          //     ,
          //     {
          //       dynamicPropertyVO: { relType },
          //     },
          //   ] = args;
          //   const { RelTypes } = this.props;
          //   return this.genMoneyLinkRender(RelTypes.ANALYSIS_SPORT_PLATFORM_TICKET.key, null, relType)(...args);
          // },
          width: 130,
        },
        {
          title: '课程培训(小计)',
          dataIndex: 'businessCourse',
          render: (...args) => {
            const { RelTypes } = this.props;
            return this.genMoneyLinkRender(RelTypes.ANALYSIS_COURSE.key)(...args);
          },
          width: 90,
        },
        {
          dynamicHeaderPlaceType: '151',
          noRowSpan: true,
          render: (...args) => {
            const relType = args[3]?.dynamicPropertyVO;
            const {
              RelTypes,
              venue: { ProfessionTypes },
            } = this.props;
            const types = new Set([
              ProfessionTypes.SPORTS_SWIMING.key,
              ProfessionTypes.SPORTS_TENNIS.key,
              ProfessionTypes.SPORTS_BADMINTON.key,
            ]);
            return this.genMoneyLinkRender(
              relType === ProfessionTypes.SPORTS_SWIMING.key ? relType : RelTypes.ANALYSIS_COURSE.key,
              null,
              relType,
              () => !types.has(relType)
            )(...args);
          },
          width: 130,
        },
        {
          title: '租赁(小计)',
          dataIndex: 'businessLease',
          render: (...args) => {
            const { RelTypes } = this.props;
            return this.genMoneyLinkRender(RelTypes.RENT.key)(...args);
          },
          width: 120,
        },
        {
          dynamicHeaderPlaceType: '238',
          noRowSpan: true,
          render: (...args) => {
            const relType = args[3]?.dynamicPropertyVO;
            const { RelTypes } = this.props;
            return this.genMoneyLinkRender(RelTypes.RENT.key, null, relType)(...args);
          },
          width: 90,
        },
        {
          title: '商品',
          dataIndex: 'businessItem',
          render: (...args) => {
            const { RelTypes } = this.props;
            return this.genMoneyLinkRender(RelTypes.ANALYSIS_ITEM.key)(...args);
          },
          width: 90,
        },
        {
          title: '账户充值',
          dataIndex: 'businessPublicAccount',
          render: (...args) => {
            const { RelTypes } = this.props;
            return this.genMoneyLinkRender(RelTypes.ANALYSIS_PUBLIC_ACCOUNT.key)(...args);
          },
          width: 90,
        },
        {
          title: '票务',
          dataIndex: 'businessExerciseTicket',
          render: (...args) => {
            const { RelTypes } = this.props;
            return this.genMoneyLinkRender(RelTypes.ANALYSIS_EXERCISE_TICKET.key)(...args);
          },
          width: 90,
        },
        {
          title: '人员',
          dataIndex: 'businessServiceUser',
          render: (...args) => {
            const { RelTypes } = this.props;
            return this.genMoneyLinkRender(RelTypes.ANALYSIS_SERVICE_USER.key)(...args);
          },
          width: 90,
        },
        {
          title: '报名',
          dataIndex: 'businessSignup',
          render: (...args) => {
            const { RelTypes } = this.props;
            return this.genMoneyLinkRender(RelTypes.ANALYSIS_SIGNUP.key)(...args);
          },
          width: 90,
        },
        {
          title: '扫码收款',
          dataIndex: 'businessScanCode',
          render: (...args) => {
            const { RelTypes } = this.props;
            return this.genMoneyLinkRender(RelTypes.ANALYSIS_SCAN_CODE.key)(...args);
          },
          width: 90,
        },
        // {
        //   title: '租凭',
        //   dataIndex: 'zl',
        //   width: 90,
        // },
        // {
        //   title: '认证',
        //   dataIndex: 'rz',
        //   width: 90,
        // },
        {
          title: '会员服务折现',
          dataIndex: 'businessPublicServiceWithdraw',
          render: (...args) => {
            const {
              pubwithdraw: { WithdrawTypes },
            } = this.props;
            return this.genMoneyLinkRender(WithdrawTypes.PUBLIC_SERVICE_ACCOUNT.key)(...args);
          },
          width: 110,
        },
        {
          title: '账户提现',
          dataIndex: 'businessPublicAccountWithdraw',
          render: (...args) => {
            const { RelTypes } = this.props;
            return this.genMoneyLinkRender(RelTypes.ANALYSIS_PUBLIC_ACCOUNT.key)(...args);
          },
          width: 90,
        },
      ],
    },
    {
      title: (
        <>
          支付方式合计&nbsp;
          <Tooltip key="icon" title="此合计=服务储值金额+白条+账户金额+服务计费金额+现金流水">
            <Icon type="info-circle" theme="twoTone" />
          </Tooltip>
        </>
      ),
      key: 'total',
      render: (_, r) => this.warningRender('total', r),
      width: 110,
      noRowSpan: true,
    },
    {
      title: '现金流',
      children: [
        {
          title: '小计',
          dataIndex: 'incomeTotal',
          render: (...args) => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return this.genMoneyLinkRender(null, [
              PayWayTypes.WECHAT.key,
              PayWayTypes.ZFB.key,
              PayWayTypes.BANKCARD.key,
              PayWayTypes.BANKTRANSFER.key,
              PayWayTypes.CASH.key,
            ])(...args);
          },
          width: 120,
        },
        {
          title: (() => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return PayWayTypes.WECHAT.value;
          })(),
          dataIndex: 'incomeWechat',
          render: (...args) => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return this.genMoneyLinkRender(null, PayWayTypes.WECHAT.key)(...args);
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
          render: (...args) => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return this.genMoneyLinkRender(null, PayWayTypes.ZFB.key)(...args);
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
          render: (...args) => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return this.genMoneyLinkRender(null, PayWayTypes.BANKCARD.key)(...args);
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
          render: (...args) => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return this.genMoneyLinkRender(null, PayWayTypes.BANKTRANSFER.key)(...args);
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
          render: (...args) => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return this.genMoneyLinkRender(null, PayWayTypes.CASH.key)(...args);
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
          render: (...args) => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return this.genMoneyLinkRender(null, PayWayTypes.ACCOUNT.key)(...args);
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
          render: (...args) => {
            const {
              deal: { PayWayTypes },
            } = this.props;
            return this.genMoneyLinkRender(SpKey, PayWayTypes.PUBSERVICE.key)(...args);
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
          render: this.spMoneyRender,
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
          render: this.spMoneyRender,
          width: 110,
        },
        {
          title: '支付宝退回账户',
          dataIndex: 'zfbToAccount',
          render: this.spMoneyRender,
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
          render: this.spMoneyRender,
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
          render: this.spMoneyRender,
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
          render: this.spMoneyRender,
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
          render: this.spMoneyRender,
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
          render: this.spMoneyRender,
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
        professionalFieldName: 'professionalIds',
        platformFieldName: 'platformIds',
        initialValue: (() => {
          const { queryType, salesIds, displayType, analysisStartDate, analysisEndDate } = getPageQuery();
          if (queryType || salesIds || displayType || analysisStartDate || analysisEndDate) {
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
          name: 'analysisStartDate',
          label: '创建时间(始)',
          initialValue: (() => {
            const { queryType, salesIds, displayType, analysisStartDate, analysisEndDate } = getPageQuery();
            if (queryType || salesIds || displayType || analysisStartDate || analysisEndDate) {
              if (analysisStartDate) {
                return moment(+analysisStartDate);
              }
              return;
            }
            return moment();
          })(),
          type: ItemTypes.DatePickerRangeStart,
        },
        {
          name: 'analysisEndDate',
          label: '创建时间(止)',
          initialValue: (() => {
            const { queryType, salesIds, displayType, analysisStartDate, analysisEndDate } = getPageQuery();
            if (queryType || salesIds || displayType || analysisStartDate || analysisEndDate) {
              if (analysisEndDate) {
                return moment(+analysisEndDate);
              }
              return;
            }
            return moment();
          })(),
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
        label: '类型显示',
        name: 'displayType',
        options: (() => {
          const {
            analysis: { DisplayTypes },
          } = this.props;
          return modelMapToOption(DisplayTypes);
        })(),
        initialValue: (() => {
          const { displayType } = getPageQuery();
          if (displayType) {
            return +displayType;
          }
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
        auth: 'export2',
        btnType: ButtonTypes.Export,
      },
    ],
  };

  handleToDetail = (record, relType, payMode, professionalId) => {
    if (relType == null && payMode == null) {
      return;
    }
    const {
      dispatch,
      RelTypes,
      pubservice: { AnalysisCalcStatus, ServiceTagTypes, categoryList },
      pubwithdraw: { WithdrawTypes },
      venue: { ProfessionTypes },
    } = this.props;
    const { tabKey, formData } = this.state;
    const { salesId, startDate: sd, endDate: ed } = record;

    // 数据没有时间则表示合计，使用表单查询时间
    const useFormDate = sd == null && ed == null;

    const startDate = useFormDate ? formData.analysisStartDate : sd;
    // 结束日期在查询表单时都加了一天
    let endDate;
    if (useFormDate) {
      endDate = formData.analysisEndDate ? moment(formData.analysisEndDate).subtract(1, 'days').valueOf() : undefined;
    } else {
      endDate = ed;
    }

    const query = {
      // 数据没有时间则表示合计，使用表单查询场馆
      salesIds: salesId == null ? (formData.salesIds || []).join(',') : salesId,
    };

    const useff = tabKey === 'financeFlow';
    const usecs = !useff && (relType === RelTypes.ANALYSIS_PUBLIC_SERVICE.key || relType === SpKey);
    const useCourese = relType === ProfessionTypes.SPORTS_SWIMING.key;
    const useQueryType =
      relType === RelTypes.ANALYSIS_COURSE.key ||
      relType === RelTypes.ANALYSIS_SPORT_PLATFORM.key ||
      relType === RelTypes.ANALYSIS_SERVICE_USER.key ||
      relType === RelTypes.ANALYSIS_SPORT_PLATFORM_TICKET.key ||
      usecs ||
      useCourese;
    if (useQueryType) {
      let queryType = 1;
      if (usecs) {
        queryType = 3;
      } else if (useff) {
        queryType = 0;
      }
      Object.assign(query, {
        queryType,
      });
    }

    if (useCourese) {
      Object.assign(query, {
        buySalesId: salesId,
        analysisCalcState: AnalysisCalcStatus.Done.key,
        serviceTag: ServiceTagTypes.TRAINING_COURSE.key,
        serviceCategoryId: categoryList.find(item => item.value === '游泳').key,
        analysisStartDate: startDate,
        analysisEndDate: endDate,
      });
    } else if (useff || useQueryType) {
      Object.assign(query, {
        analysisStartDate: startDate,
        analysisEndDate: endDate,
      });
    } else if (relType) {
      Object.assign(query, {
        orderStartDate: startDate,
        orderEndDate: endDate,
      });
    } else {
      Object.assign(query, {
        consumeStartDate: startDate,
        consumeEndDate: endDate,
      });
    }

    if (payMode != null) {
      query.payMode = Array.isArray(payMode) ? payMode.join(',') : payMode;
    }

    if (professionalId != null && !useCourese) {
      // 接收为多选
      query.professionalIds = professionalId;
    }

    const pathMapping = {
      [RelTypes.ANALYSIS_SPORT_PLATFORM.key]: '../summary/platform',
      [RelTypes.ANALYSIS_SERVICE_USER.key]: '../summary/serviceuser',
      [RelTypes.ANALYSIS_ITEM.key]: '../summary/item',
      [RelTypes.ANALYSIS_SPORT_PLATFORM_TICKET.key]: '../summary/spticket',
      [RelTypes.ANALYSIS_EXERCISE_TICKET.key]: '../summary/ticket',
      [RelTypes.ANALYSIS_PUBLIC_SERVICE.key]: '../summary/pubservice',
      [RelTypes.ANALYSIS_SIGNUP.key]: '../summary/signup',
      [RelTypes.ANALYSIS_COURSE.key]: '../summary/course',
      [RelTypes.ANALYSIS_PUBLIC_ACCOUNT.key]: '../summary/pubaccount',
      [RelTypes.ANALYSIS_SCAN_CODE.key]: '../summary/scan',
      [RelTypes.ANALYSIS_PUBLIC_CREDIT.key]: '../summary/credit',
      [ProfessionTypes.SPORTS_SWIMING.key]: '/basic/pub/pubservicesold',
      [WithdrawTypes.PUBLIC_SERVICE_ACCOUNT.key]: '/basic/deal/withdraw',
    };

    if (!useff && relType === SpKey) {
      pathMapping[SpKey] = pathMapping[RelTypes.ANALYSIS_PUBLIC_SERVICE.key];
    }

    dispatch(
      push({
        pathname: relType ? pathMapping[relType] : '/analysis/finance/detail',
        search: stringify(query),
      })
    );
  };

  dataSourceRender = data => {
    const { analysisDataSummaryList: dataList } = data || {};
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

  memoizeColumns2 = memoizeOne(
    list =>
      list.slice(0, -2).map((column, idx) => {
        if (idx === 2) {
          const children = [...column.children];
          const tIdx = children.findIndex(col => col.dataIndex === 'businessPublicService');
          if (tIdx >= 0) {
            children.splice(tIdx, 1, {
              ...children[tIdx],
              title: '会员服务(消费小计)',
            });
          }
          children.push({
            title: '白条还款',
            dataIndex: 'businessPublicCredit',
            render: (...args) => {
              const { RelTypes } = this.props;
              return this.genMoneyLinkRender(RelTypes.ANALYSIS_PUBLIC_CREDIT.key)(...args);
            },
            width: 90,
          });
          children[0] = {
            title: '小计',
            dataIndex: 'businessTotal',
            render: (v, r) => this.warningRender('', r),
            width: 90,
          };
          return {
            ...column,
            children,
          };
        }
        return column;
      }),
    isEqual
  );

  memoizeColumns1 = memoizeOne(list => [...list.slice(0, 3), ...list.slice(4, 5), ...list.slice(6)], isEqual);

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
    const { tabKey, tableMapping, loading } = this.state;
    const { data } = tableMapping[tabKey] || {};
    // 这里简单在声明columns属性时 衍生columns1 columns2不行 因为有动态头
    const columns = matchDynamicHeader(this.columns, data ? data.dynamicHeaderList : [], this.matchRender);

    const columns1 = this.memoizeColumns1(columns);
    const columns2 = this.memoizeColumns2(columns);

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
                url="/analysis/incomeSummary/salesItemIncomeSummary.do?queryType=0"
                dataSourceRender={this.dataSourceRender}
                columns={columns1}
                rowSpanByValue={record => record.salesId}
                rowKey="id"
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
                url="/analysis/incomeSummary/salesItemIncomeSummary.do?queryType=1"
                dataSourceRender={this.dataSourceRender}
                columns={columns2}
                rowSpanByValue={record => record.salesId}
                rowKey="id"
                formSearch={this.formSearch}
                operation={this.operation}
                onLoadData={this.handleLoadData}
                onTableLoadingStateChange={this.onTableLoadingStateChange}
                onInit={this.handleTableInit}
              />
            </TabPane>
          </Tabs>
        </Card>

        {/* TODO 加弹窗显示明细 (桌面文件夹)) */}
      </>
    );
  }
}

export default AnalysisBusinessIncomeBiz;
