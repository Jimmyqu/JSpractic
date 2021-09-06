import { Button, Form, Input, Upload } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@/components/Modal';
import { FileAccept, formFileMapper, formUploadOtherProps } from '@/utils/upload';
import { useUploadDocRequest } from '@/utils/hooks';
import { formItemLayoutNormal } from '@/utils/utils';

function callbackFormValue(form, callback) {
  form.validateFieldsAndScroll((err, formData) => {
    if (err) {
      return;
    }
    const { files, ...values } = formData;
    if (typeof callback === 'function') {
      callback({
        ...values,
        fileKeys: files?.map(formFileMapper),
      });
    }
  });
}

function AuditConfirmModal({ isAudit, onReject, form, onSure, onOk, loading, ...restProps }) {
  const dispatch = useDispatch();
  const fileUploading = useSelector(state => state.loading.effects['global/uploadDocFile']);

  return (
    <Modal
      title="审核"
      {...restProps}
      footer={[
        <Button key="close" link="cancel" disabled={fileUploading || loading} />,
        isAudit && (
          <Button
            key="reject"
            type="danger"
            disabled={fileUploading}
            loading={loading}
            onClick={() => {
              callbackFormValue(form, onReject);
            }}
          >
            驳回
          </Button>
        ),
        <Button key="ok" link="ok" disabled={fileUploading} loading={loading}>
          {isAudit ? '通过' : '确定'}
        </Button>,
      ].filter(Boolean)}
      onOk={arg => {
        callbackFormValue(form, (...args) => {
          arg.deepCallOk(() => {
            return onSure(...args).then(() => {
              onOk(arg);
            });
          });
        });
        return false;
      }}
    >
      <Form {...formItemLayoutNormal}>
        <Form.Item label="操作说明">
          {form.getFieldDecorator('auditReasons')(<Input.TextArea placeholder="最多输入500字" maxLength="500" />)}
        </Form.Item>
        <Form.Item label="文件">
          {form.getFieldDecorator('files', {
            ...formUploadOtherProps,
          })(
            <Upload accept={FileAccept.DOC} multiple customRequest={useUploadDocRequest({ dispatch })}>
              <Button icon="upload" type="primary">
                上传
              </Button>
              &nbsp; 上传附件格式为：xls,xlsx,ppt,pptx,docx,doc,pdf
            </Upload>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default Form.create()(AuditConfirmModal);
