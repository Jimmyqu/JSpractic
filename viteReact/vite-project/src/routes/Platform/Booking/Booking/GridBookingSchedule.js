import { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Table, Alert, Icon, Row, Col, Button, message, Input } from 'antd';
import { connect } from 'react-redux';
import { push, replace } from 'connected-react-router';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import throttle from 'lodash/throttle';
import { formatDateTime, formatHM, formatMoney, formatPayWay, formatModel } from '@/utils/format';
import DealInfoDetail from '@/components/DealInfoDetail';
import AmountColor from '@/components/Amount/Color';
import MarginBar from '@/components/MarginBar';
import Modal from '@/components/Modal';
import DealCancelModal from '@/components/Modal/DealCancelModal';
import AuthComponent from '@/components/AuthComponent';
import PlatformLockedCancelModal from '@/components/Modal/PlatformLockedCancelModal';
import BanModal from '@/components/Modal/BanModal';
import PlatformCourseDetailModal from '@/components/Modal/PlatformCourseDetailModal';

import style from './schedule.less';

@connect(({ booking, pubplatform, venue, deal, loading }) => ({
  booking,
  pubplatform,
  venue,
  deal,
  tableLoading: loading.effects['booking/fetch'],
  dealLoading: loading.effects['deal/fetch'],
  lockedDealLoading: loading.effects['pubplatform/fetch'],
  lockMessageSaving: loading.effects['pubplatform/changeLockMessage'],
  signLoading: loading.effects['booking/dealSign'] || loading.effects['booking/dealSignWithoutCode'],
}))
class GridBookingSchedule extends Component {
  static contextTypes = {
    isMobile: PropTypes.bool,
    isAuthorized: PropTypes.func,
    getGlobalFooterHeight: PropTypes.func,
    getWrapperHeight: PropTypes.func,
    outSideContentClassName: PropTypes.string,
    getCurrentServerTime: PropTypes.func,
  };

  resizeTableHeight = throttle(() => {
    if (this.isUnmounted) {
      return;
    }
    const {
      outSideContentClassName,
      getGlobalFooterHeight = () => 0,
      getWrapperHeight = () => 0,
      isMobile,
    } = this.context;
    if (outSideContentClassName == null) {
      return;
    }
    const { bodyHeight: stateBodyHeight } = this.state;
    const contentNode = document.querySelector(`.${outSideContentClassName} .${style.grid}`);
    if (contentNode == null) {
      return;
    }
    const tableDom = contentNode.querySelector('.ant-table-body');
    if (tableDom == null) {
      return;
    }
    const offset = tableDom.getBoundingClientRect().top;
    const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const globalFooterHeight = getGlobalFooterHeight();
    let bodyHeight =
      screenHeight -
      offset -
      globalFooterHeight - //
      12 - // 通常 table是放Card里面的，下方有个padding, 上方的被offset包含了
      8 - // PageHeaderLayout__content margin-top 8 和 主动保留下边距间隔 8, 上方的被offset包含了
      1 - // gridDataRows 加一行假数据，不做任何合并，用来约束表格部分场景下的对齐, 高1像素
      0; // 占位换行而已，方便上面的数字批评搜索'n '
    if (isMobile) {
      const wrapperHeight = getWrapperHeight();
      const header = contentNode.querySelector('.ant-table-header table') || {};
      const min = screenHeight - wrapperHeight - Math.max(header.offsetHeight || 0, header.clientHeight || 0) - 12 * 2; // 通常 table是放Card里面的，上下方有个padding
      bodyHeight = Math.max(bodyHeight, min);
    }
    if (stateBodyHeight !== bodyHeight) {
      this.setState({
        bodyHeight,
      });
    }
  }, 50);

  constructor(props, context) {
    super(props, context);
    const { getCurrentServerTime } = context;
    this.width = 110;
    this.state = {
      dealInfo: undefined,
      dcModalVisible: false,
      dcModalDom: undefined,
      buModalVisible: false,
      pcModalVisible: false,
      modalProps: {
        width: 900,
        visible: false,
      },

      bodyHeight: undefined,

      lockMessageEdit: undefined,
      sellerMessageEdit: undefined,
      platformCourseDetailVisible: false,
      platformCourseId: undefined,
      serverTime: getCurrentServerTime(),
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeTableHeight);
    this.resizeTableHeight();
    this.flushServerTime();
  }

  componentDidUpdate() {
    this.resizeTableHeight();
  }

  componentWillUnmount() {
    this.isUnmounted = true;
    if (this.serverTickTimer) {
      clearTimeout(this.serverTickTimer);
    }
    window.removeEventListener('resize', this.resizeTableHeight);
    const { dispatch } = this.props;
    dispatch({
      type: 'booking/clearBookingTableData',
    });
  }

  flushServerTime = () => {
    if (this.isUnmounted) {
      return;
    }
    const { getCurrentServerTime } = this.context;
    this.setState({
      serverTime: getCurrentServerTime(),
    });
    this.serverTickTimer = setTimeout(this.flushServerTime, 1000 * 5);
  };

  handleCellClick = async (dataIndex, record) => {
    // record 行数据中列数据是个大对象，在 buildDataRowsForTableBody 中初始化
    const platformId = dataIndex;
    const cell = record[platformId];
    if (cell == null) {
      return;
    }
    const { venue, dispatch, expiredDataAuth, booking, pubplatform } = this.props;
    const { LockedDealIdPrefix } = booking;
    const { currentPlatformItem = {} } = venue;
    const { PlatformDealTypes } = pubplatform;
    const isTicket = currentPlatformItem.itemType === 2;
    const { orderInfo, gridStatus = {}, platform, rowIndex } = cell;

    if (isTicket || orderInfo == null || gridStatus.isEditMode) {
      if (expiredDataAuth) {
        dispatch({
          type: 'booking/select',
          payload: {
            rowIndex,
            platform,
            isTicket,
          },
        });
      }
      return;
    }
    // 课程不给点开
    if (orderInfo.dealPlatformType === PlatformDealTypes.Course.key) {
      this.setState({
        platformCourseId: orderInfo.dealId,
        platformCourseDetailVisible: true,
      });
      return;
    }
    const isLocked = orderInfo.dealPlatformType === PlatformDealTypes.Locked.key;
    const { modalProps } = this.state;
    this.setState({
      dcModalDom: undefined,
      modalProps: {
        ...modalProps,
        title: isLocked ? (
          '锁场信息'
        ) : (
          <div>
            查看订单-{orderInfo.dealId}&nbsp;
            <span className={style.subTitle}>
              {orderInfo.srvName}-{orderInfo.srvId > 0 ? '无线' : 'PC'}
            </span>
          </div>
        ),
        loading: true,
        visible: true,
        onVisibleChange: visible => {
          const { modalProps: props } = this.state;
          if (this.isUnmounted) {
            return;
          }
          this.setState({
            modalProps: {
              ...props,
              visible,
            },
          });
        },
      },
    });
    if (isLocked) {
      dispatch({
        type: 'pubplatform/fetch',
        payload: orderInfo.lockId,
      }).then(data => {
        const { gmtCreate, gmtModified, id, createRealName, sportPlatformLockDataList, lockMessage, sellerMessage } =
          data || {};
        this.setState(prevState => ({
          dealInfo: {
            deal: {
              // 包装一下id 避免与正常订单重复
              id: `${LockedDealIdPrefix}${id}`,
              lockId: id,
              createTime: gmtCreate,
              updateTime: gmtModified,
              createRealName,
              sellerMessage: lockMessage,
            },
            sportPlatformLockDataList,
          },
          modalProps: {
            ...prevState.modalProps,
            isLocked,
            loading: false,
          },
          lockMessageEdit: lockMessage,
          sellerMessageEdit: sellerMessage,
        }));
      });
    } else {
      dispatch({
        type: 'deal/fetch',
        payload: orderInfo.dealId,
      }).then(data => {
        this.setState(prevState => ({
          dealInfo: data || {},
          modalProps: {
            ...prevState.modalProps,
            isLocked,
            loading: false,
          },
        }));
      });
    }
  };

  handleDealEdit = () => {
    const { dispatch } = this.props;
    const { dealInfo } = this.state;
    dispatch({
      type: 'booking/dealedit',
      payload: dealInfo,
    });

    this.closeDealinfoDetail();
  };

  handleDealPrint = () => {
    const { dealInfo } = this.state;
    const dealObj = dealInfo.deal;
    const { dispatch } = this.props;
    dispatch(replace(`/basic/deal/${dealObj.id}/print`));
  };

  handleDealDetail = () => {
    const { dealInfo } = this.state;
    const dealObj = dealInfo.deal;
    const { dispatch } = this.props;
    dispatch(push(`/basic/deal/${dealObj.id}/detail`));
  };

  handleSign = () => {
    const { dealInfo } = this.state;
    const { signPlatform } = this.props;
    return signPlatform(dealInfo.deal.id, this.closeDealinfoDetail);
  };

  handleSignWithoutCode = async () => {
    const { dispatch } = this.props;
    const { dealInfo } = this.state;
    const dealObj = dealInfo.deal;

    await dispatch({
      type: 'booking/dealSignWithoutCode',
      payload: dealObj.id,
    });

    message.success('签到成功');
    this.closeDealinfoDetail();
  };

  handleSummary = () => {
    const { dispatch } = this.props;
    const { dealInfo } = this.state;
    return dispatch(
      push({
        pathname: './summary',
        search: `id=${dealInfo.deal.id}`,
      })
    );
  };

  handleDealCancelBtn = () => {
    this.handleDealCancelVisibleChange(true);
  };

  handleBanUserBtn = () => {
    this.handleBanUserVisibleChange(true);
  };

  handlePlatformLockedCancelBtn = () => {
    this.handlePlatformLockedCancelVisibleChange(true);
  };

  handleDoBanUser = () => {
    message.success('添加成功');
    this.closeDealinfoDetail();
  };

  closeDealinfoDetail = () => {
    const { modalProps } = this.state;
    this.setState({
      platformCourseDetailVisible: false,
      modalProps: {
        ...modalProps,
        visible: false,
      },
    });
  };

  closeModalAndReload = () => {
    this.closeDealinfoDetail();
    const { reload } = this.props;
    if (typeof reload === 'function') {
      reload();
    }
  };

  getDealCancelModalContainer = () => {
    const { dcModalDom } = this.state;
    return dcModalDom || document.body;
  };

  handleDealCancelVisibleChange = visible => {
    this.setState({
      dcModalVisible: visible,
    });
  };

  showDealCancelModalByCourseDetailModal = (dealId, dom) => {
    this.setState({
      dcModalVisible: true,
      dcModalDom: dom,
      // 模拟dealInfo
      dealInfo: {
        deal: {
          id: dealId,
        },
      },
    });
  };

  handlePlatformCourseVisibleChange = visible => {
    this.setState({
      platformCourseDetailVisible: visible,
    });
  };

  handlePlatformLockedCancelVisibleChange = visible => {
    this.setState({
      pcModalVisible: visible,
    });
  };

  handleLockMessageChange = e => {
    this.setState({
      lockMessageEdit: e.target.value,
    });
  };

  handleSellerMessageChange = e => {
    this.setState({
      sellerMessageEdit: e.target.value,
    });
  };

  handleBanUserVisibleChange = visible => {
    this.setState({
      buModalVisible: visible,
    });
  };

  handleSaveLockMessage = async () => {
    const { dispatch } = this.props;
    const { dealInfo, lockMessageEdit, sellerMessageEdit } = this.state;
    await dispatch({
      type: 'pubplatform/changeLockMessage',
      payload: {
        id: dealInfo.deal.lockId,
        lockMessage: lockMessageEdit,
        sellerMessage: sellerMessageEdit,
      },
    });
    this.closeModalAndReload();
  };

  getAlert = columns => {
    const {
      booking: { gridDataRows, dataConflicted },
    } = this.props;
    let msg;
    if (dataConflicted) {
      msg = '场地排期时间存在冲突, 可能会影响数据显示，请核对数据配置！';
    } else if (columns == null || columns.length === 0) {
      msg = '该日期暂无场地配置信息，请先设置相关信息！';
    } else if (gridDataRows == null || gridDataRows.length === 0) {
      msg = '该日期暂无场地排期信息，请先设置相关信息！';
    }
    return (
      <Alert
        className="text-center"
        message={
          <>
            {dataConflicted ? (
              <Icon type="close-circle" className="red" />
            ) : (
              <Icon type="info-circle" className="primary-color" />
            )}
            &nbsp;
            {msg}
          </>
        }
        type={dataConflicted ? 'error' : 'info'}
      />
    );
  };

  buildColumnsForTableHeader() {
    const columns = [];
    const {
      booking,
      pubplatform: { DealStatus, PlatformDealTypes },
      venue,
      dispatch,
    } = this.props;
    const { sportPlatformInfo = {} } = booking;
    const { currentPlatformItem = {} } = venue;
    const isTicket = currentPlatformItem.itemType === 2;

    const sportPlatformList = sportPlatformInfo?.sportPlatformList || [];
    sportPlatformList.forEach(item => {
      const column = {
        title: item.platformName,
        align: 'center',
        width: this.width,
        // 关联数据对象
        platform: item,
        key: item.id,
        className: style.headerCell,
        onHeaderCell: col => {
          return {
            onClick: () => {
              dispatch({
                type: 'booking/headerSelect',
                payload: col.platform,
              });
            },
          };
        },
        onCell: record => {
          return {
            onClick: () => this.handleCellClick(item.id, record),
          };
        },
        dataIndex: item.id, // 用platformId作为列取值索引
        render: cell => {
          if (cell == null) {
            return;
          }
          const {
            dataIndex,
            platform,
            actualStartTime,
            actualEndTime,
            timeSlot: { price },
            priceInfo,
            orderInfo,
            rowSpan,
            colSpan,
            gridStatus = {},
            rowIndex,
          } = cell;
          const {
            booking: { gridDataRows, dealSignIds },
          } = this.props;
          const { serverTime } = this.state;
          let endTime = actualEndTime;
          if (rowSpan > 1 && gridDataRows.length > 0) {
            const row = gridDataRows[rowIndex + rowSpan - 1] || {};
            const { actualEndTime: targetEndTime } = row[dataIndex];
            if (targetEndTime) {
              endTime = targetEndTime;
            }
          }
          const expired = endTime <= serverTime;
          return {
            children: (
              <>
                <div platformid={platform.id}>
                  {formatHM(actualStartTime)}-{formatHM(endTime)}
                </div>
                <div>
                  {orderInfo ? (
                    <>
                      {isTicket ? (
                        <>
                          <div>
                            可售:
                            <span
                              className={classNames(style.ticketNum, {
                                [style.empty]: orderInfo.surplusNum === 0,
                              })}
                            >
                              {orderInfo.surplusNum}
                            </span>
                            /已售:
                            <span
                              className={classNames(style.ticketNum, {
                                [style.dg]: expired,
                              })}
                            >
                              {orderInfo.salesNum}
                            </span>
                          </div>
                          <div>
                            已核:
                            <span
                              className={classNames(style.ticketNum, {
                                [style.dg]: expired,
                              })}
                            >
                              {orderInfo.checkNum}
                            </span>
                            /未核:
                            <span className={classNames(style.ticketNum, style.rg)}>{orderInfo.unprovenNum}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          {orderInfo.dealPlatformType !== PlatformDealTypes.Course.key &&
                            (orderInfo.pubRealName || orderInfo.pubMobile) && (
                              <div>
                                {orderInfo.pubRealName}/{orderInfo.pubMobile}
                              </div>
                            )}
                          {orderInfo.dealServiceUser && <div>{orderInfo.dealServiceUser}</div>}
                          {orderInfo.dealItem && <div>已购商品</div>}
                          {orderInfo.isFightDeal > 0 && (
                            <div>
                              约战
                              {orderInfo.sportTeamColor && `/${orderInfo.sportTeamColorValue}`}
                            </div>
                          )}
                          {(orderInfo.dealSign || dealSignIds.includes(orderInfo.dealId)) && <div>已到</div>}
                          {orderInfo.dealPlatformType === PlatformDealTypes.Locked.key && <div>锁场</div>}
                          {orderInfo.userMessage && <div>{orderInfo.userMessage}</div>}
                          {orderInfo.sellerMessage && <div>{orderInfo.sellerMessage}</div>}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {formatMoney(priceInfo ? priceInfo.price : price)} 元{gridStatus.noBook && <div>已占用</div>}
                    </>
                  )}
                </div>
              </>
            ),
            // 跨行/列控制
            props: {
              className: classNames({
                [style.colExpired]: expired,
                [style.colNoBook]: gridStatus.noBook,
                [style.colInprocess]: orderInfo && orderInfo.dealState === DealStatus.DEAL_WAIT.key,
                [style.colScheduled]: orderInfo && orderInfo.dealState === DealStatus.DEAL_PASS.key,
                [style.colCompleted]: orderInfo && orderInfo.dealState === DealStatus.DEAL_COMPLETE.key,
                [style.colLocked]: orderInfo && orderInfo.dealPlatformType === PlatformDealTypes.Locked.key,
                [style.selected]: gridStatus.selected,
                [style.colMobile]: orderInfo && orderInfo.srvId > 0,
                [style.colFixed]: orderInfo && orderInfo.dealPlatformType === PlatformDealTypes.ForeverRange.key,
                [style.colCourse]: orderInfo && orderInfo.dealPlatformType === PlatformDealTypes.Course.key,
              }),
              rowSpan,
              colSpan,
            },
          };
        },
      };
      if (item.parentId === 0) {
        columns.push(column);
      } else {
        // 有可能父场地已经循环到了并push了，就从columns里查
        let top = columns.find(cItem => cItem.platform.id === item.parentId);
        if (top == null) {
          // 如果还没循环到父场地，就从所有数据里查
          const plt = sportPlatformList.find(sitem => sitem.id === item.parentId);
          if (plt == null) {
            // 还是查不到就忽略
            return;
          }
          top = {
            title: plt ? plt.platformName : null,
            align: 'center',
            // 关联数据对象
            platform: plt,
          };
          // 上一层还没来得及添加
          columns.push(top);
        }

        // 上层不需要的属性配置
        delete top.key;
        delete top.dataIndex;
        delete top.onCell;

        top.children = top.children || [];
        top.children.push(column);
      }
    });
    if (columns.length === 0) {
      return columns;
    }
    return [
      ...columns,
      {
        // title: ,
        width: 0,
        platform: {
          id: Date.now(),
        },
      },
    ];
  }

  render() {
    const {
      tableLoading,
      lockMessageSaving,
      signLoading,
      dealLoading,
      lockedDealLoading,
      deal: { PayStatus, DealStatus, PayWayTypes },
      booking: { gridDataRows, dealSignIds },
      expiredDataAuth,
    } = this.props;

    const { isMobile, isAuthorized } = this.context;

    const signWithoutCode = isAuthorized('sign-without-code');
    const lock = isAuthorized('lock');

    // 目前只支持两层
    const columns = this.buildColumnsForTableHeader();
    // 所有列id列表
    const columnIds = [];

    columns.forEach(column => {
      if (Array.isArray(column.children) && column.children.length > 0) {
        column.children.forEach(subColumn => {
          columnIds.push(subColumn.platform.id);
        });
        return;
      }
      columnIds.push(column.platform.id);
    });

    const {
      dealInfo: stateDealInfo,
      lockMessageEdit,
      sellerMessageEdit,
      modalProps,
      dcModalVisible,
      pcModalVisible,
      buModalVisible,
      bodyHeight,
      platformCourseDetailVisible,
      platformCourseId,
    } = this.state;
    const { isLocked, loading } = modalProps;
    const dealInfo = stateDealInfo || {};
    const { deal = {}, payInfo } = dealInfo;
    const hasPaid = deal.dealPayState === PayStatus.HASPAID.key;
    const pending = deal.dealState === DealStatus.BOOKING.key;

    const hasSigned = deal.dealSign || dealSignIds.includes(deal.id);

    const canSignWithoutCode = signWithoutCode && expiredDataAuth && !hasSigned;
    const canSign = hasPaid && expiredDataAuth && !hasSigned;

    return (
      <Card
        bordered={false}
        className={style.grid}
        bodyStyle={{
          padding: isMobile ? 0 : undefined,
        }}
      >
        {(columns.length > 0 && gridDataRows?.length > 0) || tableLoading ? (
          <div className={style.scheduleTableWrapper}>
            <Table
              columns={columns}
              // columns={[
              //   {
              //     width: 1,
              //     className: style.colHolder,
              //     dataIndex: Date.now(),
              //     render: () => <div>&nbsp;</div>,
              //   },
              // ].concat(columns)}
              // 加一行假数据，不做任何跨行跨列合并，用来约束表格部分场景下的对齐
              dataSource={[...(gridDataRows || []), { id: Date.now() }]}
              pagination={false}
              bordered
              rowKey="id"
              loading={tableLoading}
              scroll={{
                x: columnIds.length * this.width,
                // TODO 固定列头会有对不齐的情况，修复后再固定列头
                y: bodyHeight > 0 ? bodyHeight : undefined,
              }}
            />
          </div>
        ) : (
          this.getAlert(columns)
        )}
        <Modal
          {...modalProps}
          getContainer={false}
          onOk={this.handleSummary}
          footer={(isLocked
            ? //
              [
                lock && (
                  <Button
                    key="cancelAllLocked"
                    disabled={lockedDealLoading || lockMessageSaving}
                    onClick={this.handlePlatformLockedCancelBtn}
                  >
                    全部取消
                  </Button>
                ),
                lock && (
                  <Button
                    key="edit"
                    type="primary"
                    disabled={lockedDealLoading || lockMessageSaving}
                    onClick={this.handleDealEdit}
                  >
                    修改
                  </Button>
                ),
                lock && (
                  <Button
                    key="saveMessage"
                    type="primary"
                    disabled={lockedDealLoading}
                    loading={lockMessageSaving}
                    onClick={this.handleSaveLockMessage}
                  >
                    保存备注
                  </Button>
                ),
                <Button key="close" link="cancel" disabled={lockMessageSaving}>
                  关闭
                </Button>,
              ]
            : //
              [
                hasPaid ? (
                  <Button
                    key="print"
                    type="primary"
                    onClick={this.handleDealPrint}
                    disabled={dealLoading || signLoading}
                  >
                    打印
                  </Button>
                ) : (
                  expiredDataAuth && (
                    <Button key="summary" link="ok" type="primary" disabled={dealLoading || signLoading}>
                      {pending ? '改价' : '去结算'}
                    </Button>
                  )
                ),
                canSign && (
                  <AuthComponent auth="scan">
                    <Button key="sign" disabled={dealLoading} loading={signLoading} onClick={this.handleSign}>
                      签到核验
                    </Button>
                  </AuthComponent>
                ),
                canSignWithoutCode && (
                  <AuthComponent auth="sign-without-code">
                    <Button
                      key="signWithoutCode"
                      disabled={dealLoading}
                      loading={signLoading}
                      onClick={this.handleSignWithoutCode}
                    >
                      签到
                    </Button>
                  </AuthComponent>
                ),
                !hasPaid && !pending && expiredDataAuth && (
                  <Button key="edit" onClick={this.handleDealEdit} disabled={dealLoading || signLoading}>
                    修改订单
                  </Button>
                ),
                expiredDataAuth && (
                  <AuthComponent auth="blacklist">
                    <Button key="ban" onClick={this.handleBanUserBtn} disabled={dealLoading || signLoading}>
                      加入黑名单
                    </Button>
                  </AuthComponent>
                ),
                !pending && expiredDataAuth && (
                  <AuthComponent auth="cancel">
                    <Button key="cancel" onClick={this.handleDealCancelBtn} disabled={dealLoading || signLoading}>
                      取消订单
                    </Button>
                  </AuthComponent>
                ),
                <Button key="dealDetail" onClick={this.handleDealDetail} disabled={dealLoading || signLoading}>
                  订单详情
                </Button>,
                <Button key="close" link="cancel" />,
              ]
          ).filter(Boolean)}
        >
          {!loading && (
            <>
              <PlatformLockedCancelModal
                dispatchData={{
                  type: 'pubplatform/removePlatformLocked',
                  payload: {
                    lockIds: deal.lockId,
                  },
                }}
                visible={pcModalVisible}
                onVisibleChange={this.handlePlatformLockedCancelVisibleChange}
                onOk={this.closeModalAndReload}
              />
              <BanModal
                visible={buModalVisible}
                userInfo={{
                  id: deal.pubAccountId,
                  realName: deal.pubRealName,
                  mobile: deal.pubMobile,
                }}
                onVisibleChange={this.handleBanUserVisibleChange}
                onOk={this.handleDoBanUser}
              />
              <DealInfoDetail dealInfo={dealInfo} />
              {isLocked && (
                <MarginBar top>
                  <Row>
                    <Col>锁场备注</Col>
                    <Col>
                      <Input.TextArea
                        placeholder="锁场备注"
                        rows={3}
                        value={lockMessageEdit}
                        onChange={this.handleLockMessageChange}
                      />
                    </Col>
                  </Row>
                </MarginBar>
              )}
              {isLocked && (
                <MarginBar top>
                  <Row>
                    <Col>商家留言</Col>
                    <Col>
                      <Input.TextArea
                        placeholder="商家留言"
                        rows={3}
                        value={sellerMessageEdit}
                        onChange={this.handleSellerMessageChange}
                      />
                    </Col>
                  </Row>
                </MarginBar>
              )}
              {hasPaid && payInfo && (
                <MarginBar top>
                  <Row>
                    <Col>支付信息</Col>
                    <Col>
                      <Table
                        rowKey="id"
                        showHeader={false}
                        className={style.headBg}
                        columns={[
                          {
                            title: 'title',
                            align: 'center',
                            dataIndex: 'title',
                            width: 120,
                          },
                          {
                            title: 'value',
                            dataIndex: 'value',
                          },
                        ]}
                        dataSource={[
                          {
                            id: 1,
                            title: '订单总价',
                            value: <AmountColor inputSize>{formatMoney(payInfo.dealTotalAmount)}</AmountColor>,
                          },
                          ...(payInfo?.payList || []).map(pay => ({
                            id: pay.tradeWay,
                            title:
                              pay.tradeWay !== PayWayTypes.PUBSERVICE.key
                                ? `${formatModel(PayWayTypes, +pay.tradeWay)}支付`
                                : `优惠信息`,
                            value:
                              pay.tradeWay !== PayWayTypes.PUBSERVICE.key ? (
                                <AmountColor inputSize>{formatMoney(pay.tradeAmount)}</AmountColor>
                              ) : (
                                <>
                                  <div style={{ textIndent: 20 }}>[{pay.tradeWayDataName}]</div>
                                  <ul>
                                    <li>
                                      服务支付
                                      {pay.tradeAmountDetail}
                                    </li>
                                    <li>
                                      剩余服务
                                      {pay.tradeSurplusDetail}
                                    </li>
                                  </ul>
                                </>
                              ),
                          })),
                          {
                            id: 10,
                            title: '实际支付',
                            value: <AmountColor inputSize>{formatMoney(payInfo.payTotalAmount)}</AmountColor>,
                          },
                          {
                            id: 11,
                            title: '支付方式',
                            value: formatPayWay(dealInfo),
                          },
                        ].filter(Boolean)}
                        bordered
                        pagination={false}
                      />
                    </Col>
                  </Row>
                </MarginBar>
              )}
              <MarginBar top>
                <Row>
                  <Col xs={24} sm={12}>
                    创建时间：
                    {formatDateTime(deal.createTime)}
                  </Col>
                  <Col xs={24} sm={12}>
                    {hasPaid ? '支付' : '更新'}
                    时间：
                    {formatDateTime(deal.updateTime)}
                  </Col>
                  {!isLocked && (
                    <Col xs={24} sm={12}>
                      会员：
                      <Link to={`/basic/pub/info/${deal.pubAccountId}`}>
                        {deal.pubRealName}/{deal.pubMobile}
                      </Link>
                    </Col>
                  )}
                  <Col xs={24} sm={12}>
                    创建人：
                    {deal.createRealName}
                  </Col>
                </Row>
              </MarginBar>
            </>
          )}
        </Modal>
        <PlatformCourseDetailModal
          dealId={platformCourseId}
          visible={platformCourseDetailVisible}
          onVisibleChange={this.handlePlatformCourseVisibleChange}
          onDealCancel={this.showDealCancelModalByCourseDetailModal}
        />
        <DealCancelModal
          dealId={deal.id}
          visible={dcModalVisible}
          onVisibleChange={this.handleDealCancelVisibleChange}
          onOk={this.closeModalAndReload}
          getContainer={this.getDealCancelModalContainer}
        />
      </Card>
    );
  }
}

export default GridBookingSchedule;
