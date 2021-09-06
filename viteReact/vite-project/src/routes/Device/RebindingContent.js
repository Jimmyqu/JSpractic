import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Row, Col, Input, Select } from 'antd';
import Content from '@/components/Datatable/Content';
import { formItemLayoutNormal } from '@/utils/utils';
import { checkIDCardNumber } from '@/commons/lib/validator';

function RebindingContent({ form, cancel, sure, selectedRows, ...restProps }) {
  const dispatch = useDispatch();
  const { getFieldDecorator, validateFieldsAndScroll, getFieldValue, validateFields } = form;
  const { MagneticCardTypes } = useSelector(state => state.pubticket);
  const saving = useSelector(state => state.loading.effects['global/rebindingICCard']);

  const { id } = selectedRows[0] || {};

  const icType = getFieldValue('icType');
  const useIDCard = icType === MagneticCardTypes.IDCard.key;

  useEffect(() => {
    if (useIDCard) {
      validateFields(['icNo']);
    }
  }, [useIDCard]);

  return (
    <Content
      title="重新绑定"
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
          action: () => {
            validateFieldsAndScroll(async (err, formData) => {
              if (err) {
                return;
              }
              await dispatch({
                type: 'global/rebindingICCard',
                payload: {
                  ...formData,
                  id,
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
            <Form.Item label="IC/物理卡号">
              {getFieldDecorator('icNo', {
                rules: [
                  {
                    required: true,
                    message: '请填写卡号',
                  },
                  useIDCard && {
                    message: '请输入合法的身份证号码',
                    validator: checkIDCardNumber,
                  },
                ].filter(Boolean),
              })(<Input placeholder="卡号" />)}
            </Form.Item>
            <Form.Item label="卡类型">
              {getFieldDecorator('icType', {
                rules: [
                  {
                    required: true,
                    message: '请选择卡类型',
                  },
                ],
              })(
                <Select placeholder="卡类型">
                  {Object.values(MagneticCardTypes).map(item => (
                    <Select.Option key={item.key} value={item.key}>
                      {item.value}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="备注">
              {getFieldDecorator('descr')(<Input.TextArea placeholder="请填写" rows={3} />)}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Content>
  );
}

export default Form.create()(RebindingContent);
