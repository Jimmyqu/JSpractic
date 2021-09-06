import { useMemo, useEffect, useState, useCallback } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Card, message, Form, Input } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import Datatable, { ButtonTypes, ItemTypes, matchDynamicHeader } from '@/components/Datatable';
import ImageViewModal from '@/components/Modal/ImageViewModal';
import LevelView from '@/components/LevelView';
import { modelMapToOption, isNumerical, formItemLayoutNormal, getPageQuery } from '@/utils/utils';
import { formatModel, formatDateTime, formatImageUrl, formatDate } from '@/utils/format';
import Modal from '@/components/Modal';
import { modal } from '@/utils/feedback';
import ethnicList from '@/commons/lib/data/ethnic';
import LintUser from './LintUser';
import AuditContent from './AuditContent';
import DetailContent from './DetailContent';
import Logs from './Logs';
import styles from './list.less';

function UserCommon({ careerId, form }, { pushView }) {
  const dispatch = useDispatch();
  const { industryId: insId, professionalId: prosId } = getPageQuery();
  const { Industries, ProfessionTypes } = useSelector(state => state.venue);
  const { CertExtStates } = useSelector(state => state.pubserviceuser);
  const { ExtDataTypes } = useSelector(state => state.extfield);
  const [previewFile, setPreviewFile] = useState();
  const [certModalVisible, setCertModalVisible] = useState(false);
  const [editNumberModalVisible, setEditNumberModalVisible] = useState(false);
  const loading = useSelector(
    state =>
      state.loading.effects['pubserviceuser/fetchCertUserExtConfigSearch'] ||
      state.loading.effects['pubserviceuser/fetchCertAvailableAuditState']
  );

  const [industryId, setIndustryId] = useState(insId);
  const [professionalId, setProfessionalId] = useState(prosId);

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
      type: 'pubserviceuser/fetchCertUserExtConfigSearch',
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
            title: '编号',
            dataIndex: 'id',
            width: 100,
          },
          {
            title: '认证编号',
            dataIndex: 'certNo',
            width: 150,
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
          {
            title: '姓名',
            dataIndex: 'pubRealName',
            width: 100,
          },
          {
            title: '状态',
            dataIndex: 'certDataState',
            render: value => {
              return (
                <span
                  className={classNames({
                    [styles.pay]: value === CertExtStates.PayWait.key,
                    [styles.cancel]: value === CertExtStates.Cancel.key || value === CertExtStates.Disable.key,
                    [styles.inEdit]: value === CertExtStates.InEdit.key || value === CertExtStates.InAudit.key,
                    [styles.complete]: value === CertExtStates.Complete.key,
                  })}
                >
                  {formatModel(CertExtStates, value)}
                </span>
              );
            },
            width: 100,
          },
          {
            title: '手机号',
            dataIndex: 'pubMobile',
            width: 130,
          },
          {
            title: '会员编号',
            dataIndex: 'pubAccountId',
            width: 100,
          },
          {
            title: '认证配置编号',
            dataIndex: 'certConfigId',
            width: 120,
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
            title: '注册有效期',
            dataIndex: 'certValidStartDate',
            render: (value, { certValidEndDate }) => {
              if (value) {
                return `${formatDate(value)} 至 ${formatDate(certValidEndDate)}`;
              }
              return null;
            },
            width: 220,
          },
          {
            dynamicHeaderPlaceType: '234',
            width: 180,
          },
        ],
      },
      {
        title: '其他信息',
        children: [
          {
            title: '排序',
            dataIndex: 'weight',
            width: 100,
          },
          {
            title: '更新时间',
            dataIndex: 'updateTime',
            render: formatDateTime,
            width: 170,
          },
          {
            title: '创建人',
            dataIndex: 'operatorName',
            width: 130,
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            render: formatDateTime,
            width: 170,
          },
          {
            title: '单位名称',
            dataIndex: 'companyName',
            width: 230,
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
          initialValue: (() => {
            if (insId) {
              return +insId;
            }
          })(),
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
          initialValue: (() => {
            if (prosId) {
              return +prosId;
            }
          })(),
          onChange: setProfessionalId,
          rules: [
            {
              required: true,
              message: '请选择专业项目',
            },
          ],
          type: ItemTypes.Select,
        },
        // {
        //   label: '姓名',
        //   name: 'realName',
        //   defHidden: true,
        // },
        {
          label: '状态',
          name: 'certDataState',
          optionAll: false,
          options: modelMapToOption(CertExtStates),
          type: ItemTypes.Select,
          defHidden: true,
        },
        // {
        //   label: '手机号',
        //   name: 'mobile',
        //   defHidden: true,
        // },
        {
          label: '认证编号',
          name: 'certNo',
        },
        {
          label: '编号',
          name: 'id',
          defHidden: true,
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

  const cancelCert = useCallback(async () => {
    await dispatch({
      type: 'pubserviceuser/cancelCert',
      payload: {
        descr: form.getFieldValue('descr'),
        ids: (selectedRows || []).map(item => item.id),
      },
    });
    message.success('操作成功');
    table.reload();
  }, [table, selectedRows]);

  const editNumberCert = useCallback(async () => {
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'pubserviceuser/updateCertNo',
        payload: {
          ...formData,
          id: selectedRows[0].id,
        },
      }).then(() => {
        message.success('修改成功');
        table.reload();
      });
    });
  }, [table, selectedRows]);

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
          auth: 'cancel',
          type: 'danger',
          text: '取消认证',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const { certDataState } = rows[0];
            return !(certDataState === CertExtStates.Disable.key);
          },
          action() {
            setCertModalVisible(true);
          },
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
          auth: 'audit',
          type: 'primary',
          text: '审核',
          forRow: rows => {
            if (rows.length !== 1 || availableAuditStateList == null || availableAuditStateList.length === 0) {
              return false;
            }
            const { audit, certDataState } = rows[0];
            // 列表不方便过滤，使用 audit 字段控制基本的数据可审核，certDataState 控制实际可审核
            return audit && certDataState === CertExtStates.InAudit.key;
          },
          action() {
            setShowContentMode(4);
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
          text: '修改认证编号',
          forRow: 'single',
          action() {
            setEditNumberModalVisible(true);
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
        url={`/certDataList/dataList.do?careerId=${careerId}`}
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
            case 4:
              return (
                <AuditContent
                  cancel={cancelContent}
                  stateList={availableAuditStateList}
                  sure={() => {
                    message.success('审核成功');
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

      <Modal title="取消认证" visible={certModalVisible} onVisibleChange={setCertModalVisible} onOk={cancelCert}>
        <Form {...formItemLayoutNormal}>
          <Form.Item label="备注">
            {form.getFieldDecorator('descr')(<Input.TextArea placeholder="请输入备注" rows={4} maxLength="200" />)}
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="修改认证编号"
        visible={editNumberModalVisible}
        onVisibleChange={setEditNumberModalVisible}
        onOk={editNumberCert}
      >
        <Form {...formItemLayoutNormal}>
          <Form.Item label="当前认证编号">
            {form.getFieldDecorator('descr', {
              initialValue: (selectedRows[0] || {}).certNo,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="修改为">
            {form.getFieldDecorator('certNo', {
              rules: [
                {
                  required: true,
                  message: '请填写修改编号',
                },
              ],
            })(<Input placeholder="请填写" />)}
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}

UserCommon.contextTypes = {
  pushView: PropTypes.func,
  popView: PropTypes.func,
};

export default Form.create()(UserCommon);
