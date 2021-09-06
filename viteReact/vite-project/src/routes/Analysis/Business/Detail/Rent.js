import { Component } from 'react';
import { Card } from 'antd';
import { connect } from 'react-redux';
import Datatable, { ButtonTypes } from '@/components/Datatable';
import { formatMoney, formatColorWrapper } from '@/utils/format';

@connect(({ venue, deal, analysis }) => ({
  venue,
  deal,
  analysis,
}))
class AnalysisBusinessDetailRent extends Component {
  // eslint-disable-next-line react/sort-comp
  moneyRender = value => formatColorWrapper(formatMoney)(value);

  columns = [
    {
      title: '主订单号',
      dataIndex: 'analysisDeal.dealId',
      width: 100,
    },
  ];

  formSearch = {
    fields: [],
  };

  operation = {
    buttons: [
      {
        auth: 'export-rent',
        btnType: ButtonTypes.Export,
      },
    ],
  };

  render() {
    return (
      <Card bordered={false}>
        <Datatable
          url="/analysisLease/dataList.do"
          columns={this.columns}
          rowKey={record => record.analysisScanCode.id}
          formSearch={this.formSearch}
          operation={this.operation}
          rowSpanByValue={record => `${record.analysisDeal.dealId}-${record.analysisDeal.operationAction}`}
        />
      </Card>
    );
  }
}

export default AnalysisBusinessDetailRent;
