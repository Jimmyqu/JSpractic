import { useEffect, useState } from 'react';
import { Alert, Checkbox, Col, Form, Input, InputNumber, message, Row, Select } from 'antd';
import { useSelector } from 'react-redux';
import Modal from '@/components/Modal';
import MarginBar from '@/components/MarginBar';
import { formItemLayoutFull } from '@/utils/utils';
import { NoneKey, NoneOption } from '../../utils';

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

const EditItems = [
  { label: '楼层', value: 'floorCategoryId' },
  { label: '区域', value: 'areaCategoryId' },
  { label: '等级', value: 'levelCategoryId' },
  { label: '排数', value: 'rowsNum' },
  { label: '座位', value: 'seatValue', disabled: true },
  { label: '类型', value: 'seatType', disabled: true },
  { label: '属性', value: 'seatProperty' },
  { label: '排序', value: 'ranks' },
  { label: '说明', value: 'seatDesc' },
  { label: '备注', value: 'descr' },
];

// lable静态匹配，避免渲染时匹配
const lableMapping = new Map();

EditItems.forEach(item => {
  lableMapping.set(item.value, item.label);
});

function BatchEditSeatModal({
  form,
  floorList,
  areaList,
  levelList,
  selectedSeats,
  onOk,
  resetAnyCaseName,
  ...restProps
}) {
  const { SeatTypes, SeatFeatTypes } = useSelector(state => state.pubticket);
  const [enableItems, setEnableItems] = useState([]);

  const seatLength = selectedSeats?.length || 0;
  useEffect(() => {
    if (seatLength === 1) {
      setEnableItems(EditItems.map(item => item.value));
      return;
    }
    setEnableItems(
      EditItems.filter(item => item.value !== 'seatValue' && item.value !== 'seatType').map(item => item.value)
    );
  }, [seatLength]);

  const {
    ranks,
    seatDesc,
    descr,
    floorCategoryId,
    areaCategoryId,
    levelCategoryId,
    rowsNum,
    seatValue,
    seatType,
    seatProperty,
  } = selectedSeats?.length === 1 ? selectedSeats[0] : {};
  return (
    <Modal
      title="批量修改座位"
      {...restProps}
      onOk={() => {
        if (enableItems.length === 0) {
          message.warn('请至少勾选一项来修改');
          return false;
        }
        form.validateFieldsAndScroll(async (err, formData) => {
          if (err) {
            return;
          }
          onOk(
            selectedSeats.map(seat => {
              const newSeat = {
                ...seat,
                ...formData,
                isChanged: !seat.isNew,
              };
              resetAnyCaseName(newSeat);
              return newSeat;
            })
          );
        });
        return false;
      }}
    >
      {selectedSeats?.length > 1 && (
        <>
          <Alert type="info" showIcon message="请勾选批量修改的字段" />
          <MarginBar top>
            <Checkbox.Group options={EditItems} defaultValue={enableItems} onChange={setEnableItems} />
          </MarginBar>
        </>
      )}
      <MarginBar top>
        <Form {...formItemLayoutFull}>
          <Row gutter={8}>
            {enableItems.map(name => {
              switch (name) {
                case 'floorCategoryId':
                  return (
                    <Col md={12} key={name}>
                      <Form.Item label={lableMapping.get(name)}>
                        {form.getFieldDecorator(name, {
                          initialValue: floorCategoryId || NoneKey,
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
                  );
                case 'areaCategoryId':
                  return (
                    <Col md={12} key={name}>
                      <Form.Item label={lableMapping.get(name)}>
                        {form.getFieldDecorator(name, {
                          initialValue: areaCategoryId || NoneKey,
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
                  );
                case 'levelCategoryId':
                  return (
                    <Col md={12} key={name}>
                      <Form.Item label={lableMapping.get(name)}>
                        {form.getFieldDecorator(name, {
                          initialValue: levelCategoryId || NoneKey,
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
                  );
                case 'rowsNum':
                  return (
                    <Col md={12} key={name}>
                      <Form.Item label={lableMapping.get(name)}>
                        {form.getFieldDecorator(name, {
                          initialValue: rowsNum,
                          rules: [
                            {
                              required: true,
                              message: '请填写排数',
                            },
                          ],
                        })(<InputNumber placeholder="请填写" precision={0} min={1} className="full-width" />)}
                      </Form.Item>
                    </Col>
                  );
                case 'seatValue':
                  return (
                    <Col md={12} key={name}>
                      <Form.Item label={lableMapping.get(name)}>
                        {form.getFieldDecorator(name, {
                          initialValue: seatValue,
                        })(<InputNumber placeholder="请填写" precision={0} min={1} />)}
                      </Form.Item>
                    </Col>
                  );
                case 'seatType':
                  return (
                    <Col md={12} key={name}>
                      <Form.Item label={lableMapping.get(name)}>
                        {form.getFieldDecorator(name, {
                          initialValue: seatType,
                        })(
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
                  );
                case 'seatProperty':
                  return (
                    <Col md={12} key={name}>
                      <Form.Item label={lableMapping.get(name)}>
                        {form.getFieldDecorator(name, {
                          initialValue: seatProperty || SeatFeatTypes.NORMAL.key,
                          rules: [
                            {
                              required: true,
                              message: '请选择座位属性',
                            },
                          ],
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
                  );
                case 'ranks':
                  return (
                    <Col md={12} key={name}>
                      <Form.Item label={lableMapping.get(name)}>
                        {form.getFieldDecorator(name, {
                          initialValue: ranks || 0,
                        })(<InputNumber placeholder="请填写" precision={0} className="full-width" />)}
                      </Form.Item>
                    </Col>
                  );
                case 'seatDesc':
                  return (
                    <Col md={24} key={name}>
                      <Form.Item label={lableMapping.get(name)} {...formItemLayout}>
                        {form.getFieldDecorator(name, {
                          initialValue: seatDesc,
                        })(<Input.TextArea placeholder="请填写" autoSize={{ minRows: 3 }} />)}
                      </Form.Item>
                    </Col>
                  );
                case 'descr':
                  return (
                    <Col md={24} key={name}>
                      <Form.Item label={lableMapping.get(name)} {...formItemLayout}>
                        {form.getFieldDecorator(name, {
                          initialValue: descr,
                        })(<Input.TextArea placeholder="请填写" autoSize={{ minRows: 3 }} />)}
                      </Form.Item>
                    </Col>
                  );
                default:
                  return null;
              }
            })}
          </Row>
        </Form>
      </MarginBar>
    </Modal>
  );
}

export default Form.create()(BatchEditSeatModal);
