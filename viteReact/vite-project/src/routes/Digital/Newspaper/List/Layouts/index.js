import { useState, useMemo, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Row, Col, Form, Button, Upload, Icon, message, Select } from 'antd';
import Datatable, { ItemTypes } from '@/components/Datatable';
import ImageViewModal from '@/components/Modal/ImageViewModal';
import Modal from '@/components/Modal';
import LevelView from '@/components/LevelView';
import { modelMapToOption } from '@/utils/utils';
import { formatDateHM, formatModel } from '@/utils/format';
import { FileAccept, formFileMapper, formUploadOtherProps } from '@/utils/upload';
import { useUploadPdfToPngRequest, useUploadImgRequest } from '@/utils/hooks';
import { modal } from '@/utils/feedback';
import EditContent from './EditContent';
import LayoutEditView from '../EditLayout';

function LayoutIndex({ form, newspaperId, currentMediaId }, { pushView, popView }) {
  const { getFieldDecorator, validateFieldsAndScroll } = form;
  const { LayoutEditStatus } = useSelector(state => state.digital);
  const [showContentMode, setShowContentMode] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const layoutState = useRef();
  const templateVersion = useRef();
  const templateEditionId = useRef();
  const [previewFile, setPreviewFile] = useState();
  const [table, setTableInit] = useState();
  const imgFileUploading = useSelector(state => state.loading.effects['global/uploadImgFile']);
  const pdfFileUploading = useSelector(state => state.loading.effects['global/uploadPdfToPng']);
  const saving = useSelector(state => state.loading.effects['digital/postEditOrAddNewspaperLayout']);
  const dispatch = useDispatch();

  const doneEdit = async () => {
    await dispatch({
      type: 'digital/postEditOrAddNewspaperLayout',
      payload: {
        id: selectedRows[0].id,
        layoutState: LayoutEditStatus.CANUSED.key,
      },
    });
    popView();
  };

  const formSearch = useMemo(
    () => ({
      fields: [
        {
          label: '源文件',
          name: 'fileKey',
        },
        {
          label: '备注',
          name: 'descr',
        },
        {
          label: '编辑状态',
          name: 'layoutState',
          options: modelMapToOption(LayoutEditStatus),
          type: ItemTypes.Select,
        },
        {
          label: '版名',
          name: 'templateVersionName',
          defHidden: true,
        },
        {
          label: '版次',
          name: 'templateEditionName',
          defHidden: true,
        },
        {
          label: '页号',
          name: 'pageNo',
          defHidden: true,
        },
        {
          label: '更新人',
          name: 'updateRealName',
          defHidden: true,
        },
      ],
    }),
    []
  );

  const columns = useMemo(
    () => [
      {
        title: '版面源文件',
        dataIndex: 'sourceImg.url',
        render: (value, { sourceImg }) =>
          value ? (
            <img
              src={value}
              alt="版面源文件"
              style={{ width: '50px' }}
              onClick={() => {
                const { previewImage } = sourceImg;
                if (previewImage) {
                  setPreviewFile(sourceImg);
                  setPreviewVisible(true);
                }
              }}
            />
          ) : null,
        width: 160,
      },
      {
        title: '版面PDF',
        dataIndex: 'sourcePdf',
        render: val => {
          if (val?.url) {
            return (
              <a href={val.url} rel="noopener noreferrer" target="_blank">
                {val.fileName || 'PDF'}
              </a>
            );
          }
        },
        width: 160,
      },
      {
        title: '背景音乐',
        dataIndex: 'templateMusicName',
        width: 160,
      },
      {
        title: '备注',
        dataIndex: 'descr',
        width: 150,
      },
      {
        title: '编辑状态',
        dataIndex: 'layoutState',
        render: value => formatModel(LayoutEditStatus, value),
        width: 80,
      },
      {
        title: '版次',
        dataIndex: 'templateEditionName',
        width: 60,
      },
      {
        title: '页号',
        dataIndex: 'pageNo',
        width: 60,
      },
      {
        title: '版名',
        dataIndex: 'templateVersionName',
        width: 120,
      },
      {
        title: '显示排序',
        dataIndex: 'ranks',
        width: 80,
      },
      {
        title: '更新人',
        dataIndex: 'updateRealName',
        width: 90,
      },
      {
        title: '更新时间',
        dataIndex: 'gmtModified',
        render: formatDateHM,
        width: 130,
      },
      {
        title: '创建时间',
        dataIndex: 'gmtCreate',
        render: formatDateHM,
        width: 130,
      },
    ],
    []
  );

  const operation = useMemo(
    () => ({
      buttons: [
        {
          auth: 'add',
          text: '批量添加',
          icon: 'plus',
          action() {
            setModalVisible(true);
          },
        },
        {
          auth: 'remove',
          text: '删除',
          icon: 'delete',
          forRow: 'multi',
          action() {
            modal.confirm('您确认需要删除此版面吗？删除后版面内正文将全部被删除！', {
              onOk: async () => {
                await dispatch({
                  type: 'digital/deleteNewspaperLayout',
                  payload: {
                    ids: selectedRows.map(({ id: rowId }) => rowId),
                  },
                });
                message.success('删除成功');
                table.reload();
              },
            });
          },
        },
        {
          auth: 'edit-state',
          text: '编辑状态',
          forRow: 'multi',
          action() {
            modal.confirm(
              <Row>
                <Col span={12}>
                  <Select
                    defaultValue={selectedRows[0].layoutState}
                    style={{ width: 120 }}
                    onChange={val => {
                      layoutState.current = val;
                    }}
                  >
                    <Select.Option key={0} value={0}>
                      编辑中
                    </Select.Option>
                    <Select.Option key={1} value={1}>
                      可用
                    </Select.Option>
                  </Select>
                </Col>
              </Row>,
              {
                onOk: async () => {
                  await dispatch({
                    type: 'digital/editTemplate',
                    payload: {
                      ids: selectedRows.map(({ id: rowId }) => rowId),
                      layoutState: layoutState.current,
                    },
                  });
                  message.success('编辑成功');
                  table.reload();
                },
              }
            );
          },
        },
        {
          // 实际该页面没有url改变 直接在上级页面配置的boss按钮权限
          auth: 'edit-templat-name',
          text: '编辑版次',
          forRow: 'multi',
          async action() {
            const res = await dispatch({
              // 获取对应媒体的版次
              type: 'digital/queryMediaTemplateData',
              payload: {
                currentMediaId,
                templateType: 21, // 版次
              },
            });
            const info = res.map(item => ({ label: item.templateName, id: item.id }));
            modal.confirm(
              <Row>
                <Col span={12}>
                  <Select
                    defaultValue={selectedRows[0].templateEditionName}
                    style={{ width: 120 }}
                    onChange={val => {
                      templateEditionId.current = val;
                    }}
                  >
                    {info.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.label}
                      </Select.Option>
                    ))}
                    <Select.Option key={0} value={0}>
                      无(仅电子书)
                    </Select.Option>
                  </Select>
                </Col>
              </Row>,
              {
                onOk: async () => {
                  await dispatch({
                    type: 'digital/editTemplate',
                    payload: {
                      ids: selectedRows.map(({ id: rowId }) => rowId),
                      templateEditionId: templateEditionId.current,
                    },
                  });
                  message.success('编辑成功');
                  table.reload();
                },
              }
            );
          },
        },
        {
          // 实际该页面没有url改变 直接在上级页面配置的boss按钮权限
          auth: 'edit-templat-version',
          text: '编辑版名',
          forRow: 'multi',
          async action() {
            const res = await dispatch({
              // 获取对应媒体的版名
              type: 'digital/queryMediaTemplateData',
              payload: {
                ids: selectedRows.map(({ id: rowId }) => rowId),
                templateType: 22, // 版名
              },
            });
            const info = res.map(item => ({ label: item.templateName, id: item.id }));
            modal.confirm(
              <Row>
                <Col span={12}>
                  <Select
                    defaultValue={selectedRows[0].templateVersion}
                    style={{ width: 120 }}
                    onChange={val => {
                      templateVersion.current = val;
                    }}
                  >
                    {info.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.label}
                      </Select.Option>
                    ))}
                    <Select.Option key={0} value={0}>
                      无(仅电子书)
                    </Select.Option>
                  </Select>
                </Col>
              </Row>,
              {
                onOk: async () => {
                  await dispatch({
                    type: 'digital/editTemplate',
                    payload: {
                      ids: selectedRows.map(({ id: rowId }) => rowId),
                      templateVersionId: templateVersion.current,
                    },
                  });
                  message.success('编辑成功');
                  table.reload();
                },
              }
            );
          },
        },
        {
          auth: 'edit-layout',
          text: '编辑图文',
          type: 'primary',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            return rows[0].layoutState === LayoutEditStatus.EDITING.key;
          },
          action() {
            const { mediaId, id: layoutId } = selectedRows[0];
            pushView(
              <LevelView.SubView title="图文编辑">
                <LayoutEditView mediaId={mediaId} layoutId={layoutId} doneEdit={doneEdit} />
              </LevelView.SubView>,
              () => {
                table.reload();
              }
            );
          },
        },
        {
          auth: 'edit',
          text: '编辑',
          icon: 'edit',
          forRow: 'single',
          action() {
            setShowContentMode(1);
          },
        },
      ],
    }),
    [showContentMode, selectedRows]
  );

  const sure = () => {
    validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      const { fileKey } = formData;
      await Promise.all(
        formFileMapper(fileKey).map(key => {
          return dispatch({
            type: 'digital/postEditOrAddNewspaperLayout',
            payload: {
              newspaperId,
              fileKey: key,
            },
          });
        })
      );
      setModalVisible(false);
      table.reload();
    });
    return false;
  };

  const cancel = () => {
    setModalVisible(false);
  };

  const handleImageEdit = () => {
    table.reload();
  };

  const cancelContent = useCallback(() => {
    setShowContentMode(null);
  }, []);

  const handleEditFormSubmit = useCallback(() => {
    cancelContent();
    table.reload();
  }, [table]);

  const handleLoadData = list => {
    if (list == null || list.length === 0) {
      return;
    }
    dispatch({
      type: 'digital/fetchNewspaperLayoutIds',
      payload: list,
    });
  };

  const uploadImgCustomRequest = useUploadImgRequest({ dispatch });
  const uploadPdfToPngRequest = useUploadPdfToPngRequest({ dispatch });

  const genUploadCustomRequest = obj => {
    const { file } = obj;
    if (file == null) {
      return;
    }
    const isImg = file.type.includes('image/');
    if (isImg) {
      uploadImgCustomRequest(obj);
      return;
    }
    uploadPdfToPngRequest(obj);
  };

  return (
    <Card bordered={false}>
      <Datatable
        select="multi"
        url={`/digitalNewspaperLayout/dataList.do?newspaperId=${newspaperId}`}
        pagination={false}
        onSelectedChange={(_, rows) => {
          setSelectedRows(rows);
          setShowContentMode(rows == null || rows.length === 0 ? null : showContentMode);
        }}
        columns={columns}
        rowKey="id"
        formSearch={formSearch}
        operation={operation}
        onInit={setTableInit}
        onLoadData={handleLoadData}
        content={(() => {
          switch (showContentMode) {
            case 1:
              return <EditContent cancel={cancelContent} sure={handleEditFormSubmit} />;
            default:
              return null;
          }
        })()}
      />
      <Modal
        title="批量添加"
        visible={modalVisible}
        footer={[
          <Button
            key="ok"
            link="ok"
            loading={imgFileUploading || pdfFileUploading || saving}
            disabled={imgFileUploading || pdfFileUploading || saving}
          >
            确定
          </Button>,
          <Button
            key="cancel"
            link="cancel"
            loading={imgFileUploading || pdfFileUploading || saving}
            disabled={imgFileUploading || pdfFileUploading || saving}
          >
            取消
          </Button>,
        ]}
        onOk={sure}
        onCancel={cancel}
      >
        <Row type="flex" justify="center">
          <Form>
            <Form.Item>
              {getFieldDecorator('fileKey', {
                ...formUploadOtherProps,
                rules: [
                  {
                    required: true,
                    message: '请上传文件',
                  },
                ],
              })(
                <Upload
                  multiple
                  accept={FileAccept.INVOICE}
                  listType="picture-card"
                  customRequest={genUploadCustomRequest}
                  disabled={imgFileUploading || pdfFileUploading}
                >
                  <Icon type="plus" />
                </Upload>
              )}
            </Form.Item>
          </Form>
        </Row>
      </Modal>
      {previewFile && (
        <ImageViewModal
          visible={previewVisible}
          onVisibleChange={setPreviewVisible}
          file={previewFile}
          canEdit
          onOk={handleImageEdit}
        />
      )}
    </Card>
  );
}

LayoutIndex.contextTypes = {
  pushView: PropTypes.func,
  popView: PropTypes.func,
};

export default Form.create()(LayoutIndex);
