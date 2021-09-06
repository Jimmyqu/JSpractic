import { useSelector, useDispatch } from 'react-redux';
import { Form, Row, Col, Input } from 'antd';
import Content from '@/components/Datatable/Content';

const formItemLayout = {
  labelCol: { md: 2 },
  wrapperCol: { md: 22 },
};

function LostItContent({ form, cancel, sure, selectedRows, ...restProps }) {
  const { getFieldDecorator, validateFieldsAndScroll } = form;
  const dispatch = useDispatch();
  const { MagneticCardStatus } = useSelector(state => state.pubticket);
  const saving = useSelector(state => state.loading.effects['global/updateICCardBindState']);

  const { id, mobile, realName } = selectedRows[0] || {};

  return (
    <Content
      title="作废"
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
                type: 'global/updateICCardBindState',
                payload: {
                  ...formData,
                  ids: [id],
                  icState: MagneticCardStatus.Lost.key,
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
          <Form {...formItemLayout}>
            <Form.Item label="已选择">
              编号：{id}、持卡人：{realName}、持卡人手机号：{mobile}
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

export default Form.create()(LostItContent);
