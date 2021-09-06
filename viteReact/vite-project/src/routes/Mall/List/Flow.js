import { Component } from 'react';
import moment from 'moment';
import { Card } from 'antd';
import { connect } from 'react-redux';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { formatDateTime, formatMoneyLen2, formatModel } from '@/utils/format';
import { getPageQuery, modelMapToOption } from '@/utils/utils';

@connect(({ venue, store }) => ({
  venue,
  store,
}))
class Flow extends Component {
  columns = [
    {
      title: '流水编号',
      dataIndex: 'id',
      width: 90,
    },
    {
      title: '主订单号',
      dataIndex: 'dealId',
      width: 90,
    },
    {
      title: '商品编号',
      dataIndex: 'itemId',
      width: 90,
    },
    {
      title: '商品订单号',
      dataIndex: 'dealItemId',
      width: 110,
    },
    {
      title: '营销中心名称',
      dataIndex: 'salesName',
      width: 120,
    },
    {
      title: '名称',
      dataIndex: 'itemName',
      width: 120,
    },
    {
      title: '库存编号',
      dataIndex: 'itemStockId',
      width: 90,
    },
    {
      title: '库存类型',
      dataIndex: 'stockType',
      render: value => {
        const {
          store: { StockTypes },
        } = this.props;
        return formatModel(StockTypes, value);
      },
      width: 90,
    },
    {
      title: '进出货数量',
      dataIndex: 'itemNum',
      collect: true,
      width: 100,
    },
    {
      title: '剩余库存',
      dataIndex: 'itemStockNum',
      width: 90,
    },
    {
      title: '商品原价',
      dataIndex: 'marketPrice',
      render: formatMoneyLen2,
      width: 90,
    },
    {
      title: '销售价',
      dataIndex: 'salesPrice',
      render: formatMoneyLen2,
      width: 90,
    },
    {
      title: '进货价',
      dataIndex: 'buyPrice',
      render: formatMoneyLen2,
      width: 90,
    },
    {
      title: '备注',
      dataIndex: 'descr',
      width: 200,
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      render: formatDateTime,
      width: 190,
    },
    {
      title: '创建人',
      dataIndex: 'createRealName',
      width: 100,
    },
    {
      title: '单位名称',
      dataIndex: 'companyName',
      width: 100,
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
        label: '商品编号',
        name: 'itemId',
        initialValue: getPageQuery().itemId,
      },
      {
        label: '库存编号',
        name: 'itemStockId',
        initialValue: getPageQuery().itemStockId,
      },
      {
        label: '商品订单编号',
        name: 'dealItemId',
        defHidden: true,
      },
      {
        label: '名称',
        name: 'itemName',
        defHidden: true,
      },
      {
        label: '主订单号',
        name: 'dealId',
        defHidden: true,
      },
      {
        label: '库存类型',
        name: 'stockType',
        options: (() => {
          const {
            store: { StockTypes },
          } = this.props;
          return modelMapToOption(StockTypes);
        })(),
        initialValue: (() => {
          const { stockType } = getPageQuery();
          if (stockType) {
            return +stockType;
          }
        })(),
        type: ItemTypes.Select,
        defHidden: true,
      },
      {
        label: '创建人',
        name: 'createRealName',
        defHidden: true,
      },
      [
        {
          label: '操作时间（始）',
          name: 'createStartTime',
          placeholder: '操作开始时间',
          initialValue: (() => {
            const { createStartTime } = getPageQuery();
            if (createStartTime) {
              return moment(+createStartTime);
            }
            return moment();
          })(),
          type: ItemTypes.DatePickerRangeStart,
          defHidden: true,
        },
        {
          label: '操作时间（止）',
          name: 'createEndTime',
          placeholder: '操作结束时间',
          initialValue: (() => {
            const { createEndTime } = getPageQuery();
            if (createEndTime) {
              return moment(+createEndTime);
            }
            return moment();
          })(),
          type: ItemTypes.DatePickerRangeEnd,
          defHidden: true,
        },
      ],
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
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Datatable
            // select="multi"
            // onSelectedChange={this.handleSelectedChange}
            url="/itemStockLogistics/dataList.do"
            columns={this.columns}
            // https://ant.design/components/table-cn/#%E6%B3%A8%E6%84%8F
            rowKey="id"
            formSearch={this.formSearch}
            operation={this.operation}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default Flow;
