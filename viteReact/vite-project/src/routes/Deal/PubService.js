import { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Card } from 'antd';
import moment from 'moment';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import IconFont from '@/components/Icon';
import DataContent from '@/components/PubServiceCard/DataContent';
import DealCancelModal from '@/components/Modal/DealCancelModal';
import { formatTimeDuration, formatDate, formatDateTime, formatMoneyLen2, formatModel } from '@/utils/format';
import { getPageQuery, modelMapToOption, print } from '@/utils/utils';
import AuthComponent from '@/components/AuthComponent';
import OrderPrint from '@/components/OrderPrint';

@connect(({ pubservice, venue, deal, loading }) => ({
  pubservice,
  venue,
  deal,
  printFetching: loading.effects['print/fetch'],
}))
class PubServiceDeal extends Component {
  columns = [
    {
      title: '服务订单',
      dataIndex: 'dealServicePub.id',
      width: 90,
    },
    {
      title: '主订单号',
      dataIndex: 'deal.id',
      width: 90,
    },
    {
      title: '订单状态',
      dataIndex: 'dealServicePub.dealState',
      render: value => {
        const {
          pubservice: { DealStatus },
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
      title: '服务名称',
      dataIndex: 'dealServicePub.serviceName',
      width: 240,
    },
    {
      title: '数量',
      dataIndex: 'dealServicePub.buyNum',
      collect: true,
      width: 60,
    },
    {
      title: '服务价格',
      dataIndex: 'dealServicePub.servicePrice',
      render: formatMoneyLen2,
      collect: true,
      width: 90,
    },
    {
      title: '成交价',
      dataIndex: 'dealServicePub.transactionPrice',
      render: formatMoneyLen2,
      collect: true,
      width: 80,
    },
    {
      title: '成交总价',
      dataIndex: 'dealServicePub.transactionTotalPrice',
      render: formatMoneyLen2,
      collect: true,
      width: 80,
    },
    {
      title: '营销中心',
      dataIndex: 'dealServicePub.salesName',
      width: 190,
    },
    {
      title: '有效类型',
      dataIndex: 'dealServicePub.serviceType',
      render: value => {
        const {
          pubservice: { ServiceTypes },
        } = this.props;
        return formatModel(ServiceTypes, value);
      },
      width: 90,
    },
    {
      title: '有效期/天',
      dataIndex: 'dealServicePub.serviceValid',
      render: value => formatTimeDuration(value),
      width: 90,
    },
    {
      title: '有效开始日期',
      dataIndex: 'dealServicePub.startDate',
      render: formatDate,
      width: 110,
    },
    {
      title: '有效结束日期',
      dataIndex: 'dealServicePub.endDate',
      render: formatDate,
      width: 110,
    },
    {
      title: '服务内容',
      dataIndex: 'dealServicePub.dealServicePubSnapList',
      render: (value, { dealServicePub: { serviceUseMode } }) => (
        <DataContent pubServiceDataList={value} serviceUseMode={serviceUseMode} />
      ),
      width: 300,
    },
    {
      title: '服务编号',
      dataIndex: 'dealServicePub.serviceId',
      width: 80,
    },
    {
      title: '订单备注',
      dataIndex: 'deal.userMessage',
      width: 120,
    },
    {
      title: '商家留言',
      dataIndex: 'deal.sellerMessage',
      width: 120,
    },
    {
      title: '取消原因',
      dataIndex: 'deal.cancelMessage',
      width: 120,
    },
    {
      title: '更新人',
      dataIndex: 'deal.updateRealName',
      width: 120,
    },
    {
      title: '更新时间',
      dataIndex: 'dealServicePub.updateTime',
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
      dataIndex: 'dealServicePub.createTime',
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
      dataIndex: 'deal.companyName',
      width: 200,
    },
  ];

  formSearch = {
    fields: [
      {
        label: '服务名称',
        name: 'serviceName',
      },
      {
        label: '主订单号',
        name: 'dealId',
      },
      {
        label: '订单状态',
        name: 'dealState',
        mode: 'multiple',
        options: (() => {
          const {
            pubservice: { DealStatus },
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
      {
        label: '业务来源编号',
        name: 'srvId',
        defHidden: true,
      },
      {
        label: '服务编号',
        name: 'serviceId',
        initialValue: (() => {
          const { serviceId } = getPageQuery();
          if (serviceId) {
            return serviceId;
          }
        })(),
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
            // dispatch({
            //   type: 'pubserviceselling/dealedit',
            //   payload: {
            //     deal: selectedRows[0].deal,
            //     dealServicePubList: [selectedRows[0].dealServicePub],
            //   },
            // });
            dispatch(
              push({
                pathname: `/basic/pub/pubservice/${selectedRows[0].dealServicePub.serviceId}/sell`,
                search: `id=${selectedRows[0].deal.id}`,
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

  goToSummary = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    dispatch(
      push({
        pathname: `/basic/pub/pubservice/${selectedRows[0].dealServicePub.serviceId}/summary`,
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
            url="/dealServicePub/dataList.do"
            columns={this.columns}
            // https://ant.design/components/table-cn/#%E6%B3%A8%E6%84%8F
            rowKey={record => record.dealServicePub.id}
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

export default PubServiceDeal;
