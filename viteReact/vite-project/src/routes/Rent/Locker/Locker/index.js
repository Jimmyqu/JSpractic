import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import classNames from 'classnames';
import moment from 'moment';
import {
  Card,
  Row,
  Col,
  Popover,
  Badge,
  Icon,
  Button,
  Form,
  Select,
  DatePicker,
  Spin,
  Empty,
  message,
  Tooltip,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import FooterToolbar from '@/components/FooterToolbar';
import Datatable from '@/components/Datatable';
import MarginBar from '@/components/MarginBar';
import VenueSwitcher from '@/components/VenueSwitcher';
import AuthComponent from '@/components/AuthComponent';
import FastSaveOrderButton from '@/components/Button/FastSaveOrderButton';
import IconFont from '@/components/Icon';
import Cart from '@/components/Cart';
import ChartCard from '@/components/Charts/ChartCard';
import LockerRefundModal from '@/components/Modal/LockerRefundModal';
import { add, mul } from '@/commons/lib/math';
import { formItemLayoutFull, isSameDay } from '@/utils/utils';
import { formatMoney, formatMoneyLen2, formatDateTime } from '@/utils/format';
import styles from './index.less';

const warnMsg = '未能匹配到订单数据';

@connect(({ venue, rent, deal, lockerselling, orderprocessing, loading }) => ({
  venue,
  rent,
  lockerselling,
  orderprocessing,
  deal,
  saving: loading.effects['orderprocessing/saveOrder'],
  fastSaving: loading.effects['lockerselling/fastSaveOrder'],
  tableLoading: loading.effects['lockerselling/fetch'],
  scanFetching: loading.effects['deal/fetchByProjectNumber'],
  stateSaving: loading.effects['lockerselling/batchSetState'],
  fetchingItemList: loading.effects['venue/fetchItem'],
  fetchingGroupList: loading.effects['rent/queryLeaseGroupListBy'],
}))
class Locker extends Component {
  static contextTypes = {
    getNextStepPath: PropTypes.func,
    getCurrentServerTime: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    const { getCurrentServerTime } = context;
    const now = moment();
    this.state = {
      curDate: now,
      groupList: null,

      groupParent: '',
      groupSub: '',

      cartItemList: [],

      selectedRows: [],
      // 选中的有订单格子的订单id
      selectOrderColDealId: null,

      isToday: isSameDay(getCurrentServerTime(), now),
    };

    this.columns = [
      {
        title: '名称',
        dataIndex: 'name',
        width: 120,
      },
      {
        title: '总租金',
        dataIndex: 'rentalAmount',
        render: formatMoneyLen2,
        width: 80,
      },
      {
        title: '总押金',
        dataIndex: 'depositAmount',
        render: formatMoneyLen2,
        width: 80,
      },
      {
        title: '操作',
        render: () => <Button type="danger">删除</Button>,
        width: 80,
      },
    ];
  }

  componentDidMount() {
    this.fetch();
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  loadGroup = async professionalId => {
    const { dispatch } = this.props;
    const result = await dispatch({
      type: 'rent/queryLeaseGroupListBy',
      payload: professionalId
        ? {
            professionalId,
          }
        : {},
    });
    this.setState({
      groupParent: '',
      groupSub: '',
      groupList: [
        {
          groupName: '全部',
          id: '',
          parentId: 0,
        },
        ...(result || []),
      ].map(item => {
        return {
          ...item,
          children:
            item.children && item.children.length > 0
              ? [
                  {
                    groupName: '全部',
                    id: '',
                    parentId: '',
                  },
                  ...(item.children || []),
                ]
              : item.children,
        };
      }),
    });
  };

  handleItemChange = value => {
    if (this.isUnmounted) {
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'venue/changeItemId',
      payload: value,
    }).then(() => {
      this.fetch({
        professionalId: value,
      });
      this.loadGroup(value);
    });
  };

  handleDateChange = value => {
    const { getCurrentServerTime } = this.context;
    const { groupParent, groupSub } = this.state;
    this.setState({
      curDate: value,
      isToday: isSameDay(getCurrentServerTime(), value),
    });
    this.fetch({
      groupId: groupSub || groupParent,
      curDate: value.valueOf(),
    });
  };

  handleGroupParentChange = value => {
    this.setState({
      groupParent: value,
      groupSub: '',
    });
    this.fetch({
      groupId: value,
    });
  };

  handleGroupSubChange = value => {
    this.setState({
      groupSub: value,
    });
    this.fetch({
      groupId: value,
    });
  };

  fetch = params => {
    if (this.fetchTimer) {
      clearTimeout(this.fetchTimer);
    }
    const { venue, dispatch, tableLoading } = this.props;
    const { currentVenue, currentItem, itemList } = venue;
    if (
      currentVenue == null ||
      currentItem == null ||
      itemList == null ||
      !itemList.some(item => item.itemId === currentItem.itemId)
    ) {
      this.fetchTimer = setTimeout(() => {
        this.fetch(params);
      }, 100);
      return;
    }
    if (tableLoading) {
      return;
    }
    const { curDate, groupList, groupParent, groupSub } = this.state;
    if (groupList == null) {
      this.setState(
        {
          groupList: [],
        },
        this.loadGroup
      );
    }
    dispatch({
      type: 'lockerselling/fetch',
      payload: {
        curDate: curDate.valueOf(),
        groupId: groupSub || groupParent,
        ...params,
      },
    });
    this.setState({
      cartItemList: [],
      selectedRows: [],
    });
  };

  cartSwitch = col => {
    const { id, groupId, selected, groupName, projectName, priceConfig } = col;
    if (selected) {
      this.setState(({ cartItemList }) => ({
        cartItemList: cartItemList.filter(item => item.id !== id),
        selectedRows: [],
      }));
      return;
    }
    const { rentalAmount, depositAmount } = priceConfig || {};
    this.setState(({ cartItemList }) => ({
      cartItemList: [
        ...cartItemList,
        {
          id,
          num: 1,
          price: add(rentalAmount || 0, depositAmount || 0),
          // 冗余一些字段
          groupId,
          name: `${groupName}-${projectName}`,
          rentalAmount,
          depositAmount,
        },
      ],
      selectedRows: [],
    }));
  };

  handleCellClick = col => {
    if (col == null) {
      return;
    }
    const {
      stateSaving,
      dispatch,
      rent: { RentStates },
      lockerselling: { isWantToDisable, isWantToLock, isWantToEnable, isWantToUnlock, isWantToClean },
    } = this.props;
    if (stateSaving) {
      message.info('上个操作进行中，请稍后...');
      return;
    }
    const { currentState, id, groupId, priceConfig } = col;
    if (!(isWantToDisable || isWantToLock || isWantToEnable || isWantToUnlock || isWantToClean)) {
      if (currentState === RentStates.LOCKED.key || currentState === RentStates.DISABLED.key) {
        return;
      }
      if (currentState === RentStates.CANUSE.key) {
        if (priceConfig == null) {
          message.warn('所选项目未找到可用的价格配置，无法租用');
          return;
        }
        this.cartSwitch(col);
      }
    }
    dispatch({
      type: 'lockerselling/select',
      payload: {
        id,
        groupId,
      },
    });
  };

  handleCheckAllChange = e => {
    const { cartItemList } = this.state;
    const all = e.target.checked;
    this.setState({
      selectedRows: all ? cartItemList : [],
    });
  };

  handleSelectedChange = (_, rows) => {
    this.setState({
      selectedRows: rows,
    });
  };

  // cart里通过onChange修改的只有删除项目，所以mapping里只会是更少的数据
  handleCartChange = mapping => {
    const { dispatch } = this.props;
    const { cartItemList } = this.state;
    const removeItemList = cartItemList.filter(item => !mapping[item.id]);
    removeItemList.forEach(({ id, groupId }) => {
      dispatch({
        type: 'lockerselling/select',
        payload: {
          id,
          groupId,
          selected: false,
        },
      });
    });
    this.setState({
      cartItemList: cartItemList.filter(item => !removeItemList.some(it => it.id === item.id)),
      selectedRows: [],
    });
  };

  handleScanRefund = value => {
    const code = (value == null ? '' : value).trim();
    if (code.length === 0) {
      message.warn('条码内容为空，请纠正后重试！');
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'deal/fetchByProjectNumber',
      payload: code,
    }).then(dealId => {
      if (dealId) {
        this.setState({
          selectOrderColDealId: dealId,
        });
        return;
      }
      message.warn('未能查询到相关数据');
    });
  };

  handleCancelCart = () => {
    this.handleCartChange({});
  };

  handleCancelWhatIWant = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'lockerselling/resetToSell',
    });
  };

  handleSureWhatIWant = async selectedCols => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'lockerselling/batchSetState',
      payload: selectedCols.map(({ id }) => id),
    });
    message.success('操作成功');
    this.fetch();
  };

  handleSelectAllWhatIWant = entries => {
    const {
      dispatch,
      rent: { RentStates },
      lockerselling: { isWantToDisable, isWantToLock, isWantToEnable, isWantToUnlock, isWantToClean },
    } = this.props;
    entries.forEach(([, list]) => {
      list.forEach(({ id, groupId, currentState }) => {
        if (
          ((isWantToDisable || isWantToLock) && currentState === RentStates.CANUSE.key) ||
          (isWantToEnable && currentState === RentStates.DISABLED.key) ||
          (isWantToUnlock && currentState === RentStates.LOCKED.key) ||
          (isWantToClean && (currentState === RentStates.PORTALORDER.key || currentState === RentStates.PCORDER.key))
        ) {
          dispatch({
            type: 'lockerselling/select',
            payload: {
              id,
              groupId,
              selected: true,
            },
          });
        }
      });
    });
  };

  handleToWhatIWant = stateKey => {
    const { dispatch } = this.props;
    dispatch({
      type: 'lockerselling/setWantTo',
      payload: {
        [stateKey]: true,
      },
    });
  };

  handleToDisable = () => {
    this.handleToWhatIWant('isWantToDisable');
  };

  handleToEnable = () => {
    this.handleToWhatIWant('isWantToEnable');
  };

  handleToLock = () => {
    this.handleToWhatIWant('isWantToLock');
  };

  handleToUnlock = () => {
    this.handleToWhatIWant('isWantToUnlock');
  };

  handleToClean = () => {
    this.handleToWhatIWant('isWantToClean');
  };

  buildList = selectedCols => {
    return selectedCols.map(({ id, priceConfig }) => ({
      projectId: id,
      // projectNum: 1,
      rentalAmount: priceConfig?.rentalAmount || 0,
      depositAmount: priceConfig?.depositAmount || 0,
    }));
  };

  handleNextStep = (selectedCols, summary) => {
    const { dispatch } = this.props;
    const { getNextStepPath } = this.context;
    dispatch({
      type: 'lockerselling/lockerNextStep',
      payload: this.buildList(selectedCols),
      summary,
    }).then(id => {
      if (summary) {
        if (id) {
          dispatch(
            push({
              pathname: './summary',
              search: `id=${id}`,
            })
          );
        }
        return;
      }
      dispatch(push(getNextStepPath()));
    });
  };

  toFastSummary = (selectedCols, mode, changePaidPrice, totalPrice) => {
    const {
      dispatch,
      deal: { PayWayTypes },
    } = this.props;
    return dispatch({
      type: 'lockerselling/fastSaveOrder',
      payload: {
        list: this.buildList(selectedCols),
        payMode: mode,
        changePaidPrice, // 找零金额
      },
    }).then(data => {
      const { payContent, dealId } = data || {};
      if (dealId) {
        if (totalPrice === 0 || mode === PayWayTypes.CASH.key) {
          dispatch(push('./result'));
          return;
        }
        dispatch(
          push({
            pathname: './pay',
            search: `content=${payContent}`,
          })
        );
      }
    });
  };

  handleSendbackModalVisible = visible => {
    this.setState(({ selectOrderColDealId }) => ({
      selectOrderColDealId: visible ? selectOrderColDealId : null,
    }));
  };

  handleRefundOk = () => {
    this.setState({
      selectOrderColDealId: null,
    });
    this.fetch();
  };

  render() {
    const {
      fetchingItemList,
      fetchingGroupList,
      tableLoading,
      stateSaving,
      saving,
      fastSaving,
      scanFetching,
      venue: { currentItem, itemList },
      rent: { RentStates },
      lockerselling: {
        leaseLockerBoxData,
        isWantToDisable,
        isWantToEnable,
        isWantToLock,
        isWantToUnlock,
        isWantToClean,
      },
    } = this.props;
    const { curDate, groupList, groupParent, groupSub, cartItemList, selectedRows, isToday, selectOrderColDealId } =
      this.state;
    const {
      dayDepositAmount,
      dayNotRefundAmount,
      dayUsedNum,
      totalNotRefundAmount,
      saveLeaseLockerDataMapping,
      limitPayModes,
    } = leaseLockerBoxData || {};
    const groupNotFound = fetchingGroupList ? <Spin /> : undefined;

    const mapping = {};
    const counter = {
      canUse: 0,
      using: 0,
      disabled: 0,
      locked: 0,
    };

    // 裁剪和填充
    const storeMappingEntries = Object.entries(saveLeaseLockerDataMapping || {});
    if (groupList && groupList.length > 0) {
      storeMappingEntries.forEach(([key, projectlist]) => {
        const groupId = +key;
        let group;
        groupList.some(item => {
          if (item.id === groupId) {
            group = item;
            return true;
          }
          if (item.children) {
            item.children.some(subItem => {
              if (subItem.id === groupId) {
                group = subItem;
                return true;
              }
              return false;
            });
          }
          return false;
        });
        if (group == null) {
          return;
        }
        let useList = projectlist;
        const { projectRows, projectCols } = group;
        const limit = (projectRows || 0) * (projectCols || 0);
        if (projectlist) {
          if (projectlist.length > limit) {
            useList = projectlist.slice(0, limit);
          } else if (projectlist.length < limit) {
            useList = [...projectlist, ...Array.from({ length: limit - projectlist.length }).fill(null)];
          }
        }
        // 计数
        const subcounter = {
          length: projectlist.length,
          canUse: 0,
          using: 0,
          disabled: 0,
          locked: 0,
        };
        useList.forEach(col => {
          if (col == null) {
            return;
          }
          const { currentState } = col;
          switch (currentState) {
            // 可用
            case RentStates.CANUSE.key:
              subcounter.canUse += 1;
              break;
            // 禁用
            case RentStates.DISABLED.key:
              subcounter.disabled += 1;
              break;
            // 锁定
            case RentStates.LOCKED.key:
              subcounter.locked += 1;
              break;
            // 已用
            default:
              subcounter.using += 1;
          }
        });
        const { canUse, using, disabled, locked } = subcounter;
        counter.canUse += canUse;
        counter.using += using;
        counter.disabled += disabled;
        counter.locked += locked;
        // 计数结束
        mapping[groupId] = {
          group,
          counter: subcounter,
          items: Array.from({ length: projectRows })
            .fill(null)
            .map((_, i) => {
              return Array.from({ length: projectCols })
                .fill(null)
                .map((__, j) => {
                  return useList[i * projectCols + j];
                });
            }),
        };
      });
    }

    const subGroup = groupParent ? groupList.find(item => item.id === groupParent)?.children || [] : [];

    const entries = Object.entries(mapping);

    // 所有
    const selectedCols = storeMappingEntries.reduce((prev, [, projectlist]) => {
      return [...prev, ...projectlist.filter(col => col.selected)];
    }, []);

    return (
      <PageHeaderLayout
        helpContent={
          <Popover
            placement="bottomRight"
            title="帮助"
            content={
              <Card className={classNames('help-content', styles.helpContent)}>
                <Row>
                  <Col span={12}>
                    <Badge color="#6ed0f6" text="已选择" />
                  </Col>
                  <Col span={12}>
                    <Icon type="lock" />
                    &nbsp;&nbsp;已锁定
                  </Col>
                  <Col span={12}>
                    <Badge color="#b8bdc7" text="使用中" />
                  </Col>
                  <Col span={12}>
                    <Icon type="stop" />
                    &nbsp;&nbsp;禁用
                  </Col>
                  <Col span={12}>
                    <Badge color="#9be092" text="待支付" />
                  </Col>
                  <Col span={12}>
                    <Badge color="#fff" text="可用" />
                  </Col>
                </Row>
              </Card>
            }
          >
            <Icon type="question-circle-o" />
          </Popover>
        }
      >
        <Card bordered={false}>
          <Form layout="inline" {...formItemLayoutFull}>
            <Form.Item label="营销中心">
              <VenueSwitcher />
            </Form.Item>
            <Form.Item>
              <Select
                notFoundContent={fetchingItemList ? <Spin /> : undefined}
                className={styles.select}
                value={currentItem?.itemId}
                onChange={this.handleItemChange}
                disabled={tableLoading || stateSaving}
              >
                {itemList.map(item => (
                  <Select.Option key={item.itemId} value={item.itemId}>
                    {item.itemIdValue}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="日期">
              <DatePicker
                value={curDate}
                allowClear={false}
                onChange={this.handleDateChange}
                disabled={tableLoading || stateSaving}
              />
            </Form.Item>
            <Form.Item>
              <Select
                notFoundContent={groupNotFound}
                className={styles.select}
                disabled={tableLoading || stateSaving}
                value={groupParent}
                onChange={this.handleGroupParentChange}
              >
                {(groupList || []).map(item => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.groupName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {subGroup.length > 0 && (
              <Form.Item>
                <Select
                  notFoundContent={groupNotFound}
                  className={styles.select}
                  disabled={tableLoading || stateSaving}
                  value={groupSub}
                  onChange={this.handleGroupSubChange}
                >
                  {subGroup.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.groupName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </Form>
          <MarginBar top>
            <Row className={styles.cardRow}>
              <Col>
                <ChartCard
                  bordered={false}
                  avatar={<ChartCardAvatarIcon type="can-use" />}
                  title="可用数"
                  total={counter.canUse}
                />
              </Col>
              <Col>
                <ChartCard
                  bordered={false}
                  avatar={<ChartCardAvatarIcon type="used" />}
                  title="使用数"
                  total={counter.using}
                />
              </Col>
              <Col>
                <ChartCard
                  bordered={false}
                  avatar={<ChartCardAvatarIcon type="disabled" />}
                  title="禁用数"
                  total={counter.disabled + counter.locked}
                />
              </Col>
              <Col>
                <ChartCard
                  bordered={false}
                  avatar={<ChartCardAvatarIcon type="use-total" />}
                  title="当天使用数"
                  total={dayUsedNum}
                />
              </Col>
              <Col>
                <ChartCard
                  bordered={false}
                  avatar={<ChartCardAvatarIcon type="unreturned-deposit" />}
                  title="未退押金"
                  total={formatMoney(dayNotRefundAmount)}
                />
              </Col>
              <Col>
                <ChartCard
                  bordered={false}
                  avatar={<ChartCardAvatarIcon type="unreturned-deposit" />}
                  title="总未退押金"
                  total={formatMoney(totalNotRefundAmount)}
                />
              </Col>
              <Col>
                <ChartCard
                  bordered={false}
                  avatar={<ChartCardAvatarIcon type="deposit-total" />}
                  title="押金总金额"
                  total={formatMoney(dayDepositAmount)}
                />
              </Col>
            </Row>
          </MarginBar>
          <MarginBar top>
            <Card
              bordered={false}
              loading={tableLoading}
              className={styles.rentContent}
              bodyStyle={{
                padding: 0,
              }}
            >
              {entries.length === 0 ? (
                <Empty />
              ) : (
                <Row>
                  <Col md={isToday ? 18 : 24}>
                    <Row type="flex" align="top" className={styles.dataContent}>
                      {entries.map(
                        ([
                          key,
                          {
                            group,
                            counter: { using, canUse, disabled, locked },
                            items,
                          },
                        ]) => (
                          <Col key={key} className={classNames('text-center', styles.group)}>
                            <div
                              className={styles.title}
                              style={{
                                color: group.groupColor,
                              }}
                            >
                              {group.groupName}
                            </div>
                            <div className={styles.subTitle}>
                              <span className={styles.usingNum}>
                                已用<span>{using}</span>
                              </span>
                              <span className={styles.canUseNum}>
                                &nbsp;| 余<span>{canUse}</span>
                              </span>
                              {disabled > 0 && (
                                <span className={styles.disabledNum}>
                                  &nbsp;| 禁<span>{disabled}</span>
                                </span>
                              )}
                              {locked > 0 && (
                                <span className={styles.lockedNum}>
                                  &nbsp;| 锁<span>{locked}</span>
                                </span>
                              )}
                            </div>
                            <div>
                              {items.map((row, i) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <div key={`${group.id}-${i}`} className={styles.row}>
                                  {row.map((col, j) => {
                                    const { id, currentState, projectName, selected, orderInfo } = col || {};
                                    // const { dealId, startDate } = orderInfo || {};
                                    const none = col == null;
                                    const available = currentState === RentStates.CANUSE.key;
                                    const disab = currentState === RentStates.DISABLED.key;
                                    const lkd = currentState === RentStates.LOCKED.key;
                                    const hasOrder =
                                      currentState === RentStates.PORTALORDER.key ||
                                      currentState === RentStates.PCORDER.key;
                                    const paying = currentState === RentStates.LEASE_PAY_WAIT.key;

                                    // 状态操作时不可选的
                                    const canNotSelectWhenWantToDo =
                                      ((isWantToDisable || isWantToLock) && !available) ||
                                      (isWantToEnable && !disab) ||
                                      (isWantToUnlock && !lkd) ||
                                      (isWantToClean && !hasOrder);

                                    const content = <div>{projectName}</div>;
                                    return (
                                      <div
                                        key={`${group.id}-${id || j}`}
                                        className={classNames('text-overflow', styles.col, {
                                          [styles.none]: none,
                                          [styles.disabled]: !isWantToEnable && disab,
                                          [styles.locked]: !isWantToUnlock && lkd,
                                          [styles.using]: !isWantToClean && hasOrder,
                                          [styles.paying]: paying,
                                          [styles.selected]: selected,
                                          [styles.canNotSelect]: canNotSelectWhenWantToDo && !none,
                                        })}
                                        onClick={() => {
                                          if (!isToday || canNotSelectWhenWantToDo) {
                                            return;
                                          }
                                          if (!isWantToClean && (hasOrder || paying)) {
                                            if (orderInfo == null) {
                                              message.error(warnMsg);
                                              return;
                                            }
                                            this.setState({
                                              selectOrderColDealId: orderInfo.dealId,
                                            });
                                            return;
                                          }
                                          this.handleCellClick(col);
                                        }}
                                      >
                                        {!isWantToEnable && disab && <Icon type="stop" />}
                                        {!isWantToUnlock && lkd && <Icon type="lock" />}
                                        {!(
                                          isWantToDisable ||
                                          isWantToEnable ||
                                          isWantToLock ||
                                          isWantToUnlock ||
                                          isWantToClean
                                        ) &&
                                        (hasOrder || paying) ? (
                                          <Tooltip
                                            title={
                                              orderInfo == null ? (
                                                warnMsg
                                              ) : (
                                                <Row>
                                                  <Col>订单号：{orderInfo.dealId}</Col>
                                                  {paying ? (
                                                    <Col className="text-center">支付中...</Col>
                                                  ) : (
                                                    <Col>开始时间：{formatDateTime(orderInfo.startDate)}</Col>
                                                  )}
                                                </Row>
                                              )
                                            }
                                          >
                                            {content}
                                          </Tooltip>
                                        ) : (
                                          content
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              ))}
                            </div>
                          </Col>
                        )
                      )}
                    </Row>
                  </Col>
                  {isToday && (
                    <Col md={6}>
                      <Cart
                        // enterButton="添加商品"
                        itemList={cartItemList}
                        checkedIds={selectedRows.map(item => item.id)}
                        onCheckAllChange={this.handleCheckAllChange}
                        onChange={this.handleCartChange}
                        loading={scanFetching}
                        footerExtra={
                          cartItemList.length > 0 ? (
                            <div className={styles.cartFooter}>
                              <div className={classNames('text-center', styles.cartFooterTip)}>选择支付方式</div>
                              <FastSaveOrderButton
                                popover={false}
                                loading={tableLoading || stateSaving}
                                limitPayModes={limitPayModes}
                                totalPrice={cartItemList.reduce(
                                  (prev, { num, price }) => add(prev, mul(num || 0, price || 0)),
                                  0
                                )}
                                onSummary={(mode, changePaidPrice, totalPrice) =>
                                  this.toFastSummary(selectedCols, mode, changePaidPrice, totalPrice)
                                }
                              />
                            </div>
                          ) : null
                        }
                        onBarCodeScan={this.handleScanRefund}
                      >
                        <Datatable
                          bordered
                          select="multi"
                          pagination={false}
                          personalization={false}
                          rowKey="id"
                          onSelectedChange={this.handleSelectedChange}
                          rowSelection={{
                            selectedRows,
                          }}
                          // countColsWidth
                          columns={this.columns}
                          dataList={cartItemList}
                        />
                      </Cart>
                    </Col>
                  )}
                </Row>
              )}
            </Card>
          </MarginBar>
        </Card>
        {isToday && (
          <FooterToolbar>
            {isWantToDisable || isWantToEnable || isWantToLock || isWantToUnlock || isWantToClean ? (
              <>
                {isWantToDisable && '正在禁用...'}
                {isWantToEnable && '正在解禁...'}
                {isWantToLock && '正在锁定...'}
                {isWantToUnlock && '正在解锁...'}
                {isWantToClean && '正在清柜...'}
                {/* 加key的按钮是为了避免切换时被react识别为同一个来更新 */}
                <MarginBar left top right inline>
                  <Button disabled={stateSaving} onClick={this.handleCancelWhatIWant}>
                    取消
                  </Button>
                </MarginBar>
                <MarginBar left top inline key="selectall">
                  <Button
                    type="primary"
                    disabled={stateSaving}
                    onClick={() => this.handleSelectAllWhatIWant(storeMappingEntries)}
                  >
                    全选
                  </Button>
                </MarginBar>
                <MarginBar left top inline>
                  <Button type="danger" loading={stateSaving} onClick={() => this.handleSureWhatIWant(selectedCols)}>
                    确认
                  </Button>
                </MarginBar>
              </>
            ) : // eslint-disable-next-line unicorn/no-nested-ternary
            selectedCols.length === 0 ? (
              <>
                {counter.disabled > 0 && (
                  <AuthComponent auth="enable">
                    <MarginBar left top inline>
                      <Button type="primary" disabled={tableLoading} onClick={this.handleToEnable}>
                        解禁
                      </Button>
                    </MarginBar>
                  </AuthComponent>
                )}
                {counter.canUse > 0 && (
                  <AuthComponent auth="disable">
                    <MarginBar left top inline>
                      <Button type="danger" disabled={tableLoading} onClick={this.handleToDisable}>
                        禁用
                      </Button>
                    </MarginBar>
                  </AuthComponent>
                )}
                {counter.locked > 0 && (
                  <AuthComponent auth="unlock">
                    <MarginBar left top inline>
                      <Button type="primary" disabled={tableLoading} onClick={this.handleToUnlock}>
                        解锁
                      </Button>
                    </MarginBar>
                  </AuthComponent>
                )}
                {counter.canUse > 0 && (
                  <AuthComponent auth="lock">
                    <MarginBar left top inline>
                      <Button type="danger" disabled={tableLoading} onClick={this.handleToLock}>
                        锁定
                      </Button>
                    </MarginBar>
                  </AuthComponent>
                )}
                {counter.using > 0 && (
                  <AuthComponent auth="clean">
                    <MarginBar left top inline>
                      <Button type="primary" disabled={tableLoading} onClick={this.handleToClean}>
                        清柜
                      </Button>
                    </MarginBar>
                  </AuthComponent>
                )}
              </>
            ) : (
              <>
                {/* 加key的按钮是为了避免切换时被react识别为同一个来更新 */}
                <MarginBar left top right inline key="cancelcart">
                  <Button disabled={saving || fastSaving} onClick={this.handleCancelCart}>
                    取消
                  </Button>
                </MarginBar>
                <MarginBar left top inline key="sanke">
                  <Button loading={saving || fastSaving} onClick={() => this.handleNextStep(selectedCols, true)}>
                    散客结算
                  </Button>
                </MarginBar>
                <MarginBar left top inline>
                  <Button
                    type="primary"
                    loading={saving || fastSaving}
                    onClick={() => this.handleNextStep(selectedCols)}
                  >
                    下一步
                  </Button>
                </MarginBar>
              </>
            )}
          </FooterToolbar>
        )}
        <LockerRefundModal
          visible={selectOrderColDealId != null}
          dealId={selectOrderColDealId}
          onVisibleChange={this.handleSendbackModalVisible}
          onOk={this.handleRefundOk}
        />
      </PageHeaderLayout>
    );
  }
}

const ChartCardAvatarIcon = props => <IconFont {...props} style={{ fontSize: 48 }} />;

export default Locker;
