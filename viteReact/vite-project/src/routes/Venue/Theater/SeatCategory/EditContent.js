import { useDispatch, useSelector } from 'react-redux';
import { Col, Form, Input, InputNumber, Row, Select } from 'antd';
import Content from '@/components/Datatable/Content';
import ColorPicker from '@/components/Form/FormItem/ColorPicker';
import { formItemLayoutNormal } from '@/utils/utils';

function SeatCategoryEditContent({ form, edit, cancel, sure, salesId, dataId, selectedRows, ...restProps }) {
  const dispatch = useDispatch();
  const selectedRow = edit ? selectedRows?.[0] : null;

  const SeatCategoryTypes = useSelector(state => state.pubticket.SeatCategoryTypes);
  const editing = useSelector(state => state.loading.effects['pubticket/newOrEditSeatCategory']);

  return (
    <Content
      title={`${edit ? '编辑' : '添加'}`}
      // loading={fetching}
      {...restProps}
      buttons={[
        {
          text: '取消',
          disabled: editing,
          action: cancel,
        },
        {
          text: '确定',
          type: 'primary',
          loading: editing,
          action() {
            form.validateFieldsAndScroll(async (err, formData) => {
              if (err) {
                return;
              }
              const { id } = selectedRows[0] || {};
              await dispatch({
                type: 'pubticket/newOrEditSeatCategory',
                payload: {
                  ...formData,
                  id,
                  dataId,
                  salesId,
                },
              });
              sure();
            });
          },
        },
      ]}
    >
      <Form {...formItemLayoutNormal}>
        <Row>
          <Col md={8}>
            <Form.Item label="分类名称">
              {form.getFieldDecorator('categoryName', {
                initialValue: selectedRow?.categoryName,
                rules: [
                  {
                    required: true,
                    message: '请填写分类名称',
                  },
                ],
              })(
                edit ? (
                  <Input placeholder="请填写" />
                ) : (
                  <Input.TextArea placeholder="可填写多个分类名称，使用回车（Enter）键分隔" autoSize={{ minRows: 4 }} />
                )
              )}
            </Form.Item>
          </Col>
          {!edit && (
            <Col md={8}>
              <Form.Item label="分类类型">
                {form.getFieldDecorator('categoryType', {
                  initialValue: selectedRow?.categoryType,
                  rules: [
                    {
                      required: true,
                      message: '请选择分类类型',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    {Object.values(SeatCategoryTypes).map(item => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.value}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          )}
          <Col md={8}>
            <Form.Item label="排序">
              {form.getFieldDecorator('ranks', {
                initialValue: selectedRow?.ranks || 0,
              })(<InputNumber placeholder="请填写" precision={0} />)}
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item label="颜色">
              {form.getFieldDecorator('categoryColor', {
                initialValue: selectedRow?.categoryColor,
                rules: [
                  {
                    required: true,
                    message: '请选择颜色',
                  },
                  {
                    message: '请设置为非透明色',
                    validator(rule, value, fn) {
                      if (value === ColorPicker.Transparent) {
                        fn([new Error('invalid')]);
                        return;
                      }
                      fn();
                    },
                  },
                ],
              })(<ColorPicker />)}
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item label="备注">
              {form.getFieldDecorator('descr', {
                initialValue: selectedRow?.descr,
              })(<Input.TextArea placeholder="请填写" autoSize={{ minRows: 4 }} />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Content>
  );
}

export default Form.create()(SeatCategoryEditContent);
