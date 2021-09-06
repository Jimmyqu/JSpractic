import { useEffect, useState } from 'react';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { Form, Select, DatePicker, Input, message } from 'antd';
import Modal from '@/components/Modal';
import Item, { ItemTypes } from '@/components/Datatable/Item';
import { formItemLayoutNormal } from '@/utils/utils';
import { formatDate, formatHM } from '@/utils/format';
import { useComposeMapping } from '@/utils/hooks';
import { modal } from '@/utils/feedback';

const EditModes = {
  Add: {
    key: 0,
    value: '新增排期',
  },
  Move: {
    key: 1,
    value: '调整排期',
  },
  Delete: {
    key: 2,
    value: '删除排期',
  },
};

function EditScheduleModal({ courseDataId: nowId, form, referData, date, onOk = () => {}, visible, ...restProps }) {
  const dispatch = useDispatch();

  const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
  const { courseDataId = nowId, classStartTime = date, classEndTime = date, descr } = referData || {};

  const [composeStateMapping, setComposeStateMapping, handleComposeStateChange] = useComposeMapping();
  const [platformList, setPlatformList] = useState();
  const [teacherList, setTeacherList] = useState();

  const operation = getFieldValue('operation');
  const startTime = getFieldValue('classStartTime');
  const endTime = getFieldValue('classEndTime');

  useEffect(() => {
    if (!visible) {
      setComposeStateMapping({});
    }
  }, [visible]);

  useEffect(() => {
    setFieldsValue({
      platformIds: undefined,
    });
    if (startTime == null || endTime == null) {
      return;
    }
    if (operation !== EditModes.Add.key) {
      return;
    }
    dispatch({
      type: 'pubcourse/fetchAllPlatformByCourseDataId',
      payload: {
        courseDataId,
        startTime,
        endTime,
      },
    }).then(setPlatformList);
  }, [operation, startTime, endTime]);

  useEffect(() => {
    setComposeStateMapping({});
    const obj = {
      platformIds: undefined,
      userIds: undefined,
    };
    setFieldsValue(
      operation === EditModes.Delete.key
        ? obj
        : {
            ...obj,
            descr,
          }
    );
    if (operation !== EditModes.Add.key) {
      return;
    }
    dispatch({
      type: 'pubcourse/fetchAllTeacherByCourseDataId',
      payload: {
        courseDataId,
      },
    }).then(setTeacherList);
  }, [operation]);

  return (
    <Modal
      title="调整排期"
      visible={visible}
      {...restProps}
      onOk={arg => {
        const { deepCallOk, setConfirmLoading } = arg;
        form.validateFieldsAndScroll(async (err, formData) => {
          if (err) {
            return;
          }
          const { classDate } = formData;
          const useDate = classDate ? classDate.valueOf() : date;

          const fn = () => {
            setConfirmLoading(true);

            return dispatch({
              type: 'pubcourse/addOrUpdateCourseSchedule',
              payload: {
                ...formData,
                classDate: useDate,
                courseDataId,
              },
            }).then(() => {
              message.success('修改成功');
              deepCallOk();
              onOk(arg, formData);
            });
          };

          deepCallOk(async () => {
            let isExistsTime = false;
            if (operation === EditModes.Add.key || operation === EditModes.Move.key) {
              isExistsTime = await dispatch({
                type: 'pubcourse/ToCheckIsExistsTime',
                payload: {
                  courseDataId: nowId,
                  modifyId: referData ? courseDataId : null, // 不直接使用courseDataId，因为它有默认值=nowId
                  classDate: useDate,
                  // 开始时间和结束时间是当前操作日期参考的时间，使用了stepReferDate
                  startTime,
                  endTime,
                  operation, // 碰巧和这边的EditModes值一样而已
                },
              });
            }
            if (isExistsTime == null) {
              return false;
            }
            if (isExistsTime) {
              modal.confirm(
                '您选择的排期时间已有相同排期数据正在使用，请您确认是否仍需要继续添加此排期课程，若“是”请点击确认！',
                {
                  onOk() {
                    fn(true);
                  },
                }
              );
              return false;
            }
            return fn();
          });
        });
        return false;
      }}
    >
      <Form {...formItemLayoutNormal}>
        <Form.Item label="调整类型">
          {getFieldDecorator('operation', {
            rules: [
              {
                required: true,
                message: '请选择调整类型',
              },
            ],
          })(
            <Select placeholder="请选择">
              {Object.values(EditModes)
                .filter(item => item.key === EditModes.Add.key || referData != null)
                .map(({ key, value }) => (
                  <Select.Option value={key} key={key}>
                    {value}
                  </Select.Option>
                ))}
            </Select>
          )}
        </Form.Item>
        {operation === EditModes.Add.key && (
          <Form.Item label="已选日期">
            <span className="red">{formatDate(date)}</span>
          </Form.Item>
        )}
        {(operation === EditModes.Move.key || operation === EditModes.Delete.key) && (
          <Form.Item label="已选排期">
            <span className="red">
              {formatDate(date)} {formatHM(classStartTime)}-{formatHM(classEndTime)}
            </span>
          </Form.Item>
        )}

        {operation === EditModes.Move.key && (
          <Form.Item label="课程日期">
            {getFieldDecorator('classDate', {
              initialValue: moment(date),
              rules: [
                {
                  required: true,
                  message: '请选择课程日期',
                },
              ],
            })(<DatePicker />)}
          </Form.Item>
        )}
        {(operation === EditModes.Add.key || operation === EditModes.Move.key) && (
          <Form.Item label="课程时间" className="form-item-pair" required>
            <Form.Item>
              {getFieldDecorator('classStartTime', {
                initialValue: operation === EditModes.Move.key ? classStartTime : undefined,
                rules: [
                  {
                    required: true,
                    message: '请选择课程开始时间',
                  },
                ],
              })(
                <Item
                  compose="1"
                  minuteStep={5}
                  stepReferDate={classStartTime}
                  type={ItemTypes.TimePickerRangeStart2}
                  form={form}
                  composeStateMapping={composeStateMapping}
                  handleComposeStateChange={handleComposeStateChange}
                />
              )}
            </Form.Item>
            <span>-</span>
            <Form.Item>
              {getFieldDecorator('classEndTime', {
                initialValue: operation === EditModes.Move.key ? classEndTime : undefined,
                rules: [
                  {
                    required: true,
                    message: '请选择课程结束时间',
                  },
                ],
              })(
                <Item
                  compose="1"
                  minuteStep={5}
                  stepReferDate={classEndTime}
                  type={ItemTypes.TimePickerRangeEnd2}
                  form={form}
                  composeStateMapping={composeStateMapping}
                  handleComposeStateChange={handleComposeStateChange}
                />
              )}
            </Form.Item>
          </Form.Item>
        )}
        {operation === EditModes.Add.key && (
          <>
            <Form.Item label="场地">
              {getFieldDecorator('platformIds', {
                rules: [
                  {
                    required: true,
                    message: '请选择场地',
                  },
                ],
              })(
                <Select placeholder="请选择" mode="multiple">
                  {(platformList || []).map(({ id, parentPlatformName, platformName }) => (
                    <Select.Option key={id} value={id}>
                      {parentPlatformName}
                      {parentPlatformName ? '-' : ''}
                      {platformName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="教职人员">
              {getFieldDecorator('userIds', {
                rules: [
                  {
                    required: true,
                    message: '请选择教职人员',
                  },
                ],
              })(
                <Select placeholder="请选择" mode="multiple">
                  {(teacherList || []).map(({ id, realName, mobile }) => (
                    <Select.Option key={id} value={id}>
                      {realName}/{mobile}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </>
        )}
        <Form.Item label="排期数据说明">
          {operation === EditModes.Delete.key
            ? descr
            : getFieldDecorator('descr', {
                initialValue: descr,
              })(<Input.TextArea placeholder="请填写" row={4} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default Form.create()(EditScheduleModal);
