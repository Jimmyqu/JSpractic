import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Form, Select, Input, DatePicker, Upload, Button } from 'antd';
import moment from 'moment';
import Content from '@/components/Datatable/Content';
import { FileAccept, fileMapper, formFileMapper, formUploadOtherProps } from '@/utils/upload';
import { checkUpload } from '@/commons/lib/validator';
import { formItemLayoutNormal } from '@/utils/utils';
import { useUploadImgRequest } from '@/utils/hooks';

function EditContent({ form, sure, cancel, isEdit, selectedRows, ...restProps }) {
  const { getFieldValue, getFieldDecorator, validateFieldsAndScroll } = form;
  const [mediaNames, setMediaNames] = useState([]);
  const dispatch = useDispatch();
  const { PaperTypes, NewspaperEditStatus } = useSelector(state => state.digital);
  const imgFileUploading = useSelector(state => state.loading.effects['global/uploadImgFile']);
  const saving = useSelector(state => state.loading.effects['digital/postEditOrAddNewspaper']);

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

  const mediaTypeValue = getFieldValue('mediaType');

  const doSure = () => {
    validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      const { converImg, backgroundImg, newspaperDate } = formData;
      await dispatch({
        type: 'digital/postEditOrAddNewspaper',
        payload: {
          ...formData,
          publishState: NewspaperEditStatus.EDITING.key,
          converImg: Array.isArray(converImg)
            ? formFileMapper(converImg)[converImg.length - 1]
            : formFileMapper(converImg),
          backgroundImg: Array.isArray(backgroundImg)
            ? formFileMapper(backgroundImg)[backgroundImg.length - 1]
            : formFileMapper(backgroundImg),
          newspaperDate: newspaperDate ? newspaperDate.valueOf() : null,
          id: editObj.id,
        },
      });
      sure();
    });
  };

  const uploadImgCustomRequest = useUploadImgRequest({ dispatch });

  return (
    <Content
      title={isEdit ? '编辑' : '添加'}
      {...restProps}
      buttons={[
        {
          text: '取消',
          disabled: saving || imgFileUploading,
          action: cancel,
        },
        {
          text: '确定',
          type: 'primary',
          loading: saving || imgFileUploading,
          action: doSure,
        },
      ]}
    >
      <Row>
        <Col md={12}>
          <Form {...formItemLayoutNormal}>
            <Form.Item label="媒体类型">
              {getFieldDecorator('mediaType', {
                initialValue: editObj.mediaType,
                rules: [
                  {
                    required: true,
                    message: '请选择媒体类型',
                  },
                ],
              })(
                <Select placeholder="请选择">
                  {Object.values(PaperTypes).map(item => (
                    <Select.Option value={item.key} key={item.key}>
                      {item.value}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="媒体名称">
              {getFieldDecorator('mediaId', {
                initialValue: editObj.mediaId,
                rules: [
                  {
                    required: true,
                    message: '请选择媒体名称',
                  },
                ],
              })(
                <Select placeholder="请选择">
                  {mediaNames
                    .filter(item => item.mediaType === mediaTypeValue)
                    .map(item => (
                      <Select.Option value={item.mediaId} key={item.mediaId}>
                        {item.mediaName}
                      </Select.Option>
                    ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="名称">
              {getFieldDecorator('newspaperName', {
                initialValue: editObj.newspaperName,
                rules: [
                  {
                    required: true,
                    message: '请填写名称',
                  },
                ],
              })(<Input placeholder="请填写" />)}
            </Form.Item>
            <Form.Item label="发布日期">
              {getFieldDecorator('newspaperDate', {
                initialValue: moment(editObj.newspaperDate),
                rules: [
                  {
                    required: true,
                    message: '请选择日期',
                  },
                ],
              })(<DatePicker className="full-width" />)}
            </Form.Item>
            <Form.Item label="排序">
              {getFieldDecorator('ranks', {
                initialValue: editObj.ranks,
              })(<Input placeholder="请填写" />)}
            </Form.Item>
            <Form.Item label="封面图">
              {getFieldDecorator('converImg', {
                ...formUploadOtherProps,
                initialValue: editObj.converImg ? [editObj.converImg].map(fileMapper) : undefined,
                rules: [
                  {
                    required: false,
                    validator: checkUpload,
                  },
                ],
              })(
                <Upload
                  accept={FileAccept.IMG}
                  customRequest={uploadImgCustomRequest}
                  disabled={saving || imgFileUploading}
                >
                  <Button icon="upload" type="primary" disabled={saving || imgFileUploading}>
                    上传
                  </Button>
                </Upload>
              )}
            </Form.Item>
            <Form.Item label="背景图">
              {getFieldDecorator('backgroundImg', {
                ...formUploadOtherProps,
                initialValue: editObj.backgroundImg ? [editObj.backgroundImg].map(fileMapper) : undefined,
                rules: [
                  {
                    required: false,
                    validator: checkUpload,
                  },
                ],
              })(
                <Upload
                  accept={FileAccept.IMG}
                  customRequest={uploadImgCustomRequest}
                  disabled={saving || imgFileUploading}
                >
                  <Button icon="upload" type="primary" disabled={saving || imgFileUploading}>
                    上传
                  </Button>
                </Upload>
              )}
            </Form.Item>
            <Form.Item label="备注">
              {getFieldDecorator('descr', {
                initialValue: editObj.descr,
              })(<Input.TextArea rows={4} />)}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Content>
  );
}

export default Form.create()(EditContent);
