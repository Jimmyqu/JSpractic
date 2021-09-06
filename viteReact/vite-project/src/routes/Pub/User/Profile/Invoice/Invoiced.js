import { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Card } from 'antd';
import IconFont from '@/components/Icon';
import LevelView from '@/components/LevelView';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import { formatDateTime, formatMoneyLen2, formatModel } from '@/utils/format';
import InvoiceCancelModal from '@/components/Modal/InvoiceCancelModal';
import { modelMapToOption } from '@/utils/utils';
import styles from '@/components/Invoice/index.less';
import { modal } from '@/utils/feedback';
import InvoicedProfile from './InvoicedProfile';

@connect(({ pubinvoice }) => ({
  pubinvoice,
}))
class Invoiced extends Component {
  state = {
    selectedRows: undefined,
    cancelModalVisible: false,
  };

  columns = [
    {
      title: '发票编号',
      dataIndex: 'id',
      width: 90,
    },
    {
      title: '申请时间',
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
      title: '发票抬头',
      dataIndex: 'invoiceName',
      width: 200,
    },
    {
      title: '税务登记证号',
      dataIndex: 'registerNo',
      width: 150,
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
      title: '创建时间',
      width: 190,
      render: (_, { gmtCreate }) => formatDateTime(gmtCreate),
    },
  ];

  formSearch = {
    fields: [
      [
        {
          label: '申请时间(始)',
          name: 'createStartDate',
          placeholder: '开始',
          type: ItemTypes.DatePickerRangeStart,
        },
        {
          label: '申请时间(止)',
          name: 'createEndDate',
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
        label: '发票编号',
        name: 'id',
        defHidden: true,
      },
    ],
  };

  operation = {
    buttons: [
      {
        text: '详情',
        forRow: 'single',
        action: () => {
          const { pushView } = this.context;
          const { selectedRows } = this.state;
          pushView(
            <LevelView.SubView title="发票详情">
              <InvoicedProfile id={selectedRows[0].id} />
            </LevelView.SubView>
          );
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
        type: 'danger',
        icon: <IconFont type="cancel" />,
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
        auth: 'export',
        btnType: ButtonTypes.Export,
      },
    ],
  };

  static contextTypes = {
    pushView: PropTypes.func,
  };

  handleSelectedChange = (_, rows) => {
    this.setState({
      selectedRows: rows,
    });
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

  render() {
    const { pubAccountId } = this.props;
    const { cancelModalVisible, selectedRows } = this.state;
    return (
      <Card bordered={false}>
        <Datatable
          select="multi"
          url={`/invoice/queryInvoiceList.do?pubAccountId=${pubAccountId}`}
          onSelectedChange={this.handleSelectedChange}
          columns={this.columns}
          rowKey="id"
          onInit={this.handleTableInit}
          formSearch={this.formSearch}
          operation={this.operation}
        />
        <InvoiceCancelModal
          invoiceId={(selectedRows || []).map(({ id }) => id)}
          visible={cancelModalVisible}
          onVisibleChange={this.handleInvoiceCancelVisibleChange}
          onOk={this.handleDoInvoiceCancel}
        />
      </Card>
    );
  }
}

export default Invoiced;
