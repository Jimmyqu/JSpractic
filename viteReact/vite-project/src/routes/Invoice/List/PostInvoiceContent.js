import { useState } from 'react';
import { Form, Row, Col, Select, Input, Upload, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import Content from '@/components/Datatable/Content';
import { FileAccept } from '@/commons/lib/upload';
import { formItemLayoutNormal } from '@/utils/utils';

function PostInvoiceContent({
  form,
  cancel,
  sure,
  isUpdate,
  invoiceId,
  //
  selectedRows,
  composeStateMapping,
  handleComposeStateChange,
  ...restProps
}) {
  const dispatch = useDispatch();
  const { InvoiceStatus } = useSelector(state => state.pubinvoice);
  const auditing = useSelector(state => state.loading.effects['pubinvoice/auditInvoice']);
  const auditUpdating = useSelector(state => state.loading.effects['pubinvoice/updateInvoice']);
  const [fileList, setFileList] = useState([]);

  const auditState = form.getFieldValue('auditState');
  return (
    <Content
      title="审核"
      {...restProps}
      buttons={[
        {
          text: '取消',
          disabled: auditing || auditUpdating,
          action: cancel,
        },
        {
          text: '确定',
          type: 'primary',
          loading: auditing || auditUpdating,
          action: () => {
            form.validateFieldsAndScroll(async (err, formData) => {
              if (err) {
                return;
              }
              const { file } = formData;
              const data = await new Promise(resolve => {
                if (file) {
                  const { name } = file.file;
                  const reader = new FileReader();
                  reader.addEventListener('load', e => {
                    const { result } = e.target || e.srcElement;
                    resolve({
                      file: result,
                      fileName: name,
                    });
                  });
                  reader.readAsDataURL(file.file);
                } else {
                  resolve({});
                }
              });

              await dispatch({
                type: isUpdate ? 'pubinvoice/updateInvoice' : 'pubinvoice/auditInvoice',
                payload: {
                  ...formData,
                  ...data,
                  invoiceListId: invoiceId,
                },
              });
              sure();
            });
          },
        },
      ]}
    >
      <Row>
        <Col md={12}>
          <Form {...formItemLayoutNormal}>
            <Form.Item label="发票编号">{invoiceId}</Form.Item>
            {!isUpdate && (
              <Form.Item label="审核状态">
                {form.getFieldDecorator('auditState', {
                  rules: [
                    {
                      required: true,
                      message: '请选择开具类型',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    <Select.Option key={InvoiceStatus.SUCCESS.key} value={InvoiceStatus.SUCCESS.key}>
                      通过
                    </Select.Option>
                    <Select.Option key={InvoiceStatus.INVOICE_FAIL.key} value={InvoiceStatus.INVOICE_FAIL.key}>
                      不通过
                    </Select.Option>
                  </Select>
                )}
              </Form.Item>
            )}
            {(isUpdate || auditState === InvoiceStatus.SUCCESS.key) && (
              <>
                <Form.Item label="发票文件">
                  {form.getFieldDecorator('file')(
                    <Upload
                      accept={FileAccept.INVOICE}
                      beforeUpload={() => false}
                      fileList={fileList}
                      onChange={({ file }) => {
                        setFileList([file]);
                      }}
                    >
                      <Button icon="upload">上传</Button>
                      &nbsp; 上传附件格式为：jpg, png, pdf
                    </Upload>
                  )}
                </Form.Item>
                <Form.Item label="发票号码">
                  {form.getFieldDecorator('invoiceNo')(
                    <Select mode="tags" placeholder="多个发票号码请使用; 分号隔开" />
                  )}
                </Form.Item>
              </>
            )}
            <Form.Item label="备注">
              {form.getFieldDecorator('descr')(<Input.TextArea placeholder="请填写备注" rows={6} maxLength={500} />)}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Content>
  );
}

export default Form.create()(PostInvoiceContent);
