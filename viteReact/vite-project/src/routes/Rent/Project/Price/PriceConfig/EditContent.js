import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { Row, Col, Form, Input, InputNumber, DatePicker } from 'antd';
import Content from '@/components/Datatable/Content';
import AmountInput from '@/components/Amount/Input';
import { formItemLayoutNormal, clearHMS } from '@/utils/utils';
import { encodeMoney, decodeMoney } from '@/utils/format';

function EditContent({ form, sure, cancel, isEdit, selectedRows, priceGroupId, ...restProps }) {
  const { getFieldDecorator, validateFieldsAndScroll } = form;
  const saving = useSelector(state => state.loading.effects['rent/editOrAddLeasePriceConfig']);
  const dispatch = useDispatch();

  const editObj = isEdit ? (selectedRows || [])[0] || {} : {};

  return (
    <Content
      title={`${isEdit ? '编辑' : '添加'}价格配置`}
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
              const { tiemRange, rentalAmount, depositAmount, ...formValues } = formData;
              await dispatch({
                type: 'rent/editOrAddLeasePriceConfig',
                payload: {
                  ...formValues,
                  priceGroupId,
                  startDate: tiemRange[0] ? clearHMS(tiemRange[0]).valueOf() : null,
                  endDate: tiemRange[1] ? clearHMS(tiemRange[1]).add('1', 'days').valueOf() : null,
                  rentalAmount: encodeMoney(rentalAmount),
                  depositAmount: encodeMoney(depositAmount),
                  id: editObj.id,
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
            <Form.Item label="价格配置名称">
              {getFieldDecorator('priceGroupName', {
                initialValue: editObj.priceGroupName,
                rules: [
                  {
                    required: true,
                    message: '请填写价格配置名称',
                  },
                ],
              })(<Input placeholder="请填写名称" />)}
            </Form.Item>
            <Form.Item label="价格配置时间段">
              {getFieldDecorator('tiemRange', {
                initialValue: [
                  editObj.startDate ? moment(editObj.startDate) : undefined,
                  editObj.endDate
                    ? (() => {
                        // 与列表里的格式化处理呼应
                        const mmt = clearHMS(editObj.endDate);
                        if (mmt.valueOf() === editObj.endDate) {
                          return mmt.subtract('1', 'days');
                        }
                        return mmt;
                      })()
                    : undefined,
                ],
                rules: [
                  {
                    required: true,
                    message: '请填写时间段',
                  },
                ],
              })(
                <DatePicker.RangePicker
                  // format="YYYY-MM-DD"
                  placeholder={['请选择价格开始时间', '请选择价格结束时间']}
                  disabledDate={value => clearHMS(value).valueOf() < clearHMS(Date.now()).valueOf()}
                />
              )}
            </Form.Item>
            <Form.Item label="租金">
              {getFieldDecorator('rentalAmount', {
                initialValue: decodeMoney(editObj.rentalAmount || 0),
              })(<AmountInput fullWidth min={0} precision={2} disabled />)}
            </Form.Item>
            <Form.Item label="押金">
              {getFieldDecorator('depositAmount', {
                initialValue: decodeMoney(editObj.depositAmount || 0),
                rules: [
                  {
                    required: true,
                    message: '请填写押金',
                  },
                ],
              })(<AmountInput fullWidth min={0} precision={2} />)}
            </Form.Item>

            <Form.Item label="排序">
              {getFieldDecorator('ranks', {
                initialValue: editObj.ranks,
              })(<InputNumber precision={0} placeholder="请填写" className="full-width" />)}
            </Form.Item>
            <Form.Item label="备注">
              {getFieldDecorator('descr', {
                initialValue: editObj.descr,
              })(<Input.TextArea rows={4} />)}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Content>
  );
}

export default Form.create()(EditContent);
