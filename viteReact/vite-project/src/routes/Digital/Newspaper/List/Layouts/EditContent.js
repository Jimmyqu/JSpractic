import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Form, Input, Upload, Cascader, Button, Select } from 'antd';
import Content from '@/components/Datatable/Content';
import { FileAccept, fileMapper, formFileMapper, formUploadOtherProps } from '@/utils/upload';
import { formItemLayoutNormal } from '@/utils/utils';
import { useUploadImgRequest } from '@/utils/hooks';

function EditContent({ form, sure, cancel, selectedRows, ...restProps }) {
  const { getFieldDecorator, validateFieldsAndScroll } = form;
  const dispatch = useDispatch();
  const [musicTemplates, setMusicTemplates] = useState([]);
  const [editionList, setEditionList] = useState([]);
  const [versionNameList, setVersionNameList] = useState([]);
  const [musicTemplateValue, setMusicTemplateValue] = useState([]);
  const { PaperConfigurations, LayoutEditStatus } = useSelector(state => state.digital);
  const imgFileUploading = useSelector(state => state.loading.effects['global/uploadImgFile']);
  const fetching = useSelector(state => state.loading.effects['digital/fetchMediaTemplateData']);
  const saving = useSelector(state => state.loading.effects['digital/postEditOrAddNewspaperLayout']);

  const getMusicTemplate = (list, ids = []) => {
    return (list || []).map(({ id: value, templateName: label, children }) => {
      if (value === selectedRows[0].templateMusicId) {
        setMusicTemplateValue([...ids, value]);
      }
      return {
        value,
        label,
        ids: [...ids, value],
        children: Array.isArray(children) && children.length > 0 ? getMusicTemplate(children, [...ids, value]) : [],
      };
    });
  };

  useEffect(() => {
    dispatch({
      type: 'digital/fetchMediaTemplateData',
      payload: {
        templateType: PaperConfigurations.BG_MUSIC.key,
      },
    }).then(data => {
      setMusicTemplates(data ? getMusicTemplate(data) : []);
    });
    dispatch({
      type: 'digital/fetchMediaTemplateData',
      payload: {
        templateType: PaperConfigurations.EDITION.key,
      },
    }).then(setEditionList);
    dispatch({
      type: 'digital/fetchMediaTemplateData',
      payload: {
        templateType: PaperConfigurations.VERSION_NAME.key,
      },
    }).then(setVersionNameList);
  }, []);

  const doSure = () => {
    validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      const { fileKey, templateMusicId } = formData;
      await dispatch({
        type: 'digital/postEditOrAddNewspaperLayout',
        payload: {
          ...formData,
          fileKey: Array.isArray(fileKey) ? formFileMapper(fileKey)[0] : formFileMapper(fileKey),
          id: selectedRows[0].id,
          templateMusicId:
            templateMusicId == null ? selectedRows[0].templateMusicId : templateMusicId[templateMusicId.length - 1],
        },
      });
      sure();
    });
  };

  const uploadImgCustomRequest = useUploadImgRequest({ dispatch });

  return (
    <Content
      title="编辑版面配置"
      {...restProps}
      buttons={[
        {
          text: '取消',
          disabled: imgFileUploading || saving || fetching,
          action: cancel,
        },
        {
          text: '确定',
          type: 'primary',
          disabled: fetching,
          loading: imgFileUploading || saving,
          action: doSure,
        },
      ]}
    >
      <Row>
        <Col md={12}>
          <Form {...formItemLayoutNormal}>
            <Form.Item label="版次">
              {getFieldDecorator('templateEditionId', {
                initialValue: selectedRows[0]?.templateEditionId,
                rules: [
                  {
                    required: false,
                    message: '请选择版次',
                  },
                ],
              })(
                <Select placeholder="请选择" loading={fetching} disabled={fetching}>
                  {(editionList || []).map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.templateName}
                    </Select.Option>
                  ))}
                  <Select.Option key={0} value={0}>
                    无(仅电子书)
                  </Select.Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item label="版名">
              {getFieldDecorator('templateVersionId', {
                initialValue: selectedRows[0]?.templateVersionId,
                rules: [
                  {
                    required: true,
                    message: '请选择版名',
                  },
                ],
              })(
                <Select placeholder="请选择" loading={fetching} disabled={fetching}>
                  {(versionNameList || []).map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.templateName}
                    </Select.Option>
                  ))}
                  <Select.Option key={0} value={0}>
                    无(仅电子书)
                  </Select.Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item label="页号">
              {getFieldDecorator('pageNo', {
                initialValue: selectedRows[0]?.pageNo,
                rules: [
                  {
                    required: true,
                    message: '请填写页号',
                  },
                ],
              })(<Input placeholder="请填写页号" />)}
            </Form.Item>
            <Form.Item label="排序">
              {getFieldDecorator('ranks', {
                initialValue: selectedRows[0]?.ranks,
              })(<Input placeholder="请填写排序" />)}
            </Form.Item>
            <Form.Item label="源文件">
              {getFieldDecorator('fileKey', {
                ...formUploadOtherProps,
                initialValue: [selectedRows[0]?.sourceImg].filter(Boolean).map(fileMapper),
              })(
                <Upload
                  accept={FileAccept.IMG}
                  customRequest={uploadImgCustomRequest}
                  disabled={imgFileUploading || saving}
                >
                  <Button icon="upload" type="primary" disabled={imgFileUploading || saving}>
                    上传
                  </Button>
                </Upload>
              )}
            </Form.Item>
            <Form.Item label="背景音频">
              {getFieldDecorator('templateMusicId', {
                initialValue: musicTemplateValue,
              })(<Cascader options={musicTemplates} placeholder="请选择背景音频" allowClear={false} />)}
            </Form.Item>
            <Form.Item label="编辑状态">
              {getFieldDecorator('layoutState', {
                initialValue: selectedRows[0]?.layoutState,
              })(
                <Select placeholder="请选择">
                  {Object.values(LayoutEditStatus).map(item => (
                    <Select.Option value={item.key} key={item.key}>
                      {item.value}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="备注">
              {getFieldDecorator('descr', {
                initialValue: selectedRows[0]?.descr,
              })(<Input.TextArea rows={4} />)}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Content>
  );
}

export default Form.create()(EditContent);
