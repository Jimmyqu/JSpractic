import { useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Form, Input, Select, InputNumber } from 'antd';
import Content from '@/components/Datatable/Content';
import { formItemLayoutNormal } from '@/utils/utils';

function EditContent({ form, sure, cancel, selectedRows, isEdit, isMultiEdit, groupList, ...restProps }) {
  const { getFieldDecorator, validateFieldsAndScroll } = form;
  const [priceGroupList, setPriceGroupList] = useState();
  const fetching = useSelector(state => state.loading.effects['rent/queryLeasePriceGroupList']);
  const saving = useSelector(state => state.loading.effects['rent/editOrAddLeaseProject']);
  const batchSaving = useSelector(state => state.loading.effects['rent/editLeaseProjects']);
  const dispatch = useDispatch();

  const editObj = isEdit ? (selectedRows || [])[0] || {} : {};

  useEffect(() => {
    dispatch({
      type: 'rent/queryLeasePriceGroupList',
    }).then(setPriceGroupList);
  }, []);

  const title = useMemo(() => {
    if (isMultiEdit) {
      return '批量修改';
    }
    if (isEdit) {
      return '修改';
    }
    return '添加';
  }, [isMultiEdit, isEdit]);

  return (
    <Content
      title={title}
      {...restProps}
      buttons={[
        {
          text: '取消',
          disabled: saving || batchSaving || fetching,
          action: cancel,
        },
        {
          text: '确定',
          type: 'primary',
          disabled: fetching,
          loading: saving || batchSaving,
          action() {
            validateFieldsAndScroll(async (err, formData) => {
              if (err) {
                return;
              }
              await (isMultiEdit
                ? dispatch({
                    type: 'rent/editLeaseProjects',
                    payload: selectedRows.map(item => ({
                      ...formData,
                      id: item.id,
                    })),
                  })
                : dispatch({
                    type: 'rent/editOrAddLeaseProject',
                    payload: {
                      ...formData,
                      id: editObj.id,
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
          {!isMultiEdit && (
            <>
              <Col md={8}>
                <Form.Item label="名称">
                  {getFieldDecorator('projectName', {
                    initialValue: editObj.projectName,
                    rules: [
                      {
                        required: true,
                        message: '请填写名称',
                      },
                    ],
                  })(<Input placeholder="请填写名称" />)}
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item label="单位">
                  {getFieldDecorator('projectUnit', {
                    initialValue: editObj.projectUnit,
                    rules: [
                      {
                        required: true,
                        message: '请填写单位',
                      },
                    ],
                  })(<Input placeholder="请填写单位" />)}
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item label="卡号">
                  {getFieldDecorator('projectNumber', {
                    initialValue: editObj.projectNumber,
                  })(<Input placeholder="请填写卡号" />)}
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item label="排序">
                  {getFieldDecorator('ranks', {
                    initialValue: editObj.ranks,
                  })(<InputNumber precision={0} placeholder="请填写" className="full-width" />)}
                </Form.Item>
              </Col>
            </>
          )}
          <Col md={8}>
            <Form.Item label="租赁分组">
              {getFieldDecorator('groupId', {
                initialValue: editObj.groupId,
                rules: [
                  {
                    required: true,
                    message: '请选择',
                  },
                ],
              })(
                <Select placeholder="请选择">
                  {(groupList || []).map(item => (
                    <Select.Option value={item.id} key={item.id}>
                      {item.groupName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item label="价格分组">
              {getFieldDecorator('priceGroupId', {
                initialValue: editObj.priceGroupId,
                rules: [
                  {
                    required: true,
                    message: '请选择',
                  },
                ],
              })(
                <Select placeholder="请选择">
                  {(priceGroupList || []).map(item => (
                    <Select.Option value={item.id} key={item.id}>
                      {item.priceGroupName}
                    </Select.Option>
                  ))}
                </Select>
              )}
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
