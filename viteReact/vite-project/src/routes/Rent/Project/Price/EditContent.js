import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Form, Input, InputNumber } from 'antd';
import Content from '@/components/Datatable/Content';
import { formItemLayoutNormal } from '@/utils/utils';

function EditContent({ form, sure, cancel, isEdit, selectedRows, ...restProps }) {
  const { getFieldDecorator, validateFieldsAndScroll } = form;
  const dispatch = useDispatch();
  const saving = useSelector(state => state.loading.effects['rent/editOrNewLeasePriceGroup']);
  const editObj = isEdit ? (selectedRows || [])[0] || {} : {};

  return (
    <Content
      title={`${isEdit ? '编辑' : '添加'}价格分组`}
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
          action() {
            validateFieldsAndScroll(async (err, formData) => {
              if (err) {
                return;
              }
              await dispatch({
                type: 'rent/editOrNewLeasePriceGroup',
                payload: {
                  ...formData,
                  id: editObj.id,
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
            <Form.Item label="价格分组名称">
              {getFieldDecorator('priceGroupName', {
                initialValue: editObj.priceGroupName,
                rules: [
                  {
                    required: true,
                    message: '请填写分组名称',
                  },
                ],
              })(<Input placeholder="请填写价格分组名称" />)}
            </Form.Item>
            <Form.Item label="排序">
              {getFieldDecorator('ranks', {
                initialValue: editObj.ranks,
              })(<InputNumber precision={0} placeholder="请填写" className="full-width" />)}
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
