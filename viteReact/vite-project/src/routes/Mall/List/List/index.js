import { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Card, message } from 'antd';
import Datatable, { ButtonTypes } from '@/components/Datatable';
import IconFont from '@/components/Icon';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { formatMoneyLen2, formatDateTime, formatImageUrl } from '@/utils/format';
import { DEFAULT_GIFT_PIC_FULLPATH } from '@/utils/utils';
import { modal } from '@/utils/feedback';
import EditProfileContent from './EditProfileContent';
import InboundContent from './InboundContent';

@connect(({ venue, store, loading }) => ({
  venue,
  store,
  deleting: loading.effects['store/delete'],
}))
class List extends Component {
  columns = [
    {
      title: '编号',
      dataIndex: 'id',
      width: 100,
    },
    {
      title: '图片',
      dataIndex: 'fileUrl',
      render: value => (
        <img src={formatImageUrl(value, 'album_preview', DEFAULT_GIFT_PIC_FULLPATH)} alt="img" className="img-max" />
      ),
      width: 100,
    },
    {
      title: '名称',
      dataIndex: 'itemName',
      width: 200,
    },
    {
      title: '拼音',
      dataIndex: 'itemPinyin',
      width: 170,
    },
    {
      title: '编码',
      dataIndex: 'itemCode',
      width: 100,
    },
    {
      title: '条码',
      dataIndex: 'label',
      width: 100,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      width: 80,
    },
    {
      title: '库存',
      dataIndex: 'stockNum',
      width: 60,
    },
    {
      title: '进货价',
      dataIndex: 'buyPrice',
      render: formatMoneyLen2,
      width: 100,
    },
    {
      title: '商品原价',
      dataIndex: 'marketPrice',
      render: formatMoneyLen2,
      width: 100,
    },
    {
      title: '销售价',
      dataIndex: 'salesPrice',
      render: formatMoneyLen2,
      width: 100,
    },
    {
      title: '描述',
      dataIndex: 'descs',
      width: 200,
    },
    {
      title: '关键字',
      dataIndex: 'keywords',
      width: 150,
    },
    {
      title: '创建人',
      dataIndex: 'createRealName',
      width: 130,
    },
    {
      title: '单位名称',
      dataIndex: 'companyName',
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: formatDateTime,
      width: 190,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      render: formatDateTime,
      width: 190,
    },
  ];

  formSearch = {
    fields: [
      {
        label: '商品编号',
        name: 'id',
      },
      {
        label: '商品名称',
        name: 'itemName',
      },
      {
        label: '商品条码',
        name: 'label',
      },
    ],
  };

  state = {
    showContentMode: undefined,
    selectedRows: undefined,
  };

  operation = () => {
    const { deleting, dispatch } = this.props;
    return {
      buttons: [
        {
          text: '添加',
          icon: 'plus',
          auth: 'add',
          disabled: deleting,
          action: () => {
            dispatch({
              type: 'store/fetchcategoryListByParent',
            });
            this.setState({
              showContentMode: 0,
            });
          },
        },
        {
          text: '编辑',
          icon: <IconFont type="editor" />,
          auth: 'edit',
          forRow: 'single',
          disabled: deleting,
          action: () => {
            dispatch({
              type: 'store/fetchcategoryListByParent',
            });
            this.setState({
              showContentMode: 1,
            });
          },
        },
        {
          text: '删除',
          icon: <IconFont type="cancel" />,
          auth: 'remove',
          forRow: rows => {
            return rows.length > 0 && rows.every(item => item.stockNum === 0);
          },
          loading: deleting,
          action: () => {
            modal.confirm('确认删除商品吗？', {
              onOk: () => {
                const { selectedRows } = this.state;
                dispatch({
                  type: 'store/delete',
                  payload: selectedRows.map(item => item.id),
                }).then(() => {
                  message.success('删除成功');
                  this.table.reload();
                });
              },
            });
          },
        },
        {
          text: '商品入库',
          icon: <IconFont type="spck" />,
          auth: 'storage',
          forRow: 'single',
          disabled: deleting,
          action: () => {
            this.setState({
              showContentMode: 2,
            });
          },
        },
        {
          text: '进出货管理',
          icon: <IconFont type="sprk-" />,
          auth: 'ioqc',
          forRow: 'single',
          disabled: deleting,
          action: () => {
            const { selectedRows } = this.state;
            dispatch(
              push({
                pathname: `./${selectedRows[0].id}/stock`,
              })
            );
          },
        },
        {
          text: '操作流水',
          icon: <IconFont type="menu-activity-s-list" />,
          forRow: 'single',
          disabled: deleting,
          action: () => {
            const { selectedRows } = this.state;
            dispatch(
              push({
                pathname: '/basic/mall/stockflow',
                search: `itemId=${selectedRows[0].id}`,
              })
            );
          },
        },
        {
          auth: 'export',
          btnType: ButtonTypes.Export,
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

  handleInboundFormSubmit = () => {
    message.success('入库成功');
    this.cancelContent();
    this.table.reload();
  };

  handleEditItemFormSubmit = () => {
    const { showContentMode } = this.state;
    const edit = showContentMode === 1;
    if (edit) {
      message.success('编辑成功');
    } else {
      message.success('添加成功');
    }
    this.cancelContent();
    this.table.reload();
  };

  render() {
    const { showContentMode } = this.state;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Datatable
            select="multi"
            onSelectedChange={this.handleSelectedChange}
            url="/item/dataList.do"
            columns={this.columns}
            // https://ant.design/components/table-cn/#%E6%B3%A8%E6%84%8F
            rowKey="id"
            formSearch={this.formSearch}
            operation={this.operation()}
            onInit={this.handleTableInit}
            content={(() => {
              const edit = showContentMode === 1;
              switch (showContentMode) {
                case 0:
                case 1:
                  return (
                    <EditProfileContent edit={edit} cancel={this.cancelContent} sure={this.handleEditItemFormSubmit} />
                  );
                case 2:
                  return <InboundContent cancel={this.cancelContent} sure={this.handleInboundFormSubmit} />;
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
