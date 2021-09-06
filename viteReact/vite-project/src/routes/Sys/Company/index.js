import { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Card, message } from 'antd';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import ImageViewModal from '@/components/Modal/ImageViewModal';
import IconFont from '@/components/Icon';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import {
  formatDateTime,
  formatHomeTown,
  formatModel,
  formatDate,
  formatImageUrl,
  formatIDCardType,
} from '@/utils/format';
import { modelMapToOption } from '@/utils/utils';
import EditContent from './EditContent';
import AuditContent from './AuditContent';
import styles from './index.less';

const overrideSetting = {
  // override
  render: obj => (obj?.url ? formatImageUrl(obj.url, 'album_preview') : null),
};

@connect(({ company, loading }) => ({
  company,
  authing: loading.effects['company/auth'],
}))
class SysUser extends Component {
  columns = [
    {
      title: '编号',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '单位名称',
      dataIndex: 'companyName',
      width: 180,
    },
    {
      title: '单位状态',
      dataIndex: 'status',
      render: value => {
        const {
          company: { CompanyStatus },
        } = this.props;
        return formatModel(CompanyStatus, value);
      },
      width: 80,
    },
    {
      title: '审核状态',
      dataIndex: 'auditState',
      render: value => {
        const {
          company: { AuditStatus },
        } = this.props;
        return <span className={classNames(styles[`auditState-${value}`])}>{formatModel(AuditStatus, value)}</span>;
      },
      width: 100,
    },
    {
      title: '审核备注',
      dataIndex: 'reviewDescr',
      width: 90,
    },
    {
      title: '证书',
      dataIndex: 'fileItemVO',
      render: value => {
        return this.imgPreviewRender(value, '证书');
      },
      width: 120,
    },
    {
      title: '法人',
      dataIndex: 'sysCompanyAuditInfoVO.corporate',
      width: 100,
    },
    {
      title: '法人电话',
      dataIndex: 'sysCompanyAuditInfoVO.corporateTel',
      width: 100,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 170,
    },
    {
      title: '办公电话',
      dataIndex: 'sysCompanyAuditInfoVO.officeTel',
      width: 130,
    },
    {
      title: '办公地点',
      dataIndex: 'sysCompanyAuditInfoVO.officeLocation',
      width: 150,
    },
    {
      title: '经营项目',
      dataIndex: 'sysCompanyAuditInfoVO.businessProject',
      width: 150,
    },
    {
      title: '证件类型',
      dataIndex: 'sysCompanyAuditInfoVO.idCardType',
      render: formatIDCardType,
      width: 100,
    },
    {
      title: '证件号',
      dataIndex: 'sysCompanyAuditInfoVO.idCardNo',
      width: 200,
    },
    {
      title: '成立日期',
      dataIndex: 'sysCompanyAuditInfoVO.regDate',
      render: formatDate,
      width: 110,
    },
    {
      title: '登记机关',
      dataIndex: 'sysCompanyAuditInfoVO.regOrg',
      width: 130,
    },
    {
      title: '经营范围图片',
      dataIndex: 'sysCompanyAuditInfoVO.fileItemVO',
      render: value => {
        return this.imgPreviewRender(value, '经营范围图片');
      },
      width: 140,
    },
    {
      title: '经营范围',
      dataIndex: 'sysCompanyAuditInfoVO.businessScope',
      width: 150,
    },
    {
      title: '经营许可证',
      dataIndex: 'sysCompanyAuditInfoVO.businessLicense',
      render: value => {
        return this.imgPreviewRender(value, '经营许可证');
      },
      width: 140,
    },
    {
      title: '注册地址',
      dataIndex: 'sysCompanyAuditInfoVO.regLocation',
      width: 140,
    },
    {
      title: '省',
      dataIndex: 'province',
      render: formatHomeTown,
      width: 80,
    },
    {
      title: '市',
      dataIndex: 'city',
      render: formatHomeTown,
      width: 80,
    },
    {
      title: '区/县',
      dataIndex: 'district',
      render: formatHomeTown,
      width: 80,
    },
    {
      title: '通讯地址',
      dataIndex: 'address',
      width: 180,
    },
    {
      title: '单位联系人',
      dataIndex: 'contentEs',
      width: 110,
    },
    {
      title: '单位联系人电话',
      dataIndex: 'contentTel',
      width: 140,
    },
    {
      title: '单位联系人手机',
      dataIndex: 'mobile',
      width: 140,
    },
    {
      title: '单位电话',
      dataIndex: 'tel',
      width: 120,
    },
    {
      title: '邮政编码',
      dataIndex: 'zipCode',
      width: 100,
    },
    {
      title: '传真',
      dataIndex: 'fax',
      width: 100,
    },
    {
      title: '开户银行',
      dataIndex: 'sysCompanyAuditInfoVO.bankName',
      width: 150,
    },
    {
      title: '银行卡号',
      dataIndex: 'sysCompanyAuditInfoVO.bankCardNo',
      width: 200,
    },
    {
      title: '微信商户号',
      dataIndex: 'sysCompanyAuditInfoVO.wechatPayNo',
      width: 200,
    },
    {
      title: '微信商户号图片',
      dataIndex: 'sysCompanyAuditInfoVO.wechatPayNoImg',
      render: value => {
        return this.imgPreviewRender(value, '微信商户号图片');
      },
      width: 140,
    },
    {
      title: '支付宝账号',
      dataIndex: 'sysCompanyAuditInfoVO.alipayNo',
      width: 200,
    },
    {
      title: '相关证件',
      dataIndex: 'sysCompanyAuditInfoVO.relevantDocuments',
      render: value => {
        return this.imgPreviewRender(value, '相关证件');
      },
      width: 140,
    },
    {
      title: '单位网址',
      dataIndex: 'webSite',
      width: 180,
    },
    {
      title: '单位描述',
      dataIndex: 'descr',
      width: 240,
    },
    {
      title: '备注',
      dataIndex: 'sysCompanyAuditInfoVO.descr',
      width: 200,
    },
    {
      title: '备注2',
      dataIndex: 'sysCompanyAuditInfoVO.descr2',
      width: 100,
    },
    {
      title: '备注3',
      dataIndex: 'sysCompanyAuditInfoVO.descr3',
      width: 100,
    },
    {
      title: '备注4',
      dataIndex: 'sysCompanyAuditInfoVO.descr4',
      width: 100,
    },
    {
      title: '备注5',
      dataIndex: 'sysCompanyAuditInfoVO.descr5',
      width: 100,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      render: formatDateTime,
      width: 180,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: formatDateTime,
      width: 180,
    },
  ];

  formSearch = {
    fields: [
      {
        label: '审核状态',
        name: 'auditState',
        options: (() => {
          const {
            company: { AuditStatus },
          } = this.props;
          return modelMapToOption(AuditStatus);
        })(),
        type: ItemTypes.Select,
      },
      {
        label: '编号',
        name: 'id',
      },
      {
        label: '单位全称',
        name: 'companyName',
      },
      {
        label: '单位状态',
        name: 'status',
        options: (() => {
          const {
            company: { CompanyStatus },
          } = this.props;
          return modelMapToOption(CompanyStatus);
        })(),
        type: ItemTypes.Select,
        defHidden: true,
      },
      {
        label: '邮箱',
        name: 'email',
        defHidden: true,
      },
      {
        label: '法人电话',
        name: 'corporateTel',
        defHidden: true,
      },
    ],
  };

  operation = {
    export: {
      settings: {
        fileItemVO: overrideSetting,
        'sysCompanyAuditInfoVO.fileItemVO': overrideSetting,
        'sysCompanyAuditInfoVO.businessLicense': overrideSetting,
        'sysCompanyAuditInfoVO.wechatPayNoImg': overrideSetting,
        'sysCompanyAuditInfoVO.relevantDocuments': overrideSetting,
      },
    },
    buttons: [
      {
        icon: <IconFont type="editor" />,
        auth: 'edit',
        text: '编辑',
        forRow: 'single',
        action: () => {
          this.setState(
            () => ({
              showContentMode: 1,
            }),
            () => {
              this.forceUpdate();
            }
          );
        },
      },
      {
        icon: <IconFont type="audit" />,
        type: 'primary',
        text: '审核',
        auth: 'audit',
        forRow: 'single',
        action: () => {
          this.setState({
            showContentMode: 2,
          });
        },
      },
      {
        icon: <IconFont type="User-1" />,
        type: 'primary',
        auth: 'add',
        text: '跳转用户界面',
        forRow: 'single',
        action: () => {
          const { dispatch } = this.props;
          const { selectedRows } = this.state;

          dispatch(
            push({
              pathname: './sysuser',
              search: `companyId=${selectedRows[0].id}`,
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

  state = {
    selectedRows: undefined,
    showContentMode: undefined,
    previewVisible: false,
    previewFile: undefined,
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

  handleAuditFormSubmit = () => {
    message.success('操作成功');
    this.cancelContent();
    this.table.reload();
  };

  handleEditFormSubmit = () => {
    message.success('编辑成功');
    this.cancelContent();
    this.table.reload();
  };

  handleTableInit = table => {
    this.table = table;
  };

  handlePreview = (file, alt) => {
    this.setState({
      previewFile: {
        ...file,
        alt,
      },
      previewVisible: true,
    });
  };

  handlePreviewVisibleChange = previewVisible => {
    this.setState({
      previewVisible,
    });
  };

  handleImageEdit = () => {
    this.table.reload();
  };

  imgPreviewRender = (obj, alt) => {
    if (obj?.url) {
      return (
        <img
          src={formatImageUrl(obj.url, 'album_preview')}
          alt={alt}
          style={{ cursor: 'pointer' }}
          onClick={() => this.handlePreview(obj, alt)}
        />
      );
    }
    return null;
  };

  render() {
    const { showContentMode, previewVisible, previewFile } = this.state;

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Datatable
            select="multi"
            onSelectedChange={this.handleSelectedChange}
            url="/sysCompany/dataList.do"
            columns={this.columns}
            // https://ant.design/components/table-cn/#%E6%B3%A8%E6%84%8F
            rowKey="id"
            formSearch={this.formSearch}
            operation={this.operation}
            onInit={this.handleTableInit}
            content={(() => {
              switch (showContentMode) {
                case 1:
                  return <EditContent cancel={this.cancelContent} sure={this.handleEditFormSubmit} />;
                case 2:
                  return <AuditContent cancel={this.cancelContent} sure={this.handleAuditFormSubmit} />;
                default:
                  return null;
              }
            })()}
          />
        </Card>
        <ImageViewModal
          visible={previewVisible}
          onVisibleChange={this.handlePreviewVisibleChange}
          file={previewFile}
          canEdit
          onOk={this.handleImageEdit}
        />
      </PageHeaderLayout>
    );
  }
}

export default SysUser;
