import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Form, Input } from 'antd';
import Content from '@/components/Datatable/Content';
import CountInput from '@/components/CountInput';
import { formItemLayoutNormal } from '@/utils/utils';

function MakeAnInventoryContent({ form, cancel, sure, selectedRows, ...restProps }) {
  const dispatch = useDispatch();
  const saving = useSelector(state => state.loading.effects['store/makeAnInventory']);
  const { getFieldDecorator, getFieldValue } = form;

  const { id, itemId, itemName, stockCount } = (selectedRows || [])[0] || {};

  const num = getFieldValue('num') || 0;

  const sub = num - (stockCount || 0);

  const absSub = Math.abs(sub);
  return (
    <Content
      title="库存盘点"
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
          disabled: !(absSub > 0),
          loading: saving,
          action() {
            form.validateFieldsAndScroll(async (err, formData) => {
              if (err) {
                return;
              }
              await dispatch({
                type: 'store/makeAnInventory',
                payload: {
                  ...formData,
                  itemStockId: id,
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
            <Form.Item label="商品编号">{itemId}</Form.Item>
            <Form.Item label="商品库存编号">{id}</Form.Item>
            <Form.Item label="商品名称">{itemName}</Form.Item>
            <Form.Item label="账面库存">{stockCount}</Form.Item>
            <Form.Item label="盘点库存">
              {getFieldDecorator('num', {
                rules: [
                  {
                    required: true,
                    message: '请填写数量',
                  },
                ],
              })(<CountInput fullWidth />)}
            </Form.Item>
            {absSub > 0 && <Form.Item label={`盘${sub > 0 ? '盈' : '亏'} `}>{absSub}</Form.Item>}
            <Form.Item label="备注">
              {getFieldDecorator('descr')(<Input.TextArea placeholder="请填写" rows={3} maxLength={200} />)}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Content>
  );
}

export default Form.create()(MakeAnInventoryContent);
