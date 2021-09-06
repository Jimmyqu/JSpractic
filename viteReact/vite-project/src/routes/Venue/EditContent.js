import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Form, Input, Cascader } from 'antd';
import Item, { ItemTypes } from '@/components/Datatable/Item';
import Content from '@/components/Datatable/Content';
import { formItemLayoutNormal } from '@/utils/utils';
import { cascaderData } from '@/commons/lib/home-town';

function VenueEditContent({
  form,
  selectedRows,
  sure,
  cancel,
  composeStateMapping,
  handleComposeStateChange,
  ...restProps
}) {
  const {
    id,
    salesName,
    startTime,
    endTime,
    salesTel,
    province,
    city,
    district,
    salesAddress,
    wechatPayNo,
    alipayNo,
    visitAccess,
  } = selectedRows?.[0] || {};

  const dispatch = useDispatch();
  const saving = useSelector(state => state.loading.effects['venue/updateVenueInfo']);
  return (
    <Content
      title="编辑"
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
            form.validateFieldsAndScroll(async (err, formData) => {
              if (err) {
                return;
              }
              const { startTime: s, endTime: e, pcd, ...formValue } = formData;
              const [p, c, d] = pcd;
              await dispatch({
                type: 'venue/updateVenueInfo',
                payload: {
                  ...formValue,
                  id,
                  startTime: saving == null ? null : s.valueOf(),
                  endTime: e == null ? null : e.valueOf(),
                  province: p,
                  city: c,
                  district: d,
                },
              });
              sure();
            });
          },
        },
      ]}
    >
      <Form {...formItemLayoutNormal}>
        <Row>
          <Col md={8}>
            <Form.Item label="名称">
              {form.getFieldDecorator('salesName', {
                initialValue: salesName,
                rules: [
                  {
                    required: true,
                    message: '请填写名称',
                  },
                ],
              })(<Input placeholder="请填写" />)}
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item label="营业开始时间">
              {form.getFieldDecorator('startTime', {
                initialValue: startTime,
              })(
                <Item
                  compose="1"
                  // stepReferDate={classStartTime}
                  type={ItemTypes.TimePickerRangeStart2}
                  form={form}
                  composeStateMapping={composeStateMapping}
                  handleComposeStateChange={handleComposeStateChange}
                />
              )}
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item label="营业结束时间">
              {form.getFieldDecorator('endTime', {
                initialValue: endTime,
              })(
                <Item
                  compose="1"
                  // stepReferDate={classStartTime}
                  type={ItemTypes.TimePickerRangeEnd2}
                  form={form}
                  composeStateMapping={composeStateMapping}
                  handleComposeStateChange={handleComposeStateChange}
                />
              )}
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item label="电话">
              {form.getFieldDecorator('salesTel', {
                initialValue: salesTel,
              })(<Input placeholder="请填写" />)}
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item label="所在地区">
              {form.getFieldDecorator('pcd', {
                initialValue: [province, city, district],
                rules: [
                  {
                    required: true,
                    message: '请选择所在地区',
                  },
                ],
              })(<Cascader options={cascaderData} placeholder="请选择地区" />)}
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item label="详细地址">
              {form.getFieldDecorator('salesAddress', {
                initialValue: salesAddress,
                rules: [
                  {
                    required: true,
                    message: '请填写详细地址',
                  },
                ],
              })(<Input placeholder="请填写" />)}
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item label="微信商户号">
              {form.getFieldDecorator('wechatPayNo', {
                initialValue: wechatPayNo,
                rules: [
                  {
                    required: true,
                    message: '请填写微信商户号',
                  },
                ],
              })(<Input placeholder="请填写" />)}
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item label="支付宝帐号">
              {form.getFieldDecorator('alipayNo', {
                initialValue: alipayNo,
              })(<Input placeholder="请填写" />)}
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item label="线上入口">
              {form.getFieldDecorator('visitAccess', {
                initialValue: visitAccess,
              })(<Input.TextArea rows={4} placeholder="请填写" />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Content>
  );
}

export default Form.create()(VenueEditContent);
