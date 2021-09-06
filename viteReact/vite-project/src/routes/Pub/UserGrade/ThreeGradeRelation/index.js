import { Component } from 'react';
import { connect } from 'react-redux';
import { Card } from 'antd';
import Datatable from '@/components/Datatable';
import { formatDateTime } from '@/utils/format';

@connect()
class ThreeGradeRelation extends Component {
  render() {
    return (
      <Card bordered={false}>
        <Datatable
          rowKey="id"
          url="/memberLevelOuterRelAction/dataList.do"
          columns={[
            {
              title: '编号',
              dataIndex: 'id',
              width: 100,
            },
            {
              title: '会员等级',
              dataIndex: 'levelConfigName',
              width: 100,
            },
            {
              title: '第三方对应等级名称',
              dataIndex: 'outerLevelName',
              width: 150,
            },
            {
              title: 'key',
              dataIndex: 'outerLevelKey',
              width: 80,
            },
            {
              title: '业务编号',
              dataIndex: 'srvId',
              width: 100,
            },
            {
              title: '业务名称',
              dataIndex: 'srvName',
              width: 100,
            },
            {
              title: '备注',
              dataIndex: 'remark',
              width: 250,
            },
            {
              title: '更新时间',
              dataIndex: 'gmtModified',
              render: formatDateTime,
              width: 170,
            },
            {
              title: '创建人',
              dataIndex: 'createRealName',
              width: 100,
            },
            {
              title: '创建时间',
              dataIndex: 'gmtCreate',
              render: formatDateTime,
              width: 170,
            },
            {
              title: '单位名称',
              dataIndex: 'companyName',
              width: 150,
            },
          ]}
        />
      </Card>
    );
  }
}

export default ThreeGradeRelation;
