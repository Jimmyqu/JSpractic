import { useEffect, useState, useCallback } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Form, Collapse, Select, Input, Button } from 'antd';
import VenueSwitcher from '@/components/VenueSwitcher';
import MarginBar from '@/components/MarginBar';
import Item, { ItemTypes } from '@/components/Datatable/Item';
import FooterToolbar from '@/components/FooterToolbar';
import { formatDate, formatHM, formatWeekDaySeries, formatWeekDay } from '@/utils/format';
import { useComposeMapping } from '@/utils/hooks';
import { clearHMS } from '@/utils/utils';
import ResultModal from '../../Forever/Profile/ResultModal';

function AddLock({ form }, { popView }) {
  const dispatch = useDispatch();
  const [composeStateMapping, setComposeStateMapping, handleComposeStateChange] = useComposeMapping();
  const saving = useSelector(state => state.loading.effects['pubplatform/addNewPlatformLock']);
  const { currentUser } = useSelector(state => state.user);
  const { VenueTypes, currentVenue, itemList } = useSelector(state => state.venue);
  const { salesInfoMapping } = useSelector(state => state.pubplatform);

  const [visible, setVisible] = useState();
  const [lockResult, setLockresult] = useState();

  const salesInfo = salesInfoMapping[currentVenue.id] || {};
  const availableItems = (itemList || []).filter(item =>
    (salesInfo.commonSalesItemInfoList || []).some(
      salesItemList => salesItemList.commonSalesItem && salesItemList.commonSalesItem.itemId === item.itemId
    )
  );

  const currentItemInfo =
    (salesInfo.commonSalesItemInfoList || []).find(
      salesItemList =>
        salesItemList.commonSalesItem && salesItemList.commonSalesItem.itemId === form.getFieldValue('salesItemId')
    ) || {};

  const currentPlatformType = form.getFieldValue('platformType');

  const currentTimeTagInfo =
    (currentItemInfo.commonSalesItemCalendarList || []).find(item => item.tagId === form.getFieldValue('timeTagId')) ||
    {};

  const currentCalendarInfo =
    (currentTimeTagInfo.commonCalendarInfoList || []).find(item => item.id === form.getFieldValue('calendarInfoId')) ||
    {};

  const nowDate = clearHMS(moment()).valueOf();
  const { startDate: s, endDate: e, commonCalendarInfoList } = currentTimeTagInfo;
  const startDate = s ? clearHMS(moment(s)).valueOf() : null;
  const endDate = e ? clearHMS(moment(e)).valueOf() : null;
  const disabled = endDate <= nowDate;

  const handleCalendarChange = useCallback(() => {
    form.setFieldsValue({
      weekDateList: undefined,
      startTime: undefined,
      endTime: undefined,
    });
  }, [form]);

  const handleTimeTagChange = useCallback(() => {
    form.setFieldsValue({
      calendarInfoId: undefined,
      startDate: undefined,
      endDate: undefined,
    });
    setComposeStateMapping({});
    handleCalendarChange();
  }, [form, setComposeStateMapping, handleCalendarChange]);

  const handlePlatformTypeChange = useCallback(() => {
    form.setFieldsValue({
      platformIdList: undefined,
    });
  }, [form]);

  const handleItemChange = useCallback(() => {
    form.setFieldsValue({
      platformType: undefined,
      timeTagId: undefined,
    });
    handlePlatformTypeChange();
    handleTimeTagChange();
  }, [form, handlePlatformTypeChange, handleTimeTagChange]);

  const closeResult = useCallback(() => {
    if ((lockResult || []).some(({ success }) => success)) {
      popView(true);
      return;
    }
    setTimeout(() => {
      setVisible(false);
    }, 0);
  }, [popView, setVisible, lockResult]);

  useEffect(() => {
    dispatch({
      type: 'pubplatform/fetchSalesInfo',
    });
  }, []);

  return (
    <>
      <MarginBar top>
        <Form>
          <Collapse defaultActiveKey={['1', '2', '3']}>
            <Collapse.Panel header="选择类型" key="1">
              <Row>
                <Col md={6} />
                <Col md={12}>
                  <VenueSwitcher filter={item => item.salesType === VenueTypes.SPORTPLATFORM.key} />
                </Col>
              </Row>
              <Row>
                <Col md={6} />
                <Col md={12}>
                  <Form.Item label="选择运动类型">
                    {form.getFieldDecorator('salesItemId', {
                      rules: [
                        {
                          required: true,
                          message: '请选择运动类型',
                        },
                      ],
                    })(
                      <Select placeholder="请选择" onChange={handleItemChange}>
                        {availableItems.map(item => (
                          <Select.Option value={item.itemId} key={item.itemId}>
                            {item.itemIdValue}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col md={6} />
                <Col md={12}>
                  <Form.Item label="预订全场或半场">
                    {form.getFieldDecorator('platformType', {
                      rules: [
                        {
                          required: true,
                          message: '请选择全场或半场',
                        },
                      ],
                    })(
                      <Select
                        placeholder="请选择"
                        notFoundContent="请先选择运动类型"
                        onChange={handlePlatformTypeChange}
                      >
                        {(currentItemInfo.sportPlatformList || []).some(item => item.parentId > 0) && (
                          <Select.Option value={1}>半场</Select.Option>
                        )}
                        <Select.Option value={2}>全场</Select.Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col md={6} />
                <Col md={12}>
                  <Form.Item label="选择场地">
                    {form.getFieldDecorator('platformIdList', {
                      rules: [
                        {
                          required: true,
                          message: '请选择场地',
                        },
                      ],
                    })(
                      <Select
                        placeholder="请选择"
                        // notFoundContent="请先选择运动类型和全半场类型"
                        mode="multiple"
                      >
                        {(currentItemInfo.sportPlatformList || [])
                          .filter(item => (currentPlatformType === 1 ? item.parentId > 0 : item.parentId === 0))
                          .map(item => (
                            <Select.Option value={item.id} key={item.id}>
                              {item.parentPlatformName ? `${item.parentPlatformName}-` : ''}
                              {item.platformName}
                            </Select.Option>
                          ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Collapse.Panel>
            <Collapse.Panel header="选择时间" key="2">
              <Row>
                <Col md={6} />
                <Col md={12}>
                  <Form.Item label="选择时间段">
                    {form.getFieldDecorator('timeTagId', {
                      rules: [
                        {
                          required: true,
                          message: '请选择时间段',
                        },
                      ],
                    })(
                      <Select placeholder="请选择" notFoundContent="请先选择运动类型" onChange={handleTimeTagChange}>
                        {(currentItemInfo.commonSalesItemCalendarList || []).map(item => (
                          <Select.Option
                            value={item.tagId}
                            key={item.tagId}
                            title={`${item.tagName}(${formatDate(item.startDate)}至
                              ${formatDate(item.endDate)})`}
                          >
                            {item.tagName}({formatDate(item.startDate)}至{formatDate(item.endDate)})
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col md={6} />
                <Col md={12}>
                  <Form.Item label="选择星期段">
                    {form.getFieldDecorator('calendarInfoId', {
                      rules: [
                        {
                          required: true,
                          message: '请选择星期段',
                        },
                      ],
                    })(
                      <Select placeholder="请选择" notFoundContent="请先选择时间段" onChange={handleCalendarChange}>
                        {(commonCalendarInfoList || []).map(item => (
                          <Select.Option value={item.id} key={item.id}>
                            {formatWeekDaySeries(item.weekDate)}({formatHM(item.startTime)}-{formatHM(item.endTime)})
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col md={6} />
                <Col md={12}>
                  <Form.Item label="选择星期几">
                    {form.getFieldDecorator('weekDateList', {
                      rules: [
                        {
                          required: true,
                          message: '请选择星期几',
                        },
                      ],
                    })(
                      <Select
                        placeholder="请选择"
                        // notFoundContent="请先选择星期段"
                        mode="multiple"
                      >
                        {(currentCalendarInfo.weekDateList || []).map(item => (
                          <Select.Option value={item} key={item}>
                            {formatWeekDay(item)}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col md={6} />
                <Col md={12}>
                  <Row gutter={16}>
                    <Col md={12}>
                      <Form.Item label="开始日期">
                        {form.getFieldDecorator('startDate', {
                          rules: [
                            {
                              required: true,
                              message: '请选择开始日期',
                            },
                          ],
                        })(
                          <Item
                            compose="1"
                            type={ItemTypes.DatePickerRangeStart}
                            form={form}
                            disabled={disabled}
                            min={moment(Math.max(startDate, nowDate))}
                            max={endDate ? moment(endDate) : undefined}
                            className="full-width"
                            composeStateMapping={composeStateMapping}
                            handleComposeStateChange={handleComposeStateChange}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col md={12}>
                      <Form.Item label="结束日期">
                        {form.getFieldDecorator('endDate', {
                          rules: [
                            {
                              required: true,
                              message: '请选择结束日期',
                            },
                          ],
                        })(
                          <Item
                            compose="1"
                            type={ItemTypes.DatePickerRangeEnd}
                            form={form}
                            disabled={disabled}
                            min={moment(Math.max(startDate, nowDate))}
                            max={endDate ? moment(endDate) : undefined}
                            className="full-width"
                            composeStateMapping={composeStateMapping}
                            handleComposeStateChange={handleComposeStateChange}
                          />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col md={6} />
                <Col md={12}>
                  <Row gutter={16}>
                    <Col md={12}>
                      <Form.Item label="开始时间">
                        {form.getFieldDecorator('startTime', {
                          rules: [
                            {
                              required: true,
                              message: '请选择开始时间',
                            },
                          ],
                        })(
                          <Item
                            compose="2"
                            disabled={disabled}
                            type={ItemTypes.TimePickerRangeStart2}
                            form={form}
                            minuteStep={currentCalendarInfo.minuteStep}
                            min={currentCalendarInfo.startTime ? moment(currentCalendarInfo.startTime) : undefined}
                            max={currentCalendarInfo.endTime ? moment(currentCalendarInfo.endTime) : undefined}
                            composeStateMapping={composeStateMapping}
                            handleComposeStateChange={handleComposeStateChange}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col md={12}>
                      <Form.Item label="结束时间">
                        {form.getFieldDecorator('endTime', {
                          rules: [
                            {
                              required: true,
                              message: '请选择结束时间',
                            },
                          ],
                        })(
                          <Item
                            compose="2"
                            disabled={disabled}
                            type={ItemTypes.TimePickerRangeEnd2}
                            form={form}
                            minuteStep={currentCalendarInfo.minuteStep}
                            min={currentCalendarInfo.startTime ? moment(currentCalendarInfo.startTime) : undefined}
                            max={currentCalendarInfo.endTime ? moment(currentCalendarInfo.endTime) : undefined}
                            composeStateMapping={composeStateMapping}
                            handleComposeStateChange={handleComposeStateChange}
                          />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Collapse.Panel>
            <Collapse.Panel header="锁场用户信息" key="3">
              <Row>
                <Col md={6} />
                <Col md={12}>
                  <Row gutter={16}>
                    <Col md={12}>
                      <Form.Item label="用户手机号码">
                        <Input disabled value={currentUser.sysUser.mobile} />
                      </Form.Item>
                    </Col>
                    <Col md={12}>
                      <Form.Item label="锁场用户名">
                        <Input disabled value={currentUser.sysUser.realName} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col md={6} />
                <Col md={12}>
                  <Form.Item label="锁场备注">
                    {form.getFieldDecorator('userMessage')(
                      <Input.TextArea rows={3} placeholder="请填写（限50个字符）" maxLength={50} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col md={6} />
                <Col md={12}>
                  <Form.Item label="商家备注">
                    {form.getFieldDecorator('sellerMessage')(
                      <Input.TextArea rows={3} placeholder="限16个字符，客户端将显示" maxLength={16} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Collapse.Panel>
          </Collapse>
        </Form>
      </MarginBar>
      <ResultModal
        title="设置结果-锁场"
        visible={visible}
        data={lockResult}
        onOk={closeResult}
        onCancel={closeResult}
        onVisibleChange={setVisible}
      />
      <FooterToolbar>
        <MarginBar left top inline>
          <Button disabled={saving} onClick={popView}>
            取消
          </Button>
        </MarginBar>
        <MarginBar left top inline>
          <Button
            type="primary"
            loading={saving}
            onClick={() => {
              setLockresult();
              form.validateFieldsAndScroll(async (err, formData) => {
                if (err) {
                  return;
                }
                const formValues = { ...formData };
                const { startTime: st, endTime: et, calendarInfoId } = formValues;
                const startTime = st ? moment(st) : null;
                const endTime = et ? moment(et) : null;
                if (formValues.startDate) {
                  formValues.startDate.second(0).millisecond(0);
                  if (startTime) {
                    formValues.startDate.hour(startTime.hours()).minute(startTime.minutes());
                  }
                }

                if (formValues.endDate) {
                  formValues.endDate.second(0).millisecond(0);
                  if (endTime) {
                    formValues.endDate.hour(endTime.hours()).minute(endTime.minutes());
                  }
                }
                delete formValues.startTime;
                delete formValues.endTime;
                delete formValues.calendarInfoId;
                const override = {};
                Object.keys(formValues).forEach(key => {
                  const value = formValues[key];
                  if (moment.isMoment(value)) {
                    override[key] = value.valueOf();
                  }
                });
                const result = await dispatch({
                  type: 'pubplatform/addNewPlatformLock',
                  payload: {
                    ...formValues,
                    ...override,
                    calendarId: calendarInfoId.split('-')[0],
                  },
                });
                if (result) {
                  setLockresult(result);
                  setVisible(true);
                }
              });
            }}
          >
            确定提交
          </Button>
        </MarginBar>
      </FooterToolbar>
    </>
  );
}

AddLock.contextTypes = {
  // pushView: PropTypes.func,
  popView: PropTypes.func,
};

export default Form.create()(AddLock);
