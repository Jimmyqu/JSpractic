import { Form } from 'antd';
import { useDispatch } from 'react-redux';
import Modal from '@/components/Modal';
import AmountInput from '@/components/Amount/Input';
import MarginBar from '@/components/MarginBar';
import { decodeMoney, encodeMoney } from '@/utils/format';
import { formItemLayoutNormal } from '@/utils/utils';

function ModifyPriceModal({ sure, form, selectedRows, ...restProps }) {
  const dispatch = useDispatch();
  const { getFieldDecorator } = form;
  const { salesId, id, marketPrice, buyPrice, salesPrice } = (selectedRows || [])[0] || {};

  const onOk = () => {
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'store/updatePrice',
        payload: {
          itemStockId: id,
          salesId,
          marketPrice: encodeMoney(formData.marketPrice),
          salesPrice: encodeMoney(formData.salesPrice),
          buyPrice: encodeMoney(formData.buyPrice),
        },
      }).then(() => {
        sure();
      });
    });
    return false;
  };

  return (
    <Modal title="调整价格" {...restProps} onOk={onOk}>
      <MarginBar top>
        <Form {...formItemLayoutNormal}>
          <Form.Item label="销售单价">
            {getFieldDecorator('salesPrice', {
              initialValue: decodeMoney(salesPrice),
              rules: [
                {
                  message: '价格无效',
                  validator(rule, value, fn) {
                    if (value >= 0) {
                      fn();
                      return;
                    }
                    fn([new Error('invalid')]);
                  },
                },
              ],
            })(<AmountInput fullWidth min={0} precision={2} />)}
          </Form.Item>
          <Form.Item label="进货价">
            {getFieldDecorator('buyPrice', {
              initialValue: decodeMoney(buyPrice),
              rules: [
                {
                  message: '价格无效',
                  validator(rule, value, fn) {
                    if (value >= 0) {
                      fn();
                      return;
                    }
                    fn([new Error('invalid')]);
                  },
                },
              ],
            })(<AmountInput fullWidth min={0} precision={2} />)}
          </Form.Item>
          <Form.Item label="商品原价">
            {getFieldDecorator('marketPrice', {
              initialValue: decodeMoney(marketPrice),
              rules: [
                {
                  message: '价格无效',
                  validator(rule, value, fn) {
                    if (value >= 0) {
                      fn();
                      return;
                    }
                    fn([new Error('invalid')]);
                  },
                },
              ],
            })(<AmountInput fullWidth min={0} precision={2} />)}
          </Form.Item>
        </Form>
      </MarginBar>
    </Modal>
  );
}

export default Form.create()(ModifyPriceModal);
