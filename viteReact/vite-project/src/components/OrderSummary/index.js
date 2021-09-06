import { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Spin, Row, Col, Divider, Form, Input, Popover, message } from 'antd';
import { connect } from 'react-redux';
import { push, replace, goBack } from 'connected-react-router';
import { Link } from 'react-router-dom';
import DealInfoDetail from '@/components/DealInfoDetail';
import MarginBar from '@/components/MarginBar';
import FooterToolbar from '@/components/FooterToolbar';
import PubServiceCard from '@/components/PubServiceCard';
import AmountColor from '@/components/Amount/Color';
import { formatMoney } from '@/utils/format';
import { sub, add } from '@/commons/lib/math';
import { isBeforeToday, isSameDay } from '@/utils/utils';
import PayMean from './PayMean';
import style from './index.less';

@connect(({ deal, booking, orderprocessing, loading }) => ({
  deal,
  booking,
  orderprocessing,
  fetchOrderLoading: loading.effects['orderprocessing/fetchOrder'],
  isFetchingDealPay: loading.effects['orderprocessing/fetchDealPay'],
  updateOrderLoading:
    loading.effects['orderprocessing/saveMessage'] || loading.effects['orderprocessing/checkOutOrderJustUpdate'],
  calculatIng: loading.effects['orderprocessing/calcPubServicePrice'],
}))
class OrderSummary extends Component {
  static contextTypes = {
    isAuthorized: PropTypes.func,
  };

  constructor(props) {
    super(props);
    // const {
    //   deal: { PayWayTypes: dealPayMode },
    // } = this.props;
    this.formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    this.state = {
      mainData: {},
      // 账户支付
      balancePayChecked: true,
      balancePayAmount: 0,
      // 组合支付方式
      otherPayMeansId: 0,
      otherPayMode: null, // 默认第一个其他支付
      // 组合支付金额
      otherPayAmount: 0,

      // 订单总价
      orderTotalAmount: 0,
      // 订单支付总价
      orderTotalPayAmount: 0,

      // 优惠
      discountedAmount: 0,
      // 服务抵扣
      serviceDeductedAmount: 0,

      // 选中的会员服务
      selectedPubServiceId: undefined,

      // 会员服务计算信息缓存
      pubServiceCouponCache: {},

      // 当前价格配置
      newPriceInfoList: null,

      sellerMessage: null,
      userMessage: null,

      unknown: true,

      // 仅显示可用的会员服务
      onlyShowAvailablePubService: true,
    };
  }

  componentDidMount() {
    const {
      deal: { PayStatus, PayWayTypes },
      match: { params },
      dispatch,
    } = this.props;
    dispatch({
      type: 'orderprocessing/fetchOrder',
      payload: {
        id: params.id,
      },
    }).then(data => {
      if (data === false) {
        return; // 为未修复的bug情况阻断
      }
      const mainData = data || {};
      const { commonPayMeans = [], dealInfo = {}, pubServiceAccount } = mainData;
      const deal = dealInfo.deal || {};
      const hasNoPay = deal.dealPayState === PayStatus.UNPAID.key;
      if (!hasNoPay) {
        dispatch(replace(`/basic/deal/${deal.id}`));
        return;
      }

      const payInfo = dealInfo.payInfo || {};

      const { defaultOtherPayMode, defaultOtherPayMeansId } = this.getDefaultOtherPayInfo(mainData);
      if (this.isUnmounted) {
        return;
      }
      this.setState({
        mainData: {
          ...mainData,
          // 会员账户也由后台生成
          commonPayMeans: [...commonPayMeans],
        },
        otherPayMeansId: defaultOtherPayMeansId,
        otherPayMode: defaultOtherPayMode,

        sellerMessage: deal.sellerMessage,
        userMessage: deal.userMessage,
      });

      // FIXME 保存的订单后台返回是没有payInfo的 这里实际拿不到服务卡信息了
      const pubServiceAccountId = (payInfo.payList || []).find(
        payWay => payWay.tradeWay === PayWayTypes.PUBSERVICE.key
      )?.tradeWayDataId;
      if (pubServiceAccountId) {
        this.handlePubServiceSwitch(pubServiceAccountId, pubServiceAccount || []);
      }
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  // 当白条为当前支付方式时处理白条额度不足
  handleCreditAmountInsufficient(otherPayAmount) {
    const {
      deal: { PayWayTypes: dealPayMode },
    } = this.props;
    const { otherPayMode, mainData } = this.state;
    const publicAccount = mainData.publicAccount || {};
    // 白条支付
    const isCredit = otherPayMode === dealPayMode.CREDIT.key;
    // 如果当前是白条，被动金额不足时切换支付方式，白条自己判断禁用
    if (isCredit && publicAccount.creditBalance < otherPayAmount) {
      const { defaultOtherPayMode, defaultOtherPayMeansId } = this.getDefaultOtherPayInfo();
      this.setState({
        otherPayMode: defaultOtherPayMode,
        otherPayMeansId: defaultOtherPayMeansId,
      });
    }
  }

  getDefaultOtherPayInfo(mainData) {
    const {
      deal: { PayWayTypes: dealPayMode },
    } = this.props;
    const { otherPayMeansId, otherPayMode, mainData: stateMainData } = this.state;
    const { commonPayMeans = [] } = mainData || stateMainData;
    let defaultOtherPayMode = otherPayMode;
    let defaultOtherPayMeansId = otherPayMeansId;
    const firstPay = commonPayMeans.find(item => item.payWay !== dealPayMode.ACCOUNT.key);
    if (firstPay) {
      defaultOtherPayMode = firstPay.payWay;
      defaultOtherPayMeansId = firstPay.payMeansId;
    }
    // const aliPay = commonPayMeans.find(item => item.payMode === dealPayMode.ZFB.key);
    // if (aliPay) {
    //   defaultOtherPayMode = aliPay.payMode;
    //   defaultOtherPayMeansId = aliPay.payMeansId;
    // }
    // const wechatPay = commonPayMeans.find(item => item.payMode === dealPayMode.WECHAT.key);
    // if (wechatPay) {
    //   defaultOtherPayMode = wechatPay.payMode;
    //   defaultOtherPayMeansId = wechatPay.payMeansId;
    // }
    return {
      defaultOtherPayMode,
      defaultOtherPayMeansId,
    };
  }

  handleGoBack = () => {
    const { dispatch } = this.props;
    const {
      mainData: { flush, dealInfo = {} },
    } = this.state;
    if (flush) {
      const { deal, dealPlatformList, dealItemList, dealServicePubList, dealTicketList, dealCourseList } = dealInfo;
      //  服务人员没有单独的购买渠道，依附定场，有服务人员一定有定场
      if (dealPlatformList && dealPlatformList.length > 0) {
        dispatch({
          type: 'booking/switchBookingEnv',
          payload: {
            salesId: deal.salesId,
            itemId: dealPlatformList[0].professionalId,
            curDate: dealPlatformList[0].orderDate,
          },
        }).then(() => {
          dispatch(
            push({
              pathname: '/basic/platform/booking/booking',
              search: `id=${deal.id}`,
            })
          );
        });
        return;
      }
      dispatch({
        type: 'orderprocessing/switchEnv',
        payload: {
          salesId: deal.salesId,
        },
      }).then(() => {
        if (dealItemList && dealItemList.length > 0) {
          dispatch(
            push({
              pathname: '/basic/mall/sell/mall',
              search: `id=${deal.id}`,
            })
          );
          return;
        }
        if (dealServicePubList && dealServicePubList.length > 0) {
          dispatch(
            push({
              pathname: `/basic/pub/pubservice/${dealServicePubList[0].serviceId}/sell`,
              search: `id=${deal.id}`,
            })
          );
          return;
        }
        if (dealTicketList && dealTicketList.length > 0) {
          dispatch(
            push({
              pathname: `/basic/ticket/sell/${dealTicketList[0].dataId}/user`,
              search: `id=${deal.id}`,
            })
          );
          return;
        }
        if (dealCourseList && dealCourseList.length > 0) {
          dispatch(
            push({
              pathname: `/basic/course/sell/${dealCourseList[0].courseDataId}/user`,
              search: `id=${deal.id}`,
            })
          );
          return;
        }
        message.error('未实现的订单预览返回类型');
      });
      return;
    }
    dispatch(goBack());
  };

  handleBalanceChecked = checked => {
    this.setState({
      balancePayChecked: checked,
    });
    if (!checked) {
      const { orderTotalPayAmount } = this.state;
      this.setState({
        balancePayAmount: 0,
        otherPayAmount: orderTotalPayAmount,
      });
      this.handleCreditAmountInsufficient(orderTotalPayAmount);
    }
  };

  handleBalanceChange = value => {
    const { orderTotalPayAmount } = this.state;
    const newValue = Math.max(0, value || 0);
    const otherPayAmount = sub(orderTotalPayAmount, newValue);
    this.setState({
      balancePayAmount: newValue,
      otherPayAmount,
    });
    this.handleCreditAmountInsufficient(otherPayAmount);
  };

  handleOtherPayChecked = (checked, { payMeansId, payWay }) => {
    // radio 始终上checked切换
    if (checked) {
      this.setState({
        otherPayMeansId: payMeansId,
        otherPayMode: payWay,
      });
    }
  };

  handleOtherPayChange = value => {
    const { orderTotalPayAmount } = this.state;
    const isAmountTopUp = this.isAmountTopUp();
    const newValue = Math.max(0, value || 0);
    const balancePayAmount = isAmountTopUp ? 0 : sub(orderTotalPayAmount, newValue);
    this.setState({
      otherPayAmount: isAmountTopUp ? orderTotalPayAmount : newValue,
      balancePayAmount,
    });
    if (balancePayAmount > 0) {
      this.setState({
        balancePayChecked: true,
      });
    }
  };

  handleTotalAmountChange = (unknown, orderAmount, discountedAmount, serviceDeductedAmount, newPriceInfoList) => {
    const { mainData } = this.state;
    const publicAccount = mainData.publicAccount || {};
    const amount = sub(orderAmount, serviceDeductedAmount);
    const isAmountTopUp = this.isAmountTopUp();
    const balancePayAmount = isAmountTopUp ? 0 : Math.min(amount || 0, publicAccount.amountAvail || 0);
    const otherPayAmount = sub(amount, balancePayAmount);
    this.setState({
      unknown,
      orderTotalAmount: orderAmount,
      orderTotalPayAmount: amount,
      balancePayAmount,
      balancePayChecked: !isAmountTopUp,
      otherPayAmount,
      discountedAmount,
      serviceDeductedAmount,
      newPriceInfoList,
    });
    this.handleCreditAmountInsufficient(otherPayAmount);
  };

  handleBeforeDetailEdit = () => {
    this.setState({
      selectedPubServiceId: null,
    });
  };

  handleSaveMessage = () => {
    const { sellerMessage, userMessage } = this.state;
    if (
      (sellerMessage == null || sellerMessage.trim().length === 0) &&
      (userMessage == null || userMessage.trim().length === 0)
    ) {
      message.warning('请填写备注');
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'orderprocessing/saveMessage',
      payload: {
        sellerMessage: sellerMessage == null ? '' : sellerMessage,
        userMessage: userMessage == null ? '' : userMessage,
      },
    }).then(() => {
      message.success('保存成功');
    });
  };

  handleCheckOut = async justUpdate => {
    const {
      dispatch,
      deal: { PayWayTypes: dealPayMode, PayStatus },
    } = this.props;
    const {
      mainData: {
        dealInfo: { deal },
      },
      balancePayAmount,
      balancePayChecked,

      selectedPubServiceId,
      serviceDeductedAmount,

      otherPayAmount,
      otherPayMode,
      otherPayMeansId,

      newPriceInfoList,

      sellerMessage,
      userMessage,
    } = this.state;
    const dealPayInfo = [];
    const dealPriceInfo = newPriceInfoList;
    if (selectedPubServiceId) {
      // 会员服务
      dealPayInfo.push({
        payAmount: serviceDeductedAmount,
        payWay: dealPayMode.PUBSERVICE.key,
        payWayId: selectedPubServiceId,
      });
    }
    // 账户支付
    if (balancePayChecked && balancePayAmount > 0) {
      dealPayInfo.push({
        payAmount: balancePayAmount,
        payWay: dealPayMode.ACCOUNT.key,
        payWayId: deal.pubAccountId,
      });
    }
    if (otherPayAmount > 0) {
      dealPayInfo.push({
        payAmount: otherPayAmount,
        payWay: otherPayMode,
        payWayId:
          otherPayMode === dealPayMode.POINTS.key || otherPayMode === dealPayMode.CREDIT.key
            ? deal.pubAccountId // 积分支付用会员id
            : otherPayMeansId,
      });
    }
    const payload = {
      dealPayInfo,
      dealPriceInfo,
      sellerMessage: sellerMessage == null ? '' : sellerMessage,
      userMessage: userMessage == null ? '' : userMessage,
    };
    if (justUpdate) {
      const commonPayId = await dispatch({
        type: 'orderprocessing/checkOutOrderJustUpdate',
        payload,
      });
      if (commonPayId) {
        message.success('保存成功');
      }
      return;
    }

    const dealLoad = {
      dealPayInfo,
      dealPriceInfo,
      sellerMsg: sellerMessage == null ? '' : sellerMessage,
      buyerMsg: userMessage == null ? '' : userMessage,
    };
    const dealPay = await dispatch({
      type: 'orderprocessing/fetchDealPay',
      payload: dealLoad,
    });
    if (dealPay.dealPayState === PayStatus.UNPAID.key) {
      if (
        otherPayAmount > 0 &&
        (otherPayMode === dealPayMode.WECHAT.key ||
          otherPayMode === dealPayMode.ZFB.key ||
          otherPayMode === dealPayMode.GROUP.key)
      ) {
        dispatch(
          push({
            pathname: './pay',
            search: `content=${dealPay.payContent}`,
          })
        );
      }
    } else {
      dispatch(
        push({
          pathname: './result',
          search: `id=${deal.id}`,
        })
      );
    }
  };

  handlePubServiceSwitch = (pubServiceId, pubServiceAccount) => {
    // 有值是选中，无值是去掉选中
    if (pubServiceId) {
      const { pubServiceCouponCache } = this.state;
      // 如果之前选中的会员服务现在已经不可使用，则阻止默认勾选
      // 这里没有在初始化成功后切换服务时也判断可用，因为那个时候能点击的都是可用的，页面数据滞后另说，web页面本就如此
      if (pubServiceAccount && !pubServiceAccount.some(item => item.id === pubServiceId && item.serviceState === 0)) {
        return;
      }
      const couponInfo = pubServiceCouponCache[pubServiceId];
      if (couponInfo == null) {
        const { dispatch } = this.props;
        dispatch({
          type: 'orderprocessing/calcPubServicePrice',
          payload: pubServiceId,
        }).then(data => {
          if (data) {
            this.setState({
              pubServiceCouponCache: {
                ...pubServiceCouponCache,
                [pubServiceId]: data,
              },
            });
          }
        });
      }
    }
    this.setState({
      selectedPubServiceId: pubServiceId,
    });
  };

  handleUserMessageChange = e => {
    this.setState({
      userMessage: e.target.value,
    });
  };

  handleSellerMessageChange = e => {
    this.setState({
      sellerMessage: e.target.value,
    });
  };

  handleSwitchShowAvailablePubService = () => {
    this.setState(({ onlyShowAvailablePubService }) => ({
      onlyShowAvailablePubService: !onlyShowAvailablePubService,
    }));
  };

  isAmountTopUp() {
    const { mainData } = this.state;
    const { dealInfo } = mainData;
    return !!(dealInfo && dealInfo.dealPublicAccountList && dealInfo.dealPublicAccountList?.length > 0);
  }

  canBackToEdit() {
    const { mainData } = this.state;
    const { dealInfo } = mainData;
    const { dealPlatformList, dealItemList, dealServicePubList, dealTicketList, dealCourseList } = dealInfo || {};
    //  服务人员没有单独的购买渠道，依附定场，有服务人员一定有定场
    return (
      (dealPlatformList && dealPlatformList.length > 0) ||
      (dealItemList && dealItemList.length > 0) ||
      (dealServicePubList && dealServicePubList.length > 0) ||
      (dealTicketList && dealTicketList.length > 0) ||
      (dealCourseList && dealCourseList.length > 0)
    );
  }

  render() {
    const {
      deal: { PayWayTypes: dealPayMode, DealStatus, PayStatus },
      fetchOrderLoading,
      updateOrderLoading,
      isFetchingDealPay,
      calculatIng,
    } = this.props;
    const {
      mainData,
      balancePayChecked,
      balancePayAmount,
      otherPayMeansId,
      otherPayMode,
      otherPayAmount,
      orderTotalAmount,
      orderTotalPayAmount,
      discountedAmount,
      serviceDeductedAmount,
      selectedPubServiceId,
      pubServiceCouponCache,
      sellerMessage,
      userMessage,
      unknown,
      onlyShowAvailablePubService,
    } = this.state;

    const { dealInfo, commonPayMeans = [] } = mainData;
    const { id, salesName, dealState, dealPayState } = dealInfo?.deal || {};
    const { dealPlatformList } = dealInfo || {};

    const pubServiceAccount = mainData.pubServiceAccount || [];
    const publicAccount = mainData.publicAccount || {};

    const currentPayMode = Object.values(dealPayMode).find(item => item.key === otherPayMode);

    const pubServiceCoupon = pubServiceCouponCache[selectedPubServiceId];

    const selectedPubServiceAccount = pubServiceAccount.find(item => item.id === selectedPubServiceId);

    const { isAuthorized } = this.context;
    // expired-data-operation 只对场地控制
    const expiredDataAuth =
      dealPlatformList == null ||
      dealPlatformList.length === 0 ||
      isAuthorized('expired-data-operation') ||
      isSameDay(dealPlatformList[0].orderDate, Date.now()) ||
      !isBeforeToday(dealPlatformList[0].orderDate);

    const isAmountTopUp = this.isAmountTopUp();
    const isPortalWaiting = dealState === DealStatus.BOOKING.key;
    const hasNoPay = dealPayState === PayStatus.UNPAID.key;
    const canBackToEdit = hasNoPay && !isPortalWaiting && this.canBackToEdit() && expiredDataAuth;

    const accountPayMeans = commonPayMeans.find(item => item.payWay === dealPayMode.ACCOUNT.key);

    return fetchOrderLoading ? (
      <Spin />
    ) : (
      <>
        <Card>
          <Card title={`订单清单信息（主订单号：${id || ''}）${salesName || ''}`} type="inner">
            <DealInfoDetail
              dealInfo={dealInfo}
              isOrderSummary
              pubServiceCoupon={pubServiceCoupon}
              // wrapClassName={}
              onBeforeEdit={this.handleBeforeDetailEdit}
              onDataChange={this.handleTotalAmountChange}
            />
          </Card>
          {pubServiceAccount.length > 0 && (
            <MarginBar top>
              <Card
                title="使用优惠服务/卡/券/抵用"
                type="inner"
                extra={
                  <Button type="primary" onClick={this.handleSwitchShowAvailablePubService}>
                    {onlyShowAvailablePubService ? '显示' : '隐藏'}不可用的
                  </Button>
                }
              >
                {pubServiceAccount.map(item => {
                  const { serviceState } = item;
                  if (onlyShowAvailablePubService && serviceState !== 0) {
                    return null;
                  }
                  return (
                    <PubServiceCard
                      key={item.id}
                      data={item}
                      onClick={this.handlePubServiceSwitch}
                      selected={selectedPubServiceAccount === item}
                      showWhy={!onlyShowAvailablePubService}
                    />
                  );
                })}
              </Card>
            </MarginBar>
          )}
          <MarginBar top>
            <Card title="支付方式" type="inner" extra="(可选择单一或多种支付方式、最多选择两类支付方式组合支付)">
              <Form>
                <Row>
                  <Col sm={24} md={12}>
                    <div>
                      <Link to={`/basic/pub/info/${publicAccount.id}`}>
                        {publicAccount.mobile}
                        <Divider type="vertical" />
                        {publicAccount.realName}
                      </Link>
                      <Divider type="vertical" />
                      账户余额(元)
                      <Divider type="vertical" />
                      <AmountColor>{formatMoney(publicAccount.amountAvail)}</AmountColor>
                    </div>
                    {accountPayMeans && (
                      <Form.Item>
                        <PayMean
                          data={accountPayMeans}
                          checked={balancePayChecked}
                          disabled={isAmountTopUp}
                          min={0}
                          max={isAmountTopUp ? 0 : Math.min(publicAccount.amountAvail || 0, orderTotalPayAmount || 0)}
                          onChecked={this.handleBalanceChecked}
                          onChange={this.handleBalanceChange}
                          value={balancePayAmount}
                        />
                      </Form.Item>
                    )}
                    {commonPayMeans
                      .filter(item => item.payWay !== dealPayMode.ACCOUNT.key)
                      .map(item => {
                        const chk = otherPayMeansId === item.payMeansId && otherPayMode === item.payWay;
                        // 白条支付
                        const isCredit = item.payWay === dealPayMode.CREDIT.key;
                        const disabled =
                          isCredit &&
                          (publicAccount.creditBalance < otherPayAmount ||
                            publicAccount.creditBalance <= 0 ||
                            add(publicAccount.amountAvail, publicAccount.creditBalance) < orderTotalPayAmount);

                        const chkMin = isAmountTopUp
                          ? orderTotalPayAmount || 0
                          : sub(orderTotalPayAmount, publicAccount.amountAvail);
                        const min = Math.max(0, chk ? chkMin : 0);

                        const coMax = isCredit
                          ? Math.min(orderTotalPayAmount || 0, publicAccount.creditBalance || 0)
                          : orderTotalPayAmount;
                        const max = isAmountTopUp ? orderTotalPayAmount : coMax;
                        return (
                          <Form.Item
                            key={`${item.payMeansId}-${item.payWay}`}
                            help={
                              isCredit
                                ? `*白条可用额度：${formatMoney(publicAccount.creditBalance)} 总额度：${formatMoney(
                                    publicAccount.creditLimit
                                  )}`
                                : null
                            }
                          >
                            <PayMean
                              data={item}
                              checked={chk}
                              disabled={disabled}
                              min={min}
                              max={max}
                              onChecked={checked => this.handleOtherPayChecked(checked, item)}
                              onChange={this.handleOtherPayChange}
                              value={chk ? otherPayAmount : 0}
                            />
                          </Form.Item>
                        );
                      })}
                  </Col>
                  <Col sm={24} md={12}>
                    <Form.Item style={{ margin: 0 }} {...this.formItemLayout} label="订单总价">
                      <AmountColor inputSize>{formatMoney(orderTotalAmount)}</AmountColor>
                    </Form.Item>
                    <Form.Item style={{ margin: 0 }} {...this.formItemLayout} label="账户支付">
                      <AmountColor inputSize>{formatMoney(balancePayAmount)}</AmountColor>
                    </Form.Item>
                    {currentPayMode && (
                      <Form.Item style={{ margin: 0 }} {...this.formItemLayout} label={`${currentPayMode.value}支付`}>
                        <AmountColor inputSize>{formatMoney(otherPayAmount)}</AmountColor>
                      </Form.Item>
                    )}
                    <Form.Item style={{ margin: 0 }} {...this.formItemLayout} label="优惠服务">
                      {selectedPubServiceAccount != null && selectedPubServiceAccount.serviceName}
                      {discountedAmount > 0 || serviceDeductedAmount > 0 ? (
                        <span className={style.coupon}>
                          {discountedAmount > 0 && (
                            <>
                              &nbsp;优惠&nbsp;
                              <AmountColor inputSize>{formatMoney(discountedAmount)}</AmountColor>
                            </>
                          )}
                          {serviceDeductedAmount > 0 && (
                            <>
                              &nbsp;会员服务账户抵扣&nbsp;
                              <AmountColor inputSize>{formatMoney(serviceDeductedAmount)}</AmountColor>
                            </>
                          )}
                        </span>
                      ) : (
                        <AmountColor inputSize>0.00</AmountColor>
                      )}
                    </Form.Item>
                    <Divider />
                    <Form.Item
                      {...this.formItemLayout}
                      label="订单备注"
                      help="*此【订单备注】只内部显示, 限50个字符以内"
                    >
                      <Input value={userMessage} maxLength={50} onChange={this.handleUserMessageChange} />
                    </Form.Item>
                    <Form.Item
                      {...this.formItemLayout}
                      label="商家留言"
                      help="*此【商家留言】将显示在用户终端, 限16个字符以内"
                    >
                      <Input value={sellerMessage} maxLength={16} onChange={this.handleSellerMessageChange} />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          </MarginBar>
        </Card>
        <FooterToolbar>
          <MarginBar left top inline>
            <Button
              type="primary"
              disabled={calculatIng}
              loading={updateOrderLoading}
              onClick={() => this.handleCheckOut(true)}
            >
              保存订单
            </Button>
          </MarginBar>
          {/* <MarginBar left top inline>
            <Button
              disabled={checkoutLoading || calculatIng}
              loading={updateOrderLoading}
              onClick={this.handleSaveMessage}
            >
              保存备注
            </Button>
          </MarginBar> */}
          {canBackToEdit && (
            <MarginBar left top inline>
              <Button disabled={updateOrderLoading || calculatIng} onClick={this.handleGoBack}>
                返回修改
              </Button>
            </MarginBar>
          )}
          {hasNoPay &&
            !isPortalWaiting &&
            (unknown ? (
              <MarginBar left top inline>
                <Popover title="无法支付" content="未能识别的订单类型">
                  <Button disabled>无法支付</Button>
                </Popover>
              </MarginBar>
            ) : (
              expiredDataAuth && (
                <MarginBar left top inline>
                  <Button
                    disabled={updateOrderLoading || calculatIng}
                    loading={isFetchingDealPay}
                    type="primary"
                    onClick={() => this.handleCheckOut()}
                  >
                    去支付
                  </Button>
                </MarginBar>
              )
            ))}
        </FooterToolbar>
      </>
    );
  }
}

export default OrderSummary;
