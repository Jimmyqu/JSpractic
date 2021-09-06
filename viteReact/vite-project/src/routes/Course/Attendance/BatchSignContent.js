import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Form, DatePicker, Input } from 'antd';
import Content from '@/components/Datatable/Content';
import { formItemLayoutNormal } from '@/utils/utils';

const maxLength = 300;

function BatchSignContent({ form, cancel, sure, selectedRows, ...restProps }) {
  const dispatch = useDispatch();
  const posting = useSelector(state => state.loading.effects['pubcourse/batchSign']);
  const { getFieldDecorator } = form;
  return (
    <Content
      title="批量补签"
      {...restProps}
      buttons={[
        {
          text: '取消',
          disabled: posting,
          action: cancel,
        },
        {
          text: '确定',
          type: 'primary',
          loading: posting,
          action() {
            form.validateFieldsAndScroll(async (err, formData) => {
              if (err) {
                return;
              }
              const { signIn, signOut, eventTime } = formData;
              await dispatch({
                type: 'pubcourse/batchSign',
                payload: {
                  ...formData,
                  signIn: signIn ? signIn.valueOf() : null,
                  signOut: signOut ? signOut.valueOf() : null,
                  eventTime: eventTime ? eventTime.valueOf() : null,
                  ids: selectedRows.map(({ id }) => id),
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
            <Form.Item label="签到时间">{getFieldDecorator('signIn')(<DatePicker showTime />)}</Form.Item>
            <Form.Item label="签到说明">
              {getFieldDecorator('signInDescr')(<Input.TextArea placeholder="请填写" autoSize maxLength={maxLength} />)}
            </Form.Item>
            <Form.Item label="签退时间">{getFieldDecorator('signOut')(<DatePicker showTime />)}</Form.Item>
            <Form.Item label="签退说明">
              {getFieldDecorator('signOutDescr')(
                <Input.TextArea placeholder="请填写" autoSize maxLength={maxLength} />
              )}
            </Form.Item>
            <Form.Item label="事件保存时间">{getFieldDecorator('eventTime')(<DatePicker showTime />)}</Form.Item>
            <Form.Item label="事件说明">
              {getFieldDecorator('eventDescr')(<Input.TextArea placeholder="请填写" autoSize maxLength={maxLength} />)}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Content>
  );
}

export default Form.create()(BatchSignContent);
