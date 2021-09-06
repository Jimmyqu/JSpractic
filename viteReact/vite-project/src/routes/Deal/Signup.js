import { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Card } from 'antd';
import moment from 'moment';
import IconFont from '@/components/Icon';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import DealCancelModal from '@/components/Modal/DealCancelModal';
import {
  formatDate,
  formatMoneyLen2,
  formatDateTime,
  formatPayWay,
  formatModel,
  formatStudyList,
} from '@/utils/format';
import { modelMapToOption, print, getPageQuery } from '@/utils/utils';
import AuthComponent from '@/components/AuthComponent';
import OrderPrint from '@/components/OrderPrint';

@connect(({ venue, pubsignup, deal, loading }) => ({
  venue,
  pubsignup,
  deal,
  printFetching: loading.effects['print/fetch'],
}))
class Signup extends Component {
  columns = [
    {
      title: '报名订单',
      dataIndex: 'dealSignup.id',
      width: 90,
    },
    {
      title: '主订单号',
      dataIndex: 'deal.id',
      width: 90,
    },
    {
      title: '报名状态',
      dataIndex: 'dealSignup.dealState',
      render: value => {
        const {
          pubsignup: { DealStatus },
        } = this.props;
        return formatModel(DealStatus, value);
      },
      width: 80,
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
      title: '报名人员信息',
      dataIndex: 'dealSignup.dealSignupMemberList',
      render: formatStudyList,
      width: 260,
    },
    {
      title: '活动名称',
      dataIndex: 'dealSignup.objectName',
      width: 290,
    },
    {
      title: '报名价格',
      dataIndex: 'dealSignup.signupPrice',
      render: formatMoneyLen2,
      collect: true,
      width: 100,
    },
    {
      title: '成交价格',
      dataIndex: 'dealSignup.transactionPrice',
      render: formatMoneyLen2,
      collect: true,
      width: 100,
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
      width: 130,
    },
    {
      title: '退款信息',
      dataIndex: 'payInfo.refundDescription',
      width: 130,
    },
    // {
    //   title: '记录报名信息中的值',
    //   dataIndex: 'dealSignup.signupStrValue',
    // },
    // {
    //   title: '报名成员帐号基本信息',
    //   dataIndex: 'dealSignup.pubUserBasicStr',
    // },
    {
      title: '活动类型',
      dataIndex: 'dealSignup.objectType',
      render: value => {
        const {
          pubsignup: { EventTypes },
        } = this.props;
        return formatModel(EventTypes, value);
      },
      width: 80,
    },
    {
      title: '活动时间(始)',
      dataIndex: 'dealSignup.objectStartDate',
      render: formatDate,
      width: 120,
    },
    {
      title: '活动时间(止)',
      dataIndex: 'dealSignup.objectEndDate',
      render: formatDate,
      width: 120,
    },
    {
      title: '报名时间(始)',
      dataIndex: 'dealSignup.signupStartDate',
      render: formatDate,
      width: 120,
    },
    {
      title: '报名时间(止)',
      dataIndex: 'dealSignup.signupEndDate',
      render: formatDate,
      width: 120,
    },
    {
      title: '地址',
      dataIndex: 'dealSignup.objectAddress',
      width: 150,
    },
    {
      title: '联系人',
      dataIndex: 'dealSignup.objectContacts',
      width: 100,
    },
    {
      title: '联系方式',
      dataIndex: 'dealSignup.objectTel',
      width: 120,
    },
    {
      title: '投票数',
      dataIndex: 'dealSignup.ranks',
      width: 90,
    },
    {
      title: '更新人',
      dataIndex: 'deal.updateRealName',
      width: 120,
    },
    {
      title: '更新时间',
      dataIndex: 'dealSignup.updateTime',
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
      dataIndex: 'dealSignup.createTime',
      render: formatDateTime,
      width: 180,
    },
    {
      title: '业务来源',
      dataIndex: 'deal.srvName',
      width: 120,
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
        label: '订单状态',
        name: 'dealState',
        mode: 'multiple',
        options: (() => {
          const {
            pubsignup: { DealStatus },
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
      },
      {
        label: '会员手机号',
        name: 'publicMobile',
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
        label: '活动名称',
        name: 'objectName',
        defHidden: true,
      },
      {
        label: '活动类型',
        name: 'objectType',
        options: (() => {
          const {
            pubsignup: { EventTypes },
          } = this.props;
          return modelMapToOption(EventTypes);
        })(),
        type: ItemTypes.Select,
        defHidden: true,
      },
      [
        {
          label: '活动时间(始)',
          name: 'objectStartDate',
          placeholder: '开始',
          type: ItemTypes.DatePickerRangeStart,
          defHidden: true,
        },
        {
          label: '活动时间(止)',
          name: 'objectEndDate',
          placeholder: '结束',
          type: ItemTypes.DatePickerRangeEnd,
          defHidden: true,
        },
      ],
      [
        {
          label: '报名时间(始)',
          name: 'signupStartDate',
          placeholder: '开始',
          type: ItemTypes.DatePickerRangeStart,
          defHidden: true,
        },
        {
          label: '报名时间(止)',
          name: 'signupEndDate',
          placeholder: '结束',
          type: ItemTypes.DatePickerRangeEnd,
          defHidden: true,
        },
      ],
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
      {
        label: '业务来源编号',
        name: 'srvId',
        defHidden: true,
      },
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
        pathname: `/basic/deal/${selectedRows[0].deal.id}/summary`,
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
            url="/dealSignup/dataList.do"
            columns={this.columns}
            // https://ant.design/components/table-cn/#%E6%B3%A8%E6%84%8F
            rowKey={record => record.dealSignup.id}
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

export default Signup;
