import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Form, Input, Select, InputNumber } from 'antd';
import Content from '@/components/Datatable/Content';
import { formItemLayoutNormal } from '@/utils/utils';

function EditContent({ form, sure, cancel, selectedRows, isEdit, ...restProps }) {
  const { getFieldDecorator, validateFieldsAndScroll } = form;
  const { RefundModeTypes, LeaseTypes } = useSelector(state => state.rent);
  const { PayWayTypes } = useSelector(state => state.deal);
  const dispatch = useDispatch();
  const saving = useSelector(state => state.loading.effects['rent/editOrAddLeaseConfig']);
  const editObj = isEdit ? (selectedRows || [])[0] || {} : {};

  const doSure = () => {
    validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      await dispatch({
        type: 'rent/editOrAddLeaseConfig',
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
      title={`${isEdit ? '修改' : '添加'}租赁配置`}
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
            <Form.Item label="租赁类型">
              {getFieldDecorator('leaseType', {
                initialValue: editObj.leaseType,
                rules: [
                  {
                    required: true,
                    message: '请选择租赁类型',
                  },
                ],
              })(
                <Select placeholder="请选择">
                  {Object.values(LeaseTypes).map(item => (
                    <Select.Option value={item.key} key={item.key}>
                      {item.value}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="支付方式">
              {getFieldDecorator('payMode', {
                initialValue: editObj.payMode?.includes(PayWayTypes.GROUP.key)
                  ? [
                      ...editObj.payMode.filter(i => i !== PayWayTypes.GROUP.key),
                      PayWayTypes.WECHAT.key,
                      PayWayTypes.ZFB.key,
                    ]
                  : editObj.payMode,
                rules: [
                  {
                    required: true,
                    message: '请选择支付方式',
                  },
                ],
              })(
                <Select mode="multiple" placeholder="请选择">
                  {[PayWayTypes.WECHAT, PayWayTypes.ZFB, PayWayTypes.CASH].map(item => (
                    <Select.Option value={item.key} key={item.key}>
                      {item.value}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="退款方式">
              {getFieldDecorator('refundMode', {
                initialValue: editObj.refundMode,
                rules: [
                  {
                    required: true,
                    message: '请选择',
                  },
                ],
              })(
                <Select placeholder="请选择">
                  {Object.values(RefundModeTypes).map(item => (
                    <Select.Option value={item.key} key={item.key}>
                      {item.value}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            {/* <Form.Item label="延迟时间">
              {getFieldDecorator('refundTime', {
                initialValue: editObj.refundTime,
                rules: [
                  {
                    required: true,
                    message: '请填写延迟时间',
                  },
                ],
              })(<Input placeholder="请填写延迟时间" />)}
            </Form.Item> */}
            <Form.Item label="排序">
              {getFieldDecorator('ranks', {
                initialValue: editObj.ranks || 0,
              })(<InputNumber precision={0} placeholder="请填写" className="full-width" />)}
            </Form.Item>
            <Form.Item label="备注">
              {getFieldDecorator('descr', {
                initialValue: editObj.descr,
              })(<Input.TextArea rows={4} placeholder="请填写备注" />)}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Content>
  );
}

export default Form.create()(EditContent);
