import { useDispatch, useSelector } from 'react-redux';
import { Col, Form, Input, Radio, Row, Select } from 'antd';
import Content from '@/components/Datatable/Content';
import CountInput from '@/components/CountInput';
import { formItemLayoutNormal } from '@/utils/utils';

function TheaterEditContent({ form, edit, cancel, sure, salesId, selectedRows, ...restProps }) {
  const dispatch = useDispatch();
  const selectedRow = edit ? selectedRows?.[0] : null;

  const CultureTypes = useSelector(state => state.venue.CultureTypes);
  const editing = useSelector(state => state.loading.effects['venue/saveOrEditTheaterSetting']);

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
                type: 'venue/saveOrEditTheaterSetting',
                payload: {
                  ...formData,
                  id,
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
            <Form.Item label="专业类型">
              {form.getFieldDecorator('platformType', {
                initialValue: selectedRow?.platformType,
                rules: [
                  {
                    required: true,
                    message: '请选择专业类型',
                  },
                ],
              })(
                <Select placeholder="请选择">
                  {Object.values(CultureTypes).map(item => (
                    <Select.Option key={item.key} value={item.key}>
                      {item.value}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item label="场地名称">
              {form.getFieldDecorator('platformName', {
                initialValue: selectedRow?.platformName,
                rules: [
                  {
                    required: true,
                    message: '请填写场地名称',
                  },
                ],
              })(<Input placeholder="请填写" />)}
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item label="在线显示">
              {form.getFieldDecorator('platformOpen', {
                initialValue: selectedRow?.platformOpen,
                rules: [
                  {
                    required: true,
                    message: '请选择是否在线显示',
                  },
                ],
              })(
                <Radio.Group>
                  <Radio value={1}>开放</Radio>
                  <Radio value={0}>不开放</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item label="在线预订">
              {form.getFieldDecorator('onlineBooking', {
                initialValue: selectedRow?.onlineBooking,
                rules: [
                  {
                    required: true,
                    message: '请选择是否在线预订',
                  },
                ],
              })(
                <Radio.Group>
                  <Radio value={1}>开放</Radio>
                  <Radio value={0}>不开放</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item label="可容纳人数">
              {form.getFieldDecorator('limitPeople', {
                initialValue: selectedRow?.limitPeople,
                rules: [
                  {
                    required: true,
                    message: '请填写可容纳人数',
                  },
                ],
              })(<CountInput fullWidth />)}
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item label="场地备注">
              {form.getFieldDecorator('descr', {
                initialValue: selectedRow?.descr,
              })(<Input placeholder="请填写" />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Content>
  );
}

export default Form.create()(TheaterEditContent);
