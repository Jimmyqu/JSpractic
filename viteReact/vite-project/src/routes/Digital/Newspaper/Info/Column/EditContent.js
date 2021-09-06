import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Form, Select, Input } from 'antd';
import Content from '@/components/Datatable/Content';
import { formItemLayoutNormal } from '@/utils/utils';

function EditContent({ form, sure, cancel, isEdit, selectedRows, templateType, parentTemplateNames, ...restProps }) {
  const { getFieldDecorator, getFieldValue, validateFieldsAndScroll } = form;
  const dispatch = useDispatch();
  const [mediaNames, setMediaNames] = useState([]);
  const { PaperConfigurations } = useSelector(state => state.digital);
  const saving = useSelector(state => state.loading.effects['digital/editOrAddPaperConfig']);

  const templateTypeValue = getFieldValue('templateType');
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
      await dispatch({
        type: 'digital/editOrAddPaperConfig',
        payload: {
          ...formData,
          id: editObj.id,
        },
      });
      sure();
    });
  };

  return (
    <Content
      title={isEdit ? '编辑' : '添加'}
      {...restProps}
      buttons={[
        {
          text: '取消',
          disabled: saving,
          action: cancel,
        },
        {
          text: '确定',
          type: 'primary',
          loading: saving,
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
            <Form.Item label="类型">
              {getFieldDecorator('templateType', {
                initialValue: editObj.templateType,
                rules: [
                  {
                    required: true,
                    message: '请选择类型',
                  },
                ],
              })(
                <Select placeholder="请选择">
                  {Object.values(PaperConfigurations)
                    .filter(
                      item =>
                        item.key === PaperConfigurations.VERSION_NAME.key || item.key === PaperConfigurations.COLUMN.key
                    )
                    .map(item => (
                      <Select.Option value={item.key} key={item.key}>
                        {item.value}
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
                  {(templateTypeValue === PaperConfigurations.VERSION_NAME.key
                    ? parentTemplateNames.filter(item => item.id === 0)
                    : parentTemplateNames.filter(item => item.id !== 0)
                  ).map(item => (
                    <Select.Option label={item.templateName} value={item.id} key={item.id}>
                      {item.templateName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="名称">
              {getFieldDecorator('templateName', {
                initialValue: editObj.templateName,
                rules: [
                  {
                    required: true,
                    message: '请填写名称',
                  },
                ],
              })(<Input.TextArea rows={4} />)}
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
          </Form>
        </Col>
      </Row>
    </Content>
  );
}

export default Form.create()(EditContent);
