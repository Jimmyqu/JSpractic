import { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Select, Form, Spin, Row, Col, Popover, Icon, Badge } from 'antd';
import omit from 'omit.js';
import { connect } from 'react-redux';
import { push, replace } from 'connected-react-router';
import VenueSwitcher from '@/components/VenueSwitcher';
import FooterToolbar from '@/components/FooterToolbar';
import MarginBar from '@/components/MarginBar';
import AuthComponent from '@/components/AuthComponent';
import CarouselDateSwitcher from '@/components/CarouselDateSwitcher';
import TicketCheckResultModal from '@/components/Modal/TicketCheckResultModal';
import PlatformLockModal from '@/components/Modal/PlatformLockModal';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import FastSaveOrderButton from '@/components/Button/FastSaveOrderButton';
import { add } from '@/commons/lib/math';
import { getPageQuery, isBeforeToday, isSameDay, isNumber, isBefore } from '@/utils/utils';
import courseImg from '@/assets/images/course.png';
import fixedImg from '@/assets/images/fixed.png';
import GridBookingSchedule from './GridBookingSchedule';
import EditTicketModal from './EditTicketModal';
import SellTicketModal from './SellTicketModal';
import SignPlatformModal from './SignPlatformModal';

import styles from './index.less';

@connect(({ orderprocessing, venue, deal, booking, global: { QrCodeMatrixActions }, loading }) => ({
  orderprocessing,
  venue,
  deal,
  booking,
  QrCodeMatrixActions,
  tableLoading: loading.effects['booking/fetch'],
  saving: loading.effects['orderprocessing/saveOrder'] || loading.effects['booking/fastSaveOrder'],
  fetchingItemList: loading.effects['venue/fetchItem'],
  // codeQuerying: loading.effects['global/queryByCode'],
  locking: loading.effects['booking/bookingLock'],
  changegLocking: loading.effects['booking/changeBookingLock'],
  visitorNumberFetching:
    loading.effects['booking/fetchSportTicketVisitorNumbers'] || loading.effects['booking/fetchSportVisitorNumbers'],
}))
class Booking extends Component {
  showSlickItemLength = 7; // 奇数

  defaultSlickItemLength = this.showSlickItemLength * 4; // 偶数倍

  static contextTypes = {
    scanQRCode: PropTypes.func,
    isAuthorized: PropTypes.func,
    getNextStepPath: PropTypes.func,
    selectPubStudy: PropTypes.bool,
    playVerifyAudio: PropTypes.func,
    getCurrentServerTime: PropTypes.func,
  };

  state = {
    editTicketVisible: false,
    sellTicketVisible: false,
    lockVisible: false,
    lockPlatformList: null,
    signPlatformVisible: false,
    signPlatformDealId: null,
    signPlatformCallback: null,

    ticketCheckResultVisible: false,
    ticketCheckResult: undefined,
    // indexOffset: 0, // 组件index偏移量
    ticketPlatformList: null,

    // 游泳入场数据分析
    allCellsOrderVisitorNumbers: {},

    // 场地票务验票全部
    checkAll: false,

    ready: false,
  };

  // TODO 按ID初始化编辑的场地需要默认横纵滚动到可视位置
  async componentDidMount() {
    const { id, lock } = getPageQuery();
    const {
      dispatch,
      booking: { currentDate },
      orderprocessing: { dealInfo },
    } = this.props;
    const { getCurrentServerTime } = this.context;
    // 由于订单按id跳转到床底来一遍都是来源于非/basic/platform/*路径下，一遍dealInfo是会被清理保证没有值的
    // 但lock来源于/basic/platform/*路径下，这里识别一下也按id加载
    if ((dealInfo == null || lock) && id) {
      const data = await dispatch({
        type: 'orderprocessing/fetchOrder',
        payload: {
          switchEnv: true,
        },
      });
      const mainData = data || {};
      const { dealInfo: mainDataDealInfo } = mainData;
      const { dealPlatformList } = mainDataDealInfo;
      if (Array.isArray(dealPlatformList) && dealPlatformList.length > 0) {
        const { orderDate } = dealPlatformList[0];
        await dispatch({
          type: 'booking/changeCurDate',
          payload: orderDate,
        });
      }
    } else {
      await dispatch({
        type: 'booking/changeCurDate',
        payload: isNumber(currentDate) ? currentDate : getCurrentServerTime(),
      });
    }
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      ready: true,
    });
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { venue, dispatch } = this.props;
    const { venue: nextVenue } = nextProps;
    const cVenue = venue.currentVenue || {};
    const cCurrentPlatformItem = venue.currentPlatformItem || {};

    const ncVenue = nextVenue.currentVenue || {};
    const ncSportPlatformItemList = nextVenue.sportPlatformItemList || [];
    if (cVenue.id !== ncVenue.id) {
      if (ncSportPlatformItemList.some(item => item.salesItemId === cCurrentPlatformItem.salesItemId)) {
        this.fetchSportPlatformInfo();
      } else {
        dispatch({
          type: 'venue/fetchItem',
          payload: ncVenue.id,
        }).then(() => {
          this.fetchSportPlatformInfo();
        });
        // 切换的营销中心没有当前这种项目
        // TODO 这里需要优化
      }
    }
    // 场馆相同item不同的也可能是item的change来触发的
    // if (cCurrentItem.itemId !== ncCurrentItem.itemId) {
    //   this.fetchSportPlatformInfo();
    // }
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  getAllCellsByGridStatusFlag(flag) {
    if (!flag) {
      return [];
    }
    const {
      booking: { gridDataRows },
    } = this.props;
    // 列
    const cells = [];

    gridDataRows?.forEach(row => {
      Object.entries(row).forEach(([key, cellData]) => {
        // rowKey
        if (key === 'id') {
          return;
        }
        // 如果是被跨的则不处理选中, 也不可能选中
        if (cellData.rowSpan <= 0 || cellData.colSpan <= 0) {
          return;
        }
        const { gridStatus = {} } = cellData;
        // 如果有订单数据且非编辑模式则不处理选中
        if (gridStatus.noBook) {
          return;
        }
        if (gridStatus[flag]) {
          cells.push(cellData);
        }
      });
    });
    return cells;
  }

  getAllSelectedCells() {
    return this.getAllCellsByGridStatusFlag('selected');
  }

  getAllEditModeCells() {
    return this.getAllCellsByGridStatusFlag('isEditMode');
  }

  getDealPlatformList({
    noVerticalMerge, // 不垂直合并
    noHorizontalMerge, // 不水平合并
    withCellData,
  } = {}) {
    const {
      venue,
      booking: { gridDataRows, currentDate },
    } = this.props;
    const { currentPlatformItem = {} } = venue;
    const isTicket = currentPlatformItem.itemType === 2;
    const orderDate = currentDate;

    // 所有选中的列
    const selectedCells = this.getAllSelectedCells();

    // 不可能相等
    selectedCells.sort(({ rowIndex: r1, colIndex: c1 }, { rowIndex: r2, colIndex: c2 }) => {
      if (r1 < r2) {
        return -1;
      }
      if (r1 > r2) {
        return 1;
      }
      if (c1 < c2) {
        return -1;
      }
      if (c1 > c2) {
        return 1;
      }
      return 0;
    });

    const abandoned = []; // 废弃的

    const dealPlatformArray = [];
    const buildDealPlatform = (cellData, allSub = false, mustFight = false) => {
      const {
        platform: { parentId, id, isFight, salesItemId, selectPubStudy, validPubStudy, validFace },
        timeSlot,
        rowIndex,
        colIndex,
        priceInfo,
      } = cellData;
      // 冗余一些字段给人脸采集时用
      const col = {
        platformId: allSub ? parentId : id,
        isFightDeal: allSub || parentId === 0 ? 0 : isFight,
        orderDate,
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime,
        rowIndex,
        colIndex,
        mustFight,
        // 场地票务下单时，每个platform纬度就有一套selectPubStudy、validPubStudy、validFace，如果选择多个platform下的格子下单就需要区分处理
        // 其他，比如会员服务、文化票务、课程没有这种能多个下到一个单里的场景
        // 体育场地始终只选一个人
        selectPubStudy,
        validPubStudy,
        validFace,
        salesItemId,
        // price冗余给user step支持快速结算
        price: (priceInfo ? priceInfo.price : timeSlot.price) || 0,
      };
      if (withCellData) {
        col.cellData = cellData;
      }
      dealPlatformArray.push(col);
    };

    // 是否必须约战？
    const isMustFight = ({ platform, rowIndex, brotherSize }) => {
      const row = gridDataRows[rowIndex];
      const cells = Object.entries(row).filter(([key, { platform: p, orderInfo }]) => {
        // rowKey
        if (key === 'id' || p === platform) {
          return false;
        }
        // 有订单的其他兄弟
        return p.parentId === platform.parentId && orderInfo != null;
      });
      // 所有兄弟有订单
      return cells.length === brotherSize - 1;
    };

    selectedCells.forEach(cellData => {
      if (abandoned.includes(cellData)) {
        return;
      }
      const { platform, timeSlot, brotherSize, rowIndex, colIndex } = cellData;
      if (isTicket) {
        buildDealPlatform(cellData);
        return;
      }
      let mustFight = false;
      if (!noHorizontalMerge && platform.parentId > 0) {
        // 已选择的同级，含自身
        const brother = selectedCells.filter(
          cd => cd.platform.parentId === platform.parentId && cd.rowIndex === rowIndex
        );
        if (brother.length === brotherSize) {
          abandoned.push(...brother);
          buildDealPlatform(cellData, true);
          return;
        }
        // 所有兄弟有订单
        mustFight = isMustFight(cellData);
      }
      if (noVerticalMerge) {
        buildDealPlatform(cellData);
        return;
      }
      // 找上面的看能不能接上
      if (rowIndex === 0) {
        // 是第一行的
        buildDealPlatform(cellData, false, mustFight); // 直接放
        return;
      }
      // 找到本列比当前早的
      const founddtCols = dealPlatformArray.filter(dtCol => {
        return dtCol.platformId === platform.id && dtCol.colIndex === colIndex && dtCol.rowIndex < rowIndex;
      });

      if (founddtCols.length === 0) {
        // 没有更早的
        buildDealPlatform(cellData, false, mustFight); // 直接放;
        return;
      }

      const lastColInFound = founddtCols[founddtCols.length - 1]; // 因为是按顺序放的，所以直接拿最后一个来判断
      if (lastColInFound.rowIndex < rowIndex && lastColInFound.endTime === timeSlot.startTime) {
        if (mustFight !== lastColInFound.mustFight) {
          // 约战与非约战隔离
          buildDealPlatform(cellData, false, mustFight); // 直接放
          return;
        }
        // 紧挨着的，纵向合并
        lastColInFound.endTime = timeSlot.endTime; // 改结束时间
        return;
      }
      buildDealPlatform(cellData, false, mustFight); // 直接放
    });
    return dealPlatformArray.map(item => omit(item, ['rowIndex', 'colIndex']));
  }

  handleEditTicket = () => {
    const ticketPlatformList = this.getDealPlatformList({
      noVerticalMerge: true,
    });
    this.setState({
      ticketPlatformList,
    });
    this.handleEditTicketVisibleChange(true);
  };

  handleSellTicket = () => {
    const ticketPlatformList = this.getDealPlatformList({
      noVerticalMerge: true,
      withCellData: true,
    });
    this.setState({
      ticketPlatformList,
    });
    this.handleSellTicketVisibleChange(true);
  };

  toSpTicket = () => {
    const list = this.getDealPlatformList();
    const { dispatch } = this.props;
    const { startTime, endTime } = list[0];
    dispatch(
      push({
        pathname: '/basic/deal/spticket',
        search: `startTime=${startTime}&endTime=${endTime}`,
      })
    );
  };

  handleCheckTicketWithCheckMode = all => {
    this.setState(
      () => ({
        checkAll: all,
      }),
      this.handleCheckTicket
    );
  };

  handleCheckTicket = () => {
    const { scanQRCode, playVerifyAudio } = this.context;
    scanQRCode(code => {
      // 当needResult 为 1 时，扫码返回的结果
      const { dispatch, venue, QrCodeMatrixActions } = this.props;
      const { currentVenue } = venue;
      const { checkAll } = this.state;
      const ticketPlatformList = this.getDealPlatformList({
        noVerticalMerge: true,
        withCellData: true,
      });
      dispatch({
        type: 'global/wxScan',
        payload: {
          sportPlatformTicketList: ticketPlatformList.map(({ orderDate, startTime, endTime, platformId }) => {
            return {
              curDate: orderDate, // 当前日期存时间戳
              endTime, // 结束时间存时间戳
              platformId, // 场地编号
              startTime, // 开始时间存时间戳
              // surplusNum: dealGts.ticketOrder.surplusNum, // 可售票数
            };
          }),
          // 不提供action则不要求匹配，反之要求匹配
          action: QrCodeMatrixActions.CheckSPTicket.key,
          scanValue: code,
          checkedNumState: checkAll,
          salesId: currentVenue.id,
        },
      })
        .catch(() => {
          playVerifyAudio(false);
        })
        .then(result => {
          if (result == null) {
            return;
          }
          playVerifyAudio(result.success);
          this.setState({
            ticketCheckResultVisible: true,
            ticketCheckResult: {
              ...result,
              isVerify: true,
            },
          });
        });
    });
  };

  handleEditTicketOk = (arg, formData, list) => {
    const { number } = formData;
    const { dispatch } = this.props;
    return dispatch({
      type: 'booking/ticketUpdate',
      payload: list.map(item =>
        omit(
          {
            ...item,
            curDate: item.orderDate,
            surplusNum: number,
          },
          ['orderDate']
        )
      ),
    }).then(() => {
      this.fetchSportPlatformInfo();
    });
  };

  convertTicketList = (numberMapping, list) =>
    list.map(({ cellData, selectPubStudy, validPubStudy, validFace, startTime, endTime }) => {
      const {
        orderInfo,
        priceInfo,
        timeSlot,
        platform: { id, platformName, platformParentName, salesItemId },
      } = cellData;
      // 冗余一些字段给人脸采集时用
      return {
        startTime,
        endTime,
        platformId: id,
        platformName,
        platformParentName,
        // 场地票务下单时，每个platform纬度就有一套selectPubStudy、validPubStudy、validFace，如果选择多个platform下的格子下单就需要区分处理
        // 其他，比如会员服务、文化票务、课程没有这种能多个下到一个单里的场景
        // 体育场地始终只选一个人
        selectPubStudy,
        validPubStudy,
        validFace,
        //
        sportPlatformTicketId: orderInfo.id,
        salesItemId,
        // 没动过数量的numberMapping没值
        salesNum: numberMapping[`${orderInfo.id}-${id}`] || 1,
        transactionPrice: (priceInfo ? priceInfo.price : timeSlot.price) || 0,
      };
    });

  handleSellTicketOk = (arg, numberMapping, list, summary, isIndividual) => {
    return this.handleNextStep(summary, this.convertTicketList(numberMapping, list), isIndividual);
  };

  lockPlatformOk = () => {
    this.handleCancelEdit();
  };

  handleGetCode = async code => {
    if (code == null || code.trim().length === 0) {
      return;
    }
    const { playVerifyAudio } = this.context;
    const { venue, dispatch, QrCodeMatrixActions } = this.props;
    const { currentPlatformItem = {} } = venue;
    const isTicket = currentPlatformItem.itemType === 2;
    let result;
    try {
      result = await dispatch({
        type: 'global/queryByCode',
        payload: {
          code,
          // 不提供action则不要求匹配，反之要求匹配
          action: isTicket ? QrCodeMatrixActions.CheckSPTicket.key : QrCodeMatrixActions.CheckPlatform.key,
        },
      });
    } catch {
      playVerifyAudio(false);
      return;
    }
    if (result) {
      this.setState({
        signPlatformVisible: false,
        ticketCheckResultVisible: true,
        ticketCheckResult: {
          ...result,
          isSignPlatform: true,
        },
      });
    }
  };

  handleCheck = async (code, dealId) => {
    if (code == null || code.trim().length === 0) {
      return;
    }
    const { playVerifyAudio } = this.context;
    const { venue, dispatch, QrCodeMatrixActions } = this.props;
    const { currentVenue } = venue;
    let result;
    try {
      result = await dispatch({
        type: 'booking/dealSignDirectly',
        payload: {
          // 不提供action则不要求匹配，反之要求匹配
          action: QrCodeMatrixActions.CheckPlatform.key,
          scanValue: code,
          dealId,
          checkedNumState: true,
          salesId: currentVenue.id,
        },
      });
    } catch {
      playVerifyAudio(false);
      return;
    }
    const { signPlatformCallback } = this.state;
    if (result) {
      playVerifyAudio(result.success);
      this.setState({
        signPlatformVisible: false,
        ticketCheckResultVisible: true,
        ticketCheckResult: {
          ...result,
          isSignPlatform: true,
          isVerify: true,
        },
      });
      if (result.success && signPlatformCallback) {
        signPlatformCallback();
      }
    }
  };

  handleVerify = async num => {
    const { dispatch, venue } = this.props;
    const { currentVenue } = venue;
    const { ticketCheckResult } = this.state;
    const { data, success, isVerify } = ticketCheckResult || {};
    if (!success || isVerify) {
      return;
    }
    const { id, relType } = data || {};
    const { playVerifyAudio } = this.context;
    let result;
    try {
      result = await dispatch({
        type: 'booking/dealSign',
        payload: {
          dataId: id,
          relType,
          checkedNumState: true,
          salesId: currentVenue.id,
          checkPersonNum: num,
        },
      });
    } catch {
      playVerifyAudio(false);
      return;
    }
    if (result) {
      this.setState({
        ticketCheckResult: {
          ...ticketCheckResult,
          ...result,
          isVerify: true,
        },
      });
      playVerifyAudio(result.success);
    }
  };

  handleEditTicketVisibleChange = visible => {
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      editTicketVisible: visible,
    });
  };

  handleSellTicketVisibleChange = visible => {
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      sellTicketVisible: visible,
    });
  };

  handleLockVisibleChange = visible => {
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      lockVisible: visible,
    });
  };

  handleTicketCheckResultVisibleChange = visible => {
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      ticketCheckResultVisible: visible,
    });
  };

  handleSignPlatformVisibleChange = visible => {
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      signPlatformVisible: visible,
    });
  };

  handleItemChange = value => {
    if (this.isUnmounted) {
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'venue/changePlatformItemId',
      payload: value,
    }).then(() => {
      this.fetchSportPlatformInfo({
        platformGroupId: '',
      });
    });
  };

  handleGroupChange = value => {
    if (this.isUnmounted) {
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'booking/changeCurGroup',
      payload: value,
    }).then(() => {
      this.fetchSportPlatformInfo();
    });
  };

  handleCancelEdit = () => {
    const { dispatch } = this.props;
    dispatch(replace('../'));
  };

  handleNextStep = (summary, payload, isIndividual) => {
    // 这里还不知道是否selectPubStudy
    // const { getNextStepPath, selectPubStudy } = this.context;
    const { dispatch } = this.props;
    const list = payload || this.getDealPlatformList();
    return dispatch({
      type: 'booking/bookingNextStep',
      payload: list,
      // 识别payload的数据可知
      summary: list.some(item => item.selectPubStudy) ? false : summary,
      isIndividual,
    }).then(id => {
      const { getNextStepPath } = this.context;
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
      dispatch(push(getNextStepPath(isIndividual ? 2 : 1)));
    });
  };

  // 非场地票务的快速结算
  toFastSummaryByPlatform = (mode, changePaidPrice, totalPrice) => {
    return this.toFastSummary(mode, changePaidPrice, totalPrice, this.getDealPlatformList());
  };

  // 场地票务的快速结算
  toFastSummaryByTicket = (mode, changePaidPrice, totalPrice, numberMapping, list) => {
    return this.toFastSummary(mode, changePaidPrice, totalPrice, this.convertTicketList(numberMapping, list));
  };

  toFastSummary = (mode, changePaidPrice, totalPrice, list) => {
    const {
      dispatch,
      deal: { PayWayTypes },
    } = this.props;
    return dispatch({
      type: 'booking/fastSaveOrder',
      payload: {
        list,
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

  fetchSportPlatformInfo = params => {
    if (this.fetchTimer) {
      clearTimeout(this.fetchTimer);
    }
    const { venue, dispatch, tableLoading } = this.props;
    const { ready } = this.state;
    const { currentVenue, currentPlatformItem, sportPlatformItemList } = venue;
    if (
      !ready ||
      currentVenue == null ||
      currentPlatformItem == null ||
      sportPlatformItemList == null ||
      !sportPlatformItemList.some(item => item.salesItemId === currentPlatformItem.salesItemId)
    ) {
      this.fetchTimer = setTimeout(() => {
        this.fetchSportPlatformInfo(params);
      }, 100);
      return;
    }
    if (tableLoading) {
      return;
    }
    dispatch({
      type: 'booking/fetch',
      payload: params,
    });
  };

  handleCarouselDateChange = val => {
    this.fetchSportPlatformInfo({
      curDate: val,
    });
  };

  signPlatform = (dealId, callback) => {
    this.setState({
      signPlatformDealId: dealId,
      signPlatformCallback: callback,
    });
    const { scanQRCode } = this.context;
    if (
      scanQRCode(code => {
        if (dealId) {
          // 直接验证
          this.handleCheck(code, dealId);
          return;
        }
        this.handleGetCode(code);
      })
    ) {
      return;
    }
    this.setState({
      signPlatformVisible: true,
    });
  };

  toLockPlatform = async () => {
    const list = this.getDealPlatformList();
    this.setState({
      lockPlatformList: list,
      lockVisible: true,
    });
  };

  handlePopoverVisibleChange = visible => {
    if (visible) {
      const {
        venue: { currentPlatformItem = {} },
      } = this.props;
      const isTicket = currentPlatformItem.itemType === 2;
      const { dispatch } = this.props;
      dispatch({
        type: isTicket ? 'booking/fetchSportTicketVisitorNumbers' : 'booking/fetchSportVisitorNumbers',
      }).then(data => {
        this.setState({
          allCellsOrderVisitorNumbers: data || {},
        });
      });
    }
  };

  render() {
    const {
      venue,
      fetchingItemList,
      locking,
      changegLocking,
      booking: { currentDate, currentGroupId },
      tableLoading,
      visitorNumberFetching,
      saving,
      deal: { isCancelLoading },
    } = this.props;
    const { isAuthorized, getCurrentServerTime } = this.context;
    const now = getCurrentServerTime();
    // expired-data-operation 只对场地控制
    const expiredDataAuth =
      isAuthorized('expired-data-operation') || isSameDay(currentDate, now) || !isBeforeToday(currentDate);
    const { sportPlatformItemList = [], currentPlatformItem, VenueTypes } = venue;
    const {
      editTicketVisible,
      sellTicketVisible,
      lockVisible,
      lockPlatformList,
      ticketCheckResultVisible,
      signPlatformVisible,
      signPlatformDealId,
      ticketCheckResult,
      ticketPlatformList,
      allCellsOrderVisitorNumbers,
      ready,
    } = this.state;

    const { salesItemId, itemType, isVisitor, sportPlatformGroupList, sysDayBooking } = currentPlatformItem || {};

    const isTicket = itemType === 2;

    // 必须选择会员
    const isMustFetchUser = isVisitor == null ? false : isVisitor !== 1;

    // 所有选中的列
    const selectedCells = this.getAllSelectedCells();

    // 有选
    const someoneSelected = selectedCells.length > 0;
    // 只选一个
    const onlyOneSelected = someoneSelected && selectedCells.length < 2;
    // 编辑状态
    const editModeCells = this.getAllEditModeCells();
    const isEditMode = editModeCells.length > 0;
    const editLockId = isEditMode
      ? (editModeCells.find(({ orderInfo }) => orderInfo && orderInfo.lockId) || { orderInfo: {} }).orderInfo.lockId
      : null;
    const hasGroup = sportPlatformGroupList?.length > 0;

    const totalPrice = selectedCells.reduce(
      (pre, { priceInfo, timeSlot }) => add(pre, priceInfo ? priceInfo.price : timeSlot.price),
      0
    );

    // 可预定多少天以内的，今天可订则需要sysDayBooking为1，以此类推，否则不限制
    const availableForSale =
      sysDayBooking > 0 ? isBefore(currentDate, now + 1000 * 60 * 60 * 24 * sysDayBooking) : true;

    // 找出有没有 selectPubStudy 和 validPubStudy 可能为true 的对方
    let selectPubStudy = false;
    let validPubStudy = false;
    selectedCells.some(({ platform }) => {
      const { selectPubStudy: s, validPubStudy: v } = platform;
      if (s) {
        selectPubStudy = s;
      }
      if (v) {
        validPubStudy = v;
      }
      if (selectPubStudy && validPubStudy) {
        return true;
      }
      return false;
    });

    // 可快速结算/散客结算(可直接跳过后面的流程)
    const canFastSummary = availableForSale && !((selectPubStudy && validPubStudy) || isMustFetchUser);

    return (
      <PageHeaderLayout
        helpContent={
          <Popover
            placement="bottomRight"
            title="帮助"
            content={
              <Card className="help-content">
                <Row>
                  <Col span={12}>
                    <Badge color="#6ed0f6" text="已选择" />
                  </Col>
                  <Col span={12}>
                    <Badge color="#9be092" text="已预订（PC）" />
                  </Col>
                  <Col span={12}>
                    <Badge color="#ff9673" text="已预订" />
                  </Col>
                  <Col span={12}>
                    <Badge color="#b8bdc7" text="已支付" />
                  </Col>
                  <Col span={12}>
                    <Badge color="#edf8fe" text="锁场" />
                  </Col>
                  <Col span={12}>
                    <Badge color="#fff" text="可订" />
                  </Col>
                  <Col span={12}>
                    <img src={fixedImg} alt="fixed" />
                    固定场
                  </Col>
                  <Col span={12}>
                    <img src={courseImg} alt="course" className={styles.courseImg} />
                    课程
                  </Col>
                  <Col span={12}>
                    <Badge color="#f0f2f5" text="场地复用占场" />
                  </Col>
                </Row>
              </Card>
            }
          >
            帮助 <Icon type="question-circle-o" />
          </Popover>
        }
      >
        <Card
          bordered={false}
          bodyStyle={{
            paddingBottom: 2,
          }}
          loading={isCancelLoading}
        >
          <Row>
            <Col span={24}>
              <Form layout="inline">
                <Form.Item>
                  <VenueSwitcher filter={item => item.salesType === VenueTypes.SPORTPLATFORM.key} />
                </Form.Item>
                <Form.Item>
                  <Select
                    notFoundContent={fetchingItemList && <Spin />}
                    className={styles.select}
                    value={salesItemId}
                    onChange={this.handleItemChange}
                    disabled={tableLoading}
                  >
                    {sportPlatformItemList.map(item => (
                      <Select.Option key={item.salesItemId} value={item.salesItemId}>
                        {item.salesItemName || item.salesItemId}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                {hasGroup && (
                  <Form.Item>
                    <Select
                      className={styles.select}
                      value={currentGroupId}
                      onChange={this.handleGroupChange}
                      disabled={tableLoading}
                    >
                      <Select.Option value="">全部区域</Select.Option>
                      {sportPlatformGroupList?.map(group => (
                        <Select.Option key={group.platformGroupId} value={group.platformGroupId}>
                          {group.groupName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}
              </Form>
            </Col>
          </Row>
          {currentDate && ready && <CarouselDateSwitcher date={currentDate} onChange={this.handleCarouselDateChange} />}
        </Card>

        <GridBookingSchedule
          reload={this.fetchSportPlatformInfo}
          signPlatform={this.signPlatform}
          expiredDataAuth={expiredDataAuth}
        />

        {isTicket ? (
          <>
            <EditTicketModal
              visible={editTicketVisible}
              onOk={this.handleEditTicketOk}
              onVisibleChange={this.handleEditTicketVisibleChange}
              list={ticketPlatformList}
            />

            <SellTicketModal
              visible={sellTicketVisible}
              onOk={this.handleSellTicketOk}
              toFastSummaryByTicket={this.toFastSummaryByTicket}
              onVisibleChange={this.handleSellTicketVisibleChange}
              list={ticketPlatformList}
              canFastSummary={canFastSummary}
            />
          </>
        ) : (
          <>
            <PlatformLockModal
              visible={lockVisible}
              onOk={this.lockPlatformOk}
              onVisibleChange={this.handleLockVisibleChange}
              lockId={editLockId}
              list={lockPlatformList}
            />
          </>
        )}

        <SignPlatformModal
          visible={signPlatformVisible}
          onOk={signPlatformDealId ? code => this.handleCheck(code, signPlatformDealId) : this.handleGetCode}
          onVisibleChange={this.handleSignPlatformVisibleChange}
        />

        <TicketCheckResultModal
          visible={ticketCheckResultVisible}
          result={ticketCheckResult}
          onVerify={this.handleVerify}
          onOk={this.handleCheckTicket}
          onCancel={() => {
            this.handleTicketCheckResultVisibleChange(false);
            this.fetchSportPlatformInfo();
          }}
          onVisibleChange={this.handleTicketCheckResultVisibleChange}
        />
        {expiredDataAuth && (
          <FooterToolbar>
            {isEditMode && (
              <MarginBar left top right inline>
                <Button type="dashed" disabled={changegLocking} onClick={this.handleCancelEdit}>
                  取消编辑
                </Button>
              </MarginBar>
            )}
            {editLockId ? (
              <>
                <AuthComponent auth="lock" key="lock">
                  <MarginBar left top inline>
                    <Button
                      type="danger"
                      disabled={!someoneSelected}
                      loading={changegLocking}
                      onClick={this.toLockPlatform}
                    >
                      保存锁场
                    </Button>
                  </MarginBar>
                </AuthComponent>
              </>
            ) : (
              <>
                <Popover
                  onVisibleChange={this.handlePopoverVisibleChange}
                  content={
                    <Spin spinning={!!visitorNumberFetching}>
                      <div className={styles.dataAnalysis}>
                        {isTicket ? (
                          <>
                            <Row>
                              <Col span={18}>本时段入场人数</Col>
                              <Col span={6}>{allCellsOrderVisitorNumbers.curAccountNum}</Col>
                            </Row>
                            <MarginBar top>
                              <Row>
                                <Col span={18}>当天入场人数</Col>
                                <Col span={6}>{allCellsOrderVisitorNumbers.todayAccountNum}</Col>
                              </Row>
                            </MarginBar>
                            <MarginBar top>
                              <Row>
                                <Col span={18}>本时段员工入场数</Col>
                                <Col span={6}>{allCellsOrderVisitorNumbers.curEmpNum}</Col>
                              </Row>
                            </MarginBar>
                            <MarginBar top>
                              <Row>
                                <Col span={18}>当天员工入场数</Col>
                                <Col span={6}>{allCellsOrderVisitorNumbers.todayEmpNum}</Col>
                              </Row>
                            </MarginBar>
                            <MarginBar top>
                              <Row>
                                <Col span={18}>已售张数</Col>
                                <Col span={6} className={styles.dataAnalysisState2}>
                                  {allCellsOrderVisitorNumbers.salesNum}
                                </Col>
                              </Row>
                            </MarginBar>
                            <MarginBar top>
                              <Row>
                                <Col span={18}>已验张数</Col>
                                <Col span={6} className={styles.dataAnalysisState2}>
                                  {allCellsOrderVisitorNumbers.checkNum}
                                </Col>
                              </Row>
                            </MarginBar>
                            <MarginBar top>
                              <Row>
                                <Col span={18}>未验张数</Col>
                                <Col span={6} className={styles.dataAnalysisState1}>
                                  {allCellsOrderVisitorNumbers.unprovenNum}
                                </Col>
                              </Row>
                            </MarginBar>
                            <MarginBar top>
                              <Row>
                                <Col span={18}>可售张数</Col>
                                <Col span={6}>{allCellsOrderVisitorNumbers.surplusNum}</Col>
                              </Row>
                            </MarginBar>
                          </>
                        ) : (
                          <>
                            <Row>
                              <Col span={18}>当天入场总人数</Col>
                              <Col span={6} className={styles.dataAnalysisState2}>
                                {allCellsOrderVisitorNumbers.todayAccountNum}
                              </Col>
                            </Row>
                            <MarginBar top>
                              <Row>
                                <Col span={18}>当前入场总人数</Col>
                                <Col span={6} className={styles.dataAnalysisState2}>
                                  {allCellsOrderVisitorNumbers.curTotalAccountNum}
                                </Col>
                              </Row>
                            </MarginBar>
                            <MarginBar top>
                              <Row>
                                <Col span={18}>当前入场人数</Col>
                                <Col span={6} className={styles.dataAnalysisState2}>
                                  {allCellsOrderVisitorNumbers.todayAccountNum}
                                </Col>
                              </Row>
                            </MarginBar>
                            <MarginBar top>
                              <Row>
                                <Col span={18}>已验订单</Col>
                                <Col span={6} className={styles.dataAnalysisState2}>
                                  {allCellsOrderVisitorNumbers.checkNum}
                                </Col>
                              </Row>
                            </MarginBar>
                            <MarginBar top>
                              <Row>
                                <Col span={18}>未验订单</Col>
                                <Col span={6} className={styles.dataAnalysisState1}>
                                  {allCellsOrderVisitorNumbers.unprovenNum}
                                </Col>
                              </Row>
                            </MarginBar>
                            <MarginBar top>
                              <Row>
                                <Col span={18}>已结算订单</Col>
                                <Col span={6}>{allCellsOrderVisitorNumbers.salesNum}</Col>
                              </Row>
                            </MarginBar>
                          </>
                        )}
                      </div>
                    </Spin>
                  }
                  trigger="hover"
                  key="dataAnalysis"
                >
                  <Button icon="question-circle">数据分析</Button>
                </Popover>
                {someoneSelected &&
                  (isTicket
                    ? //
                      [
                        onlyOneSelected && (
                          <MarginBar left top inline key="toSpTicket">
                            <Button disabled={saving || locking} onClick={() => this.toSpTicket()}>
                              查看订单
                            </Button>
                          </MarginBar>
                        ),
                        <MarginBar left top inline key="checkSingle">
                          <Button
                            type="primary"
                            disabled={saving || locking}
                            onClick={() => this.handleCheckTicketWithCheckMode(false)}
                          >
                            拆分验票
                          </Button>
                        </MarginBar>,
                        <MarginBar left top inline key="checkAll">
                          <Button
                            type="primary"
                            disabled={saving || locking}
                            onClick={() => this.handleCheckTicketWithCheckMode(true)}
                          >
                            合并验票
                          </Button>
                        </MarginBar>,
                        <MarginBar left top inline key="editTicket">
                          <Button disabled={saving || locking} onClick={this.handleEditTicket}>
                            修改可售
                          </Button>
                        </MarginBar>,
                        availableForSale && (
                          <MarginBar left top inline key="sell">
                            <Button type="danger" disabled={locking} loading={saving} onClick={this.handleSellTicket}>
                              售票
                            </Button>
                          </MarginBar>
                        ),
                      ]
                    : //
                      [
                        !isEditMode && (
                          <AuthComponent auth="lock" key="lock">
                            <MarginBar left top inline>
                              <Button type="primary" loading={saving || locking} onClick={this.toLockPlatform}>
                                锁场
                              </Button>
                            </MarginBar>
                          </AuthComponent>
                        ),
                        canFastSummary && (
                          <MarginBar left top inline key="quickly">
                            <FastSaveOrderButton
                              loading={saving || locking}
                              totalPrice={totalPrice}
                              onSummary={this.toFastSummaryByPlatform}
                            >
                              快速结算
                            </FastSaveOrderButton>
                          </MarginBar>
                        ),
                        canFastSummary && (
                          <MarginBar left top inline key="individual">
                            <Button loading={saving || locking} onClick={() => this.handleNextStep(false, null, true)}>
                              散客结算
                            </Button>
                          </MarginBar>
                        ),
                        availableForSale && (
                          <MarginBar left top inline key="next">
                            <Button type="primary" disabled={saving || locking} onClick={() => this.handleNextStep()}>
                              下一步
                            </Button>
                          </MarginBar>
                        ),
                      ])}
                <MarginBar left top inline>
                  <Button disabled={saving || locking} onClick={() => this.signPlatform()}>
                    签到核验
                  </Button>
                </MarginBar>
              </>
            )}
          </FooterToolbar>
        )}
      </PageHeaderLayout>
    );
  }
}

export default Booking;
