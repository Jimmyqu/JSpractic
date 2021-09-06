import { useSelector, useDispatch } from 'react-redux';
import { Form, Row, Col, Input } from 'antd';
import Content from '@/components/Datatable/Content';
import Item, { ItemTypes } from '@/components/Datatable/Item';
import { formItemLayoutNormal } from '@/utils/utils';

function FreezeContent({
  form,
  cancel,
  selectedRows,
  sure,
  composeStateMapping,
  handleComposeStateChange,
  ...restProps
}) {
  const dispatch = useDispatch();
  const { getFieldDecorator, validateFieldsAndScroll } = form;
  const saving = useSelector(state => state.loading.effects['pubservice/batchFreeze']);

  return (
    <Content
      title="服务冻结"
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

              const { startDate, endDate } = formData;
              await dispatch({
                type: 'pubservice/batchFreeze',
                payload: {
                  ...formData,
                  publicServiceAccountId: selectedRows.map(item => item.id),
                  startDate: startDate.valueOf(),
                  endDate: endDate ? endDate.valueOf() : undefined,
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
              {getFieldDecorator('startDate', {
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
            <Form.Item label="结束时间" extra="无结束时间表示不限">
              {getFieldDecorator('endDate')(
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
              {getFieldDecorator('descr')(<Input.TextArea placeholder="请填写" rows={3} />)}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Content>
  );
}

export default Form.create()(FreezeContent);
