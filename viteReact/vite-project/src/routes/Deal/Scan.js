import { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Card } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import IconFont from '@/components/Icon';
import DealCancelModal from '@/components/Modal/DealCancelModal';
import { formatMoneyLen2, formatDateTime, formatPayWay, formatModel } from '@/utils/format';
import { modelMapToOption, print, getPageQuery } from '@/utils/utils';
import AuthComponent from '@/components/AuthComponent';
import OrderPrint from '@/components/OrderPrint';

@connect(({ venue, pubscan, deal, loading }) => ({
  venue,
  pubscan,
  deal,
  printFetching: loading.effects['print/fetch'],
}))
class ScanDeal extends Component {
  columns = [
    {
      title: '扫码订单号',
      dataIndex: 'dealScanCode.id',
      width: 110,
    },
    {
      title: '主订单号',
      dataIndex: 'deal.id',
      width: 100,
    },
    {
      title: '订单状态',
      dataIndex: 'dealScanCode.dealState',
      render: value => {
        const {
          pubscan: { DealStatus },
        } = this.props;
        return formatModel(DealStatus, value);
      },
      width: 100,
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
      title: '支付方式',
      dataIndex: 'payInfo.payList',
      render: (_, record) => formatPayWay(record),
      width: 130,
    },
    {
      title: '发生金额',
      dataIndex: 'dealScanCode.amount',
      render: formatMoneyLen2,
      collect: true,
      width: 100,
    },
    {
      title: '订单备注',
      dataIndex: 'deal.userMessage',
      width: 250,
    },
    {
      title: '备注',
      dataIndex: 'deal.descr',
      width: 250,
    },
    {
      title: '营销中心',
      dataIndex: 'deal.salesName',
      width: 190,
    },
    {
      title: '更新人',
      dataIndex: 'deal.updateRealName',
      width: 120,
    },
    {
      title: '更新时间',
      dataIndex: 'dealScanCode.gmtModified',
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
      dataIndex: 'dealScanCode.gmtCreate',
      render: formatDateTime,
      width: 180,
    },
    {
      title: '单位名称',
      dataIndex: 'deal.companyName',
      width: 190,
    },
  ];

  formSearch = {
    fields: [
      {
        label: '营销中心',
        name: 'salesId',
        initialValue: (() => {
          const { salesId, dealState } = getPageQuery();
          const {
            venue: { currentVenue },
          } = this.props;
          if (salesId === '' || dealState) {
            return '';
          }
          if (salesId) {
            return +salesId;
          }
          return currentVenue.id;
        })(),
        type: ItemTypes.CascaderVenue,
      },
      {
        label: '订单状态',
        name: 'dealState',
        mode: 'multiple',
        options: (() => {
          const {
            pubscan: { DealStatus },
          } = this.props;
          return modelMapToOption(DealStatus);
        })(),
        initialValue: (() => {
          const { dealState } = getPageQuery();
          if (dealState) {
            return dealState
              .split(',')
              .filter(id => id)
              .map(id => +id);
          }
        })(),
        type: ItemTypes.Select,
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
      // },
      {
        label: '主订单号',
        name: 'dealId',
        defHidden: true,
      },
      {
        label: '创建人',
        name: 'createRealName',
        defHidden: true,
      },
      [
        {
          label: '创建时间(始)',
          name: 'startTime',
          placeholder: '开始',
          type: ItemTypes.DatePickerRangeStart,
          defHidden: true,
        },
        {
          label: '创建时间(止)',
          name: 'endTime',
          placeholder: '结束',
          type: ItemTypes.DatePickerRangeEnd,
          defHidden: true,
        },
      ],
      [
        {
          label: '更新时间(始)',
          name: 'modifiedStartTime',
          placeholder: '开始',
          type: ItemTypes.DatePickerRangeStart,
          defHidden: true,
        },
        {
          label: '更新时间(止)',
          name: 'modifiedEndTime',
          placeholder: '结束',
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
            const { selectedRows } = this.state;
            dispatch(
              push({
                pathname: `/basic/deal/${selectedRows[0].deal.id}/summary`,
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
            url="/dealScanCode/dataList.do"
            columns={this.columns}
            // https://ant.design/components/table-cn/#%E6%B3%A8%E6%84%8F
            rowKey={record => record.dealScanCode.id}
            formSearch={this.formSearch}
            operation={this.operation()}
            onInit={this.handleTableInit}
            onBeforeLoadData={this.handleBeforeLoadData}
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

export default ScanDeal;
