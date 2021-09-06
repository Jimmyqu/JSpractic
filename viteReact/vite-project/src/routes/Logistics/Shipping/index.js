import { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Card, message } from 'antd';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { formatRelType, formatHomeTown, formatDateTime, formatModel } from '@/utils/format';
import { getPageQuery, modelMapToOption } from '@/utils/utils';
import DeliverContent from './DeliverContent';
import DeliverBatchContent from './DeliverBatchContent';
import ShippingEditContent from './ShippingEditContent';
import styles from './index.less';

@connect(({ global, logistics }) => ({
  global,
  logistics,
}))
class Shipping extends Component {
  state = {
    showContentMode: undefined,
  };

  columns = [
    {
      title: '物流单号',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '主订单号',
      dataIndex: 'dealId',
      width: 80,
    },
    {
      title: '物流状态',
      dataIndex: 'shippingState',
      render: value => {
        const {
          logistics: { ShippingStates },
        } = this.props;
        return (
          <span className={classNames(styles[`shippingState-${value}`])}>{formatModel(ShippingStates, value)}</span>
        );
      },
      width: 80,
    },
    {
      title: '物流公司',
      dataIndex: 'shippingCompanyId',
      render: value => {
        const {
          logistics: { ExpressCompanys },
        } = this.props;
        return formatModel(ExpressCompanys, value);
      },
      width: 120,
    },
    {
      title: '物流运单号',
      dataIndex: 'shippingNo',
      width: 200,
    },
    {
      title: '备注',
      dataIndex: 'descr',
      width: 300,
    },
    {
      title: '收件人',
      dataIndex: 'consigneeName',
      width: 120,
    },
    {
      title: '收件人手机号',
      dataIndex: 'consigneeMobile',
      width: 130,
    },
    {
      title: '收货地址',
      dataIndex: 'consigneeAddress',
      render: (value, { province, city, district }) => (
        <>
          {formatHomeTown(province)}
          {formatHomeTown(city)}
          {formatHomeTown(district)}
          {value}
        </>
      ),
      width: 300,
    },
    {
      title: '订单类型',
      dataIndex: 'relType',
      render: value => {
        const { global } = this.props;
        return formatRelType(value, global);
      },
      width: 100,
    },
    {
      title: '订单信息',
      dataIndex: 'dealDescription',
      width: 300,
    },
    {
      title: '营销中心',
      dataIndex: 'commonSales.salesName',
      width: 160,
    },
    {
      title: '寄件人',
      dataIndex: 'shipperName',
      width: 140,
    },
    {
      title: '寄件人手机号',
      dataIndex: 'shipperMobile',
      width: 120,
    },
    {
      title: '寄件地址',
      dataIndex: 'commonSalesList',
      render: value =>
        (value || []).map(({ id, province, city, district, salesAddress }) => (
          <div key={id}>
            {formatHomeTown(province)}
            {formatHomeTown(city)}
            {formatHomeTown(district)}
            {salesAddress}
          </div>
        )),
      width: 300,
    },
    {
      title: '更新时间',
      dataIndex: 'gmtModified',
      render: formatDateTime,
      width: 190,
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
      width: 120,
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'logistics/fetchExpressCompanyList',
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  operation = () => {
    const {
      logistics: { ExpressCompanys },
    } = this.props;
    return {
      export: {
        settings: {
          shippingCompanyId: {
            validations: {
              items: Object.values(ExpressCompanys).map(item => item.value),
            },
          },
        },
      },
      buttons: [
        {
          text: '发货',
          type: 'primary',
          auth: 'deliver',
          forRow: rows => {
            const {
              logistics: { ShippingStates },
            } = this.props;
            return rows.length === 1 && rows[0].shippingState === ShippingStates.WAIT.key;
          },
          action: () => {
            this.setState({
              showContentMode: 1,
            });
          },
        },
        {
          text: '批量发货',
          auth: 'deliverMore',
          action: () => {
            this.setState({
              showContentMode: 2,
            });
          },
        },
        {
          text: '修改地址',
          auth: 'deliverEdit',
          forRow: rows => {
            const {
              logistics: { ShippingStates },
            } = this.props;
            return rows.length === 1 && rows[0].shippingState === ShippingStates.WAIT.key;
          },
          action: () => {
            this.setState({
              showContentMode: 3,
            });
          },
        },
        {
          auth: 'export',
          btnType: ButtonTypes.Export,
        },
      ],
    };
  };

  formSearch = () => {
    return {
      fields: [
        {
          label: '订单号',
          name: 'dealId',
          initialValue: (() => {
            const { id } = getPageQuery();
            return id;
          })(),
        },
        {
          label: '订单类型',
          name: 'relType',
          options: (() => {
            const {
              global: { RelTypes },
            } = this.props;
            return [RelTypes.DEALITEM, RelTypes.DEALTICKET].map(item => ({
              key: item.key,
              text: item.value,
            }));
          })(),
          type: ItemTypes.Select,
        },
        {
          label: '收件人',
          name: 'consigneeName',
        },
        {
          label: '收件人手机号',
          name: 'consigneeMobile',
          defHidden: true,
        },
        {
          label: '物流状态',
          name: 'shippingState',
          options: (() => {
            const {
              logistics: { ShippingStates },
            } = this.props;
            return modelMapToOption(ShippingStates);
          })(),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '物流公司',
          name: 'shippingCompanyId',
          options: (() => {
            const {
              logistics: { ExpressCompanys },
            } = this.props;
            return modelMapToOption(ExpressCompanys);
          })(),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '物流运单号',
          name: 'shippingNo',
          defHidden: true,
        },
        {
          label: '寄件人',
          name: 'shipperName',
          defHidden: true,
        },
        {
          label: '寄件人手机号',
          name: 'shipperMobile',
          defHidden: true,
        },
        {
          label: '订单信息',
          name: 'dealDescription',
          defHidden: true,
        },
        [
          {
            label: '创建时间（始）',
            name: 'startCreateTime',
            type: ItemTypes.DatePickerRangeStart,
          },
          {
            label: '创建时间（止）',
            name: 'endCreateTime',
            type: ItemTypes.DatePickerRangeEnd,
          },
        ],
      ],
    };
  };

  handleSelectedChange = (_, rows) => {
    if (this.isUnmounted) {
      return;
    }
    this.setState(({ showContentMode }) => ({
      showContentMode: rows == null || rows.length === 0 ? null : showContentMode,
    }));
  };

  cancelContent = () => {
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      showContentMode: null,
    });
  };

  handleTableInit = table => {
    this.table = table;
  };

  reload = () => {
    this.table.reload();
  };

  handleDeliverFormSubmit = () => {
    message.success('发货成功');
    this.cancelContent();
    this.reload();
  };

  handleBatchDeliverFormSubmit = result => {
    if (result > 0) {
      message.success('批量发货成功');
    } else {
      message.info('无有效数据提交');
    }
    this.cancelContent();
    this.reload();
  };

  handleEditFormSubmit = result => {
    if (result) {
      message.success('修改成功');
      this.cancelContent();
      this.reload();
    }
  };

  render() {
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Datatable
            select="multi"
            url="/dealShipping/dataList.do"
            columns={this.columns}
            rowKey="id"
            formSearch={this.formSearch()}
            operation={this.operation()}
            onSelectedChange={this.handleSelectedChange}
            onInit={this.handleTableInit}
            content={(() => {
              const { showContentMode } = this.state;
              switch (showContentMode) {
                case 1:
                  return (
                    <DeliverContent
                      cancel={this.cancelContent}
                      sure={this.handleDeliverFormSubmit}
                      reload={this.reload}
                    />
                  );
                case 2:
                  return <DeliverBatchContent cancel={this.cancelContent} sure={this.handleBatchDeliverFormSubmit} />;
                case 3:
                  return <ShippingEditContent cancel={this.cancelContent} sure={this.handleEditFormSubmit} />;
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

export default Shipping;
