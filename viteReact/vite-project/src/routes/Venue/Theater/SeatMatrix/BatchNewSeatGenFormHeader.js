import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import CountInput from '@/components/CountInput';
import MarginBar from '@/components/MarginBar';
import styles from './index.less';

export default ({ GenerateMode, form, generate, clear, max }) => {
  return (
    <div className={styles.formHeader}>
      <Row>
        <Col md={8}>
          <Form.Item label="生成方式">
            {form.getFieldDecorator('genMode', {
              rules: [
                {
                  required: true,
                  message: '请选择生成方式',
                },
              ],
            })(
              <Select placeholder="请选择">
                {Object.values(GenerateMode).map(item => (
                  <Select.Option key={item.key} value={item.key} disabled={item.disabled} title={item.text}>
                    {item.text}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col md={8}>
          <Form.Item label="生成数">
            {form.getFieldDecorator('quantity', {
              initialValue: max,
              rules: [
                {
                  required: true,
                  message: '请填写生成数',
                },
              ],
            })(<CountInput min={1} max={max} fullWidth />)}
          </Form.Item>
        </Col>
        <Col md={8}>
          <Form.Item label="座位起始">
            {form.getFieldDecorator('startFrom', {
              initialValue: 1,
              rules: [
                {
                  required: true,
                  message: '请填写起始座位编号',
                },
              ],
            })(<InputNumber min={1} className="full-width" />)}
          </Form.Item>
        </Col>
        <Col md={8}>
          <Form.Item label="座位单位">
            {form.getFieldDecorator('seatUnit', {
              initialValue: '座',
              rules: [
                {
                  required: true,
                  message: '请填写座位单位',
                },
              ],
            })(<Input placeholder="请填写" disabled />)}
          </Form.Item>
        </Col>
        <Col md={8}>
          <Form.Item label="座位说明">{form.getFieldDecorator('seatDesc')(<Input placeholder="请填写" />)}</Form.Item>
        </Col>
        <Col md={10}>
          <Form.Item>
            <MarginBar inline left>
              <Button type="primary" onClick={generate}>
                生成座位
              </Button>
            </MarginBar>
            <MarginBar inline left>
              <Button type="danger" onClick={clear}>
                删除所有
              </Button>
            </MarginBar>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};
