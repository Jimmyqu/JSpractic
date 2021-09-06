import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Form, Select, Input } from 'antd';
import Content from '@/components/Datatable/Content';
import { formItemLayoutNormal } from '@/utils/utils';

function EditContent({ form, sure, cancel, isEdit, selectedRows, ...restProps }) {
  const { getFieldDecorator, validateFieldsAndScroll } = form;
  const dispatch = useDispatch();
  const { PaperTypes } = useSelector(state => state.digital);
  const saving = useSelector(state => state.loading.effects['digital/editOrAddPaper']);
  const editObj = isEdit ? (selectedRows || [])[0] || {} : {};

  const doSure = () => {
    validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      await dispatch({
        type: 'digital/editOrAddPaper',
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
            <Form.Item label="数字媒体类型">
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
            <Form.Item label="数字媒体名称">
              {getFieldDecorator('mediaName', {
                initialValue: editObj.mediaName,
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
          </Form>
        </Col>
      </Row>
    </Content>
  );
}

export default Form.create()(EditContent);
