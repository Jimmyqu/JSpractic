import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Row, Col, Input, Select } from 'antd';
import Content from '@/components/Datatable/Content';
import { formItemLayoutNormal } from '@/utils/utils';
import { checkIDCardNumber, checkNumber } from '@/commons/lib/validator';

function BindingSimpleContent({ form, cancel, sure, selectedRows, userId, relType, ...restProps }) {
  const { getFieldDecorator, validateFieldsAndScroll, getFieldValue, validateFields } = form;

  const dispatch = useDispatch();
  const saving = useSelector(state => state.loading.effects['global/addICCardBinding']);
  const { RelTypes } = useSelector(state => state.global);
  const { MagneticCardTypes } = useSelector(state => state.pubticket);

  // const isSysUserType = relType === RelTypes.SYS_USER.key;
  const isStudyUserType = relType === RelTypes.PUBSTUDY_USER.key;
  const isPubServiceType = relType === RelTypes.PUBSERVICE_ACCOUNT.key;

  const icType = getFieldValue('icType');
  const useIDCard = icType === MagneticCardTypes.IDCard.key;

  useEffect(() => {
    if (icType != null) {
      validateFields(['icNo']);
    }
  }, [useIDCard]);

  return (
    <Content
      title="绑定卡号"
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
              const formValues = {
                ...formData,
                relType,
                userId,
              };
              if (isPubServiceType || isStudyUserType) {
                formValues.dataId = selectedRows[0].id;
              }

              await dispatch({
                type: 'global/addICCardBinding',
                payload: formValues,
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
            <Form.Item label="绑定卡号">
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
            <Form.Item label="绑定物理卡号">
              {getFieldDecorator('icPhysicsNo', {
                rules: [
                  getFieldValue('icPhysicsNo') && {
                    message: '请填写正确的物理卡号',
                    validator: checkNumber,
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
              {getFieldDecorator('descr')(<Input.TextArea placeholder="备注" rows={3} />)}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Content>
  );
}

export default Form.create()(BindingSimpleContent);
