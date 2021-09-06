import { useSelector, useDispatch } from 'react-redux';
import { Form, Row, Col, DatePicker, Input, Select, InputNumber } from 'antd';
import Content from '@/components/Datatable/Content';
import { formItemLayoutNormal } from '@/utils/utils';

function BatchDelayContent({ form, cancel, selectedRows, sure, ...restProps }) {
  const dispatch = useDispatch();
  const { getFieldDecorator, validateFieldsAndScroll, getFieldValue } = form;
  const saving = useSelector(state => state.loading.effects['pubservice/batchDelayPeriod']);

  const delayType = getFieldValue('delayType');

  return (
    <Content
      title="批量延期"
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
                type: 'pubservice/batchDelayPeriod',
                payload: {
                  ...formData,
                  publicServiceAccountId: selectedRows.map(item => item.id),
                  endDate: formData.endDate ? formData.endDate.valueOf() : undefined,
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
            <Form.Item label="延期类型">
              {getFieldDecorator('delayType', {
                rules: [
                  {
                    required: true,
                    message: '请选择延期类型',
                  },
                ],
              })(
                <Select placeholder="请选择">
                  <Select.Option key={1} value={1}>
                    按日期
                  </Select.Option>
                  <Select.Option key={2} value={2}>
                    按天数
                  </Select.Option>
                </Select>
              )}
            </Form.Item>
            {delayType === 1 && (
              <Form.Item label="结束日期">
                {getFieldDecorator('endDate', {
                  rules: [
                    {
                      required: true,
                      message: '请选择日期',
                    },
                  ],
                })(<DatePicker />)}
              </Form.Item>
            )}
            {delayType === 2 && (
              <Form.Item label="延期天数">
                {getFieldDecorator('delayDays', {
                  rules: [
                    {
                      required: true,
                      message: '请填写天数',
                      type: 'number',
                    },
                    {
                      message: '请填写有效天数',
                      validator: (rule, value, fn) => {
                        if (value <= 0) {
                          fn([new Error('invalid')]);
                          return;
                        }
                        fn();
                      },
                    },
                  ],
                })(<InputNumber placeholder="请填写" className="full-width" />)}
              </Form.Item>
            )}
            <Form.Item label="备注">
              {getFieldDecorator('descr')(<Input.TextArea placeholder="请填写" rows={3} />)}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Content>
  );
}

export default Form.create()(BatchDelayContent);
