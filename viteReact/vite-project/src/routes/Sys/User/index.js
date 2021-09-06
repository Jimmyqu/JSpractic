import { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Card, message } from 'antd';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import IconFont from '@/components/Icon';
import { formatDateTime, formatModel } from '@/utils/format';
import { CommonFileLinkTypes } from '@/utils/upload';
import { getPageQuery, modelMapToOption } from '@/utils/utils';
import AddContent from './AddContent';
import EditContent from './EditContent';
import ChangeAuthContent from './ChangeAuthContent';
import ChangePwdContent from './ChangePwdContent';
import BindingSimpleContent from '../../Device/BindingSimpleContent';

@connect(({ user, loading, global }) => ({
  user,
  changePwdIng: loading.effects['user/changepwd'],
  RelTypes: global.RelTypes,
}))
class SysUser extends Component {
  type = CommonFileLinkTypes.SYSUSER_FACE_AVATAR.key;

  columns = [
    {
      title: '编号',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '姓名(负责人)',
      dataIndex: 'realName',
      width: 150,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 250,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: value => {
        const {
          user: { UserStatus },
        } = this.props;
        return formatModel(UserStatus, value);
      },
      width: 80,
    },
    {
      title: '用户类型',
      dataIndex: 'superAdmin',
      render: value => {
        const {
          user: { Roles },
        } = this.props;
        return formatModel(Roles, value);
      },
      width: 130,
    },
    {
      title: '所属角色',
      dataIndex: 'roleStr',
      width: 130,
    },
    {
      title: '备注',
      dataIndex: 'descr',
      width: 160,
    },
    {
      title: '登陆次数',
      dataIndex: 'loginCount',
      width: 80,
    },
    {
      title: '公司名称',
      dataIndex: 'companyName',
      width: 180,
    },
    {
      title: '创建人',
      dataIndex: 'createRealName',
      width: 120,
    },
    {
      title: '最后更新时间',
      dataIndex: 'updateTime',
      render: formatDateTime,
      width: 190,
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
        text: '添加',
        auth: 'add',
        icon: 'plus',
        action: () => {
          this.setState({
            showContentMode: 1,
          });
        },
      },
      {
        text: '编辑',
        icon: <IconFont type="editor" />,
        auth: 'edit',
        forRow: 'single',
        action: () => {
          this.setState({
            showContentMode: 2,
          });
        },
      },
      // 审核?
      {
        text: '用户授权',
        icon: <IconFont type="authorize" />,
        auth: 'role',
        forRow: 'single',
        action: () => {
          this.setState({
            showContentMode: 3,
          });
        },
      },
      {
        text: '修改密码',
        icon: <IconFont type="password" />,
        auth: 'pwd',
        forRow: 'single',
        action: () => {
          this.setState({
            showContentMode: 4,
          });
        },
      },
      {
        text: '认证图片',
        // auth: 'toAfr',// 只是跳转先不限制权限
        forRow: 'single',
        action: () => {
          const { dispatch } = this.props;
          const { selectedRows } = this.state;
          dispatch(
            push({
              pathname: '/basic/device/afr/pics',
              search: `type=${this.type}&id=${selectedRows[0].id}`,
            })
          );
        },
      },
      {
        text: '绑定IC/物理卡',
        auth: 'binding',
        type: 'primary',
        forRow: 'single',
        action: () => {
          this.setState({
            showContentMode: 5,
          });
        },
      },
      {
        auth: 'export',
        btnType: ButtonTypes.Export,
      },
    ],
  };

  state = {
    selectedRows: undefined,
    showContentMode: undefined,
  };

  formSearch = query => {
    const {
      user: { UserStatus, Roles },
    } = this.props;
    return {
      fields: [
        {
          label: '手机号',
          name: 'mobile',
        },
        {
          label: '姓名',
          name: 'realName',
        },
        {
          label: '公司全称',
          name: 'companyName',
        },
        {
          label: '用户状态',
          name: 'state',
          options: modelMapToOption(UserStatus),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '编号',
          name: 'id',
          initialValue: query.id,
          defHidden: true,
        },
        {
          label: '邮箱',
          name: 'email',
          defHidden: true,
        },
        {
          label: '用户类型',
          name: 'superAdmin',
          options: modelMapToOption(Roles).filter(item => item.key >= 0),
          type: ItemTypes.Select,
          defHidden: true,
        },
        [
          {
            label: '更新日期(始)',
            name: 'updateStartTime',
            type: ItemTypes.DatePickerRangeStart,
            defHidden: true,
          },
          {
            label: '更新日期(止)',
            name: 'updateEndTime',
            type: ItemTypes.DatePickerRangeEnd,
            defHidden: true,
          },
        ],
      ],
    };
  };

  handleChangePwdFormSubmit = () => {
    message.success('操作成功');
    this.cancelContent();
    this.table.reload();
  };

  handleChangeAuthFormSubmit = () => {
    message.success('操作成功');
    this.cancelContent();
    this.table.reload();
  };

  handleEditOrNewFormSubmit = () => {
    message.success('操作成功');
    this.cancelContent();
    this.table.reload();
  };

  handleICCardBingdingFormSubmit = () => {
    message.success('绑定成功');
    this.cancelContent();
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

  handleSelectedChange = (_, rows) => {
    this.setState(({ showContentMode }) => ({
      showContentMode: rows == null || rows.length === 0 ? null : showContentMode,
      selectedRows: rows,
    }));
  };

  render() {
    const query = getPageQuery();
    const { RelTypes } = this.props;
    const { showContentMode, selectedRows } = this.state;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Datatable
            select="multi"
            url={`/sysUser/dataList.do?companyId=${query.companyId || ''}`}
            columns={this.columns}
            // https://ant.design/components/table-cn/#%E6%B3%A8%E6%84%8F
            rowKey="id"
            formSearch={this.formSearch(query)}
            operation={this.operation}
            onInit={this.handleTableInit}
            onSelectedChange={this.handleSelectedChange}
            content={(() => {
              switch (showContentMode) {
                case 1:
                  return <AddContent cancel={this.cancelContent} sure={this.handleEditOrNewFormSubmit} />;
                case 2:
                  return <EditContent cancel={this.cancelContent} sure={this.handleEditOrNewFormSubmit} />;
                case 3:
                  return <ChangeAuthContent cancel={this.cancelContent} sure={this.handleChangeAuthFormSubmit} />;
                case 4:
                  return <ChangePwdContent cancel={this.cancelContent} sure={this.handleChangePwdFormSubmit} />;
                case 5:
                  return (
                    <BindingSimpleContent
                      cancel={this.cancelContent}
                      userId={selectedRows[0].id}
                      relType={RelTypes.SYS_USER.key}
                      sure={this.handleICCardBingdingFormSubmit}
                    />
                  );
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

export default SysUser;
