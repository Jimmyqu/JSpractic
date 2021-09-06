import { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Card, Button } from 'antd';
import IconFont from '@/components/Icon';
// import EllipsisCell from '@/components/EllipsisCell';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Datatable from '@/components/Datatable';
import { DEFAULT_GIFT_PIC_FULLPATH } from '@/utils/utils';
import { formatDateTime, formatImageUrl } from '@/utils/format';

@connect(({ pubticket }) => ({
  pubticket,
}))
class ScanChecking extends Component {
  columns = [
    {
      title: '项目名称',
      dataIndex: 'exerciseName',
      width: 120,
    },
    {
      title: '图片',
      dataIndex: 'picUrl',
      render: value => (
        <img
          src={formatImageUrl(value, 'img_ticket_list_prew', DEFAULT_GIFT_PIC_FULLPATH)}
          alt="img"
          className="img-max"
        />
      ),
      width: 80,
    },
    {
      title: '时间备注',
      dataIndex: 'descr',
      width: 200,
    },
    {
      title: '价格备注',
      dataIndex: 'descr2',
      width: 200,
    },
    {
      title: '分类',
      dataIndex: 'exerciseCategory',
      width: 80,
    },
    {
      title: '标签',
      dataIndex: 'exerciseTag',
      width: 80,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: formatDateTime,
      width: 200,
    },
    {
      title: '单位名称',
      dataIndex: 'companyName',
      width: 200,
    },
    {
      title: '操作',
      key: 'id',
      render: v => {
        return (
          <Button type={v.topWeight ? 'default' : 'primary'} onClick={() => this.handleSortChange(v)}>
            <IconFont type="to-top" className={v.topWeight ? 'black' : 'white'} />
          </Button>
        );
      },
      width: 60,
      fixed: 'right',
    },
  ];

  operation = {
    buttons: [
      {
        text: '拆分验票',
        icon: 'scan',
        auth: 'code',
        type: 'primary',
        forRow: 'single',
        action: () => {
          const { dispatch } = this.props;
          const { selectedRows } = this.state;
          dispatch(push(`./${selectedRows[0].id}`));
        },
      },
      {
        text: '合并验票',
        icon: 'scan',
        auth: 'code',
        type: 'primary',
        forRow: 'single',
        action: () => {
          const { dispatch } = this.props;
          const { selectedRows } = this.state;
          dispatch(push(`./${selectedRows[0].id}?all=1`));
        },
      },
      {
        icon: 'reload',
        text: '重置置顶',
        auth: 'code',
        type: 'text',
        action: () => {
          const { dispatch } = this.props;
          dispatch({
            type: 'pubticket/cleanSortShowIndex',
          }).then(() => {
            this.child.reload();
          });
        },
      },
    ],
  };

  state = {
    selectedRows: undefined,
  };

  handleSelectedChange = (_, rows) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSortChange = r => {
    const { dispatch } = this.props;
    const { id, topWeight } = r;
    dispatch({
      type: 'pubticket/saveSortShowIndex',
      payload: {
        exerciseId: id,
        topWeight: topWeight ? 0 : 1,
      },
    }).then(() => {
      this.child.reload();
    });
  };

  handleTableInit = ref => {
    this.child = ref;
  };

  render() {
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Datatable
            select="multi"
            onSelectedChange={this.handleSelectedChange}
            url="/exerciseList/ticketList.do?sortType=0"
            columns={this.columns}
            rowKey="id"
            formSearch={this.formSearch}
            operation={this.operation}
            onInit={this.handleTableInit}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default ScanChecking;
