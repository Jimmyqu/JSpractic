import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Row, Button, Form, Upload, Icon, message } from 'antd';
import Datatable from '@/components/Datatable';
import Modal from '@/components/Modal';
import { formatBoolean } from '@/utils/format';
import { CommonFileLinkTypes, FileAccept, formFileMapper, formUploadOtherProps } from '@/utils/upload';
import { modal } from '@/utils/feedback';
import { useUploadImgRequest } from '@/utils/hooks';

function Pics({ form, linkId }) {
  const { getFieldDecorator, validateFieldsAndScroll } = form;
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [table, setTableInit] = useState();
  const saving = useSelector(state => state.loading.effects['global/addFile']);
  const imgFileUploading = useSelector(state => state.loading.effects['global/uploadImgFile']);
  const dispatch = useDispatch();
  const uploadImgCustomRequest = useUploadImgRequest({ dispatch });

  const type = CommonFileLinkTypes.DIGITAL_NEWSPAPER_IMG.key;

  const columns = useMemo(() => [
    {
      title: '名称',
      dataIndex: 'fileName',
      width: 150,
    },
    {
      title: '认证图片',
      dataIndex: 'url',
      render: value => <img src={value} alt="认证图片" style={{ width: '50px' }} />,
      width: 100,
    },
    {
      title: '是否封面',
      dataIndex: 'conver',
      render: value => formatBoolean(value),
      width: 100,
    },
    {
      title: '是否为预览图',
      dataIndex: 'previewImage',
      render: value => formatBoolean(value),
      width: 100,
    },
    {
      title: '文件排序',
      dataIndex: 'ranks',
      width: 100,
    },
    {
      title: '所属单位',
      dataIndex: 'companyName',
      width: 100,
    },
    {
      title: '上传者',
      dataIndex: 'updateRealName',
      width: 100,
    },
  ]);

  const operation = useMemo(() => ({
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
          modal.confirm('确认删除照片吗？', {
            onOk: () => {
              dispatch({
                type: 'global/deleteStreamFile',
                payload: {
                  ids: selectedRows.map(({ id: rowId }) => rowId),
                },
              }).then(() => {
                message.success('删除成功');
                table.reload();
              });
            },
          });
        },
      },
    ],
  }));

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
              linkId,
              linkType: type,
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

  return (
    <Card bordered={false}>
      <Datatable
        select="multi"
        pagination={false}
        onSelectedChange={(_, rows) => {
          setSelectedRows(rows);
        }}
        url={`/commonFile/queryByFile.do?linkType=${type}&linkId=${linkId}`}
        columns={columns}
        rowKey="id"
        operation={operation}
        onInit={setTableInit}
      />
      <Modal
        title="批量添加"
        visible={modalVisible}
        footer={[
          <Button key="ok" link="ok" loading={imgFileUploading || saving} disabled={imgFileUploading || saving}>
            确定
          </Button>,
          <Button key="cancel" link="cancel" loading={imgFileUploading || saving} disabled={imgFileUploading || saving}>
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
                  accept={FileAccept.IMG}
                  listType="picture-card"
                  customRequest={uploadImgCustomRequest}
                  loading={imgFileUploading}
                >
                  <Icon type="plus" />
                </Upload>
              )}
            </Form.Item>
          </Form>
        </Row>
      </Modal>
    </Card>
  );
}

export default Form.create()(Pics);
