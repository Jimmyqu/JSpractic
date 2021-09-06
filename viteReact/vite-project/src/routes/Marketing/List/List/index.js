import { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Card, message } from 'antd';
import IconFont from '@/components/Icon';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { formatDate, formatMoneyLen2, formatModel, formatDateTime } from '@/utils/format';
import { modelMapToOption } from '@/utils/utils';
import CheckoutContent from './CheckoutContent';

@connect(({ venue, pubmktmb }) => ({
  venue,
  pubmktmb,
}))
class List extends Component {
  columns = [
    {
      title: '编号',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '主订单编号',
      dataIndex: 'dealId',
      width: 90,
    },
    {
      title: '分成报表状态',
      dataIndex: 'performanceReportState',
      render: value => {
        const {
          pubmktmb: { PerformanceReportStatus },
        } = this.props;
        return formatModel(PerformanceReportStatus, value);
      },
      width: 110,
    },
    {
      title: '订单结算日期',
      dataIndex: 'dealCheckoutData',
      render: formatDate,
      width: 110,
    },
    {
      title: '销售分成总金额（元）',
      dataIndex: 'performanceTotalPrice',
      render: formatMoneyLen2,
      collect: true,
      width: 170,
    },
    {
      title: '真实姓名',
      dataIndex: 'realName',
      width: 100,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      width: 130,
    },
    {
      title: '订单信息',
      dataIndex: 'dealDescription',
      width: 250,
    },
    {
      title: '销售团队',
      dataIndex: 'marketingTeamName',
      width: 130,
    },
    {
      title: '行业信息',
      dataIndex: 'industryId',
      render: value => {
        const {
          venue: { Industries },
        } = this.props;
        return formatModel(Industries, value);
      },
      width: 100,
    },
    {
      title: '项目类型',
      dataIndex: 'professionalId',
      render: value => {
        const {
          venue: { ProfessionTypes },
        } = this.props;
        return formatModel(ProfessionTypes, value);
      },
      width: 100,
    },
    {
      title: '职业信息',
      dataIndex: 'careerId',
      render: value => {
        const {
          venue: { Careers },
        } = this.props;
        return formatModel(Careers, value);
      },
      width: 100,
    },
    {
      title: '备注',
      dataIndex: 'descr',
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      render: formatDateTime,
      width: 190,
    },
    {
      title: '更新时间',
      dataIndex: 'gmtModified',
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
      width: 130,
    },
  ];

  formSearch = {
    fields: [
      {
        label: '编号',
        name: 'id',
      },
      {
        label: '主订单编号',
        name: 'dealId',
      },
      {
        label: '分成报表状态',
        name: 'performanceReportState',
        options: (() => {
          const {
            pubmktmb: { PerformanceReportStatus },
          } = this.props;
          return modelMapToOption(PerformanceReportStatus);
        })(),
        type: ItemTypes.Select,
      },
      {
        label: '销售团队名称',
        name: 'marketingTeamName',
        defHidden: true,
      },
      {
        label: '销售成员',
        name: 'realName',
        defHidden: true,
      },
      {
        label: '销售成员手机',
        name: 'mobile',
        defHidden: true,
      },
      [
        {
          label: '结算时间(始)',
          name: 'startGmtModified',
          type: ItemTypes.DatePickerRangeStart,
        },
        {
          label: '结算时间(止)',
          name: 'endGmtModified',
          type: ItemTypes.DatePickerRangeEnd,
        },
      ],
    ],
  };

  state = {
    showContentMode: undefined,
    selectedRows: undefined,
  };

  operation = {
    buttons: [
      {
        text: '结算分成',
        auth: 'checkout',
        icon: <IconFont type="marketing-checkout" />,
        type: 'primary',
        forRow: rows => {
          const {
            pubmktmb: { PerformanceReportStatus },
          } = this.props;
          return rows.length === 1 && rows[0].performanceReportState === PerformanceReportStatus.NOT_DIVIDED_INTO.key;
        },
        action: () => {
          this.setState({
            showContentMode: 1,
          });
        },
      },
      {
        text: '查看销售分成报表日志',
        auth: 'view',
        icon: <IconFont type="menu-ticket-webcheck" />,
        forRow: 'single',
        action: () => {
          const { dispatch } = this.props;
          const { selectedRows } = this.state;
          dispatch(push(`./${selectedRows[0].id}/stock`));
        },
      },
      {
        auth: 'export',
        btnType: ButtonTypes.Export,
      },
    ],
  };

  cancelContent = () => {
    this.setState({
      showContentMode: null,
    });
  };

  handleSelectedChange = (_, rows) => {
    this.setState(({ showContentMode }) => ({
      selectedRows: rows,
      showContentMode: rows == null || rows.length === 0 ? null : showContentMode,
    }));
  };

  handleTableInit = table => {
    this.table = table;
  };

  handleCheckout = () => {
    message.success('结算成功');
    this.cancelContent();
    this.table.reload();
  };

  render() {
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Datatable
            select="multi"
            onSelectedChange={this.handleSelectedChange}
            url="/marketingPerformanceReport/performanceReportList.do"
            columns={this.columns}
            rowKey="id"
            formSearch={this.formSearch}
            operation={this.operation}
            onInit={this.handleTableInit}
            content={(() => {
              const { showContentMode } = this.state;
              switch (showContentMode) {
                case 1:
                  return <CheckoutContent cancel={this.cancelContent} sure={this.handleCheckout} />;
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

export default List;
