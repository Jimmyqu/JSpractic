import { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Card, message } from 'antd';
import moment from 'moment';
import IconFont from '@/components/Icon';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import InvoiceCancelModal from '@/components/Modal/InvoiceCancelModal';
import styles from '@/components/Invoice/index.less';
import { formatDateTime, formatMoneyLen2, formatModel } from '@/utils/format';
import { modal } from '@/utils/feedback';
import { modelMapToOption } from '@/utils/utils';
import PostInvoiceContent from './PostInvoiceContent';

@connect(({ pubinvoice }) => ({
  pubinvoice,
}))
class List extends Component {
  state = {
    selectedRows: undefined,
    cancelModalVisible: false,
    showContentMode: undefined,
  };

  columns = [
    {
      title: '发票编号',
      dataIndex: 'id',
      width: 90,
    },
    {
      title: '发票状态',
      dataIndex: 'invoiceStatus',
      render: value => {
        const {
          pubinvoice: { InvoiceStatus },
        } = this.props;
        return (
          <span
            className={classNames({
              'primary-color': value === InvoiceStatus.STAY_AUDIT.key,
              [styles.cancelColor]: value === InvoiceStatus.CANCEL.key,
            })}
          >
            {formatModel(InvoiceStatus, value)}
          </span>
        );
      },
      width: 90,
    },
    {
      title: '主订单号',
      dataIndex: 'dealIds',
      render: value => (value || []).join(' ; '),
      width: 100,
    },
    {
      title: '申请时间',
      key: 'sq',
      dataIndex: 'gmtCreate',
      render: formatDateTime,
      width: 190,
    },
    {
      title: '开票时间',
      dataIndex: 'invoiceDate',
      render: formatDateTime,
      width: 190,
    },
    {
      title: '开票总额',
      dataIndex: 'invoiceMoney',
      render: formatMoneyLen2,
      collect: true,
      width: 90,
    },
    {
      title: '发票号码',
      dataIndex: 'invoiceNo',
      render: invoiceNo => (Array.isArray(invoiceNo) ? invoiceNo.join(' ; ') : invoiceNo),
      width: 200,
    },
    {
      title: '发票抬头',
      dataIndex: 'invoiceName',
      width: 200,
    },
    {
      title: '会员姓名',
      dataIndex: 'pubRealName',
      width: 120,
    },
    {
      title: '会员手机号',
      dataIndex: 'pubMobile',
      width: 120,
    },
    {
      title: '开票方式',
      dataIndex: 'invoiceMode',
      render: value => {
        const {
          pubinvoice: { InvoiceModeTypes },
        } = this.props;
        return formatModel(InvoiceModeTypes, value);
      },
      width: 90,
    },
    {
      title: '税务登记证号',
      dataIndex: 'registerNo',
      width: 150,
    },
    {
      title: '开具类型',
      dataIndex: 'issueType',
      render: value => {
        const {
          pubinvoice: { InvoiceIssueTypes },
        } = this.props;
        return formatModel(InvoiceIssueTypes, value);
      },
      width: 90,
    },
    {
      title: '发票类型',
      dataIndex: 'invoiceType',
      render: value => {
        const {
          pubinvoice: { InvoiceTypes },
        } = this.props;
        return formatModel(InvoiceTypes, value);
      },
      width: 150,
    },
    {
      title: '备注',
      dataIndex: 'invoiceNote',
      width: 250,
    },
    {
      title: '创建人',
      dataIndex: 'createRealName',
      width: 130,
    },
    {
      title: '更新时间',
      width: 190,
      dataIndex: 'gmtModified',
      render: formatDateTime,
    },
    {
      title: '创建时间',
      width: 190,
      dataIndex: 'gmtCreate',
      render: formatDateTime,
    },
  ];

  formSearch = {
    fields: [
      [
        {
          label: '开票时间(始)',
          name: 'invoiceStartDate',
          placeholder: '开始',
          type: ItemTypes.DatePickerRangeStart,
        },
        {
          label: '开票时间(止)',
          name: 'invoiceEndDate',
          placeholder: '结束',
          type: ItemTypes.DatePickerRangeEnd,
        },
      ],
      {
        label: '发票状态',
        name: 'invoiceStatus',
        options: (() => {
          const {
            pubinvoice: { InvoiceStatus },
          } = this.props;
          return modelMapToOption(InvoiceStatus);
        })(),
        type: ItemTypes.Select,
      },
      {
        label: '发票号码',
        name: 'invoiceNo',
        defHidden: true,
      },
      {
        label: '开票方式',
        name: 'invoiceMode',
        options: (() => {
          const {
            pubinvoice: { InvoiceModeTypes },
          } = this.props;
          return modelMapToOption(InvoiceModeTypes);
        })(),
        type: ItemTypes.Select,
        defHidden: true,
      },
      {
        label: '开具类型',
        name: 'issueType',
        options: (() => {
          const {
            pubinvoice: { InvoiceIssueTypes },
          } = this.props;
          return modelMapToOption(InvoiceIssueTypes);
        })(),
        type: ItemTypes.Select,
        defHidden: true,
      },
      {
        label: '会员姓名',
        name: 'pubRealName',
        defHidden: true,
      },
      {
        label: '会员手机号',
        name: 'pubMobile',
        defHidden: true,
      },
      {
        label: '主订单号',
        name: 'dealId',
        defHidden: true,
      },
      {
        label: '备注',
        name: 'invoiceNote',
        defHidden: true,
      },
      {
        label: '编号',
        name: 'id',
        defHidden: true,
      },
      {
        label: '创建人',
        name: 'createRealName',
        defHidden: true,
      },
      [
        {
          label: '创建时间(始)',
          name: 'createStartDate',
          placeholder: '开始',
          initialValue: moment(),
          type: ItemTypes.DatePickerRangeStart,
          defHidden: true,
        },
        {
          label: '创建时间(止)',
          name: 'createEndDate',
          placeholder: '结束',
          initialValue: moment(),
          type: ItemTypes.DatePickerRangeEnd,
          defHidden: true,
        },
      ],
    ],
  };

  operation = {
    buttons: [
      {
        text: '详情',
        forRow: 'single',
        action: () => {
          const { dispatch } = this.props;
          const { selectedRows } = this.state;
          dispatch(push(`./${selectedRows[0].id}`));
        },
      },
      {
        type: 'danger',
        icon: <IconFont type="cancel" />,
        text: '作废',
        forRow: rows => {
          const {
            pubinvoice: { InvoiceStatus },
          } = this.props;
          return rows.length > 0 && rows.every(item => item.invoiceStatus === InvoiceStatus.SUCCESS.key);
        },
        action: () => {
          this.setState({
            cancelModalVisible: true,
          });
        },
      },
      {
        type: 'primary',
        text: '更新发票',
        forRow: rows => {
          const {
            pubinvoice: { InvoiceStatus },
          } = this.props;
          return rows.length > 0 && rows.every(item => item.invoiceStatus === InvoiceStatus.SUCCESS.key);
        },
        action: () => {
          this.setState({
            showContentMode: 2,
          });
        },
      },
      {
        type: 'danger',
        text: '撤销申请',
        forRow: rows => {
          const {
            pubinvoice: { InvoiceStatus },
          } = this.props;
          return rows.length > 0 && rows.every(({ invoiceStatus }) => invoiceStatus === InvoiceStatus.STAY_AUDIT.key);
        },
        action: () => {
          modal.confirm('确认撤销申请吗？', {
            onOk: async () => {
              const { dispatch } = this.props;
              const { selectedRows } = this.state;
              await dispatch({
                type: 'pubinvoice/revokeInvoice',
                payload: {
                  invoiceListIds: selectedRows.map(({ id }) => id),
                },
              });
              this.table.reload();
            },
          });
        },
      },
      {
        type: 'primary',
        text: '审核',
        forRow: rows => {
          const {
            pubinvoice: { InvoiceStatus },
          } = this.props;
          return rows.length === 1 && rows[0].invoiceStatus === InvoiceStatus.STAY_AUDIT.key;
        },
        action: () => {
          this.setState({
            showContentMode: 1,
          });
        },
      },
      {
        auth: 'export',
        btnType: ButtonTypes.Export,
      },
    ],
  };

  handleSelectedChange = (_, rows) => {
    this.setState(({ showContentMode }) => ({
      selectedRows: rows,
      showContentMode: rows == null || rows.length === 0 ? null : showContentMode,
    }));
  };

  handleInvoiceCancelVisibleChange = visible => {
    this.setState({
      cancelModalVisible: visible,
    });
  };

  handleDoInvoiceCancel = () => {
    this.table.reload();
  };

  handleTableInit = table => {
    this.table = table;
  };

  cancelContent = () => {
    this.setState({
      showContentMode: null,
    });
  };

  handlePostInvoiceSubmit = () => {
    const {
      pubinvoice: { InvoiceStatus },
    } = this.props;
    const { selectedRows } = this.state;
    const msg = selectedRows[0].invoiceStatus === InvoiceStatus.SUCCESS.key ? '更新成功' : '审核成功';
    message.success(msg);
    this.cancelContent();
    this.table.reload();
  };

  render() {
    const { cancelModalVisible, selectedRows, showContentMode } = this.state;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Datatable
            select="multi"
            url="/invoice/queryInvoiceList.do"
            onSelectedChange={this.handleSelectedChange}
            columns={this.columns}
            rowKey="id"
            onInit={this.handleTableInit}
            formSearch={this.formSearch}
            operation={this.operation}
            content={(() => {
              switch (showContentMode) {
                case 1:
                case 2:
                  return (
                    <PostInvoiceContent
                      invoiceId={((selectedRows || [])[0] || {}).id}
                      isUpdate={showContentMode === 2}
                      cancel={this.cancelContent}
                      sure={this.handlePostInvoiceSubmit}
                    />
                  );
                default:
                  return null;
              }
            })()}
          />
        </Card>
        <InvoiceCancelModal
          invoiceId={(selectedRows || []).map(({ id }) => id)}
          visible={cancelModalVisible}
          onVisibleChange={this.handleInvoiceCancelVisibleChange}
          onOk={this.handleDoInvoiceCancel}
        />
      </PageHeaderLayout>
    );
  }
}

export default List;
