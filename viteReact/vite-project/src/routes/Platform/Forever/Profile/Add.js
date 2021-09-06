import { Component } from 'react';
import moment from 'moment';
import { Card, Collapse, Form, Select, Row, Col, Input, Button, Checkbox } from 'antd';
import { connect } from 'react-redux';
import { push, goBack } from 'connected-react-router';
import FooterToolbar from '@/components/FooterToolbar';
import MarginBar from '@/components/MarginBar';
import VenueSwitcher from '@/components/VenueSwitcher';
import Item, { ItemTypes } from '@/components/Datatable/Item';
import FetchUserSelect from '@/components/FetchUser/FetchUserSelect';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import AmountInput from '@/components/Amount/Input';
import { formatDate, formatHM, formatWeekDay, formatWeekDaySeries, formatModel, encodeMoney } from '@/utils/format';
import { clearHMS } from '@/utils/utils';
import ResultModal from './ResultModal';
import style from './index.less';

const { Panel } = Collapse;

@connect(({ venue, pubplatform, loading }) => ({
  venue,
  pubplatform,
  fetchUserLoading: loading.effects['pubuser/fetchUserByKey'],
  saving: loading.effects['pubplatform/addNewPlatformForever'],
}))
@Form.create()
class ForeverAdd extends Component {
  timePickerFormat = 'HH:mm';

  state = {
    composeStateMapping: {},

    visible: false,

    result: undefined,
    checked: false,

    pubAccountItemList: null,
  };

  componentDidMount() {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'pubplatform/fetchSalesInfo',
    }).then(() => {
      const list = this.getAvailableItems();
      const salesItemId = list[0]?.itemId;
      const currentItemInfo = this.getCurrentItemInfo(salesItemId);
      // platformType=2才这样过滤
      // const firstPlatform = (currentItemInfo?.sportPlatformList || []).find(item => item.parentId === 0);
      form.setFieldsValue({
        salesItemId,
        // 2 静态的一定有
        platformType: 2,
        // platformIdList: firstPlatform?.id,
        timeTagId: currentItemInfo?.commonSalesItemCalendarList?.[0]?.tagId,
      });
      dispatch({
        type: 'pubplatform/fetchPubserviceUserList',
        payload: salesItemId,
      });
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleItemChange = value => {
    const { form, dispatch } = this.props;
    form.setFieldsValue({
      // 2 静态的一定有
      platformType: 2,
      timeTagId: undefined,
      sportPlatformUserIdList: undefined,
      price: undefined,
    });
    dispatch({
      type: 'pubplatform/fetchPubserviceUserList',
      payload: value,
    });
    this.handlePlatformTypeChange();
    this.handleTimeTagChange();
  };

  handlePlatformTypeChange = () => {
    const { form } = this.props;
    form.setFieldsValue({
      platformIdList: undefined,
    });
    this.handlePlatformChange([], []);
  };

  handlePlatformChange = (value, allList) => {
    const hasFight = (allList || []).filter(item => value.includes(item.id)).some(item => item.isFight > 0);
    this.setState(
      () => ({
        hasFight,
      }),
      this.reloadSportTeamInfo
    );
  };

  handleTimeTagChange = () => {
    const { form } = this.props;
    form.setFieldsValue({
      calendarInfoId: undefined,
      startDate: undefined,
      endDate: undefined,
    });
    this.setState({
      composeStateMapping: {},
    });
    this.handleCalendarChange();
  };

  handleCalendarChange = () => {
    const { form } = this.props;
    form.setFieldsValue({
      weekDateList: undefined,
      startTime: undefined,
      endTime: undefined,
    });
  };

  handlePriceChange = e => {
    this.setState({
      checked: e.target.checked,
    });
  };

  handleSave = () => {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      const formValues = { ...formData };
      const { startDate, startTime: st, endDate, endTime: et, calendarInfoId, price } = formValues;
      const startTime = st ? moment(st) : null;
      const endTime = et ? moment(et) : null;
      if (startDate) {
        startDate.second(0).millisecond(0);
        if (startTime) {
          startDate.hour(startTime.hours()).minute(startTime.minutes());
        }
      }

      if (endDate) {
        endDate.second(0).millisecond(0);
        if (endTime) {
          endDate.hour(endTime.hours()).minute(endTime.minutes());
        }
      }

      if (price) {
        formValues.price = encodeMoney(price);
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
        type: 'pubplatform/addNewPlatformForever',
        payload: {
          ...formValues,
          ...override,
          calendarId: calendarInfoId.split('-')[0],
        },
      });
      if (result) {
        this.setState({
          visible: true,
          result,
        });
      }
    });
  };

  handleComposeStateChange = (obj, compose) => {
    if (compose == null) {
      return;
    }
    // 使用函数方式setState, 兼容初始化值并发修改
    this.setState(({ composeStateMapping }) => ({
      composeStateMapping: {
        ...composeStateMapping,
        [compose]: {
          ...composeStateMapping[compose],
          ...obj,
        },
      },
    }));
  };

  handlePubAccountChange = id => {
    const { form } = this.props;
    form.setFieldsValue({
      pubAccountId: id,
    });
    this.reloadSportTeamInfo(id);
  };

  reloadSportTeamInfo = async id => {
    const { form, dispatch } = this.props;
    const { hasFight } = this.state;
    if (!hasFight) {
      return;
    }
    const itemId = form.getFieldValue('salesItemId');
    const pubAccountId = id || form.getFieldValue('pubAccountId');
    const result = await dispatch({
      type: 'pubplatform/fetchSportTeam',
      payload: {
        pubAccountId,
        professionalId: itemId,
      },
    });
    this.setState({
      sportTeamInfo: result,
    });
  };

  handleCancel = () => {
    if (window.opener && window.opener !== window) {
      window.close();
      return;
    }
    const { dispatch } = this.props;
    dispatch(goBack());
  };

  handleVisibleChange = visible => {
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      visible,
    });
  };

  sure = () => {
    const { dispatch } = this.props;
    const { result } = this.state;
    if ((result || []).some(({ success }) => success)) {
      dispatch(push('.'));
      return;
    }
    this.handleVisibleChange(false);
  };

  onCollapseChange = () => {};

  getAvailableItems = props => {
    const {
      pubplatform,
      venue: { itemList, currentVenue },
    } = props || this.props;
    const { salesInfoMapping } = pubplatform;
    const salesInfo = salesInfoMapping[currentVenue.id] || {};
    return (itemList || []).filter(item =>
      (salesInfo.commonSalesItemInfoList || []).some(
        salesItemList => salesItemList.commonSalesItem && salesItemList.commonSalesItem.itemId === item.itemId
      )
    );
  };

  getCurrentItemInfo = itemId => {
    const {
      pubplatform,
      venue: { currentVenue },
      form,
    } = this.props;
    const { salesInfoMapping } = pubplatform;
    const salesInfo = salesInfoMapping[currentVenue.id] || {};
    const formItemId = itemId == null ? form.getFieldValue('salesItemId') : itemId;
    return (salesInfo.commonSalesItemInfoList || []).find(
      salesItemList => salesItemList.commonSalesItem && salesItemList.commonSalesItem.itemId === formItemId
    );
  };

  onLoadData = list => {
    this.setState({
      pubAccountItemList: list || [],
    });
  };

  render() {
    const {
      form,
      pubplatform,
      venue: { currentVenue, Careers, VenueTypes },
      fetchUserLoading,
      saving,
    } = this.props;
    const { pubserviceUserListMapping } = pubplatform;
    const { composeStateMapping, hasFight, sportTeamInfo, visible, result, checked, pubAccountItemList } = this.state;

    const availableItems = this.getAvailableItems();

    const currentItemInfo = this.getCurrentItemInfo() || {};
    const currentPlatformType = form.getFieldValue('platformType');
    const currentPlatformList = (currentItemInfo.sportPlatformList || []).filter(item =>
      currentPlatformType === 1 ? item.parentId > 0 : item.parentId === 0
    );
    // const currentPlatformIds = form.getFieldValue('platformIdList') || [];
    // const currentPlatformList = (currentItemInfo.sportPlatformList || []).filter(item =>
    //   currentPlatformIds.includes(item.id)
    // );
    const currentTimeTagInfo =
      (currentItemInfo.commonSalesItemCalendarList || []).find(
        item => item.tagId === form.getFieldValue('timeTagId')
      ) || {};
    const currentCalendarInfo =
      (currentTimeTagInfo.commonCalendarInfoList || []).find(
        item => item.id === form.getFieldValue('calendarInfoId')
      ) || {};
    const nowDate = clearHMS(moment()).valueOf();
    const { startDate: s, endDate: e, commonCalendarInfoList } = currentTimeTagInfo;
    const startDate = s ? clearHMS(moment(s)).valueOf() : null;
    const endDate = e ? clearHMS(moment(e)).valueOf() : null;
    const disabled = endDate <= nowDate;

    const serviceUserList = currentItemInfo.commonSalesItem
      ? (pubserviceUserListMapping[currentVenue.id] || {})[currentItemInfo.commonSalesItem.itemId]
      : null;

    const pubAccountId = form.getFieldValue('pubAccountId');
    return (
      <PageHeaderLayout title="添加固定场">
        <Card bordered={false}>
          <Row>
            <Col md={8} xs={24}>
              <VenueSwitcher filter={item => item.salesType === VenueTypes.SPORTPLATFORM.key} />
            </Col>
          </Row>
        </Card>
        <MarginBar top>
          <Form>
            <Collapse defaultActiveKey={['1', '2', '3', '4', '5']} onChange={this.onCollapseChange}>
              <Panel header="选择类型" key="1">
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
                        <Select placeholder="请选择" onChange={this.handleItemChange}>
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
                        // 2 静态的一定有
                        initialValue: 2,
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
                          onChange={this.handlePlatformTypeChange}
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
                          onChange={value => this.handlePlatformChange(value, currentItemInfo.sportPlatformList)}
                        >
                          {currentPlatformList.map(item => (
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
              </Panel>
              <Panel header="选择时间" key="2">
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
                        <Select
                          placeholder="请选择"
                          notFoundContent="请先选择运动类型"
                          onChange={this.handleTimeTagChange}
                        >
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
                        <Select
                          placeholder="请选择"
                          notFoundContent="请先选择时间段"
                          onChange={this.handleCalendarChange}
                        >
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
                              handleComposeStateChange={this.handleComposeStateChange}
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
                              handleComposeStateChange={this.handleComposeStateChange}
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
                              handleComposeStateChange={this.handleComposeStateChange}
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
                              handleComposeStateChange={this.handleComposeStateChange}
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
                    <Row gutter={16} type="flex">
                      <Col>
                        <Checkbox className={style.checked} checked={checked} onChange={this.handlePriceChange}>
                          需要修改价格
                        </Checkbox>
                      </Col>
                      <Col className={style.fullWidth}>
                        <Form.Item>
                          {form.getFieldDecorator('price', {
                            rules: checked
                              ? [
                                  {
                                    required: true,
                                    message: '请填写成交价',
                                  },
                                ]
                              : null,
                          })(
                            <AmountInput
                              disabled={!checked}
                              fullWidth
                              min={0}
                              precision={2}
                              placeholder="请勾选后再修改成交价"
                            />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Panel>
              <Panel header="选择服务人员" key="3">
                <Row>
                  <Col md={6} />
                  <Col md={12}>
                    <Form.Item label="服务人员">
                      {form.getFieldDecorator(
                        'sportPlatformUserIdList',
                        {}
                      )(
                        <Select
                          placeholder="请选择"
                          // notFoundContent="请先选择运动类型"
                          mode="multiple"
                        >
                          {(serviceUserList || []).map(item => (
                            <Select.Option value={item.platformUserId} key={item.platformUserId}>
                              {item.realName}({formatModel(Careers, item.careerId)})
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Panel>
              <Panel header="填写会员信息" key="4">
                <Row>
                  <Col md={6} />
                  <Col md={12}>
                    <Row gutter={16}>
                      <Col md={8}>
                        <Form.Item label="手机号码">
                          {form.getFieldDecorator('pubAccountId', {
                            rules: [
                              {
                                required: true,
                                message: '请关联会员',
                              },
                            ],
                          })(
                            <FetchUserSelect
                              placeholder="按会员手机号搜索"
                              searchFieldName="mobile"
                              onChange={this.reloadSportTeamInfo}
                              onLoadData={this.onLoadData}
                              loading={fetchUserLoading}
                              data={pubAccountItemList}
                              itemRender={item => {
                                return item.mobile;
                              }}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col md={8}>
                        <Form.Item label="会员姓名">
                          <FetchUserSelect
                            placeholder="按会员姓名搜索"
                            searchFieldName="realName"
                            onChange={this.handlePubAccountChange}
                            onLoadData={this.onLoadData}
                            loading={fetchUserLoading}
                            value={pubAccountId}
                            data={pubAccountItemList}
                            itemRender={item => {
                              return item.realName;
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col md={8}>
                        <Form.Item label="会员备注">
                          <FetchUserSelect
                            placeholder="按会员备注搜索"
                            searchFieldName="descr"
                            onChange={this.handlePubAccountChange}
                            onLoadData={this.onLoadData}
                            loading={fetchUserLoading}
                            value={pubAccountId}
                            data={pubAccountItemList}
                            itemRender={item => {
                              return item.descr || '<空>';
                            }}
                          />
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
                        <Form.Item label="订单备注(限50个字符以内)">
                          {form.getFieldDecorator('userMessage')(<Input maxLength={50} placeholder="请填写" />)}
                        </Form.Item>
                      </Col>
                      <Col md={12}>
                        <Form.Item label="商家留言(限16个字符以内)">
                          {form.getFieldDecorator('sellerMessage')(<Input maxLength={16} placeholder="请填写" />)}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Panel>
              {hasFight && (
                <Panel header="填写约战信息" key="5">
                  <Row>
                    <Col md={6} />
                    <Col md={12}>
                      <Row gutter={16}>
                        <Col md={12}>
                          <Form.Item label="球队">
                            {form.getFieldDecorator('sportTeamId', {
                              rules: [
                                {
                                  required: true,
                                  message: '请选择团队',
                                },
                              ],
                            })(
                              <Select placeholder="请选择">
                                {((sportTeamInfo || {}).sportTeamList || []).map(item => (
                                  <Select.Option value={item.sportTeamId} key={item.sportTeamId}>
                                    {item.sportName || '?'}
                                  </Select.Option>
                                ))}
                              </Select>
                            )}
                          </Form.Item>
                        </Col>
                        <Col md={12}>
                          <Form.Item label="队服颜色">
                            {form.getFieldDecorator('sportTeamColor', {
                              rules: [
                                {
                                  required: true,
                                  message: '请选择队服颜色',
                                },
                              ],
                            })(
                              <Select placeholder="请选择">
                                {((sportTeamInfo || {}).ballColorList || []).map(item => (
                                  <Select.Option value={item.key} key={item.key}>
                                    <span
                                      className={style.colorBlock}
                                      style={{
                                        background: item.rgb,
                                      }}
                                    >
                                      &nbsp;
                                    </span>
                                    {item.title || item.rgb}
                                  </Select.Option>
                                ))}
                              </Select>
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
                          <Form.Item label="联系人">
                            {form.getFieldDecorator('fightMobile')(<Input placeholder="联系人手机号" />)}
                          </Form.Item>
                        </Col>
                        <Col md={12}>
                          <Form.Item label="宣言">
                            {form.getFieldDecorator('fightDeclaration')(<Input placeholder="约战宣言" />)}
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Panel>
              )}
            </Collapse>
          </Form>
        </MarginBar>
        <ResultModal
          title="设置结果-固定场"
          visible={visible}
          onVisibleChange={this.handleVisibleChange}
          data={result}
          onOk={this.sure}
          onCancel={this.sure}
        />
        <FooterToolbar>
          <MarginBar left top inline>
            <Button disabled={saving} onClick={this.handleCancel}>
              取消
            </Button>
          </MarginBar>
          <MarginBar left top inline>
            <Button type="primary" loading={saving} onClick={this.handleSave}>
              确定提交
            </Button>
          </MarginBar>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}

export default ForeverAdd;
