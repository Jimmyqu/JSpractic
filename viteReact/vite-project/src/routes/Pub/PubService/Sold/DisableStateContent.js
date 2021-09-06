import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Row, Col, Form } from 'antd';
import Content from '@/components/Datatable/Content';
import { formItemLayoutNormal } from '@/utils/utils';

export default function ({ cancel, selectedRows, sure, ...restProps }) {
  const dispatch = useDispatch();
  const [value, setValue] = useState();
  const saving = useSelector(state => state.loading.effects['pubservice/disableOrEnableService']);
  return (
    <Content
      title="禁用服务"
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
          async action() {
            await dispatch({
              type: 'pubservice/disableOrEnableService',
              payload: {
                descr: value,
                publicServiceAccountId: selectedRows[0].id,
                enable: false,
              },
            });
            sure();
          },
        },
      ]}
    >
      <Row>
        <Col md={12}>
          <Form {...formItemLayoutNormal}>
            <Form.Item label="备注">
              <Input.TextArea placeholder="请填写" value={value} rows={4} onChange={e => setValue(e.target.value)} />
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Content>
  );
}
