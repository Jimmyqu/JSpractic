import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Card, message } from 'antd';
import IconFont from '@/components/Icon';
import Datatable, { ItemTypes } from '@/components/Datatable';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { formatMoneyLen2, formatDateTime } from '@/utils/format';
import PurchaseContent from './PurchaseContent';
import BreakContent from './BreakContent';
import TransferContent from './TransferContent';
import QRCodeImgDownloadContent from './QRCodeImgDownloadContent';
import MakeAnInventoryContent from '../../StockAll/MakeAnInventoryContent';

@connect(({ venue }) => ({
  venue,
}))
class Stock extends Component {
  columns = [
    {
      title: '库存编号',
      dataIndex: 'id',
      width: 100,
    },
    {
      title: '商品编号',
      dataIndex: 'itemId',
      width: 100,
    },
    {
      title: '商品名称',
      dataIndex: 'itemName',
      width: 200,
    },
    {
      title: '剩余库存',
      dataIndex: 'stockCount',
      width: 80,
      collect: true,
    },
    {
      title: '单位',
      dataIndex: 'stockUnit',
      width: 80,
    },
    {
      title: '销售数量',
      dataIndex: 'stockSoldCount',
      collect: true,
      width: 80,
    },
    {
      title: '营销中心名称',
      dataIndex: 'salesName',
      width: 150,
    },
    {
      title: '销售单价',
      dataIndex: 'salesPrice',
      render: formatMoneyLen2,
      width: 100,
    },
    {
      title: '商品原价',
      dataIndex: 'marketPrice',
      render: formatMoneyLen2,
      width: 100,
    },
    {
      title: '进货价',
      dataIndex: 'buyPrice',
      render: formatMoneyLen2,
      width: 100,
    },
    {
      title: '商品拼音',
      dataIndex: 'itemPinyin',
      width: 200,
    },
    {
      title: '创建人',
      dataIndex: 'createRealName',
      width: 130,
    },
    {
      title: '创建单位',
      dataIndex: 'companyName',
      width: 200,
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
        initialValue: (() => {
          const {
            venue: { currentVenue },
          } = this.props;
          if (currentVenue) {
            return currentVenue.id;
          }
        })(),
        type: ItemTypes.CascaderVenue,
      },
      {
        label: '商品名称',

        name: 'itemName',
      },
      {
        label: '库存编号',
        name: 'id',
      },
    ],
  };

  iconStyle = {
    cursor: 'pointer',
  };

  static contextTypes = {
    getScopeAuthorizedBtnTypes: PropTypes.func,
  };

  static childContextTypes = {
    isAuthorized: PropTypes.func,
  };

  state = {
    showContentMode: undefined,
    selectedRows: undefined,
  };

  // 覆盖 isAuthorized
  getChildContext() {
    const { getScopeAuthorizedBtnTypes } = this.context;
    const authorizedBtnTypes = getScopeAuthorizedBtnTypes('/basic/mall/stock');
    return {
      isAuthorized: auth => {
        if (auth == null) {
          return true;
        }
        return authorizedBtnTypes.includes(auth);
      },
    };
  }

  operation = () => {
    return {
      buttons: [
        {
          text: '进货',
          auth: 'purchase',
          forRow: 'single',
          action: () => {
            this.setState({
              showContentMode: 1,
            });
          },
        },
        {
          text: '报损',
          auth: 'breakage',
          forRow: 'single',
          action: () => {
            this.setState({
              showContentMode: 2,
            });
          },
        },
        {
          text: '调货',
          auth: 'stockmove',
          forRow: 'single',
          action: () => {
            this.setState({
              showContentMode: 3,
            });
          },
        },
        {
          text: '操作流水',
          icon: <IconFont type="menu-activity-s-list" />,
          forRow: 'single',
          action: () => {
            const { selectedRows } = this.state;
            const { dispatch } = this.props;
            dispatch(
              push({
                pathname: '/basic/mall/stockflow',
                search: `itemId=${selectedRows[0].itemId}`,
              })
            );
          },
        },
        {
          text: '盘点',
          type: 'primary',
          auth: 'inventory',
          forRow: 'single',
          action: () => {
            this.setState({
              showContentMode: 5,
            });
          },
        },
        {
          text: '下载商品二维码',
          auth: 'downloadCode',
          forRow: 'single',
          action: () => {
            this.setState({
              showContentMode: 4,
            });
          },
        },
      ],
    };
  };

  handleSelectedChange = (_, rows) => {
    this.setState(({ showContentMode }) => ({
      selectedRows: rows,
      showContentMode: rows == null || rows.length === 0 ? null : showContentMode,
    }));
  };

  cancelContent = () => {
    this.setState({
      showContentMode: null,
    });
  };

  handleSuccess = () => {
    this.cancelContent();
    this.table.reload();
  };

  handleTransferFormSubmit = () => {
    message.success('调货成功');
    this.handleSuccess();
  };

  handleBreakFormSubmit = () => {
    message.success('报损成功');
    this.handleSuccess();
  };

  handlePurchaseFormSubmit = () => {
    message.success('进货成功');
    this.handleSuccess();
  };

  handleInventoryFormSubmit = () => {
    message.success('盘点成功');
    this.handleSuccess();
  };

  handleTableInit = table => {
    this.table = table;
  };

  render() {
    const { match } = this.props;
    const { id } = match.params || {};
    const { showContentMode } = this.state;
    return (
      <PageHeaderLayout title="进出货管理">
        <Card bordered={false}>
          <Datatable
            select="multi"
            onSelectedChange={this.handleSelectedChange}
            url={`/itemStock/dataList.do?itemId=${id}`}
            columns={this.columns}
            // https://ant.design/components/table-cn/#%E6%B3%A8%E6%84%8F
            rowKey="id"
            formSearch={this.formSearch}
            operation={this.operation()}
            onInit={this.handleTableInit}
            content={(() => {
              switch (showContentMode) {
                case 1:
                  return <PurchaseContent cancel={this.cancelContent} sure={this.handlePurchaseFormSubmit} />;
                case 2:
                  return <BreakContent cancel={this.cancelContent} sure={this.handleBreakFormSubmit} />;
                case 3:
                  return <TransferContent cancel={this.cancelContent} sure={this.handleTransferFormSubmit} />;
                case 4:
                  return <QRCodeImgDownloadContent cancel={this.cancelContent} />;
                case 5:
                  return <MakeAnInventoryContent cancel={this.cancelContent} sure={this.handleInventoryFormSubmit} />;
                default:
                  return null;
              }
            })()}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default Stock;
