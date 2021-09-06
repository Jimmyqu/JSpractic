import { Component } from 'react';
import { connect } from 'react-redux';
import { Card } from 'antd';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import { formatDateTime, formatMoneyLen2, formatPayWayFromList, formatModel } from '@/utils/format';
import { modelMapToOption } from '@/utils/utils';

@connect(({ payment, deal, venue, pubuser }) => ({
  payment,
  deal,
  venue,
  pubuser,
}))
class ProfileAmountFlow extends Component {
  columns = [
    {
      title: '账单流水号',
      dataIndex: 'id',
      width: 130,
    },
    {
      title: '主订单号',
      dataIndex: 'dataId',
      width: 100,
    },
    {
      title: '支付时间',
      dataIndex: 'payTime',
      render: formatDateTime,
      width: 190,
    },
    {
      title: '账单类型',
      dataIndex: 'payType',
      render: value => {
        const {
          deal: { BillTypes },
        } = this.props;
        return formatModel(BillTypes, value);
      },
      width: 80,
    },
    // {
    //   title: '订单金额',
    // },
    {
      title: '账户余额',
      dataIndex: 'pubAccountBalance',
      render: formatMoneyLen2,
      collect: true,
      width: 100,
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.WECHAT.value;
      })(),
      dataIndex: 'pubWechatCash',
      render: formatMoneyLen2,
      collect: true,
      width: 100,
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.ZFB.value;
      })(),
      dataIndex: 'pubZfbCash',
      render: formatMoneyLen2,
      collect: true,
      width: 100,
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.CASH.value;
      })(),
      dataIndex: 'pubCash',
      render: formatMoneyLen2,
      collect: true,
      width: 100,
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.BANKCARD.value;
      })(),
      dataIndex: 'pubBankCard',
      render: formatMoneyLen2,
      collect: true,
      width: 100,
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.BANKTRANSFER.value;
      })(),
      dataIndex: 'pubBankTransfer',
      render: formatMoneyLen2,
      collect: true,
      width: 100,
    },
    {
      title: '账户',
      dataIndex: 'pubAccountAmount',
      render: formatMoneyLen2,
      collect: true,
      width: 100,
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.CREDIT.value;
      })(),
      dataIndex: 'pubCreditCash',
      render: formatMoneyLen2,
      collect: true,
      width: 100,
    },
    {
      title: '支付方式',
      dataIndex: 'payMode',
      render: (_, record) => formatPayWayFromList(record.payNewMode || []),
      width: 140,
    },
    {
      title: '账单信息',
      dataIndex: 'descr',
      width: 600,
    },
    {
      title: '营销中心',
      dataIndex: 'salesName',
      width: 200,
    },
    {
      title: '业务来源',
      dataIndex: 'srvName',
      width: 80,
    },
    {
      title: '用户类型',
      dataIndex: 'createUserId',
      render: value => {
        const {
          pubuser: { UserTypes },
        } = this.props;
        return value < 50_000_000 ? UserTypes.SYS_USER.value : UserTypes.PUBACCOUNT_USER.value;
      },
      width: 80,
    },
    {
      title: '创建人',
      dataIndex: 'createRealName',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: formatDateTime,
      width: 190,
    },
  ];

  formSearch = {
    fields: [
      {
        label: '营销中心',
        name: 'salesId',
        type: ItemTypes.CascaderVenue,
      },
      {
        label: '支付状态',
        name: 'dealPayState',
        options: (() => {
          const {
            deal: { PayStatus },
          } = this.props;
          return modelMapToOption(PayStatus);
        })(),
        type: ItemTypes.Select,
      },
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
        label: '主订单号',
        name: 'dealId',
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
        label: '账单信息',
        name: 'descr',
        defHidden: true,
      },
      {
        label: '用户类型',
        name: 'userType',
        options: (() => {
          const {
            pubuser: { UserTypes },
          } = this.props;
          return modelMapToOption(UserTypes);
        })(),
        type: ItemTypes.Select,
        defHidden: true,
      },
      {
        label: '账单类型',
        name: 'payType',
        options: (() => {
          const {
            deal: { BillTypes },
          } = this.props;
          return modelMapToOption(BillTypes);
        })(),
        type: ItemTypes.Select,
        defHidden: true,
      },
    ],
  };

  operation = {
    buttons: [
      {
        auth: 'export',
        btnType: ButtonTypes.Export,
      },
    ],
  };

  render() {
    const {
      match: { params },
    } = this.props;
    const { id: pubAccountId } = params || {};

    return (
      <Card bordered={false}>
        <Datatable
          url={`/publicAccountRecord/dataList.do?pubAccountId=${pubAccountId}`}
          columns={this.columns}
          rowKey="id"
          formSearch={this.formSearch}
          operation={this.operation}
        />
      </Card>
    );
  }
}

export default ProfileAmountFlow;
