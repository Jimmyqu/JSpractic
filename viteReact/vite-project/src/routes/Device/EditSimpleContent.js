import { useSelector, useDispatch } from 'react-redux';
import { Form, Row, Col, Input } from 'antd';
import Content from '@/components/Datatable/Content';
import { formItemLayoutNormal } from '@/utils/utils';
import { checkNumber } from '@/commons/lib/validator';

function BindingSimpleContent({ form, cancel, sure, selectedRows, userId, relType, ...restProps }) {
  const { getFieldDecorator, validateFieldsAndScroll, getFieldValue } = form;

  const dispatch = useDispatch();
  const saving = useSelector(state => state.loading.effects['global/updateIcPhysicsNo']);
  const { RelTypes } = useSelector(state => state.global);

  const isStudyUserType = relType === RelTypes.PUBSTUDY_USER.key;
  const isPubServiceType = relType === RelTypes.PUBSERVICE_ACCOUNT.key;

  return (
    <Content
      title="修改物理卡号"
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
              formValues.id = selectedRows[0].id;
              if (isPubServiceType || isStudyUserType) {
                formValues.id = selectedRows[0].id;
              }
              await dispatch({
                type: 'global/updateIcPhysicsNo',
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
            <Form.Item label="修改物理卡号">
              {getFieldDecorator('icPhysicsNo', {
                initialValue: selectedRows[0].icPhysicsNo,
                rules: [
                  getFieldValue('icPhysicsNo') && {
                    message: '请输入正确物理卡号',
                    validator: checkNumber,
                  },
                ].filter(Boolean),
              })(<Input placeholder="卡号" />)}
            </Form.Item>
            <Form.Item label="修改备注">
              {getFieldDecorator('descr', {
                initialValue: selectedRows[0].descr,
              })(<Input.TextArea placeholder="备注" rows={3} />)}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Content>
  );
}

export default Form.create()(BindingSimpleContent);
