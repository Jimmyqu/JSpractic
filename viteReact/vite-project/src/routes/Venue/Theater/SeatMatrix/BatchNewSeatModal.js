import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import Modal from '@/components/Modal';
import MarginBar from '@/components/MarginBar';
import CountInput from '@/components/CountInput';
import TableComp from '@/components/EditableCellTable';
import { uuid } from '@/utils/utils';
import BatchNewSeatGenFormHeader from './BatchNewSeatGenFormHeader';
import { NoneOption, NoneKey } from '../../utils';

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const GenerateMode = {
  ltr: {
    key: 1,
    text: '升序-从左到右/从上到下(1、2、3)',
  },
  rtl: {
    key: 2,
    text: '降序-从右至左/从下到上(10、9、8)',
  },
  mtsb: {
    key: 3,
    text: '从中间(左奇右偶，两边大中间小)',
    disabled: true,
  },
  mtss: {
    key: 4,
    text: '从中间(左奇右偶，两边小中间大)',
    disabled: true,
  },
};

function BatchNewSeatModal({
  form,
  tableForm,
  floorList,
  areaList,
  levelList,
  visible,
  onOk,
  selectedArea,
  resetAnyCaseName,
  ...restProps
}) {
  const { SeatTypes, SeatFeatTypes } = useSelector(state => state.pubticket);

  const [seatList, setSeatList] = useState([]);

  useEffect(() => {
    if (visible) {
      setSeatList([]);
    }
  }, [visible]);

  const rules = useMemo(
    () => [
      {
        validator: (rule, value, fn, source, options, record) => {
          let msg;
          if (
            seatList.some(seat => {
              if (seat.index === record.index) {
                return false;
              }
              if (
                seat.floorCategoryId === record.floorCategoryId &&
                seat.areaCategoryId === record.areaCategoryId &&
                seat.levelCategoryId === record.levelCategoryId
              ) {
                // 同一排
                // eslint-disable-next-line unicorn/no-lonely-if
                if (seat.rowsNum === record.rowsNum) {
                  // 同一个座位号
                  if (seat.seatValue === record.seatValue) {
                    msg = '座位号冲突';
                    return true;
                  }
                  // // 每个座位号名称必须也不相同
                  // if (seat.seatName === record.seatName) {
                  //   msg = '座位号名称冲突';
                  //   return true;
                  // }
                  return false;
                }
                // // 不同排，排数名称必须也不同
                // if (seat.rowsName === record.rowsName) {
                //   msg = '排数名称冲突';
                //   return true;
                // }
              }
              return false;
            })
          ) {
            fn([new Error(msg)]);
            return;
          }
          fn([]);
        },
      },
    ],
    [seatList]
  );

  const columns = useMemo(
    () => [
      {
        title: '楼层',
        dataIndex: 'floorCategoryId',
        render: value => {
          if (value) {
            return floorList.find(item => item.id === value)?.categoryName;
          }
        },
        width: 100,
      },
      {
        title: '区域',
        dataIndex: 'areaCategoryId',
        render: value => {
          if (value) {
            return areaList.find(item => item.id === value)?.categoryName;
          }
        },
        width: 100,
      },
      {
        title: '等级',
        dataIndex: 'levelCategoryId',
        render: value => {
          if (value) {
            return levelList.find(item => item.id === value)?.categoryName;
          }
        },
        width: 100,
      },
      {
        title: '排数',
        dataIndex: 'rowsNum',
        editable: {
          required: true,
          rules,
          node: <CountInput min={1} />,
        },
        width: 150,
      },
      {
        title: '排数名称',
        dataIndex: 'rowsName',
        // editable: {
        //   required: true,
        //   rules,
        //   node: <Input placeholder="请填写" />,
        // },
        width: 100,
      },
      {
        title: '座位号',
        dataIndex: 'seatValue',
        editable: {
          required: true,
          rules,
          node: <InputNumber placeholder="请填写" precision={0} min={1} />,
        },
        width: 100,
      },
      {
        title: '座位号名称',
        dataIndex: 'seatName',
        // 不直接使用seatName字段显示座位名称，但这里已经是由前端使用seatValue拼接的了
        // editable: {
        //   required: true,
        //   rules,
        //   node: <Input placeholder="请填写" />,
        // },
        width: 100,
      },
      {
        title: '座位号说明',
        dataIndex: 'seatDesc',
        editable: {
          node: <Input.TextArea placeholder="请填写" autoSize={{ minRows: 4 }} />,
        },
        render: value => value || '--',
        width: 100,
      },
    ],
    [floorList, areaList, levelList, rules]
  );
  // 暂时限制为仅支持单个完整区域

  const generate = useCallback(() => {
    form.validateFieldsAndScroll((err, formData) => {
      if (err) {
        return;
      }
      const { x, y, rowspan, colspan } = selectedArea;
      // 是纵向单行, 这里区分出来纵向单行是为了考虑情侣座合并，只有这种情况才纵向合并，其他都横向
      const isSingleVerticalLine = rowspan > 1 && colspan === 1;
      // quantity 是总空间数量
      const { genMode, quantity, seatUnit, rowsName, seatName, startFrom, ...restData } = formData;
      const { seatType } = restData;
      // 每个座位占的空间，情侣座占两个
      const atom = seatType === SeatTypes.COUPLE.key ? 2 : 1;
      // length是已经在InputNumber组件经过atom处理的
      const length = quantity || 0;
      // 不管座位最终left(x),top(y)是多少，seatColspan和seatRowspan是一样的
      const seatColspan = isSingleVerticalLine ? 1 : atom;
      const seatRowspan = isSingleVerticalLine ? atom : 1;
      const list = [];
      // let seatTop = y;
      // let seatLeft = x;
      switch (genMode) {
        // case GenerateMode.mtsb:
        //   for (let idx = 0; idx < length; idx += 1) {
        //     list[(idx + 1) % 2 === 0 ? 'unshift' : 'push']({
        //       seatValue: idx + 1,
        //     });
        //   }
        //   break;
        // case GenerateMode.mtss:
        //   for (let idx = length; idx > 0; idx -= 1) {
        //     list[idx % 2 === 0 ? 'unshift' : 'push']({
        //       seatValue: idx,
        //     });
        //   }
        //   break;
        case GenerateMode.ltr.key:
          for (let i = 0; i < length; i += 1) {
            if (isSingleVerticalLine) {
              list.push({
                seatValue: startFrom + i,
                seatLeft: x,
                seatTop: y + ((i * atom) % rowspan),
              });
            } else {
              // 当前行剩余
              const end = colspan - (list.length === 0 ? 0 : list[list.length - 1].seatLeft - x + atom);
              const left = end < atom || list.length === 0 ? 0 : colspan - end;
              list.push({
                seatValue: startFrom + i,
                seatLeft: x + left,
                // 不能直接(i * atom) / colspan来用，因为每一行末尾可能空位置，比如7个格子只能放3个情侣座(2x3=6)
                seatTop:
                  y +
                  //  Math.floor(colspan / atom) 一行几个
                  // list.length / Math.floor(colspan / atom) 用了几行
                  Math.floor(
                    (Math.floor(list.length / Math.floor(colspan / atom)) * colspan + // 整行占用的格子
                      (list.length % Math.floor(colspan / atom)) * atom) / // 剩余占用的格子
                      colspan
                  ),
              });
            }
          }
          break;
        case GenerateMode.rtl.key:
          for (let i = 0; i < length; i += 1) {
            if (isSingleVerticalLine) {
              list.push({
                seatValue: startFrom + i,
                seatLeft: x,
                seatTop: y + rowspan - 1 - ((i * atom) % rowspan) - (atom - 1),
              });
            } else {
              // 当前行剩余
              const end = list.length === 0 ? colspan : list[list.length - 1].seatLeft - x;
              const left = end < atom || list.length === 0 ? colspan - atom : end - atom;
              list.push({
                seatValue: startFrom + i,
                seatLeft: x + left,
                // 不能直接(i * atom) / colspan来用，因为每一行末尾可能空位置，比如7个格子只能放3个情侣座(2x3=6)
                seatTop:
                  y +
                  rowspan -
                  1 -
                  //  Math.floor(colspan / atom) 一行几个
                  // list.length / Math.floor(colspan / atom) 用了几行
                  Math.floor(
                    (Math.floor(list.length / Math.floor(colspan / atom)) * colspan + // 整行占用的格子
                      (list.length % Math.floor(colspan / atom)) * atom) / // 剩余占用的格子
                      colspan
                  ),
              });
            }
          }
          break;
        default:
      }
      setSeatList(
        list.map(({ seatValue, ...others }, i) => {
          const newSeat = {
            ...restData,
            ...others,
            // 方便比对未提交的座位的修改操作
            isNew: uuid(),
            index: i,
            // rowsName: `${restData.rowsNum}${rowsName}`,
            seatValue,
            // seatName: `${seatValue}${seatUnit}`,
            seatColspan,
            seatRowspan,
          };
          resetAnyCaseName(newSeat);
          return newSeat;
        })
      );
    });
  }, [selectedArea]);

  const seatType = form.getFieldValue('seatType');
  // 每个座位占的空间，情侣座占两个
  const atom = seatType === SeatTypes.COUPLE.key ? 2 : 1;

  let max; // undefined 不限制
  if (selectedArea) {
    const { rowspan, colspan } = selectedArea;
    // 是纵向单行, 这里区分出来纵向单行是为了考虑情侣座合并，只有这种情况才纵向合并，其他都横向
    const isSingleVerticalLine = rowspan > 1 && colspan === 1;
    max = isSingleVerticalLine ? Math.floor((rowspan * colspan) / atom) : Math.floor(colspan / atom) * rowspan;
  }

  return (
    <Modal
      title="批量添加座位"
      width={1333}
      {...restProps}
      visible={visible}
      onOk={() => {
        tableForm.validateFieldsAndScroll(async err => {
          if (err) {
            return;
          }
          onOk(seatList);
        });
        return false;
      }}
      footer={[
        <Button key="cancel" link="cancel">
          关闭
        </Button>,
        <Button key="primary" type="primary" link="ok" disabled={seatList.length === 0}>
          确认
        </Button>,
      ]}
    >
      <Row>
        <Col md={5}>
          <Form {...formItemLayout}>
            <Form.Item label="楼层">
              {form.getFieldDecorator('floorCategoryId', {
                initialValue: NoneKey,
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
            <Form.Item label="区域">
              {form.getFieldDecorator('areaCategoryId', {
                initialValue: NoneKey,
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
            <Form.Item label="等级">
              {form.getFieldDecorator('levelCategoryId', {
                initialValue: NoneKey,
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
            <Form.Item label="排数">
              {form.getFieldDecorator('rowsNum', {
                rules: [
                  {
                    required: true,
                    message: '请填写排数',
                  },
                ],
              })(<InputNumber placeholder="请填写" precision={0} min={1} className="full-width" />)}
            </Form.Item>
            <Form.Item label="排数单位">
              {form.getFieldDecorator('rowsName', {
                initialValue: '排',
                rules: [
                  {
                    required: true,
                    message: '请填写排数单位',
                  },
                ],
              })(<Input placeholder="请填写" disabled />)}
            </Form.Item>
            <Form.Item label="座位类型">
              {form.getFieldDecorator('seatType', {
                initialValue: SeatTypes.NORMAL.key,
              })(
                <Select placeholder="请选择">
                  {Object.values(SeatTypes).map(item => (
                    <Select.Option key={item.key} value={item.key}>
                      {item.value}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="座位属性">
              {form.getFieldDecorator('seatProperty', {
                initialValue: SeatFeatTypes.NORMAL.key,
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
            <Form.Item label="排序">
              {form.getFieldDecorator('ranks', {
                initialValue: 0,
              })(<InputNumber placeholder="请填写" precision={0} className="full-width" />)}
            </Form.Item>
            <Form.Item label="备注">
              {form.getFieldDecorator('descr')(<Input.TextArea placeholder="请填写" autoSize={{ minRows: 4 }} />)}
            </Form.Item>
          </Form>
        </Col>
        <Col md={19}>
          <MarginBar left>
            <Form {...formItemLayout}>
              <BatchNewSeatGenFormHeader
                GenerateMode={GenerateMode}
                max={max}
                form={form}
                generate={generate}
                clear={() => setSeatList([])}
              />
            </Form>
            <MarginBar top>
              <TableComp
                rowKey="index"
                form={tableForm}
                countColsWidth
                columns={columns}
                dataSource={seatList}
                onEdit={record => {
                  const newList = [...seatList];
                  resetAnyCaseName(record);
                  newList[record.index] = record;
                  setSeatList(newList);
                }}
                bordered
                pagination={false}
                scroll={{ y: 387 }}
              />
            </MarginBar>
          </MarginBar>
        </Col>
      </Row>
    </Modal>
  );
}

// 为了给table一个独立的form
const BatchNewSeatModalWithForm = Form.create()(BatchNewSeatModal);

function MultipleFormAdhesive({ form, ...rest }) {
  return <BatchNewSeatModalWithForm tableForm={form} {...rest} />;
}
export default Form.create()(MultipleFormAdhesive);
