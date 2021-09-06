import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { message, Card } from 'antd';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import LevelView from '@/components/LevelView';
import { modelMapToOption } from '@/utils/utils';
import { formatDateTime, formatSubSeq, formatMoneyLen2 } from '@/utils/format';
import Invoiced from '../Invoiced';
import Company from '../Company';
import InvoiceContent from './InvoiceContent';

@connect(({ deal }) => ({
  deal,
}))
class Uninvoiced extends Component {
  state = {
    showContentMode: undefined,
  };

  columns = [
    {
      title: '订单号',
      dataIndex: 'id',
      width: 110,
    },
    {
      title: '订单类型',
      dataIndex: 'subDealType',
      render: formatSubSeq,
      width: 110,
    },
    {
      title: '账单金额',
      dataIndex: 'dealAmount',
      render: formatMoneyLen2,
      collect: true,
      width: 90,
    },
    {
      title: '账单信息',
      dataIndex: 'descr',
      width: 300,
    },
    {
      title: '业务来源',
      dataIndex: 'srvName',
      width: 130,
    },
    {
      title: '支付时间',
      dataIndex: 'updateTime',
      render: formatDateTime,
      width: 190,
    },
    {
      title: '创建人',
      dataIndex: 'createRealName',
      width: 110,
    },
    {
      title: '下单/创建时间',
      dataIndex: 'createTime',
      render: formatDateTime,
      width: 190,
    },
  ];

  formSearch = {
    fields: [
      [
        {
          label: '支付时间(始)',
          name: 'startUpdateTime',
          placeholder: '开始',
          type: ItemTypes.DatePickerRangeStart,
        },
        {
          label: '支付时间(止)',
          name: 'endUpdateTime',
          placeholder: '结束',
          type: ItemTypes.DatePickerRangeEnd,
        },
      ],
      {
        label: '主订单号',
        name: 'dealId',
      },
      {
        label: '订单类型',
        name: 'subDealTypes',
        mode: 'multiple',
        options: (() => {
          const {
            deal: { SubSeqTypes },
          } = this.props;
          return modelMapToOption(SubSeqTypes);
        })(),
        type: ItemTypes.Select,
        defHidden: true,
      },
    ],
  };

  operation = {
    buttons: [
      {
        text: '申请开票',
        type: 'primary',
        forRow: rows => rows.length > 0,
        action: () => {
          this.setState({
            showContentMode: 1,
          });
        },
      },
      {
        text: '开票历史',
        action: () => {
          const { pubAccountId } = this.props;
          const { pushView } = this.context;
          pushView(
            <LevelView.SubView title="开票历史">
              <Invoiced pubAccountId={pubAccountId} />
            </LevelView.SubView>
          );
        },
      },
      {
        text: '发票信息管理',
        action: () => {
          const { pubAccountId } = this.props;
          const { pushView } = this.context;
          pushView(
            <LevelView.SubView title="发票信息管理">
              <Company pubAccountId={pubAccountId} />
            </LevelView.SubView>
          );
        },
      },
      {
        auth: 'export',
        btnType: ButtonTypes.Export,
      },
      // {
      //   text: '收货地址管理',
      //   action: () => {},
      // },
    ],
  };

  static contextTypes = {
    pushView: PropTypes.func,
  };

  cancelContent = () => {
    this.setState({
      showContentMode: null,
    });
  };

  handleSelectedChange = (_, rows) => {
    this.setState(({ showContentMode }) => ({
      showContentMode: rows == null || rows.length === 0 ? null : showContentMode,
    }));
  };

  handleTableInit = table => {
    this.table = table;
  };

  handleInvoiceSubmit = result => {
    if (result) {
      message.success('申请成功');
      this.cancelContent();
      this.table.reload();
    }
  };

  render() {
    const { pubAccountId } = this.props;
    const { showContentMode } = this.state;
    return (
      <Card bordered={false}>
        <Datatable
          select="multi"
          url={`/invoice/queryDealList.do?pubAccountId=${pubAccountId}`}
          onSelectedChange={this.handleSelectedChange}
          columns={this.columns}
          rowKey="id"
          formSearch={this.formSearch}
          operation={this.operation}
          onInit={this.handleTableInit}
          content={(() => {
            switch (showContentMode) {
              case 1:
                return (
                  <InvoiceContent
                    pubAccountId={pubAccountId}
                    cancel={this.cancelContent}
                    sure={this.handleInvoiceSubmit}
                  />
                );
              default:
                return null;
            }
          })()}
        />
      </Card>
    );
  }
}

export default Uninvoiced;
