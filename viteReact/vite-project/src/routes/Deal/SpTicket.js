import { Component } from 'react';
import moment from 'moment';
import { stringify } from 'qs';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Card } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import IconFont from '@/components/Icon';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import DealCancelModal from '@/components/Modal/DealCancelModal';
import {
  formatDate,
  formatHM,
  formatMoneyLen2,
  formatDateTime,
  formatPayWay,
  formatModel,
  formatColorWrapper,
  formatStudyList,
} from '@/utils/format';
import { getPageQuery, modelMapToOption, print } from '@/utils/utils';
import AuthComponent from '@/components/AuthComponent';
import OrderPrint from '@/components/OrderPrint';

@connect(({ venue, pubticket, deal, loading }) => ({
  venue,
  pubticket,
  deal,
  printFetching: loading.effects['print/fetch'],
}))
class Ticket extends Component {
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

  numRender = value => formatColorWrapper()(value);

  columns = [
    {
      title: '票务订单号',
      dataIndex: 'dealSportPlatformTicket.id',
      width: 90,
    },
    {
      title: '主订单号',
      dataIndex: 'deal.id',
      width: 90,
    },
    {
      title: '订单状态',
      dataIndex: 'dealSportPlatformTicket.dealState',
      render: value => {
        const {
          pubticket: { DealStatus },
        } = this.props;
        return formatModel(DealStatus, value);
      },
      width: 90,
    },
    {
      title: '会员姓名',
      dataIndex: 'deal.pubRealName',
      width: 90,
    },
    {
      title: '会员手机号',
      dataIndex: 'deal.pubMobile',
      width: 130,
    },
    {
      title: '入场人员',
      dataIndex: 'dealSportPlatformTicket.dealSportTicketStudyList',
      render: formatStudyList,
      width: 200,
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
      width: 130,
    },
    {
      title: '支付信息',
      dataIndex: 'payInfo.payDescription',
      width: 170,
    },
    {
      title: '退款信息',
      dataIndex: 'payInfo.refundDescription',
      width: 170,
    },
    {
      title: '数量',
      dataIndex: 'dealSportPlatformTicket.salesNum',
      collect: true,
      width: 60,
    },
    {
      title: '单价',
      dataIndex: 'dealSportPlatformTicket.ticketPrice',
      render: formatMoneyLen2,
      collect: true,
      width: 80,
    },
    {
      title: '总价',
      dataIndex: 'dealSportPlatformTicket.ticketTotalPrice',
      collect: true,
      render: formatMoneyLen2,
      width: 90,
    },
    {
      title: '订票日期',
      dataIndex: 'dealSportPlatformTicket.orderDate',
      render: formatDate,
      width: 110,
    },
    {
      title: '开始时间',
      dataIndex: 'dealSportPlatformTicket.startTime',
      render: formatHM,
      width: 80,
    },
    {
      title: '结束时间',
      dataIndex: 'dealSportPlatformTicket.endTime',
      render: formatHM,
      width: 80,
    },
    {
      title: '场馆/场地',
      dataIndex: 'dealSportPlatformTicket.platformName',
      width: 130,
    },
    {
      title: '类型',
      dataIndex: 'dealSportPlatformTicket.professionalId',
      render: value => {
        const {
          venue: { ProfessionTypes },
        } = this.props;
        return formatModel(ProfessionTypes, value);
      },
      width: 90,
    },
    {
      title: '营销中心',
      dataIndex: 'deal.salesName',
      width: 180,
    },
    {
      title: '回码',
      dataIndex: 'dealSportPlatformTicket.ticketCode',
      width: 100,
    },
    {
      title: '订单备注',
      dataIndex: 'deal.userMessage',
      width: 130,
    },
    {
      title: '商家留言',
      dataIndex: 'deal.sellerMessage',
      width: 130,
    },
    {
      title: '取消原因',
      dataIndex: 'deal.cancelMessage',
      width: 120,
    },
    {
      title: '核验状态',
      dataIndex: 'dealSportPlatformTicket.checkState',
      render: value => {
        const {
          pubticket: { CheckStatus },
        } = this.props;
        return formatModel(CheckStatus, value);
      },
      width: 80,
    },
    {
      title: '核验数',
      children: [
        {
          title: '已核验数',
          dataIndex: 'dealSportPlatformTicket.checkNum',
          render: this.genLinkWrapperRender(
            this.numRender,
            (value, record) => {
              const {
                dealSportPlatformTicket: { dealId },
              } = record;
              return {
                dealId,
              };
            },
            value => value === 0
          ),
          width: 80,
        },
        {
          title: '未核验数',
          render: (value, { dealSportPlatformTicket: { salesNum, checkNum } }) =>
            formatColorWrapper()(salesNum - checkNum),
          width: 80,
        },
      ],
    },
    {
      title: '核验人',
      dataIndex: 'dealSportPlatformTicket.checkName',
      render: (value, { dealSportPlatformTicket: { checkMobile } }) =>
        `${value || ''}${checkMobile ? '/' : ''}${checkMobile || ''}`,
      width: 180,
    },
    {
      title: '核验时间',
      dataIndex: 'dealSportPlatformTicket.checkDate',
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
      dataIndex: 'dealSportPlatformTicket.gmtModified',
      render: formatDateTime,
      width: 180,
    },
    {
      title: '创建人',
      dataIndex: 'deal.createRealName',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'dealSportPlatformTicket.gmtCreate',
      render: formatDateTime,
      width: 180,
    },
    {
      title: '业务来源',
      dataIndex: 'deal.srvName',
      width: 110,
    },
    {
      title: '单位名称',
      dataIndex: 'dealSportPlatformTicket.companyName',
      width: 150,
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
            pubticket: { DealStatus },
          } = this.props;
          return modelMapToOption(DealStatus);
        })(),
        type: ItemTypes.Select,
      },
      {
        label: '核验状态',
        name: 'checkStates',
        mode: 'multiple',
        options: (() => {
          const {
            pubticket: { CheckStatus },
          } = this.props;
          return modelMapToOption(CheckStatus);
        })(),
        initialValue: (() => {
          const { checkState } = getPageQuery();
          if (checkState) {
            return [+checkState];
          }
        })(),
        type: ItemTypes.Select,
      },
      {
        label: '主订单号',
        name: 'dealId',
      },
      {
        label: '票务订单号',
        name: 'id',
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
        label: '营销中心',
        name: 'salesId',
        initialValue: (() => {
          const { salesId } = getPageQuery();
          if (salesId) {
            return +salesId;
          }
        })(),
        type: ItemTypes.CascaderVenue,
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
      [
        {
          label: '票务日期(始)',
          name: 'startOrderDate',
          placeholder: '开始',
          initialValue: (() => {
            const { orderStartDate } = getPageQuery();
            if (orderStartDate) {
              return moment(+orderStartDate);
            }
          })(),
          type: ItemTypes.DatePickerRangeStart,
          defHidden: true,
        },
        {
          label: '票务日期(止)',
          name: 'endOrderDate',
          placeholder: '结束',
          initialValue: (() => {
            const { orderEndDate } = getPageQuery();
            if (orderEndDate) {
              return moment(+orderEndDate);
            }
          })(),
          type: ItemTypes.DatePickerRangeEnd,
          defHidden: true,
        },
      ],
      [
        {
          label: '更新时间(始)',
          name: 'startDate',
          placeholder: '开始',
          type: ItemTypes.DatePickerRangeStart,
          defHidden: true,
        },
        {
          label: '更新时间(止)',
          name: 'endDate',
          placeholder: '结束',
          type: ItemTypes.DatePickerRangeEnd,
          defHidden: true,
        },
      ],
      {
        label: '业务来源编号',
        name: 'srvId',
        defHidden: true,
      },
      [
        {
          label: '开始时间',
          name: 'startTime',
          type: ItemTypes.TimePickerRangeStart2,
          defHidden: true,
        },
        {
          label: '结束时间',
          name: 'endTime',
          type: ItemTypes.TimePickerRangeEnd2,
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
            const { selectedRows } = this.state;
            const { deal } = selectedRows[0];
            dispatch(
              push({
                pathname: '/basic/platform/booking/summary',
                search: `id=${deal.id}`,
              })
            );
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
            url="/dealSportPlatformTicket/sportPlatformTicketList.do"
            columns={this.columns}
            // https://ant.design/components/table-cn/#%E6%B3%A8%E6%84%8F
            rowKey={record => record.dealSportPlatformTicket.id}
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

export default Ticket;
