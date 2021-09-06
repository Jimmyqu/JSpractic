import { Component } from 'react';
import { connect } from 'react-redux';
import { message, Card } from 'antd';
import IconFont from '@/components/Icon';
import Datatable from '@/components/Datatable';
import { modal } from '@/utils/feedback';
import { formatDateTime } from '@/utils/format';
import EditContent from './EditContent';

@connect(({ pubinvoice, loading }) => ({
  pubinvoice,
  deleting: loading.effects['pubinvoice/delete'],
}))
class Company extends Component {
  state = {
    selectedRows: undefined,
    showContentMode: undefined,
  };

  columns = [
    {
      title: '编号',
      dataIndex: 'id',
      width: 90,
    },
    {
      title: '发票抬头',
      dataIndex: 'invoiceName',
      width: 110,
    },
    {
      title: '税务登记证号',
      dataIndex: 'registerNo',
      width: 130,
    },
    {
      title: '开户银行',
      dataIndex: 'bankName',
      width: 110,
    },
    {
      title: '开户账号',
      dataIndex: 'bankAccount',
      width: 110,
    },
    {
      title: '单位注册地址',
      dataIndex: 'regAddress',
      width: 250,
    },
    {
      title: '联系电话',
      dataIndex: 'contact',
      width: 170,
    },
    {
      title: '收件邮箱',
      dataIndex: 'email',
      width: 170,
    },
    {
      title: '创建人',
      dataIndex: 'createRealName',
      width: 130,
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
      title: '单位名称',
      dataIndex: 'companyName',
      width: 130,
    },
  ];

  formSearch = {
    fields: [
      {
        label: '发票抬头',
        name: 'invoiceName',
      },
    ],
  };

  operation = () => {
    const { deleting } = this.props;
    return {
      buttons: [
        {
          text: '添加',
          icon: <IconFont type="add" />,
          disabled: deleting,
          action: () => {
            this.setState({
              showContentMode: 1,
            });
          },
        },
        {
          text: '修改',
          icon: <IconFont type="editor" />,
          forRow: 'single',
          disabled: deleting,
          action: () => {
            this.setState({
              showContentMode: 2,
            });
          },
        },
        {
          text: '删除',
          type: 'danger',
          icon: <IconFont type="cancel" />,
          forRow: 'multi',
          loading: deleting,
          action: () => {
            modal.confirm('确认删除选择的发票信息吗？', {
              onOk: () => {
                const { selectedRows } = this.state;
                const { dispatch } = this.props;
                dispatch({
                  type: 'pubinvoice/delete',
                  payload: selectedRows.map(item => item.id),
                }).then(() => {
                  message.success('删除成功');
                  this.table.reload();
                });
              },
            });
          },
        },
      ],
    };
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

  handleCreateOrEditSubmit = result => {
    const { showContentMode } = this.state;
    const edit = showContentMode === 2;
    if (result) {
      if (edit) {
        message.success('编辑成功');
      } else {
        message.success('添加成功');
      }
      this.cancelContent();
      this.table.reload();
    }
  };

  handleLoadData = list => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pubinvoice/saveCompany',
      payload: {
        list: list || [],
      },
    });
  };

  render() {
    const { pubAccountId } = this.props;
    const { showContentMode } = this.state;
    return (
      <Card bordered={false}>
        <Datatable
          select="multi"
          url={`/invoiceInfo/dataList.do?pubAccountId=${pubAccountId}`}
          onSelectedChange={this.handleSelectedChange}
          columns={this.columns}
          rowKey="id"
          formSearch={this.formSearch}
          operation={this.operation()}
          onInit={this.handleTableInit}
          onLoadData={this.handleLoadData}
          content={(() => {
            switch (showContentMode) {
              case 1:
              case 2:
                return (
                  <EditContent
                    edit={showContentMode === 2}
                    pubAccountId={pubAccountId}
                    cancel={this.cancelContent}
                    sure={this.handleCreateOrEditSubmit}
                  />
                );
              default:
                return null;
            }
          })()}
        />
      </Card>
    );
  }
}

export default Company;
