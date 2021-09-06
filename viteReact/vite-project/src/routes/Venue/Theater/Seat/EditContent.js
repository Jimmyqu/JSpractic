import { useDispatch, useSelector } from 'react-redux';
import { Col, Form, Input, InputNumber, Row, Select } from 'antd';
import Content from '@/components/Datatable/Content';
import { formItemLayoutNormal } from '@/utils/utils';
import { NoneOption } from '../../utils';

function EditContent({ singleEdit, form, cancel, sure, floorList, areaList, levelList, selectedRows, ...restProps }) {
  const dispatch = useDispatch();
  const selectedRow = singleEdit ? selectedRows?.[0] : null;
  const { SeatTypes, SeatFeatTypes } = useSelector(state => state.pubticket);
  const editing = useSelector(
    state => state.loading.effects['pubticket/editSeat'] || state.loading.effects['pubticket/batchEditSeats']
  );

  return (
    <Content
      title="批量修改座位说明"
      // loading={fetching}
      {...restProps}
      buttons={[
        {
          text: '取消',
          disabled: editing,
          action: cancel,
        },
        {
          text: '确定',
          type: 'primary',
          loading: editing,
          action() {
            form.validateFieldsAndScroll(async (err, formData) => {
              if (err) {
                return;
              }
              await (singleEdit
                ? dispatch({
                    type: 'pubticket/editSeat',
                    payload: {
                      ...formData,
                      id: selectedRow.id,
                    },
                  })
                : dispatch({
                    type: 'pubticket/batchEditSeats',
                    payload: {
                      ...formData,
                      ids: selectedRows.map(({ id }) => id),
                    },
                  }));
              sure();
            });
          },
        },
      ]}
    >
      <Form {...formItemLayoutNormal}>
        <Row>
          {singleEdit && (
            <>
              <Col md={8}>
                <Form.Item label="楼层">
                  {form.getFieldDecorator('floorCategoryId', {
                    initialValue: selectedRow?.floorCategoryId,
                  })(
                    <Select placeholder="请选择">
                      {NoneOption}
                      {floorList.map(item => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.categoryName}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item label="区域">
                  {form.getFieldDecorator('areaCategoryId', {
                    initialValue: selectedRow?.areaCategoryId,
                  })(
                    <Select placeholder="请选择">
                      {NoneOption}
                      {areaList.map(item => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.categoryName}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item label="等级">
                  {form.getFieldDecorator('levelCategoryId', {
                    initialValue: selectedRow?.levelCategoryId,
                  })(
                    <Select placeholder="请选择">
                      {NoneOption}
                      {levelList.map(item => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.categoryName}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item label="排数">
                  {form.getFieldDecorator('rowsNum', {
                    initialValue: selectedRow?.rowsNum,
                    rules: [
                      {
                        required: true,
                        message: '请填写排数',
                      },
                    ],
                  })(<InputNumber placeholder="请填写" precision={0} min={1} />)}
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item label="排数名称">
                  {form.getFieldDecorator('rowsName', {
                    initialValue: selectedRow?.rowsName,
                  })(<Input placeholder="请填写" disabled />)}
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item label="座位号">
                  {form.getFieldDecorator('seatValue', {
                    initialValue: selectedRow?.seatValue,
                    rules: [
                      {
                        required: true,
                        message: '请填写座位号',
                      },
                    ],
                  })(<InputNumber placeholder="请填写" precision={0} min={1} />)}
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item label="座位名称">
                  {form.getFieldDecorator('seatName', {
                    initialValue: selectedRow?.seatName,
                  })(<Input placeholder="请填写" disabled />)}
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item label="座位类型">
                  {form.getFieldDecorator('seatType', {
                    initialValue: selectedRow?.seatType || SeatTypes.NORMAL.key,
                  })(
                    // 座位类型不能在这里改，因为情侣座占两个位置显示
                    <Select placeholder="请选择" disabled>
                      {Object.values(SeatTypes).map(item => (
                        <Select.Option key={item.key} value={item.key}>
                          {item.value}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item label="座位属性">
                  {form.getFieldDecorator('seatProperty', {
                    initialValue: selectedRow?.seatProperty || SeatFeatTypes.NORMAL.key,
                  })(
                    <Select placeholder="请选择">
                      {Object.values(SeatFeatTypes).map(item => (
                        <Select.Option key={item.key} value={item.key}>
                          {item.value}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </>
          )}
          <Col md={8}>
            <Form.Item label="排序">
              {form.getFieldDecorator('ranks', {
                initialValue: selectedRow?.ranks || 0,
              })(<InputNumber placeholder="请填写" precision={0} />)}
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item label="座位说明">
              {form.getFieldDecorator('seatDesc', {
                initialValue: selectedRow?.seatDesc,
              })(<Input.TextArea placeholder="请填写" autoSize={{ minRows: 4 }} />)}
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item label="备注">
              {form.getFieldDecorator('descr', {
                initialValue: selectedRow?.descr,
              })(<Input.TextArea placeholder="请填写" autoSize={{ minRows: 4 }} />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Content>
  );
}

export default Form.create()(EditContent);
