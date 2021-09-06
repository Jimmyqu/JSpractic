import { useMemo, useEffect, useState, useCallback } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Card, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import Datatable, { ButtonTypes, ItemTypes, matchDynamicHeader } from '@/components/Datatable';
import ImageViewModal from '@/components/Modal/ImageViewModal';
import LevelView from '@/components/LevelView';
import { modelMapToOption, isNumerical } from '@/utils/utils';
import { formatModel, formatDateTime, formatImageUrl } from '@/utils/format';
import { modal } from '@/utils/feedback';
import ethnicList from '@/commons/lib/data/ethnic';
import AddContent from './AddContent';
import EditContent from './EditContent';
import LintUser from './LintUser';
import DetailContent from './DetailContent';
import Logs from './Logs';
import styles from './list.less';

function UserCommon({ careerId }, { pushView }) {
  const dispatch = useDispatch();
  const { Industries, ProfessionTypes } = useSelector(state => state.venue);
  const { CertExtStates } = useSelector(state => state.pubserviceuser);
  const { ExtDataTypes } = useSelector(state => state.extfield);
  const [previewFile, setPreviewFile] = useState();
  const loading = useSelector(
    state =>
      state.loading.effects['pubserviceuser/fetchSysUserCertExtConfigSearch'] ||
      state.loading.effects['pubserviceuser/fetchCertAvailableAuditState']
  );

  const [industryId, setIndustryId] = useState();
  const [professionalId, setProfessionalId] = useState();

  const [table, setTableInit] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [showContentMode, setShowContentMode] = useState();

  const [extSearchFieldList, setExtSearchFieldList] = useState();
  const [availableAuditStateList, setAvailableAuditStateList] = useState();
  const [dynamicHeaderList, setDynamicHeaderList] = useState();

  function cancelContent() {
    setShowContentMode(null);
  }

  useEffect(() => {
    if (industryId == null || professionalId == null) {
      setExtSearchFieldList([]);
      setAvailableAuditStateList([]);
      return;
    }
    const params = {
      careerId,
      industryId,
      professionalId,
    };
    dispatch({
      type: 'pubserviceuser/fetchSysUserCertExtConfigSearch',
      payload: params,
    }).then(data => {
      setExtSearchFieldList(data || []);
    });
    dispatch({
      type: 'pubserviceuser/fetchCertAvailableAuditState',
      payload: params,
    }).then(data => {
      setAvailableAuditStateList(data || []);
    });
  }, [careerId, industryId, professionalId]);

  const formLoading = extSearchFieldList == null || loading;

  const columns = useMemo(() => {
    const list = [
      {
        title: '个人信息',
        children: [
          {
            title: '用户编号',
            dataIndex: 'id',
            width: 100,
          },
          {
            title: '照片',
            dataIndex: 'userImg',
            render: value => {
              if (value?.url) {
                const obj = {
                  ...value,
                  url: formatImageUrl(value.url, 'img_100X140_prew'),
                };
                return (
                  <img
                    className={classNames('img-max', styles.faceImg)}
                    src={obj.url}
                    alt="face"
                    onClick={() => {
                      setPreviewFile(obj);
                    }}
                  />
                );
              }
            },
            width: 100,
          },
          // {
          //   title: '性别',
          //   dataIndex: 'sex',
          //   width: 100,
          // },
          {
            title: '姓名',
            dataIndex: 'realName',
            width: 100,
          },
          {
            title: '状态',
            dataIndex: 'extState',
            render: value => formatModel(CertExtStates, value),
            width: 100,
          },
          {
            title: '手机号',
            dataIndex: 'mobile',
            width: 100,
          },
          {
            title: '会员编号',
            dataIndex: 'pubAccountId',
            width: 100,
          },
        ],
      },
      {
        title: '认证信息',
        children: [
          {
            title: '行业信息',
            dataIndex: 'industryId',
            render: value => formatModel(Industries, value),
            width: 100,
          },
          {
            title: '专业项目',
            dataIndex: 'professionalId',
            render: value => formatModel(ProfessionTypes, value),
            width: 100,
          },
          {
            title: '证书',
            dataIndex: 'certList.certImg',
            render: value =>
              value == null ? null : (
                <span
                  className="link"
                  onClick={() => {
                    setPreviewFile(value);
                  }}
                >
                  查看证书
                </span>
              ),
            width: 150,
          },
          {
            dynamicHeaderPlaceType: '234',
            width: 130,
          },
        ],
      },
      {
        title: '其他信息',
        children: [
          {
            title: '排序',
            dataIndex: 'ranks',
            width: 100,
          },
          // {
          //   title: '审核时间',
          //   dataIndex: 'xxx',
          //   width: 170,
          // },
          {
            title: '更新人',
            dataIndex: 'updateRealName',
            width: 130,
          },
          {
            title: '更新时间',
            dataIndex: 'gmtModified',
            render: formatDateTime,
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
            width: 170,
          },
          {
            title: '单位名称',
            dataIndex: 'companyName',
            width: 130,
          },
        ],
      },
    ];
    return matchDynamicHeader(list, dynamicHeaderList || []);
  }, [dynamicHeaderList]);

  const formSearch = useMemo(
    () => ({
      loading: formLoading,
      fields: [
        {
          label: '行业类型',
          name: 'industryId',
          optionAll: false,
          options: modelMapToOption(Industries),
          onChange: setIndustryId,
          rules: [
            {
              required: true,
              message: '请选择行业类型',
            },
          ],
          type: ItemTypes.Select,
        },
        {
          label: '专业项目',
          name: 'professionalId',
          optionAll: false,
          options: modelMapToOption(ProfessionTypes),
          onChange: setProfessionalId,
          rules: [
            {
              required: true,
              message: '请选择专业项目',
            },
          ],
          type: ItemTypes.Select,
        },
        {
          label: '姓名',
          name: 'realName',
          defHidden: true,
        },
        {
          label: '手机号',
          name: 'mobile',
          defHidden: true,
        },
        {
          label: '编号',
          name: 'id',
        },
        ...(extSearchFieldList || []).map(
          ({ extShowName, extName, extDataType, extDataTypeValue, dataDefaultValue }) => {
            const field = {
              label: extShowName,
              // test
              // name: extName.startsWith('extMap.id-') ? `extMap.${extName.split('-')[1]}` : extName,
              name: extName,
              placeholder: '请填写',
              initialValue: isNumerical(dataDefaultValue) ? +dataDefaultValue : dataDefaultValue,
              defHidden: dataDefaultValue == null || dataDefaultValue === '',
            };
            switch (extDataType) {
              case ExtDataTypes.Text.key: // 1
              case ExtDataTypes.Number.key: // 2
              case ExtDataTypes.TextArea.key: // 7
              case ExtDataTypes.IDCard.key: // 11
                break;
              case ExtDataTypes.Select.key: // 3
                return {
                  ...field,
                  options: (extDataTypeValue || []).map(item => ({
                    key: isNumerical(item.value) ? +item.value : item.value,
                    text: item.name,
                  })),
                  type: ItemTypes.Select,
                };
              case ExtDataTypes.Date.key: // 8
                return {
                  ...field,
                  initialValue: dataDefaultValue == null ? null : moment(+dataDefaultValue),
                  type: ItemTypes.DatePicker,
                };
              case ExtDataTypes.HourAndMinute.key: // 9
                return {
                  ...field,
                  initialValue: dataDefaultValue == null ? null : moment(+dataDefaultValue),
                  // format: 'HH:mm',
                  // type: ItemTypes.DatePicker,
                  type: ItemTypes.TimePickerRangeStart2,
                };
              case ExtDataTypes.DateTime.key: // 10
                return {
                  ...field,
                  initialValue: dataDefaultValue == null ? null : moment(+dataDefaultValue),
                  showTime: true,
                  type: ItemTypes.DatePicker,
                };
              case ExtDataTypes.Ethnic.key: // 13
                return {
                  ...field,
                  options: ethnicList.map(item => ({
                    key: item.id,
                    text: item.text,
                  })),
                  type: ItemTypes.Select,
                };
              default:
            }
            return field;
          }
        ),
      ],
    }),
    [extSearchFieldList, formLoading]
  );

  const deleteAction = useCallback(() => {
    modal.confirm('您确认要删除所选人员吗？', {
      onOk: async () => {
        await dispatch({
          type: 'pubserviceuser/deleteCertUsers',
          payload: {
            ids: (selectedRows || []).map(item => item.id),
            careerId,
            industryId,
            professionalId,
          },
        });
        message.success('删除成功');
        table.reload();
      },
    });
  }, [table, selectedRows, careerId, industryId, professionalId]);

  const operation = useMemo(
    () => ({
      buttons: [
        {
          auth: 'add',
          text: '添加',
          action() {
            setShowContentMode(1);
          },
        },
        {
          auth: 'edit',
          text: '修改',
          forRow: 'single',
          action() {
            setShowContentMode(2);
          },
        },
        {
          auth: 'delete',
          type: 'danger',
          text: '删除',
          forRow: 'multi',
          action: deleteAction,
        },
        {
          text: '详细信息',
          forRow: 'single',
          action() {
            setShowContentMode(5);
          },
        },
        {
          auth: 'link',
          text: '关联会员',
          forRow: 'single',
          action() {
            setShowContentMode(3);
          },
        },
        {
          auth: 'logs',
          text: '审核记录',
          forRow: 'single',
          action() {
            pushView(
              <LevelView.SubView title="审核日志">
                <Logs dataId={selectedRows[0].id} />
              </LevelView.SubView>
            );
          },
        },
        {
          auth: 'export',
          btnType: ButtonTypes.Export,
        },
      ],
    }),
    [selectedRows, deleteAction, availableAuditStateList]
  );

  return (
    <Card bordered={false}>
      <Datatable
        select="multi"
        onSelectedChange={(_, rows) => {
          setSelectedRows(rows);
          setShowContentMode(rows == null || rows.length === 0 ? null : showContentMode);
        }}
        url={`/sysUserCert/dataList.do?careerId=${careerId}`}
        columns={columns}
        rowKey="id"
        formSearch={formSearch}
        operation={operation}
        onInit={setTableInit}
        onLoadData={(list, result) => {
          setDynamicHeaderList(result?.dynamicHeaderList);
        }}
        dataSourceRender={result => {
          const { pageData } = result || {};
          return pageData;
        }}
        content={(() => {
          switch (showContentMode) {
            case 1:
              return (
                <AddContent
                  cancel={cancelContent}
                  careerId={careerId}
                  sure={() => {
                    message.success('添加成功');
                    cancelContent();
                    table.reload();
                  }}
                />
              );
            case 2:
              return (
                <EditContent
                  cancel={cancelContent}
                  careerId={careerId}
                  sure={() => {
                    message.success('修改成功');
                    cancelContent();
                    table.reload();
                  }}
                />
              );
            case 3:
              return (
                <LintUser
                  cancel={cancelContent}
                  sure={() => {
                    message.success('关联成功');
                    cancelContent();
                    table.reload();
                  }}
                />
              );
            case 5:
              return (
                <DetailContent
                  cancel={cancelContent}
                  sure={() => {
                    message.success('修改成功');
                    cancelContent();
                    table.reload();
                  }}
                />
              );
            default:
              return null;
          }
        })()}
      />
      <ImageViewModal
        visible={!!previewFile}
        onVisibleChange={visible => {
          setPreviewFile(visible ? previewFile : null);
        }}
        file={previewFile}
      />
    </Card>
  );
}

UserCommon.contextTypes = {
  pushView: PropTypes.func,
  popView: PropTypes.func,
};

export default UserCommon;
