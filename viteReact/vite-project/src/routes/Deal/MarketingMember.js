import { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Card } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import IconFont from '@/components/Icon';
import { formatDateTime, formatModel } from '@/utils/format';
import { modelMapToOption, print } from '@/utils/utils';
import AuthComponent from '@/components/AuthComponent';
import OrderPrint from '@/components/OrderPrint';

@connect(({ venue, pubmktmb, deal, loading }) => ({
  venue,
  pubmktmb,
  deal,
  printFetching: loading.effects['print/fetch'],
}))
class MarketingMemberDeal extends Component {
  columns = [
    {
      title: '编号',
      dataIndex: 'id',
      width: 90,
    },
    {
      title: '主订单编号',
      dataIndex: 'dealId',
      width: 90,
    },
    {
      title: '订单状态',
      dataIndex: 'dealState',
      render: value => {
        const {
          pubmktmb: { DealStatus },
        } = this.props;
        return formatModel(DealStatus, value);
      },
      width: 90,
    },
    {
      title: '销售团队编号',
      dataIndex: 'marketingTeamId',
      width: 110,
    },
    {
      title: '销售团队名称',
      dataIndex: 'marketingTeamName',
      width: 130,
    },
    {
      title: '行业',
      dataIndex: 'industryId',
      render: value => {
        const {
          venue: { Industries },
        } = this.props;
        return formatModel(Industries, value);
      },
      width: 130,
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
      width: 130,
    },
    {
      title: '职业',
      dataIndex: 'careerId',
      render: value => {
        const {
          venue: { Careers },
        } = this.props;
        return formatModel(Careers, value);
      },
      width: 130,
    },
    {
      title: '真实姓名',
      dataIndex: 'realName',
      width: 130,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      width: 130,
    },
    {
      title: '备注',
      dataIndex: 'descr',
      width: 200,
    },
    // {
    //   title: '更新人',
    //   dataIndex: 'updateRealName',
    //   width: 120,
    // },
    {
      title: '更新时间',
      dataIndex: 'gmtModified',
      render: formatDateTime,
      width: 190,
    },
    {
      title: '创建人',
      dataIndex: 'createRealName',
      width: 120,
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
      width: 130,
    },
  ];

  formSearch = {
    fields: [
      {
        label: '主订单编号',
        name: 'dealId',
      },
      {
        label: '真实姓名',
        name: 'realName',
      },
      {
        label: '手机号',
        name: 'mobile',
      },
      {
        label: '团队编号',
        name: 'marketingTeamId',
        defHidden: true,
      },
      {
        label: '团队名称',
        name: 'marketingTeamName',
        defHidden: true,
      },
      {
        label: '订单状态',
        name: 'dealState',
        mode: 'multiple',
        options: (() => {
          const {
            pubmktmb: { DealStatus },
          } = this.props;
          return modelMapToOption(DealStatus);
        })(),
        type: ItemTypes.Select,
        defHidden: true,
      },
      [
        {
          label: '创建日期(始)',
          name: 'startGmtCreate',
          placeholder: '开始',
          type: ItemTypes.DatePickerRangeStart,
          defHidden: true,
        },
        {
          label: '创建日期(止)',
          name: 'endGmtCreate',
          placeholder: '结束',
          type: ItemTypes.DatePickerRangeEnd,
          defHidden: true,
        },
      ],
      [
        {
          label: '更新时间(始)',
          name: 'modifiedStartTime',
          placeholder: '开始',
          type: ItemTypes.DatePickerRangeStart,
          defHidden: true,
        },
        {
          label: '更新时间(止)',
          name: 'modifiedEndTime',
          placeholder: '结束',
          type: ItemTypes.DatePickerRangeEnd,
          defHidden: true,
        },
      ],
    ],
  };

  state = {
    selectedRows: undefined,
  };

  operation = () => {
    const {
      dispatch,
      pubmktmb: { DealStatus },
      printFetching,
    } = this.props;
    return {
      buttons: [
        {
          auth: 'export',
          btnType: ButtonTypes.Export,
        },
        {
          text: '打印',
          icon: <IconFont type="print" />,
          loading: printFetching,
          auth: 'print',
          forRow: rows => {
            return rows.length === 1 && rows[0].dealState === DealStatus.DEAL_COMPLETE.key;
          },
          action: () => {
            print();
          },
        },
        {
          text: '打印预览',
          icon: <IconFont type="print" />,
          auth: 'print',
          forRow: rows => {
            return rows.length === 1 && rows[0].dealState === DealStatus.DEAL_COMPLETE.key;
          },
          action: () => {
            const { selectedRows } = this.state;
            dispatch(push(`./${selectedRows[0].dealId}/print`));
          },
        },
        {
          text: '订单详情',
          icon: <IconFont type="menu-deal-main" />,
          forRow: 'single',
          action: () => {
            const { selectedRows } = this.state;
            dispatch(push(`./${selectedRows[0].dealId}/detail`));
          },
        },
      ],
    };
  };

  handleSelectedChange = (_, rows) => {
    this.setState({
      selectedRows: rows,
    });
  };

  render() {
    const {
      pubmktmb: { DealStatus },
    } = this.props;
    const { selectedRows } = this.state;
    const printId = selectedRows?.[0]?.dealState === DealStatus.DEAL_COMPLETE.key ? selectedRows[0].dealId : null;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Datatable
            select="multi"
            onSelectedChange={this.handleSelectedChange}
            url="/dealMarketingMember/dataList.do"
            columns={this.columns}
            // https://ant.design/components/table-cn/#%E6%B3%A8%E6%84%8F
            rowKey="id"
            formSearch={this.formSearch}
            operation={this.operation()}
          />
        </Card>
        {/* //FIXME 选行即加载的方式性能非常不好，但疑似受限于 https://github.com/facebook/react/issues/16734 ，只能先这样 */}
        <AuthComponent auth="print">
          <OrderPrint id={printId} onlyPrint />
        </AuthComponent>
      </PageHeaderLayout>
    );
  }
}

export default MarketingMemberDeal;
