import { Component } from 'react';
import { connect } from 'react-redux';
import { Card } from 'antd';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { formatMoney, formatDateTime, formatModel, formatMoneyLen2 } from '@/utils/format';
import { modelMapToOption } from '@/utils/utils';

@connect(({ pubmktmb, global }) => ({
  pubmktmb,
  RelTypes: global.RelTypes,
}))
class List extends Component {
  columns = [
    {
      title: '编号',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '分成报表编号',
      dataIndex: 'performanceReportId',
      width: 110,
    },
    {
      title: '数据订单编号',
      dataIndex: 'dataDealId',
      width: 110,
    },
    {
      title: '数据编号',
      dataIndex: 'dataId',
      width: 80,
    },
    {
      title: '数据类型',
      dataIndex: 'relType',
      render: value => {
        const { RelTypes } = this.props;
        return formatModel(RelTypes, value);
      },
      width: 150,
    },
    {
      title: '数据名称',
      dataIndex: 'dataName',
      width: 150,
    },
    {
      title: '数量',
      dataIndex: 'dataNum',
      collect: true,
      width: 80,
    },
    {
      title: '成交价格（元）',
      dataIndex: 'dataTransactionPrice',
      render: formatMoneyLen2,
      collect: true,
      width: 120,
    },
    {
      title: '销售分组名称',
      dataIndex: 'dataGroupName',
      width: 140,
    },
    {
      title: '销售分成配置名称',
      dataIndex: 'performanceConfigName',
      width: 140,
    },
    {
      title: '分成方式',
      dataIndex: 'performanceMode',
      render: value => {
        const {
          pubmktmb: { PerformanceModeTypes },
        } = this.props;
        return formatModel(PerformanceModeTypes, value);
      },
      width: 150,
    },
    {
      title: '分成值',
      dataIndex: 'performanceValue',
      render: (value, { performanceMode }) => {
        const {
          pubmktmb: { PerformanceModeTypes },
        } = this.props;
        if (performanceMode === PerformanceModeTypes.NUMBER_MONEY.key) {
          return formatMoney(value);
        }
        return `${formatMoney(value, 0)}%`;
      },
      width: 80,
    },
    {
      title: '销售分成金额（元）',
      dataIndex: 'performancePrice',
      render: formatMoneyLen2,
      collect: true,
      width: 160,
    },
    {
      title: '备注',
      dataIndex: 'descr',
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      render: formatDateTime,
      width: 190,
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
      title: '单位名称',
      dataIndex: 'companyName',
      width: 120,
    },
  ];

  formSearch = {
    fields: [
      {
        label: '分成方式',
        name: 'performanceMode',
        options: (() => {
          const {
            pubmktmb: { PerformanceModeTypes },
          } = this.props;
          return modelMapToOption(PerformanceModeTypes);
        })(),
        type: ItemTypes.Select,
      },
      {
        label: '数据类型',
        name: 'relType',
        options: (() => {
          const { RelTypes } = this.props;
          return modelMapToOption([RelTypes.COMMONCATEGORY_ITEM, RelTypes.EXERCISELIST]);
        })(),
        type: ItemTypes.Select,
      },
      {
        label: '数据名称',
        name: 'dataName',
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
    const { id } = params;
    return (
      <PageHeaderLayout title="分成报表日志">
        <Card bordered={false}>
          <Datatable
            select="multi"
            url={`/marketingPerformanceLog/performanceLogList.do?performanceReportId=${id}`}
            columns={this.columns}
            rowKey="id"
            formSearch={this.formSearch}
            operation={this.operation}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default List;
