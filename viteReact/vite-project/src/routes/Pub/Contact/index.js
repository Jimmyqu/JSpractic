import { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Card, message } from 'antd';
import { Link } from 'react-router-dom';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import IconFont from '@/components/Icon';
import { formatModel, formatGender, formatDate, formatDateTime, formatFaceImgInTable } from '@/utils/format';
import { modal } from '@/utils/feedback';
import BindingSimpleContent from '../../Device/BindingSimpleContent';
import EditContactContent from '../User/Profile/EditContactContent';

const overrideSetting = {
  // override
  render: value => value,
};

@connect(({ pubuser, global: { RelTypes, CommonFileLinkTypes, AuthenticationStatus }, loading }) => ({
  pubuser,
  RelTypes,
  CommonFileLinkTypes,
  AuthenticationStatus,
  deleting: loading.effects['contact/delete'],
}))
class StudentList extends Component {
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
      title: '所属会员编号',
      dataIndex: 'pubAccountId',
      render: value => <Link to={`/basic/pub/info/${value}/base`}>{value}</Link>,
      width: 110,
    },
    {
      title: '会员姓名',
      dataIndex: 'pubRealName',
      width: 110,
    },
    {
      title: '会员手机号',
      dataIndex: 'pubMobile',
      width: 130,
    },
    {
      title: '人员/学员姓名',
      dataIndex: 'realName',
      width: 130,
    },
    {
      title: '人员/学员手机号',
      dataIndex: 'mobile',
      width: 140,
    },
    {
      title: '人脸认证照片',
      dataIndex: 'picUrl',
      render: formatFaceImgInTable,
      width: 120,
    },
    {
      title: '认证状态',
      dataIndex: 'authentication',
      render: value => {
        const { AuthenticationStatus } = this.props;
        return formatModel(AuthenticationStatus, value);
      },
      width: 100,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      render: formatGender,
      width: 100,
    },
    {
      title: '出生日期',
      dataIndex: 'birthday',
      render: formatDate,
      width: 120,
    },
    {
      title: '固定电话',
      dataIndex: 'telephone',
      width: 130,
    },
    {
      title: '证件类型',
      dataIndex: 'cardType',
      render: value => {
        const {
          pubuser: { IDCardTypes },
        } = this.props;
        return formatModel(IDCardTypes, value);
      },
      width: 100,
    },
    {
      title: '证件号',
      dataIndex: 'cardNum',
      width: 200,
    },
    {
      title: '身高（单位cm）',
      dataIndex: 'height',
      width: 150,
    },
    {
      title: '体重（单位kg）',
      dataIndex: 'weight',
      width: 150,
    },
    {
      title: '备注',
      dataIndex: 'descr',
      width: 100,
    },
    {
      title: '更新时间',
      dataIndex: 'gmtModified',
      render: formatDateTime,
      width: 190,
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      render: formatDateTime,
      width: 190,
    },
  ];

  formSearch = {
    fields: [
      {
        label: '人员/学员手机号',
        name: 'mobile',
      },
      {
        label: '人员/学员姓名',
        name: 'realName',
      },
      {
        label: '所属会员编号',
        name: 'pubAccountId',
      },
      [
        {
          label: '创建时间（始）',
          name: 'startDateValue',
          type: ItemTypes.DatePickerRangeStart,
          defHidden: true,
        },
        {
          label: '创建时间（止）',
          name: 'endDateValue',
          type: ItemTypes.DatePickerRangeEnd,
          defHidden: true,
        },
      ],
    ],
  };

  operation = () => {
    const { deleting, dispatch, AuthenticationStatus, CommonFileLinkTypes } = this.props;
    return {
      export: {
        settings: {
          pubAccountId: overrideSetting,
        },
      },
      buttons: [
        {
          text: '添加',
          auth: 'edit',
          icon: <IconFont type="add" />,
          type: 'primary',
          disabled: deleting,
          action: () => {
            this.setState({
              showContentMode: 2,
            });
          },
        },
        {
          text: '编辑',
          icon: <IconFont type="editor" />,
          auth: 'edit',
          type: 'primary',
          forRow: 'single',
          disabled: deleting,
          action: () => {
            this.setState({
              showContentMode: 3,
            });
          },
        },
        {
          text: '删除',
          icon: <IconFont type="cancel" />,
          auth: 'remove',
          type: 'danger',
          forRow: 'multi',
          action: () => {
            modal.confirm('确认删除这些联系人吗？', {
              onOk: async () => {
                const { selectedRows } = this.state;
                await dispatch({
                  type: 'contact/delete',
                  payload: selectedRows.map(item => item.id),
                });
                message.success('删除成功');
                this.table.reload();
              },
            });
          },
        },
        {
          text: '可用服务',
          forRow: 'single',
          action: () => {
            const { selectedRows } = this.state;
            dispatch(
              push({
                pathname: '/basic/pub/pubservicesold',
                search: `pubAccountId=${selectedRows[0].pubAccountId}`,
              })
            );
          },
        },
        {
          text: '服务流水',
          forRow: 'single',
          action: () => {
            const { selectedRows } = this.state;
            dispatch(
              push({
                pathname: '/basic/pub/pubserviceflow',
                search: `pubAccountId=${selectedRows[0].pubAccountId}`,
              })
            );
          },
        },
        {
          type: 'primary',
          text: '人脸认证',
          // icon: <IconFont type="pay" />,
          disabled: deleting,
          forRow: rows => rows.length === 1 && rows[0].authentication === AuthenticationStatus.UNCERTIFIED.key,
          action: () => {
            const { selectedRows } = this.state;
            dispatch(
              push({
                pathname: '/basic/device/afr/auth',
                search: `type=${CommonFileLinkTypes.PUBLICSTUDY_FACE_AVATAR.key}&id=${selectedRows[0].id}`,
              })
            );
          },
        },
        {
          text: '认证图片',
          forRow: 'single',
          disabled: deleting,
          action: () => {
            const { selectedRows } = this.state;
            dispatch(
              push({
                pathname: '/basic/device/afr/pics',
                search: `type=${CommonFileLinkTypes.PUBLICSTUDY_FACE_AVATAR.key}&id=${selectedRows[0].id}`,
              })
            );
          },
        },
        {
          text: '绑定IC/物理卡',
          auth: 'binding-ctt',
          type: 'primary',
          forRow: 'single',
          disabled: deleting,
          action: () => {
            this.setState({
              showContentMode: 1,
            });
          },
        },
        {
          auth: 'export',
          disabled: deleting,
          btnType: ButtonTypes.Export,
        },
      ],
    };
  };

  handleSelectedChange = (_, rows) => {
    this.setState(({ showContentMode }) => ({
      selectedRows: rows,
      showContentMode: rows == null || rows.length === 0 ? null : showContentMode,
    }));
  };

  cancelContent = () => {
    this.setState({
      showContentMode: null,
    });
  };

  handleICCardBingdingFormSubmit = () => {
    message.success('绑定成功');
    this.cancelContent();
    this.table.reload();
  };

  handleAddOrEditContactFormSubmit = () => {
    const { showContentMode } = this.state;
    message.success(`${showContentMode === 3 ? '编辑' : '添加'}成功`);
    this.cancelContent();
    this.table.reload();
  };

  handleTableInit = table => {
    this.table = table;
  };

  render() {
    const {
      match: { params },
      RelTypes,
    } = this.props;
    const { id: pubAccountId } = params || {};
    const { showContentMode } = this.state;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Datatable
            select="multi"
            url="/publicStudy/studyList.do"
            onSelectedChange={this.handleSelectedChange}
            columns={this.columns}
            rowKey="id"
            onInit={this.handleTableInit}
            formSearch={this.formSearch}
            operation={this.operation()}
            content={(() => {
              switch (showContentMode) {
                case 1:
                  return (
                    <BindingSimpleContent
                      cancel={this.cancelContent}
                      userId={pubAccountId}
                      relType={RelTypes.PUBSTUDY_USER.key}
                      sure={this.handleICCardBingdingFormSubmit}
                    />
                  );
                case 2:
                case 3:
                  return (
                    <EditContactContent
                      cancel={this.cancelContent}
                      isEdit={showContentMode === 3}
                      sure={this.handleAddOrEditContactFormSubmit}
                      add="true"
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

export default StudentList;
