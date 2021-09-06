import { Form, Row, Col, Input, InputNumber } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import Content from '@/components/Datatable/Content';
import { formItemLayoutNormal } from '@/utils/utils';
import { fixedMoney, decodeMoney, encodeMoney } from '@/utils/format';

function EditContent({
  form,
  cancel,
  sure,
  //
  selectedRows,
  composeStateMapping,
  handleComposeStateChange,
  ...restProps
}) {
  const { getFieldDecorator, validateFieldsAndScroll } = form;
  const dispatch = useDispatch();
  const editing = useSelector(state => state.loading.effects['a/editing']);

  const selectedRow = selectedRows[0] || {};

  const min = decodeMoney(selectedRow.couponPrice || 0);

  return (
    <Content
      title="修改核验信息"
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
            validateFieldsAndScroll(async (err, formData) => {
              if (err) {
                return;
              }
              await dispatch({
                type: 'coupon/updateVerify',
                payload: {
                  ...formData,
                  consumeTotalPrice: encodeMoney(formData.consumeTotalPrice),
                  id: selectedRows[0].id,
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
            <Form.Item label="订单号">
              {getFieldDecorator('consumeDealId', {
                initialValue: selectedRow.consumeDealId,
                rules: [
                  {
                    required: true,
                    message: '请填写订单号',
                  },
                ],
              })(<Input placeholder="请填写消费订单号" />)}
            </Form.Item>
            <Form.Item label="订单金额">
              {getFieldDecorator('consumeTotalPrice', {
                initialValue: decodeMoney(selectedRow.consumeTotalPrice),
                rules: [
                  {
                    required: true,
                    message: `请填写订单金额, 不小于${fixedMoney(min)}`,
                    validator(rule, value, fn) {
                      if (value >= min) {
                        fn();
                        return;
                      }
                      fn([new Error('invalid')]);
                    },
                  },
                ],
              })(<InputNumber className="full-width" precision={2} min={Math.max(0, min)} placeholder="请填写" />)}
            </Form.Item>
            <Form.Item label="消费备注">
              {getFieldDecorator('consumeContent', {
                initialValue: selectedRow.consumeContent,
              })(<Input.TextArea autoSize placeholder="请填写" />)}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Content>
  );
}

export default Form.create()(EditContent);
