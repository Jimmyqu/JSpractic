import { Component } from 'react';
import { stringify } from 'qs';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Card } from 'antd';
import moment from 'moment';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import IconFont from '@/components/Icon';
import DealCancelModal from '@/components/Modal/DealCancelModal';
import {
  formatDate,
  formatHM,
  formatMoneyLen2,
  formatDateTime,
  formatPayWay,
  formatModel,
  formatStudyList,
} from '@/utils/format';
import { getPageQuery, modelMapToOption, print } from '@/utils/utils';
import AuthComponent from '@/components/AuthComponent';
import OrderPrint from '@/components/OrderPrint';

@connect(({ venue, pubplatform, pubticket, deal, loading }) => ({
  venue,
  pubplatform,
  pubticket,
  deal,
  printFetching: loading.effects['print/fetch'],
}))
class PlatformDeal extends Component {
  /**
   * 生成不同链接效果的 render
   */
  // eslint-disable-next-line react/sort-comp
  genLinkWrapperRender =
    (render = value => value, genQuery = () => {}, isIgnore = () => false) =>
    (...args) => {
      const [, record] = args;
      const v = render(...args);
      if (isIgnore(...args)) {
        return v;
      }
      return (
        <span className="link" onClick={() => this.handleToCheckLogs(record, genQuery(...args))}>
          {v}
        </span>
      );
    };

  columns = [
    {
      title: '场地订单',
      dataIndex: 'dealPlatform.id',
      width: 90,
    },
    {
      title: '主订单号',
      dataIndex: 'deal.id',
      width: 90,
    },
    {
      title: '订单状态',
      dataIndex: 'dealPlatform.dealState',
      render: value => {
        const {
          pubplatform: { DealStatus },
        } = this.props;
        return formatModel(DealStatus, value);
      },
      width: 80,
    },
    {
      title: '会员姓名',
      dataIndex: 'deal.pubRealName',
      width: 80,
    },
    {
      title: '会员手机号',
      dataIndex: 'deal.pubMobile',
      width: 130,
    },
    {
      title: '场地订单类型',
      dataIndex: 'dealPlatform.dealPlatformType',
      render: value => {
        const {
          pubplatform: { PlatformDealTypes },
        } = this.props;
        return formatModel(PlatformDealTypes, value);
      },
      width: 130,
    },
    {
      title: '营销中心',
      dataIndex: 'deal.salesName',
      width: 180,
    },
    {
      title: '场地名称',
      dataIndex: 'dealPlatform.platformName',
      width: 100,
    },
    {
      title: '父场地名',
      dataIndex: 'dealPlatform.platformParentName',
      width: 100,
    },
    {
      title: '是否全场',
      dataIndex: 'dealPlatform.platformIsFull',
      render: value => {
        if (value === 0) {
          return '全场';
        }
        if (value === 1) {
          return '半场';
        }
        return value;
      },
      width: 80,
    },
    {
      title: '场地类型',
      dataIndex: 'dealPlatform.professionalId',
      render: value => {
        const {
          venue: { ProfessionTypes },
        } = this.props;
        return formatModel(ProfessionTypes, value);
      },
      width: 90,
    },
    {
      title: '订场日期',
      dataIndex: 'dealPlatform.orderDate',
      render: formatDate,
      width: 120,
    },
    {
      title: '订场时间',
      dataIndex: 'dealPlatform.startTime',
      render: (value, record) => `${formatHM(value)}-${formatHM(record.dealPlatform.endTime)}`,
      width: 120,
    },
    {
      title: '时间段场地价',
      dataIndex: 'dealPlatform.platformPrice',
      render: formatMoneyLen2,
      collect: true,
      width: 110,
    },
    {
      title: '成交价',
      dataIndex: 'dealPlatform.transactionPrice',
      render: formatMoneyLen2,
      collect: true,
      width: 70,
    },
    {
      title: '主订单支付总价',
      dataIndex: 'payInfo.payTotalAmount',
      render: formatMoneyLen2,
      collect: true,
      width: 140,
    },
    {
      title: '支付方式',
      dataIndex: 'payInfo.payList',
      render: (_, record) => formatPayWay(record),
      width: 120,
    },
    {
      title: '支付信息',
      dataIndex: 'payInfo.payDescription',
      width: 180,
    },
    {
      title: '退款信息',
      dataIndex: 'payInfo.refundDescription',
      width: 180,
    },
    {
      title: '服务人员',
      dataIndex: 'dealPlatform.dealUserList',
      render: value => (value || []).map(item => item.realName).join(', '),
      width: 90,
    },
    {
      title: '入场人员',
      dataIndex: 'dealPlatform.dealPlatformStudyList',
      render: formatStudyList,
      width: 200,
    },
    {
      title: '订单备注',
      dataIndex: 'deal.userMessage',
      width: 100,
    },
    {
      title: '商家留言',
      dataIndex: 'deal.sellerMessage',
      width: 100,
    },
    {
      title: '取消原因',
      dataIndex: 'deal.cancelMessage',
      width: 120,
    },
    {
      title: '核验状态',
      dataIndex: 'dealPlatform.checkState',
      render: this.genLinkWrapperRender(
        value => {
          const {
            pubticket: { CheckStatus },
          } = this.props;
          return formatModel(CheckStatus, value);
        },
        (value, record) => {
          const {
            dealPlatform: { dealId },
          } = record;
          return {
            dealId,
          };
        },
        value => {
          const {
            pubticket: { CheckStatus },
          } = this.props;
          return value === CheckStatus.UNCHECKED.key;
        }
      ),
      width: 80,
    },
    {
      title: '核验人',
      dataIndex: 'dealPlatform.checkName',
      render: (value, { dealPlatform: { checkMobile } }) =>
        `${value || ''}${checkMobile ? '/' : ''}${checkMobile || ''}`,
      width: 180,
    },
    {
      title: '核验时间',
      dataIndex: 'dealPlatform.checkDate',
      render: formatDateTime,
      width: 180,
    },
    {
      title: '更新人',
      dataIndex: 'deal.updateRealName',
      width: 120,
    },
    {
      title: '更新时间',
      dataIndex: 'dealPlatform.updateTime',
      render: formatDateTime,
      width: 180,
    },
    {
      title: '创建人',
      dataIndex: 'deal.createRealName',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'dealPlatform.createTime',
      render: formatDateTime,
      width: 180,
    },
    {
      title: '业务来源',
      dataIndex: 'deal.srvName',
      width: 130,
    },
    {
      title: '单位名称',
      dataIndex: 'dealPlatform.companyName',
      width: 200,
    },
  ];

  formSearch = {
    fields: [
      {
        label: '订单状态',
        name: 'dealState',
        mode: 'multiple',
        options: (() => {
          const {
            pubplatform: { DealStatus },
          } = this.props;
          return modelMapToOption(DealStatus);
        })(),
        type: ItemTypes.Select,
      },
      {
        label: '核验状态',
        name: 'checkState',
        initialValue: (() => {
          const { checkState } = getPageQuery();
          if (checkState) {
            return +checkState;
          }
        })(),
        options: (() => {
          const {
            pubticket: { CheckStatus },
          } = this.props;
          return modelMapToOption(CheckStatus);
        })(),
        type: ItemTypes.Select,
        defHidden: true,
      },
      {
        label: '营销中心',
        name: 'salesId',
        initialValue: (() => {
          const { salesId } = getPageQuery();
          if (salesId) {
            return +salesId;
          }
        })(),
        type: ItemTypes.CascaderVenue,
      },
      {
        label: '主订单号',
        name: 'dealId',
      },
      {
        label: '场地订单号',
        name: 'id',
        defHidden: true,
      },
      {
        label: '场地订单类型',
        name: 'dealPlatformType',
        options: (() => {
          const {
            pubplatform: { PlatformDealTypes },
          } = this.props;
          return modelMapToOption(PlatformDealTypes).filter(item => item.key !== PlatformDealTypes.Locked.key);
        })(),
        type: ItemTypes.Select,
        defHidden: true,
      },
      // {
      //   label: '支付方式',
      //   name: 'payMode',
      //   options: (() => {
      //     const {
      //       deal: { PayModeTypesWithOutGroup },
      //     } = this.props;
      //     return modelMapToOption(PayModeTypesWithOutGroup);
      //   })(),
      //   type: ItemTypes.Select,
      //   defHidden: true,
      // },
      {
        label: '项目类型',
        name: 'professionalId',
        initialValue: (() => {
          const { professionalId } = getPageQuery();
          if (professionalId) {
            return +professionalId;
          }
        })(),
        options: (() => {
          const {
            venue: { ProfessionTypes },
          } = this.props;
          return modelMapToOption(ProfessionTypes);
        })(),
        type: ItemTypes.Select,
        defHidden: true,
      },
      {
        label: '会员手机号',
        name: 'publicMobile',
        defHidden: true,
      },
      {
        label: '会员姓名',
        name: 'publicRealName',
        defHidden: true,
      },
      {
        label: '入场人员手机号',
        name: 'pubStudyMobile',
        defHidden: true,
      },
      {
        label: '入场人员姓名',
        name: 'pubStudyRealName',
        defHidden: true,
      },
      {
        label: '场地名称',
        name: 'platformName',
        initialValue: (() => {
          const { platformName } = getPageQuery();
          if (platformName) {
            return platformName;
          }
        })(),
        defHidden: true,
      },
      {
        label: '业务来源编号',
        name: 'srvId',
        defHidden: true,
      },
      [
        {
          label: '订场日期(始)',
          name: 'startDate',
          placeholder: '开始',
          type: ItemTypes.DatePickerRangeStart,
          defHidden: true,
        },
        {
          label: '订场日期(止)',
          name: 'endDate',
          placeholder: '结束',
          type: ItemTypes.DatePickerRangeEnd,
          defHidden: true,
        },
      ],
      // [
      //   {
      //     label: '创建时间(始)',
      //     name: 'startDateValue',
      //     placeholder: '开始',
      //     type: ItemTypes.DatePickerRangeStart,
      //     defHidden: true,
      //   },
      //   {
      //     label: '创建时间(止)',
      //     name: 'endDateValue',
      //     placeholder: '结束',
      //     type: ItemTypes.DatePickerRangeEnd,
      //     defHidden: true,
      //   },
      // ],
      {
        label: '创建人',
        name: 'createRealName',
        defHidden: true,
      },
      [
        {
          label: '更新时间(始)',
          name: 'updateStartTime',
          placeholder: '开始',
          initialValue: (() => {
            const { updateStartTime } = getPageQuery();
            if (updateStartTime) {
              return moment(+updateStartTime);
            }
          })(),
          type: ItemTypes.DatePickerRangeStart,
          defHidden: true,
        },
        {
          label: '更新时间(止)',
          name: 'updateEndTime',
          placeholder: '结束',
          initialValue: (() => {
            const { updateEndTime } = getPageQuery();
            if (updateEndTime) {
              return moment(+updateEndTime);
            }
          })(),
          type: ItemTypes.DatePickerRangeEnd,
          defHidden: true,
        },
      ],
    ],
  };

  state = {
    selectedRows: undefined,

    dcModalVisible: false,
  };

  operation = () => {
    const {
      dispatch,
      deal: { PayStatus, DealStatus, DealShippingStatus },
      printFetching,
    } = this.props;
    return {
      buttons: [
        {
          text: '去支付',
          icon: <IconFont type="pay" />,
          auth: 'pay',
          type: 'danger',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const { dealState, dealPayState } = rows[0].deal;
            if (dealState === DealStatus.BOOKING.key) {
              return false;
            }
            return dealPayState === PayStatus.UNPAID.key;
          },
          action: () => {
            this.goToSummary();
          },
        },
        {
          text: '编辑',
          auth: 'edit',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const { dealState, dealPayState } = rows[0].deal;
            if (dealState === DealStatus.BOOKING.key) {
              return false;
            }
            return dealPayState === PayStatus.UNPAID.key;
          },
          action: () => {
            const { selectedRows } = this.state;
            window.open(`/basic/platform/booking/booking?id=${selectedRows[0].deal.id}`);
          },
        },
        {
          text: '取消订单',
          icon: <IconFont type="cancel" />,
          auth: 'remove',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const { dealState, dealAddress, dealShippingState } = rows[0].deal;
            return !(
              dealState === DealStatus.CANCEL.key ||
              dealState === DealStatus.REFUNDED.key ||
              dealState === DealStatus.BOOKING.key ||
              (dealAddress &&
                (dealShippingState === DealShippingStatus.WAIT_CONSIGNEE.key ||
                  dealShippingState === DealShippingStatus.CONFIRM_CONSIGNEE.key))
            );
          },
          action: () => {
            this.handleDealCancelVisibleChange(true);
          },
        },
        {
          text: '改价',
          auth: 'edit-amount-btn',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const { dealState, dealPayState } = rows[0].deal;
            return dealPayState === PayStatus.UNPAID.key || dealState === DealStatus.BOOKING.key;
          },
          action: () => {
            this.goToSummary();
          },
        },
        {
          text: '发货',
          auth: 'deliver',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const dealInfo = rows[0] || {};
            const { dealAddress, dealShippingState } = dealInfo.deal || {};
            return dealAddress && dealShippingState === DealShippingStatus.WAIT_SEND.key;
          },
          action: () => {
            const { selectedRows } = this.state;
            dispatch(
              push({
                pathname: '/basic/logistics/shipping',
                search: `id=${selectedRows[0].deal.id}`,
              })
            );
          },
        },
        {
          text: '打印',
          icon: <IconFont type="print" />,
          loading: printFetching,
          auth: 'print',
          forRow: rows => {
            return rows.length === 1 && rows[0].deal.dealPayState === PayStatus.HASPAID.key;
          },
          action: () => {
            print();
          },
        },
        {
          text: '打印预览',
          icon: <IconFont type="print" />,
          auth: 'print',
          forRow: rows => {
            return rows.length === 1 && rows[0].deal.dealPayState === PayStatus.HASPAID.key;
          },
          action: () => {
            const { selectedRows } = this.state;
            dispatch(push(`./${selectedRows[0].deal.id}/print`));
          },
        },
        {
          auth: 'export',
          btnType: ButtonTypes.Export,
        },
        {
          text: '订单详情',
          icon: <IconFont type="menu-deal-main" />,
          forRow: 'single',
          action: () => {
            const { selectedRows } = this.state;
            dispatch(push(`./${selectedRows[0].deal.id}/detail`));
          },
        },
      ],
    };
  };

  handleToCheckLogs = (record, query) => {
    const finalQuery = {
      ...query,
    };

    const { dispatch } = this.props;
    dispatch(
      push({
        pathname: '/basic/device/logs',
        search: stringify(finalQuery),
      })
    );
  };

  goToSummary = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    dispatch(
      push({
        pathname: '/basic/platform/booking/summary',
        search: `id=${selectedRows[0].deal.id}`,
      })
    );
  };

  handleDealCancelVisibleChange = visible => {
    this.setState({
      dcModalVisible: visible,
    });
  };

  handleDoDealCancel = () => {
    this.table.reload();
  };

  handleTableInit = table => {
    this.table = table;
  };

  handleSelectedChange = (_, rows) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleBeforeLoadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deal/breakPolling',
    });
  };

  render() {
    const {
      deal: { PayStatus },
    } = this.props;
    const { selectedRows = [], dcModalVisible } = this.state;
    const printId = selectedRows?.[0]?.deal?.dealPayState === PayStatus.HASPAID.key ? selectedRows[0].deal.id : null;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Datatable
            select="multi"
            onSelectedChange={this.handleSelectedChange}
            url="/dealPlatform/dataList.do"
            columns={this.columns}
            // https://ant.design/components/table-cn/#%E6%B3%A8%E6%84%8F
            rowKey={record => record.dealPlatform.id}
            formSearch={this.formSearch}
            operation={this.operation()}
            onInit={this.handleTableInit}
            onBeforeLoadData={this.handleBeforeLoadData}
            // onLoadData={this.handleLoadData}
          />
        </Card>
        <DealCancelModal
          dealId={((selectedRows[0] || {}).deal || {}).id}
          visible={dcModalVisible}
          onVisibleChange={this.handleDealCancelVisibleChange}
          onOk={this.handleDoDealCancel}
        />
        {/* //FIXME 选行即加载的方式性能非常不好，但疑似受限于 https://github.com/facebook/react/issues/16734 ，只能先这样 */}
        <AuthComponent auth="print">
          <OrderPrint id={printId} onlyPrint />
        </AuthComponent>
      </PageHeaderLayout>
    );
  }
}

export default PlatformDeal;
