import { Component } from 'react';
import { Card } from 'antd';
import { connect } from 'react-redux';
import Datatable, { ButtonTypes } from '@/components/Datatable';
import { formatDateTime, formatMoneyLen2, formatModel } from '@/utils/format';

@connect(({ action }) => ({
  action,
}))
class ProfileFeeFlow extends Component {
  columns = [
    {
      title: '编号',
      dataIndex: 'id',
      width: 100,
    },
    {
      title: '用户行为',
      dataIndex: 'actionType',
      render: value => {
        const {
          action: { ActionTypes },
        } = this.props;
        return formatModel(ActionTypes, value);
      },
      width: 100,
    },
    {
      title: '积分值',
      dataIndex: 'dataValue',
      render: formatMoneyLen2,
      width: 90,
    },
    {
      title: '备注',
      dataIndex: 'descr',
      width: 250,
    },
    // {
    //   title: '用户编号',
    //   dataIndex: 'pubUserId',
    // },
    // {
    //   title: '用户帐户编号',
    //   dataIndex: 'pubAccountId',
    //   width: 120,
    // },
    // {
    //   title: '排序',
    //   dataIndex: 'ranks',
    // },
    {
      title: '操作来源',
      dataIndex: 'srvName',
      width: 140,
    },
    {
      title: '来源IP',
      dataIndex: 'sourceIp',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: formatDateTime,
      width: 190,
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

  render() {
    const {
      match: { params },
    } = this.props;
    const { id: pubAccountId } = params || {};

    return (
      <Card bordered={false}>
        <Datatable
          url={`/publicAccountAction/dataList.do?pubAccountId=${pubAccountId}`}
          columns={this.columns}
          rowKey="id"
          operation={this.operation}
        />
      </Card>
    );
  }
}

export default ProfileFeeFlow;
