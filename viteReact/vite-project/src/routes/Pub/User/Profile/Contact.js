import { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Card, message } from 'antd';
import Datatable from '@/components/Datatable';
import IconFont from '@/components/Icon';
import { formatModel, formatGender, formatDate, formatDateTime, formatFaceImgInTable } from '@/utils/format';
import { modal } from '@/utils/feedback';
import BindingSimpleContent from '../../../Device/BindingSimpleContent';
import EditContactContent from './EditContactContent';

@connect(({ pubuser, global: { RelTypes, CommonFileLinkTypes, AuthenticationStatus }, loading }) => ({
  pubuser,
  RelTypes,
  CommonFileLinkTypes,
  AuthenticationStatus,
  deleting: loading.effects['contact/delete'],
}))
class ProfileContact extends Component {
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
      width: 110,
    },
    {
      title: '人脸认证照片',
      dataIndex: 'picUrl',
      render: formatFaceImgInTable,
      width: 120,
    },
    {
      title: '人员/学员',
      dataIndex: 'realName',
      width: 100,
    },
    {
      title: '人员/学员手机号',
      dataIndex: 'mobile',
      width: 140,
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
    fields: [],
  };

  operation = () => {
    const { deleting, dispatch, AuthenticationStatus, CommonFileLinkTypes } = this.props;
    return {
      buttons: [
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
          text: '删除',
          icon: <IconFont type="cancel" />,
          auth: 'remove-contact',
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
          text: '添加',
          icon: <IconFont type="add" />,
          auth: 'edit-contact',
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
          auth: 'edit-contact',
          type: 'primary',
          forRow: 'single',
          disabled: deleting,
          action: () => {
            this.setState({
              showContentMode: 3,
            });
          },
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
      <Card bordered={false}>
        <Datatable
          select="multi"
          url={`/publicStudy/studyList.do?pubAccountId=${pubAccountId}`}
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
                    pubAccountId={pubAccountId}
                    sure={this.handleAddOrEditContactFormSubmit}
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

export default ProfileContact;
