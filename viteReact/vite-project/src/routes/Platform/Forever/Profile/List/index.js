import { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Card, Row, Col, message } from 'antd';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import IconFont from '@/components/Icon';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import VenueSwitcher from '@/components/VenueSwitcher';
import { formatDate, formatHM, formatDateTime, formatWeekDay } from '@/utils/format';
import { weekDaysMapToOption } from '@/utils/utils';
import UpdateContent from './UpdateContent';

@connect(({ venue, loading }) => ({
  venue,
  removing: loading.effects['pubplatform/removePlatformForever'],
}))
class ForeverList extends Component {
  columns = [
    {
      title: '编号',
      dataIndex: 'sportPlatformForeverId',
      width: 80,
    },
    {
      title: '营销中心名称',
      dataIndex: 'salesName',
      width: 200,
    },
    {
      title: '场地名称',
      dataIndex: 'sportPlatformList',
      render: value =>
        (value || [])
          .map(item => `${item.parentPlatformName ? `${item.parentPlatformName}-` : ''}${item.platformName}`)
          .join(','),
      width: 200,
    },
    {
      title: '服务人员',
      dataIndex: 'sysUserList',
      render: value => (value || []).map(item => item.realName).join(','),
      width: 150,
    },
    {
      title: '姓名/手机',
      dataIndex: 'pubRealName',
      render: (value, record) => `${value}/${record.pubMobile}`,
      width: 170,
    },
    {
      title: '订单备注',
      dataIndex: 'userMessage',
      width: 150,
    },
    {
      title: '商家留言',
      dataIndex: 'sellerMessage',
      width: 150,
    },
    {
      title: '星期/工作日/节假日',
      dataIndex: 'weekDate',
      render: value => formatWeekDay(value, 1),
      width: 150,
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      render: formatDate,
      width: 130,
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      render: formatDate,
      width: 130,
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      render: formatHM,
      width: 80,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      render: formatHM,
      width: 80,
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
        label: '星期',
        name: 'weekDate',
        options: weekDaysMapToOption(),
        type: ItemTypes.Select,
      },
      {
        label: '手机号',
        name: 'pubMobile',
      },
      {
        label: '订单备注',
        name: 'userMessage',
      },
      {
        label: '商家留言',
        name: 'sellerMessage',
        defHidden: true,
      },
    ],
  };

  state = {
    selectedRows: undefined,

    showContent: undefined,
  };

  operation = () => {
    const { removing, dispatch } = this.props;
    return {
      buttons: [
        {
          text: '添加固定场',
          auth: 'add',
          type: 'primary',
          icon: 'plus',
          disabled: removing,
          action: () => {
            dispatch(push('./add'));
          },
        },
        {
          text: '删除',
          icon: <IconFont type="cancel" />,
          type: 'danger',
          auth: 'remove',
          forRow: 'multi',
          loading: removing,
          action: async () => {
            const { selectedRows } = this.state;
            await dispatch({
              type: 'pubplatform/removePlatformForever',
              payload: selectedRows.map(item => item.sportPlatformForeverId),
            });
            message.success('删除成功');
            this.table.reload();
          },
        },
        {
          text: '调整有效期',
          icon: <IconFont type="editor" />,
          auth: 'edit',
          forRow: 'single',
          disabled: removing,
          action: () => {
            this.setState({
              showContent: true,
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

  handleSelectedChange = (_, rows) => {
    this.setState(({ showContent }) => ({
      selectedRows: rows,
      showContent: rows == null || rows.length === 0 ? null : showContent,
    }));
  };

  handleTableInit = table => {
    this.table = table;
  };

  cancelContent = () => {
    this.setState({
      showContent: null,
    });
  };

  handleFormSubmit = () => {
    message.success('修改成功');
    this.cancelContent();
    this.table.reload();
  };

  render() {
    const {
      venue: { currentVenue, VenueTypes },
    } = this.props;
    const { showContent } = this.state;
    const { id } = currentVenue || {};

    return (
      <PageHeaderLayout title="固定场列表">
        <Card
          bordered={false}
          bodyStyle={{
            paddingBottom: 0,
          }}
        >
          <Row>
            <Col md={8} xs={24}>
              <VenueSwitcher filter={item => item.salesType === VenueTypes.SPORTPLATFORM.key} />
            </Col>
          </Row>
        </Card>
        <Card bordered={false}>
          <Datatable
            select="multi"
            onSelectedChange={this.handleSelectedChange}
            url={`/sportPlatformForever/dataList.do?salesId=${id}`}
            columns={this.columns}
            // https://ant.design/components/table-cn/#%E6%B3%A8%E6%84%8F
            rowKey="sportPlatformForeverId"
            formSearch={this.formSearch}
            operation={this.operation()}
            onInit={this.handleTableInit}
            content={showContent ? <UpdateContent cancel={this.cancelContent} sure={this.handleFormSubmit} /> : null}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default ForeverList;
