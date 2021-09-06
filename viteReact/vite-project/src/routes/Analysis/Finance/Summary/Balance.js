import { Component } from 'react';
import moment from 'moment';
import { Card, Icon, Popover } from 'antd';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import { formatMoney, formatDate, formatColorWrapper } from '@/utils/format';

class AnalysisFinanceSummaryBalance extends Component {
  // eslint-disable-next-line react/sort-comp
  moneyRender = value => formatColorWrapper(formatMoney)(value);

  numRender = value => formatColorWrapper()(value);

  columns = [
    {
      title: (
        <Popover content="按统计日期凌晨3点计算当天结余">
          <span>
            统计日期 <Icon type="question-circle" />
          </span>
        </Popover>
      ),
      dataIndex: 'analysisDate',
      render: formatDate,
      width: 110,
    },
    {
      title: '账户总结余',
      dataIndex: 'amountSurplus', // 原字段accountTotalBalance暂时保留
      render: this.moneyRender,
      width: 110,
    },
    {
      title: '总消费',
      dataIndex: 'amountPay',
      render: this.moneyRender,
      width: 110,
    },
    {
      title: '总充值',
      dataIndex: 'amountRecharge',
      render: this.moneyRender,
      width: 110,
    },
    {
      title: '总提现',
      dataIndex: 'amountWithdraw',
      render: this.moneyRender,
      width: 110,
    },
    {
      title: '总退款',
      dataIndex: 'amountRefund',
      render: this.moneyRender,
      width: 110,
    },
    {
      title: '总微信转账户',
      dataIndex: 'wechatToAccount',
      render: this.moneyRender,
      width: 110,
    },
    {
      title: '总支付宝转账户',
      dataIndex: 'alipayToAccount',
      render: this.moneyRender,
      width: 110,
    },
    {
      title: '上期结余',
      dataIndex: 'amountAfterSurplus',
      render: this.moneyRender,
      width: 110,
    },
    {
      title: '账户余额大于0总人数',
      dataIndex: 'accountTotalNum',
      render: this.numRender,
      width: 110,
    },
    {
      title: '白条总结余',
      dataIndex: 'creditTotalBalance',
      render: this.moneyRender,
      width: 110,
    },
    {
      title: '白条开通总人数',
      dataIndex: 'creditTotalNum',
      render: this.numRender,
      width: 110,
    },
    {
      title: '白条未还总额度',
      dataIndex: 'creditArrearageBalance',
      render: this.moneyRender,
      width: 110,
    },
    {
      title: '白条未还总人数',
      dataIndex: 'creditArrearageNum',
      render: this.numRender,
      width: 110,
    },
  ];

  formSearch = {
    fields: [
      [
        {
          name: 'presetDate',
          // initialValue: 2,
          type: ItemTypes.DatePickerRangePreset,
        },
        {
          label: '统计开始日期',
          name: 'analysisStartDate',
          initialValue: moment(),
          type: ItemTypes.DatePickerRangeStart,
        },
        {
          label: '统计结束日期',
          name: 'analysisEndDate',
          initialValue: moment(),
          type: ItemTypes.DatePickerRangeEnd,
        },
      ],
    ],
  };

  operation = {
    export: {
      ignoreSum: true,
    },
    buttons: [
      {
        auth: 'export-balance',
        btnType: ButtonTypes.Export,
      },
    ],
  };

  render() {
    return (
      <Card bordered={false}>
        <Datatable
          url="/analysis/finance/balanceSummary.do"
          columns={this.columns}
          rowKey="id"
          formSearch={this.formSearch}
          operation={this.operation}
        />
      </Card>
    );
  }
}

export default AnalysisFinanceSummaryBalance;
