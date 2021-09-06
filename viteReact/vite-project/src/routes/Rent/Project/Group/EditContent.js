import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Form, Select, Input, InputNumber } from 'antd';
import Content from '@/components/Datatable/Content';
import ColorPicker from '@/components/Form/FormItem/ColorPicker';
import { formItemLayoutNormal } from '@/utils/utils';

function EditContent({ form, sure, cancel, isEdit, selectedRows, fetchGroupList, ...restProps }) {
  const { getFieldDecorator, validateFieldsAndScroll, getFieldValue } = form;
  const dispatch = useDispatch();
  const [groupList, setGroupList] = useState([]);
  const { LeaseTypes, RentGroupStates } = useSelector(state => state.rent);
  const { ProfessionTypes = {}, list = [] } = useSelector(state => state.venue);
  const saving = useSelector(state => state.loading.effects['rent/editOrAddLeaseGroup']);
  const editObj = isEdit ? (selectedRows || [])[0] || {} : {};

  useEffect(() => {
    fetchGroupList(setGroupList, true);
  }, []);

  const parentId = getFieldValue('parentId');
  const parentGroup = parentId ? groupList.find(item => item.id === parentId) : null;

  return (
    <Content
      title={`${isEdit ? '编辑' : '添加'}分组`}
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
              await dispatch({
                type: 'rent/editOrAddLeaseGroup',
                payload: {
                  ...formData,
                  id: editObj.id,
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
            <Form.Item label="父级编号">
              {getFieldDecorator('parentId', {
                initialValue: editObj.parentId || 0,
              })(
                <Select placeholder="请选择" disabled={isEdit}>
                  {[
                    {
                      id: 0,
                      groupName: '无',
                    },
                    ...groupList,
                  ].map(item => (
                    <Select.Option value={item.id} key={item.id}>
                      {item.groupName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item label="分组名称">
              {getFieldDecorator('groupName', {
                initialValue: editObj.groupName,
                rules: [
                  {
                    required: true,
                    message: '请填写分组名称',
                  },
                ],
              })(<Input placeholder="请填写分组名称" />)}
            </Form.Item>
          </Col>
          {parentGroup == null && (
            <>
              <Col md={8}>
                <Form.Item label="租赁类型">
                  {getFieldDecorator('leaseType', {
                    initialValue: editObj.leaseType,
                    rules: [
                      {
                        required: true,
                        message: '请选择',
                      },
                    ],
                  })(
                    <Select placeholder="请选择">
                      {Object.values(LeaseTypes).map(item => (
                        <Select.Option value={item.key} key={item.key}>
                          {item.value}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item label="营销中心">
                  {getFieldDecorator('salesId', {
                    initialValue: editObj.salesId,
                    rules: [
                      {
                        required: true,
                        message: '请选择',
                      },
                    ],
                  })(
                    <Select placeholder="请选择">
                      {list.map(item => (
                        <Select.Option value={item.id} key={item.id}>
                          {item.salesName}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item label="专业项目">
                  {getFieldDecorator('professionalId', {
                    initialValue: editObj.professionalId,
                    rules: [
                      {
                        required: true,
                        message: '请选择',
                      },
                    ],
                  })(
                    <Select placeholder="请选择">
                      {Object.values(ProfessionTypes).map(item => (
                        <Select.Option value={item.key} key={item.key}>
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
            <Form.Item label="状态">
              {getFieldDecorator('groupState', {
                initialValue: editObj.groupState,
                rules: [
                  {
                    required: true,
                    message: '请选择状态',
                  },
                ],
              })(
                <Select placeholder="请选择">
                  {Object.values(RentGroupStates).map(item => (
                    <Select.Option value={item.key} key={item.key}>
                      {item.value}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item label="行数">
              {getFieldDecorator('projectRows', {
                initialValue: editObj.projectRows || 1,
                rules: [
                  {
                    required: true,
                    message: '请填写行数',
                  },
                ],
              })(<InputNumber min={1} precision={0} placeholder="请填写" className="full-width" />)}
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item label="列数">
              {getFieldDecorator('projectCols', {
                initialValue: editObj.projectCols || 1,
                rules: [
                  {
                    required: true,
                    message: '请填写列数',
                  },
                ],
              })(<InputNumber min={1} precision={0} placeholder="请填写" className="full-width" />)}
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item label="颜色">
              {getFieldDecorator('groupColor', {
                initialValue: editObj.groupColor,
                rules: [
                  {
                    required: true,
                    message: '请选择颜色',
                  },
                  {
                    message: '请设置为非透明色',
                    validator(rule, value, fn) {
                      if (value === ColorPicker.Transparent) {
                        fn([new Error('invalid')]);
                        return;
                      }
                      fn();
                    },
                  },
                ],
              })(<ColorPicker />)}
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item label="排序">
              {getFieldDecorator('ranks', {
                initialValue: editObj.ranks,
              })(<InputNumber precision={0} placeholder="请填写" className="full-width" />)}
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item label="备注">
              {getFieldDecorator('descr', {
                initialValue: editObj.descr,
              })(<Input.TextArea rows={4} />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Content>
  );
}

export default Form.create()(EditContent);
