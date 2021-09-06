import { useEffect, useState, useRef } from 'react';
import { Form, Input, InputNumber, Select, Modal, Upload, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { FileAccept, formUploadOtherProps } from '@/utils/upload';
import { formItemLayoutFull } from '@/utils/utils';
import { useUploadDocRequest } from '@/utils/hooks';

const templateState = [
  { key: 0, value: '可用' },
  { key: 1, value: '禁用' },
];

const exportModelType = [
  { key: 1, value: '独立文件' },
  // { key: 2, value: '合并单表' },
  { key: 3, value: '合并多表' },
];

function TeplateModal({
  form,
  isEdit,
  setIsEdit,
  reltype,
  setIsModalShow,
  certTemplateType,
  selectedRow,
  onDone,
  visible,
  ...resPorps
}) {
  const dispatch = useDispatch();
  const { CertTypes, CertTemplateType } = useSelector(state => state.pubserviceuser);
  const [searchResList, setSearchResList] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [keyData, setKeyData] = useState([]);
  const dataList = useRef([]);
  const customDocRequest = useUploadDocRequest({ dispatch });
  const exportType = form.getFieldValue('exportType') || selectedRow?.exportType;
  const relType = form.getFieldValue('relType') || selectedRow?.relType;

  useEffect(() => {
    if (!relType) {
      return;
    }
    dispatch({
      type: 'pubserviceuser/fetchCertDataListByRelType',
      payload: {
        relType,
      },
    }).then(res => {
      dataList.current = res;
      setSearchResList(res);
      form.setFieldsValue({
        dataId: selectedRow?.dataId || 0,
      });
    });
    dispatch({
      type: 'pubserviceuser/fetchKeyListByRelTypeAndExcel',
      payload: {
        relType,
      },
    }).then(res => {
      setKeyData(res);
    });
  }, [relType]);

  return (
    <Modal
      visible={visible}
      title={`${isEdit ? '编辑' : '添加'}模版`}
      {...resPorps}
      confirmLoading={confirmLoading}
      onCancel={() => {
        setIsModalShow(false);
        setIsEdit(false);
        form.resetFields();
      }}
      onOk={() => {
        setConfirmLoading(true);
        form.validateFieldsAndScroll(async (err, formData) => {
          if (err) {
            setConfirmLoading(false);
            return;
          }
          const data =
            formData.exportType === certTemplateType.Img.key
              ? formData
              : {
                  ...formData,
                  file: formData.file.map(f => ({
                    fileKey: f.response?.fileKey || f.fileKey,
                  })),
                };
          if (isEdit) {
            try {
              dispatch({
                type: 'pubserviceuser/editCertTemplate',
                payload: {
                  ...data,
                  id: selectedRow?.id,
                },
              });
            } catch (error) {
              // eslint-disable-next-line no-console
              console.warn(error);
            } finally {
              form.resetFields();
              setIsModalShow(false);
              setConfirmLoading(false);
              onDone();
            }
            return;
          }
          try {
            dispatch({
              type: 'pubserviceuser/addTemplateInfo',
              payload: data,
            });
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn(error);
          } finally {
            form.resetFields();
            setIsModalShow(false);
            setConfirmLoading(false);
            onDone();
          }
        });
        return false;
      }}
    >
      <Form {...formItemLayoutFull}>
        <Form.Item label="模板名称">
          {form.getFieldDecorator('templateName', {
            initialValue: selectedRow?.templateName,
            rules: [
              {
                required: true,
                message: '请填写模板名称',
              },
            ],
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="生成类型">
          {form.getFieldDecorator('exportType', {
            initialValue: selectedRow?.exportType,
            rules: [
              {
                required: true,
                message: '请选择生成类型',
              },
            ],
          })(
            <Select placeholder="请选择" disabled={isEdit}>
              {Object.values(certTemplateType).map(item => (
                <Select.Option key={item.key} value={item.key}>
                  {item.value}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="认证类型">
          {form.getFieldDecorator('relType', {
            initialValue: selectedRow?.relType,
            rules: [
              {
                required: true,
                message: '请选择认证类型',
              },
            ],
          })(
            <Select placeholder="请选择" disabled={isEdit}>
              {Object.values(CertTypes).map(item => (
                <Select.Option key={item.key} value={item.key}>
                  {item.value}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        {(Number.isInteger(relType) || selectedRow?.relType) && (
          <>
            <Form.Item label="关联数据">
              {form.getFieldDecorator('dataId', {
                initialValue: selectedRow?.dataId || 0,
                rules: [
                  {
                    required: true,
                    message: '请选择关联数据',
                  },
                ],
              })(
                <Select showSearch placeholder="请选择" optionFilterProp="children">
                  {searchResList.map(item => (
                    <Select.Option key={item.dataId} value={item.dataId}>
                      {item.dataId}-{item.dataName}
                    </Select.Option>
                  ))}
                  <Select.Option key={0} value={0}>
                    无
                  </Select.Option>
                </Select>
              )}
            </Form.Item>
          </>
        )}
        {exportType === CertTemplateType.Table.key && (
          <>
            <Form.Item label="上传模板">
              {form.getFieldDecorator('file', {
                initialValue: selectedRow?.file,
                ...formUploadOtherProps,
                rules: [
                  {
                    required: true,
                    message: '请上传模板',
                  },
                ],
              })(
                <Upload accept={FileAccept.DOC} customRequest={customDocRequest}>
                  <Button icon="upload" type="primary">
                    上传
                  </Button>
                  &nbsp; 上传附件格式为：xls,xlsx
                </Upload>
              )}
            </Form.Item>
            <Form.Item label="替换字符">
              {form.getFieldDecorator('keys', {
                initialValue: selectedRow?.keys || '0',
                rules: [
                  {
                    required: true,
                    message: '请选择替换字符',
                  },
                ],
              })(
                <Select placeholder="请选择" mode="multiple">
                  {keyData.map(item => (
                    <Select.Option key={item.key} value={item.key}>
                      {item.name}
                    </Select.Option>
                  ))}
                  <Select.Option key="0" value="0">
                    无
                  </Select.Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item label="导出方式">
              {form.getFieldDecorator('exportModel', {
                initialValue: +selectedRow?.exportModel || 1,
              })(
                <Select placeholder="请选择">
                  {exportModelType.map(item => (
                    <Select.Option key={+item.key} value={+item.key}>
                      {item.value}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </>
        )}
        <Form.Item label="备注">
          {form.getFieldDecorator('remark', {
            initialValue: selectedRow?.remark,
          })(<Input />)}
        </Form.Item>
        <Form.Item label="排序">
          {form.getFieldDecorator('ranks', {
            initialValue: selectedRow?.ranks || 0,
          })(<InputNumber precision={0} placeholder="请填写" className="full-width" />)}
        </Form.Item>
        <Form.Item label="状态">
          {form.getFieldDecorator('templateState', {
            initialValue: +selectedRow?.templateState || 0,
          })(
            <Select placeholder="请选择">
              {templateState.map(item => (
                <Select.Option key={+item.key} value={+item.key}>
                  {item.value}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
}
export default Form.create()(TeplateModal);
