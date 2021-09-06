import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Form, Row, Col, Input } from 'antd';
import Content from '@/components/Datatable/Content';
import Item, { ItemTypes } from '@/components/Datatable/Item';
import { formItemLayoutNormal } from '@/utils/utils';

function UpdateContent({
  form,
  cancel,
  sure,
  selectedRows,
  composeStateMapping,
  handleComposeStateChange,
  ...restProps
}) {
  const dispatch = useDispatch();
  const changIng = useSelector(state => state.loading.effects['pubplatform/editFoeverLockedDate']);
  return (
    <Content
      title="更新锁场日期"
      {...restProps}
      buttons={[
        {
          text: '取消',
          disabled: changIng,
          action: cancel,
        },
        {
          text: '确定',
          type: 'primary',
          loading: changIng,
          action() {
            form.validateFieldsAndScroll(async (err, formData) => {
              if (err) {
                return;
              }
              await dispatch({
                type: 'pubplatform/editFoeverLockedDate',
                payload: {
                  ...formData,
                  sportPlatformForeverId: selectedRows[0].sportPlatformForeverId,
                  startDate: formData.startDate.valueOf(),
                  endDate: formData.endDate.valueOf(),
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
            <Form.Item label="开始时间">
              {form.getFieldDecorator('startDate', {
                initialValue: moment(selectedRows[0].startDate),
                rules: [
                  {
                    required: true,
                    message: '请选择开始时间',
                  },
                ],
              })(
                <Item
                  compose="1"
                  type={ItemTypes.DatePickerRangeStart}
                  form={form}
                  composeStateMapping={composeStateMapping}
                  handleComposeStateChange={handleComposeStateChange}
                />
              )}
            </Form.Item>
            <Form.Item label="结束时间">
              {form.getFieldDecorator('endDate', {
                initialValue: moment(selectedRows[0].endDate),
                rules: [
                  {
                    required: true,
                    message: '请选择结束时间',
                  },
                ],
              })(
                <Item
                  compose="1"
                  type={ItemTypes.DatePickerRangeEnd}
                  form={form}
                  composeStateMapping={composeStateMapping}
                  handleComposeStateChange={handleComposeStateChange}
                />
              )}
            </Form.Item>
            <Form.Item label="备注">
              {form.getFieldDecorator('updateMessage')(<Input.TextArea placeholder="请填写" rows={3} />)}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Content>
  );
}

export default Form.create()(UpdateContent);
