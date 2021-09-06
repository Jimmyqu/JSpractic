import { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Card } from 'antd';
import moment from 'moment';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import IconFont from '@/components/Icon';
import { formatMoneyLen2, formatDateTime, formatModel } from '@/utils/format';
import AuthComponent from '@/components/AuthComponent';
import OrderPrint from '@/components/OrderPrint';
import { print, modelMapToOption, getPageQuery } from '@/utils/utils';

@connect(({ venue, pubwithdraw, deal, loading }) => ({
  venue,
  pubwithdraw,
  deal,
  printFetching: loading.effects['print/fetch'],
}))
class Withdraw extends Component {
  columns = [
    {
      title: '主订单号',
      dataIndex: 'dealId',
      width: 90,
    },
    {
      title: '提现订单编号',
      dataIndex: 'id',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'dealState',
      render: value => {
        const {
          pubwithdraw: { DealStatus },
        } = this.props;
        return formatModel(DealStatus, value);
      },
      width: 90,
    },
    {
      title: '提现类型',
      dataIndex: 'withdrawType',
      render: value => {
        const {
          pubwithdraw: { WithdrawTypes },
        } = this.props;
        return formatModel(WithdrawTypes, value);
      },
      width: 120,
    },
    {
      title: '会员服务编号',
      dataIndex: 'publicServiceId',
      width: 110,
    },
    {
      title: '会员服务账户编号',
      dataIndex: 'publicServiceAccountId',
      width: 110,
    },
    {
      title: '会员服务名称',
      dataIndex: 'publicServiceName',
      width: 250,
    },
    {
      title: '购买营销中心',
      dataIndex: 'buySalesName',
      width: 180,
    },
    {
      title: '会员姓名',
      dataIndex: 'publicAccountName',
      width: 130,
    },
    {
      title: '会员手机号',
      dataIndex: 'publicAccountMobile',
      width: 130,
    },
    {
      title: '收款人姓名',
      dataIndex: 'withdrawRealName',
      width: 130,
    },
    {
      title: '收款人手机号',
      dataIndex: 'withdrawMobile',
      width: 130,
    },
    {
      title: '提现金额',
      dataIndex: 'withdrawAmount',
      render: formatMoneyLen2,
      collect: true,
      width: 90,
    },
    {
      title: '提现支付方式',
      dataIndex: 'withdrawMode',
      render: value => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return formatModel(PayWayTypes, value);
      },
      width: 110,
    },
    {
      title: '营销中心',
      dataIndex: 'salesName',
      width: 180,
    },
    {
      title: '提现原因',
      dataIndex: 'descr',
      width: 250,
    },
    {
      title: '更新人',
      dataIndex: 'updateRealName',
      width: 120,
    },
    {
      title: '更新时间',
      dataIndex: 'gmtModified',
      render: formatDateTime,
      width: 190,
    },
    {
      title: '创建人',
      dataIndex: 'createRealName',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      render: formatDateTime,
      width: 190,
    },
    {
      title: '单位名称',
      dataIndex: 'companyName',
      width: 130,
    },
  ];

  formSearch = {
    fields: [
      {
        label: '营销中心',
        name: 'salesId',
        initialValue: (() => {
          const { salesIds } = getPageQuery();
          if (salesIds) {
            return +salesIds;
          }
        })(),
        type: ItemTypes.CascaderVenue,
      },
      {
        label: '订单状态',
        name: 'dealState',
        mode: 'multiple',
        options: (() => {
          const {
            pubwithdraw: { DealStatus },
          } = this.props;
          return modelMapToOption(DealStatus);
        })(),
        type: ItemTypes.Select,
      },
      {
        label: '收款人姓名',
        name: 'withdrawRealName',
      },
      {
        label: '收款人手机号',
        name: 'withdrawMobile',
        defHidden: true,
      },
      {
        label: '主订单号',
        name: 'dealId',
        defHidden: true,
      },
      {
        label: '提现类型',
        name: 'withdrawType',
        type: ItemTypes.Select,
        options: (() => {
          const {
            pubwithdraw: { WithdrawTypes },
          } = this.props;
          return modelMapToOption(WithdrawTypes);
        })(),
        defHidden: true,
      },
      {
        label: '会员服务编号',
        name: 'publicServiceName',
        defHidden: true,
      },
      {
        label: '会员服务账户编号',
        name: 'publicServiceAccountId',
        defHidden: true,
      },
      {
        label: '会员服务名称',
        name: 'publicServiceId',
        defHidden: true,
      },
      {
        label: '购买营销中心',
        name: 'buySalesId',
        options: (() => {
          const {
            venue: { list },
          } = this.props;
          return (list || []).map(item => ({
            key: item.id,
            text: item.salesName,
          }));
        })(),
        type: ItemTypes.Select,
        defHidden: true,
      },
      {
        label: '会员姓名',
        name: 'publicAccountName',
        defHidden: true,
      },
      {
        label: '会员手机号',
        name: 'publicAccountMobile',
        defHidden: true,
      },
      [
        {
          label: '创建时间(始)',
          name: 'startDate',
          type: ItemTypes.DatePickerRangeStart,
          defHidden: true,
        },
        {
          label: '创建时间(止)',
          name: 'endDate',
          type: ItemTypes.DatePickerRangeEnd,
          defHidden: true,
        },
      ],
      [
        {
          label: '更新时间(始)',
          name: 'modifiedStartTime',
          initialValue: (() => {
            const { orderStartDate, orderEndDate } = getPageQuery();
            if ((orderStartDate || orderEndDate) && orderStartDate) {
              return moment(+orderStartDate);
            }
          })(),
          type: ItemTypes.DatePickerRangeStart,
          defHidden: true,
        },
        {
          label: '更新时间(止)',
          name: 'modifiedEndTime',
          initialValue: (() => {
            const { orderStartDate, orderEndDate } = getPageQuery();
            if ((orderStartDate || orderEndDate) && orderEndDate) {
              return moment(+orderEndDate);
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
  };

  operation = () => {
    const {
      dispatch,
      pubwithdraw: { DealStatus },
      printFetching,
    } = this.props;
    return {
      buttons: [
        {
          text: '打印',
          icon: <IconFont type="print" />,
          loading: printFetching,
          auth: 'print',
          forRow: rows => {
            return rows.length === 1 && rows[0].dealState === DealStatus.DEAL_WITHDRAW_COMPLETED.key;
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
            return rows.length === 1 && rows[0].dealState === DealStatus.DEAL_WITHDRAW_COMPLETED.key;
          },
          action: () => {
            const { selectedRows } = this.state;
            dispatch(push(`./${selectedRows[0].dealId}/print`));
          },
        },
        {
          text: '订单详情',
          icon: <IconFont type="menu-deal-main" />,
          forRow: 'single',
          action: () => {
            const { selectedRows } = this.state;
            dispatch(push(`./${selectedRows[0].dealId}/detail`));
          },
        },
        {
          auth: 'export',
          btnType: ButtonTypes.Export,
        },
      ],
    };
  };

  handleSelectedChange = (_, rows) => {
    this.setState({
      selectedRows: rows,
    });
  };

  render() {
    const {
      pubwithdraw: { DealStatus },
    } = this.props;
    const { selectedRows } = this.state;
    const printId =
      selectedRows?.[0]?.dealState === DealStatus.DEAL_WITHDRAW_COMPLETED.key ? selectedRows[0].dealId : null;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Datatable
            select="multi"
            onSelectedChange={this.handleSelectedChange}
            url="/dealWithdraw/dataList.do"
            columns={this.columns}
            // https://ant.design/components/table-cn/#%E6%B3%A8%E6%84%8F
            rowKey="id"
            formSearch={this.formSearch}
            operation={this.operation()}
          />
        </Card>
        {/* //FIXME 选行即加载的方式性能非常不好，但疑似受限于 https://github.com/facebook/react/issues/16734 ，只能先这样 */}
        <AuthComponent auth="print">
          <OrderPrint id={printId} onlyPrint />
        </AuthComponent>
      </PageHeaderLayout>
    );
  }
}

export default Withdraw;
