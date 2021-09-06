import { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import Modal from '@/components/Modal';
import AmountColor from '@/components/Amount/Color';
import CountInput from '@/components/CountInput';
import EditableCellTable from '@/components/EditableCellTable';
import FastSaveOrderButton from '@/components/Button/FastSaveOrderButton';
import { formatDate, formatMoney, formatMoneyLen2 } from '@/utils/format';
import { mul, add } from '@/commons/lib/math';

@connect(({ venue, booking, loading }) => ({
  venue,
  booking,
  saving: loading.effects['orderprocessing/saveOrder'] || loading.effects['booking/fastSaveOrder'],
}))
class SellTicketModal extends Component {
  tableAlign = 'center';

  columns = [
    {
      title: '场地',
      align: this.tableAlign,
      dataIndex: 'cellData.platform.platformName',
      render: (value, record) =>
        `${
          record.cellData.platform.parentPlatformName ? `${record.cellData.platform.parentPlatformName}-` : ''
        }${value}`,
    },
    {
      title: '单价(元)',
      align: this.tableAlign,
      dataIndex: 'cellData.priceInfo.price',
      render: formatMoneyLen2,
    },
    {
      title: '张数',
      align: this.tableAlign,
      dataIndex: 'salesNum',
      editable: {
        required: true,
        node: <CountInput />,
        onNode: () => {
          return { min: 1 };
        },
      },
      render: value => <AmountColor inputSize>{value}</AmountColor>,
    },
    {
      title: '总价(元)',
      align: this.tableAlign,
      dataIndex: 'transactionTotalPrice',
      render: value => <AmountColor inputSize>{formatMoney(value)}</AmountColor>,
    },
  ];

  state = {
    // `${orderInfo.id}-${platform.id}` 为key
    numberMapping: {},
  };

  handleEdit = ({ cellData, salesNum }) => {
    const { numberMapping } = this.state;
    this.setState({
      numberMapping: {
        ...numberMapping,
        [`${cellData.orderInfo.id}-${cellData.platform.id}`]: salesNum,
      },
    });
  };

  sure = (arg, summary, isIndividual) => {
    const { onOk, list } = this.props;
    if (onOk == null) {
      return;
    }
    const { numberMapping } = this.state;
    return onOk(
      arg,
      // 没动过数量的numberMapping没值
      numberMapping,
      list.filter(item => item.cellData.orderInfo),
      summary,
      isIndividual
    );
  };

  toFastSummary = (mode, changePaidPrice, totalPrice) => {
    const { toFastSummaryByTicket, list } = this.props;
    const { numberMapping } = this.state;
    toFastSummaryByTicket(
      mode,
      changePaidPrice,
      totalPrice,
      // 没动过数量的numberMapping没值
      numberMapping,
      list.filter(item => item.cellData.orderInfo)
    );
  };

  toIndividual = arg => {
    this.sure(arg, false, true);
  };

  render() {
    const { form, list, booking, onOk, saving, canFastSummary, ...restProps } = this.props;
    const { numberMapping } = this.state;

    const newList = (list || [])
      .filter(item => item.cellData && item.cellData.orderInfo)
      .map(item => {
        const { orderInfo, priceInfo, timeSlot, platform } = item.cellData;
        const salesNum = numberMapping[`${orderInfo.id}-${platform.id}`] || item.salesNum || 1;
        return {
          ...item,
          salesNum,
          transactionTotalPrice: mul(salesNum, (priceInfo ? priceInfo.price : timeSlot.price) || 0),
        };
      });

    // transactionTotalPrice 上面已经乘以了数量
    const totalPrice = newList.reduce((prev, { transactionTotalPrice }) => add(prev, transactionTotalPrice), 0);

    return (
      <Modal
        title="售票"
        width={640}
        {...restProps}
        onOk={this.sure}
        footer={[
          <Button key="close" link="cancel" disabled={saving} />,
          canFastSummary && (
            <FastSaveOrderButton
              key="qk"
              loading={saving}
              disabled={newList.length === 0}
              totalPrice={totalPrice}
              onSummary={this.toFastSummary}
            >
              快速结算
            </FastSaveOrderButton>
          ),
          canFastSummary && (
            <Button key="sk" onClick={this.toIndividual} loading={saving} disabled={newList.length === 0}>
              散客结算
            </Button>
          ),
          <Button key="ok" link="ok" disabled={saving || newList.length === 0}>
            下一步
          </Button>,
        ]}
      >
        {newList.length > 0 ? (
          <div>
            <h4>购票信息</h4>
            <div>
              购票日期&nbsp;
              {formatDate(newList[0].orderDate)}
            </div>
            <EditableCellTable
              rowKey={record => `${record.cellData.orderInfo.id}-${record.cellData.platform.id}`}
              columns={this.columns}
              dataSource={newList}
              pagination={false}
              onEdit={this.handleEdit}
            />
          </div>
        ) : (
          '无可售数量'
        )}
      </Modal>
    );
  }
}

export default SellTicketModal;
