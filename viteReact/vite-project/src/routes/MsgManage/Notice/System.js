import { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Spin } from 'antd';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import { getPageQuery } from '@/utils/utils';
import { formatDateTime } from '@/utils/format';

// const testData = new Array(102).fill({}).map((item, i) => ({ ...item, id: i + 1 }));

@connect(({ message, venue, loading }) => ({
  message,
  venue,
  fetchingCategoryList: loading.effects['message/fetchCategoryList'],
}))
class SystemMessage extends Component {
  columns = [
    {
      title: '编号',
      dataIndex: 'id',
      width: 100,
    },
    {
      title: '消息类型',
      dataIndex: 'title',
      width: 90,
      // sorter: true,
      // filters: [
      //   {
      //     text: '场地预订通知',
      //     value: 1,
      //   },
      //   {
      //     text: '取消场地通知',
      //     value: 2,
      //   },
      // ],
      // onFilter: (value, record) => {
      //   return record.messageType.toString() === value;
      // },
    },
    {
      title: '消息内容',
      dataIndex: 'content',
      width: 500,
    },
    {
      title: '营销中心',
      dataIndex: 'salesName',
      width: 200,
    },
    {
      title: '备注',
      dataIndex: 'descr',
      width: 500,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: formatDateTime,
      width: 170,
    },
    {
      title: '创建人',
      dataIndex: 'createRealName',
      width: 90,
    },
    {
      title: '单位名称',
      dataIndex: 'companyName',
      width: 140,
    },
  ];

  operation = {
    buttons: [
      {
        auth: 'export',
        btnType: ButtonTypes.Export,
      },
    ],
  };

  // dataList = testData;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'message/fetchCategoryList',
    });
  }

  componentDidUpdate(preProps) {
    const { location } = this.props;
    if (location !== preProps.location) {
      const { search } = location;
      this.table.reload({
        formValues: {
          id: getPageQuery(search).id,
        },
      });
    }
  }

  formSearch = () => {
    const {
      message: { categoryList = [] },
      fetchingCategoryList,
    } = this.props;
    const { id, salesIds } = getPageQuery();
    return {
      fields: [
        {
          label: '营销中心',
          name: 'salesId',
          initialValue: (() => {
            const {
              venue: { currentVenue },
            } = this.props;
            if (salesIds || salesIds === '') {
              return +salesIds || '';
            }
            if (currentVenue) {
              return currentVenue.id;
            }
          })(),
          type: ItemTypes.CascaderVenue,
        },
        {
          label: '消息通知',
          name: 'messageType',
          notFoundContent: fetchingCategoryList ? <Spin /> : null,
          options: categoryList.map(item => ({
            key: item.messageTypeId,
            text: item.messageTypeName,
          })),
          type: ItemTypes.Select,
        },
        {
          label: '消息内容',
          name: 'content',
        },
        {
          label: '备注',
          name: 'descr',
          defHidden: true,
        },
        {
          label: '单位名称',
          name: 'companyName',
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
          label: '编号',
          initialValue: id,
          name: 'id',
          defHidden: true,
        },
      ],
    };
  };

  handleTableInit = table => {
    this.table = table;
  };

  render() {
    return (
      <Card bordered={false}>
        <Datatable
          select="multi"
          url="/commonMessage/dataList.do"
          columns={this.columns}
          rowKey="id"
          formSearch={this.formSearch()}
          operation={this.operation}
          onInit={this.handleTableInit}
        />
      </Card>
    );
  }
}

export default SystemMessage;
