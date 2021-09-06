import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Form, Select, Input, Upload, Button } from 'antd';
import Content from '@/components/Datatable/Content';
import { FileAccept, formFileMapper, formUploadOtherProps } from '@/utils/upload';
import { formItemLayoutNormal } from '@/utils/utils';
import { useUploadAudioRequest } from '@/utils/hooks';

function EditContent({ form, sure, cancel, isEdit, selectedRows, templateType, parentTemplateNames, ...restProps }) {
  const { getFieldDecorator, validateFieldsAndScroll } = form;
  const dispatch = useDispatch();
  const audioUploading = useSelector(state => state.loading.effects['global/uploadAudioFile']);
  const saving = useSelector(state => state.loading.effects['digital/editOrAddPaperConfig']);
  const [mediaNames, setMediaNames] = useState([]);

  const editObj = isEdit ? (selectedRows || [])[0] || {} : {};

  useEffect(() => {
    dispatch({
      type: 'digital/fetchDigitalMediaList',
    }).then(data => {
      if (data == null) {
        return;
      }
      setMediaNames(data);
    });
  }, []);

  const doSure = () => {
    validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      const { file, ...formValues } = formData;
      await dispatch({
        type: 'digital/editOrAddPaperConfig',
        payload: {
          ...formValues,
          templateType,
          id: editObj.id,
          fileKey: file == null ? null : formFileMapper(file[0]),
        },
      });
      sure();
    });
  };

  const uploadAudioRequest = useUploadAudioRequest({ dispatch });

  return (
    <Content
      title={isEdit ? '编辑' : '添加'}
      {...restProps}
      buttons={[
        {
          text: '取消',
          disabled: audioUploading || saving,
          action: cancel,
        },
        {
          text: '确定',
          type: 'primary',
          loading: audioUploading || saving,
          action: doSure,
        },
      ]}
    >
      <Row>
        <Col md={12}>
          <Form {...formItemLayoutNormal}>
            <Form.Item label="媒体名称">
              {getFieldDecorator('mediaId', {
                initialValue: editObj.mediaId,
                rules: [
                  {
                    required: true,
                    message: '请选择媒体类型',
                  },
                ],
              })(
                <Select placeholder="请选择">
                  {mediaNames.map(item => (
                    <Select.Option value={item.mediaId} key={item.mediaId}>
                      {item.mediaName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="父级">
              {getFieldDecorator('parentId', {
                initialValue: !isEdit || (selectedRows.length > 0 && editObj.parentId === 0) ? 0 : editObj.parentId,
              })(
                <Select placeholder="请选择">
                  {parentTemplateNames.map(item => (
                    <Select.Option label={item.templateName} value={item.id} key={item.id}>
                      {item.templateName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="音乐名称">
              {getFieldDecorator('templateName', {
                initialValue: editObj.templateName,
                rules: [
                  {
                    required: true,
                    message: '请填写名称',
                  },
                ],
              })(<Input placeholder="请填写" />)}
            </Form.Item>
            <Form.Item label="备注">
              {getFieldDecorator('descr', {
                initialValue: editObj.descr,
              })(<Input.TextArea rows={4} />)}
            </Form.Item>
            <Form.Item label="排序">
              {getFieldDecorator('ranks', {
                initialValue: editObj.ranks,
              })(<Input placeholder="请填写" />)}
            </Form.Item>
            <Form.Item label="上传音乐">
              {form.getFieldDecorator('file', {
                ...formUploadOtherProps,
              })(
                <Upload
                  accept={FileAccept.AUDIO}
                  customRequest={uploadAudioRequest}
                  disabled={audioUploading || saving}
                >
                  <Button icon="upload" type="primary" disabled={audioUploading || saving}>
                    上传
                  </Button>
                </Upload>
              )}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Content>
  );
}

export default Form.create()(EditContent);
