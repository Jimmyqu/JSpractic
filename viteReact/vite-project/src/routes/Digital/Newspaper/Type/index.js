import { useState, useMemo, useCallback } from 'react';
import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Card, message, Icon, Button, Row, Upload } from 'antd';
import Datatable from '@/components/Datatable';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import ImageViewModal from '@/components/Modal/ImageViewModal';
import Modal from '@/components/Modal';
import { formatDateHM, formatModel } from '@/utils/format';
import { CommonFileLinkTypes, FileAccept, formFileMapper, formUploadOtherProps } from '@/utils/upload';
import { useUploadImgRequest } from '@/utils/hooks';
import EditContent from './EditContent';

function MediaType({ form }) {
  const { getFieldValue, getFieldDecorator, validateFieldsAndScroll } = form;
  const [table, setTableInit] = useState();
  const [showContentMode, setShowContentMode] = useState();
  const [selectedRows, setSelectedRows] = useState();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState();
  const [imgType, setImgType] = useState();
  const { PaperTypes } = useSelector(state => state.digital);
  const imgFileUploading = useSelector(state => state.loading.effects['global/uploadImgFile']);
  const fileSaving = useSelector(state => state.loading.effects['global/addFile']);
  const dispatch = useDispatch();
  const uploadImgCustomRequest = useUploadImgRequest({ dispatch });

  const logoType = CommonFileLinkTypes.DIGITAL_NEWSPAPER_LOGO.key;
  const qrcodeType = CommonFileLinkTypes.DIGITAL_NEWSPAPER_QR_CODE.key;
  const imgKey = getFieldValue('fileKey') || [];

  const cancelContent = useCallback(() => {
    setShowContentMode(null);
  }, []);

  const handleEditOrNewFormSubmit = useCallback(() => {
    cancelContent();
    table.reload();
  }, [table]);

  const onSelectedChange = useCallback((_, rows) => {
    setSelectedRows(rows);
    setShowContentMode(rows == null || rows.length === 0 ? null : showContentMode);
  }, []);

  const columns = useMemo(
    () => [
      {
        title: '编号',
        dataIndex: 'id',
        width: 60,
      },
      {
        title: '数字媒体名称',
        dataIndex: 'mediaName',
        width: 100,
      },
      {
        title: '数字媒体类型',
        dataIndex: 'mediaType',
        render: value => formatModel(PaperTypes, value),
        width: 100,
      },
      {
        title: '备注',
        dataIndex: 'descr',
        width: 150,
      },
      {
        title: '排序',
        dataIndex: 'ranks',
        width: 60,
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
      {
        title: '单位名称',
        dataIndex: 'companyName',
        width: 130,
      },
      {
        title: 'logo',
        dataIndex: 'logoFileItem.url',
        render: (value, { logoFileItem }) =>
          value ? (
            <img
              src={value}
              alt="logo"
              style={{ width: '50px' }}
              onClick={() => {
                const { previewImage } = logoFileItem;
                if (previewImage) {
                  setPreviewFile(logoFileItem);
                  setPreviewVisible(true);
                }
              }}
            />
          ) : null,
        width: 160,
      },
      {
        title: '二维码',
        dataIndex: 'qrCodeFileItem.url',
        render: (value, { qrCodeFileItem }) =>
          value ? (
            <img
              src={value}
              alt="qrcode"
              style={{ width: '50px' }}
              onClick={() => {
                const { previewImage } = qrCodeFileItem;
                if (previewImage) {
                  setPreviewFile(qrCodeFileItem);
                  setPreviewVisible(true);
                }
              }}
            />
          ) : null,
        width: 160,
      },
    ],
    []
  );

  const operation = useMemo(
    () => ({
      buttons: [
        {
          auth: 'add',
          text: '添加',
          icon: 'plus',
          action() {
            setShowContentMode(1);
          },
        },
        {
          auth: 'edit',
          text: '修改',
          type: 'primary',
          icon: 'edit',
          forRow: 'single',
          action() {
            setShowContentMode(2);
          },
        },
        {
          auth: 'remove',
          text: '删除',
          icon: 'delete',
          forRow: 'multi',
          async action() {
            await dispatch({
              type: 'digital/deletePaper',
              payload: {
                ids: (selectedRows || []).map(item => item.id),
              },
            });
            message.success('删除成功');
            table.reload();
          },
        },
        {
          text: '报纸配置',
          forRow: 'single',
          action() {
            dispatch(
              push({
                pathname: './info/music',
                search: `mediaName=${selectedRows[0].mediaName}&flag=${Date.now()}`,
              })
            );
          },
        },
        {
          text: 'logo',
          forRow: 'single',
          action() {
            setImgType(logoType);
          },
        },
        {
          text: '二维码',
          forRow: 'single',
          action() {
            setImgType(qrcodeType);
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
            type: 'global/addFile',
            payload: {
              linkId: selectedRows[0].id,
              linkType: imgType,
              fileKey: key,
            },
          });
        })
      );
      setImgType(null);
      table.reload();
    });
    return false;
  };

  const cancel = () => {
    setImgType(null);
  };

  const handleImageEdit = () => {
    table.reload();
  };

  return (
    <PageHeaderLayout>
      <Card bordered={false}>
        <Datatable
          select="multi"
          url="/digitalMediaList/dataList.do"
          pagination={false}
          columns={columns}
          rowKey="id"
          operation={operation}
          onInit={setTableInit}
          onSelectedChange={onSelectedChange}
          content={(() => {
            switch (showContentMode) {
              case 1:
              case 2:
                return (
                  <EditContent isEdit={showContentMode === 2} cancel={cancelContent} sure={handleEditOrNewFormSubmit} />
                );
              default:
                return null;
            }
          })()}
        />
      </Card>
      <Modal
        title="添加"
        visible={!!imgType}
        onVisibleChange={visible => {
          if (!visible) {
            setImgType(null);
          }
        }}
        footer={[
          <Button key="ok" link="ok" loading={fileSaving} disabled={imgFileUploading}>
            确定
          </Button>,
          <Button key="cancel" link="cancel" disabled={imgFileUploading || fileSaving}>
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
                  accept={FileAccept.IMG}
                  listType="picture-card"
                  customRequest={uploadImgCustomRequest}
                  disabled={imgFileUploading}
                >
                  {imgKey.length === 0 && <Icon type="plus" />}
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
    </PageHeaderLayout>
  );
}

export default Form.create()(MediaType);
