import { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Row, Col, Input, Alert, Form, Button, Descriptions, Divider, message } from 'antd';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { push, replace } from 'connected-react-router';
import VenueSwitcher from '@/components/VenueSwitcher';
import Icon from '@/components/Icon';
import MarginBar from '@/components/MarginBar';
import AmountColor from '@/components/Amount/Color';
import AmountInput from '@/components/Amount/Input';
import ReceiptQRCodeDownloadModal from '@/components/Modal/ReceiptQRCodeDownloadModal';
import { encodeMoney, formatMoney, formatDateTime, formatPayPlatform } from '@/utils/format';
import { notification } from '@/utils/feedback';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import SuccessResult from './Success';
import ErrorResult from './Error';
import QRCode from './QRCode';
import style from './index.less';

@connect(({ payment, venue, deal, loading }) => ({
  payment,
  deal,
  currentVenue: venue.currentVenue,
  fetchingPayMeanlist: loading.effects['payment/fetchPayMeans'],
  fetchingScanQRCode: loading.effects['payment/fetchQRcode'],
}))
class ScanPay extends Component {
  gutter = 8;

  formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  static contextTypes = {
    isMobile: PropTypes.bool,
    playPayAudio: PropTypes.func,
    scanQRCode: PropTypes.func,
  };

  state = {
    number: undefined,
    userMessage: undefined,
    selectPaymodeInfo: undefined,
    currentPayment: undefined,
    currentPaymentState: undefined,

    scanValue: null,

    downloaderModalVisible: false,
    isBarPaying: false,
  };

  componentDidMount() {
    const { currentVenue, dispatch } = this.props;
    if (currentVenue) {
      dispatch({
        type: 'payment/fetchPayMeans',
        payload: {
          salesId: currentVenue.id,
        },
      });
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { dispatch, currentVenue } = this.props;
    const newCurrentVenue = nextProps.currentVenue;
    if (currentVenue.id !== newCurrentVenue.id) {
      this.clearSagaPolling();
      this.reset();
      dispatch({
        type: 'payment/fetchPayMeans',
        payload: {
          salesId: newCurrentVenue.id,
        },
      });
    }
  }

  componentWillUnmount() {
    this.clearSagaPolling();
    // this.reset();
    this.isUnmounted = true;
  }

  handleMoneyChange = value => {
    const { number = {} } = this.state;
    let num = Number(value);
    if (Number.isNaN(num)) {
      num = 0;
    }
    const emp = value == null || value.toString().trim().length === 0;
    this.setState(
      emp || num <= 0
        ? {
            number: {
              ...number,
              value,
              payMoney: 0,
              validateStatus: 'error',
              errorMsg: emp ? '请填写金额' : '请填写合法的金额',
            },
          }
        : {
            number: {
              ...number,
              value,
              payMoney: encodeMoney(num),
              validateStatus: null,
              errorMsg: null,
            },
          }
    );
  };

  handleUserMessageChange = e => {
    this.setState({
      userMessage: e.target.value,
    });
  };

  handleScanBtnClick = async (value, e) => {
    this.setState({
      scanValue: undefined,
      isBarPaying: true,
    });
    if (e.keyCode === 13) {
      this.handleCode(value);
      return;
    }
    const { scanQRCode } = this.context;
    scanQRCode(this.handleCode);
  };

  handleCode = async value => {
    const code = (value == null ? '' : value).trim();
    if (code.length === 0) {
      message.warn('条码内容为空，请纠正后重试！');
      return;
    }
    const { dispatch } = this.props;
    const { currentPayment } = this.state;
    dispatch({
      type: 'payment/barCodePay',
      payload: {
        content: currentPayment.payContent,
        authCode: value,
      },
    }).catch(() => {
      this.setState({
        isBarPaying: false,
      });
    });
  };

  handleScanValueChange = e => {
    this.setState({
      scanValue: e.target.value,
    });
  };

  handleEditorModalVisibleChange = downloaderModalVisible => {
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      downloaderModalVisible,
    });
  };

  handlePayMeanClick(payMeansId, payPlatform) {
    this.setState(
      () => ({
        scanValue: undefined,
      }),
      () => {
        const {
          payment: { payMeanlist },
        } = this.props;
        const { number } = this.state;
        if (number == null || number.payMoney <= 0) {
          this.setState({
            number: {
              ...number,
              validateStatus: 'error',
              errorMsg: number == null || number.payMoney === 0 ? '请填写金额' : '请填写合法的金额',
            },
          });
          return;
        }
        if (number.validateStatus) {
          return;
        }
        this.setState({
          selectPaymodeInfo: {
            ...(payMeanlist || []).find(item => item.payMeansId === payMeansId),
          },
        });
        this.fetchScanQRCode(payMeansId, payPlatform, number.payMoney || 0);
      }
    );
  }

  queryPaymentState = async () => {
    const {
      dispatch,
      deal: { PayStatus },
    } = this.props;

    const { currentPayment } = this.state;
    if (currentPayment == null) {
      return;
    }

    // saga轮询
    dispatch({
      type: 'deal/queryPayStatusPolling',
      payload: {
        dealId: currentPayment.dealId,
        expect: PayStatus.HASPAID.key,
      },
    })
      .then(res => {
        const { playPayAudio } = this.context;
        playPayAudio(res.payWay, currentPayment.qrPayAmount);
        this.setState({
          currentPaymentState: res,
          number: undefined,
          userMessage: undefined,
          scanValue: undefined,
        });
      })
      .catch(e => {
        // 重新发起
        if (e.name === 'FailedBrokenError') {
          notification.error('异常', e.message);
          this.queryPaymentState();
        }
      })
      .finally(() => {
        this.setState({
          isBarPaying: false,
        });
      });
  };

  print = () => {
    const { currentPayment } = this.state;
    if (currentPayment && currentPayment.orderId) {
      const { dispatch } = this.props;
      dispatch(replace(`/basic/deal/${currentPayment.orderId}/print`));
    }
  };

  goToStatPayment = () => {
    const { dispatch } = this.props;
    dispatch(push('/basic/deal/scan'));
  };

  goToDealDetail = () => {
    const { currentPaymentState } = this.state;
    if (currentPaymentState && currentPaymentState.dealPayState === 1) {
      const { dispatch } = this.props;
      dispatch(replace(`/basic/deal/${currentPaymentState.orderId}/detail`));
    }
  };

  reset = () => {
    this.setState({
      selectPaymodeInfo: undefined,
      currentPayment: undefined,
      currentPaymentState: undefined,
    });
  };

  showDownloaderModal = () => {
    this.handleEditorModalVisibleChange(true);
  };

  async fetchScanQRCode(payMeansId, payPlatform, payMoney) {
    this.clearSagaPolling();
    const { currentVenue = {}, dispatch } = this.props;
    const { userMessage } = this.state;
    const data = await dispatch({
      type: 'payment/fetchQRcode',
      payload: {
        payWayId: payMeansId || 0,
        salesId: currentVenue.id,
        payWay: payPlatform,
        payMoney,
        descr: userMessage == null ? '' : userMessage.trim(),
      },
    });
    this.setState({
      currentPayment: data,
    });
    if (this.barCodeNode) {
      this.barCodeNode.focus();
    }
    this.queryPaymentState();
  }

  clearSagaPolling() {
    const { dispatch } = this.props;
    dispatch({
      type: 'deal/breakPolling',
    });
  }

  render() {
    const { isMobile } = this.context;
    const { currentVenue = {}, fetchingPayMeanlist, payment, fetchingScanQRCode, deal } = this.props;
    const {
      number,
      userMessage,
      selectPaymodeInfo = {},
      currentPayment,
      currentPaymentState,
      scanValue,
      downloaderModalVisible,
      isBarPaying,
    } = this.state;
    const { PayPlatform, payMeanlist: plist } = payment;
    const { PayStatus } = deal;
    const payMeanlist = plist || [];
    const { dealPayState } = currentPaymentState || {};
    const showResult = dealPayState && dealPayState !== PayStatus.UNPAID.key;

    const formProps = {
      ...this.formItemLayout,
      labelAlign: 'left',
    };
    return (
      <PageHeaderLayout>
        {showResult ? (
          <>
            {dealPayState === PayStatus.HASPAID.key ? (
              <SuccessResult
                currentPayment={currentPayment}
                currentPaymentState={currentPaymentState}
                onBack={this.reset}
                onPrint={this.print}
                onToDealDetail={this.goToDealDetail}
              />
            ) : (
              <ErrorResult currentPaymentState={currentPaymentState} onBack={this.reset} />
            )}
          </>
        ) : (
          <>
            <Row gutter={this.gutter}>
              <Col sm={24} md={16} lg={18}>
                <Card>
                  <Row>
                    <Col span={isMobile ? 24 : 16}>
                      <VenueSwitcher />
                    </Col>
                    <Col span={isMobile ? 24 : 8} className="text-right">
                      <MarginBar top={isMobile}>
                        {payMeanlist.length > 0 && <Button onClick={this.showDownloaderModal}>下载收款码</Button>}
                        <MarginBar left inline>
                          <Button type="primary" onClick={this.goToStatPayment}>
                            支付统计
                          </Button>
                        </MarginBar>
                      </MarginBar>
                    </Col>
                  </Row>
                </Card>
                <Card loading={fetchingPayMeanlist} title="收银台" extra={`收款方：${currentVenue.salesName || ''}`}>
                  {payMeanlist.length === 0 ? (
                    <div className="text-center">无可用支付方式</div>
                  ) : (
                    <div>
                      <Row gutter={this.gutter}>
                        <Col sm={24} md={12}>
                          <AmountForm
                            handleMoneyChange={this.handleMoneyChange}
                            number={number}
                            formProps={formProps}
                          />
                        </Col>
                        <Col sm={24} md={12}>
                          <Form {...formProps}>
                            <Form.Item label="备注">
                              <Input placeholder="请输入" onChange={this.handleUserMessageChange} value={userMessage} />
                            </Form.Item>
                          </Form>
                        </Col>
                      </Row>
                      <Row gutter={this.gutter}>
                        {payMeanlist.map(item => (
                          <Col
                            sm={24}
                            md={12}
                            key={item.payMeansId}
                            onClick={() => {
                              if (fetchingScanQRCode) {
                                return;
                              }
                              this.handlePayMeanClick(item.payMeansId, item.payPlatform);
                            }}
                          >
                            <MarginBar top>
                              <PayMean item={item} PayPlatform={PayPlatform} loading={fetchingScanQRCode} />
                            </MarginBar>
                          </Col>
                        ))}
                      </Row>
                      {currentPayment && (
                        <>
                          <Input.Search
                            className={style.mainMargin}
                            size="large"
                            placeholder={
                              isBarPaying
                                ? '等待响应结果，可能需要顾客输入密码以确认支付...'
                                : `扫顾客${formatPayPlatform(currentPayment.payWay)}付款一维/二维码, 收款${
                                    number?.value || 0
                                  }元`
                            }
                            onSearch={this.handleScanBtnClick}
                            value={scanValue}
                            onChange={this.handleScanValueChange}
                            enterButton="扫码"
                            disabled={isBarPaying}
                            loading={isBarPaying}
                            ref={node => {
                              this.barCodeNode = node;
                            }}
                          />
                          <MarginBar top>
                            <Alert message="使用扫码枪扫码前，请确保光标定位在上方输入框内！" type="info" showIcon />
                          </MarginBar>
                        </>
                      )}
                    </div>
                  )}
                </Card>
                {currentPayment && (
                  <Card
                    loading={fetchingScanQRCode}
                    title="订单信息"
                    extra={
                      <span>
                        合计： <AmountColor>{formatMoney(currentPayment.qrPayAmount)}</AmountColor> 元
                      </span>
                    }
                  >
                    {currentPayment.opUser && (
                      <>
                        <Descriptions column={1}>
                          <Descriptions.Item label="会员">{currentPayment.opUser}(散客结算)</Descriptions.Item>
                        </Descriptions>
                        <Divider />
                      </>
                    )}
                    <Descriptions>
                      {currentPayment.dealId && (
                        <Descriptions.Item label="订单号">{currentPayment.dealId}</Descriptions.Item>
                      )}
                      {/* {currentPayment.dealId && (
                        <Descriptions.Item label="支付订单号">{currentPayment.dealId}</Descriptions.Item>
                      )}
                      {currentPayment.flowId && (
                        <Descriptions.Item label="支付流水号">{currentPayment.flowId}</Descriptions.Item>
                      )} */}
                      {currentPayment.payWay >= 0 && (
                        <Descriptions.Item label="支付方式">
                          {formatPayPlatform(currentPayment.payWay)}
                        </Descriptions.Item>
                      )}
                      {currentPayment.createRealName && (
                        <Descriptions.Item label="创建人">{currentPayment.createRealName}</Descriptions.Item>
                      )}
                      {currentPayment.dealTime && (
                        <Descriptions.Item label="下单时间">
                          {formatDateTime(currentPayment.dealTime)}
                        </Descriptions.Item>
                      )}
                      {currentPayment.salesName && (
                        // TODO 后台目前返回0
                        <Descriptions.Item label="营销中心">{currentPayment.salesName}</Descriptions.Item>
                      )}
                    </Descriptions>
                  </Card>
                )}
              </Col>
              <Col sm={24} md={8} lg={6}>
                <QRCode
                  loading={fetchingScanQRCode}
                  currentPayment={currentPayment}
                  selectPaymodeInfo={selectPaymodeInfo}
                />
              </Col>
              <ReceiptQRCodeDownloadModal
                footer={null}
                visible={downloaderModalVisible}
                onVisibleChange={this.handleEditorModalVisibleChange}
              />
            </Row>
          </>
        )}
      </PageHeaderLayout>
    );
  }
}

const AmountForm = ({ handleMoneyChange, number = {}, formProps }) => {
  return (
    <Form {...formProps}>
      <Form.Item label="金额" validateStatus={number.validateStatus} help={number.errorMsg}>
        <AmountInput
          disabled={number.disabled}
          precision={2}
          value={number.value}
          min={0}
          fullWidth
          onChange={handleMoneyChange}
        />
      </Form.Item>
    </Form>
  );
};

const PayMean = ({ item, PayPlatform }) => {
  const { payPlatform, payAccount, payWayShowName } = item;
  const cardClassName = classNames(style.payMean, {
    [style.mixedBg]: payPlatform === PayPlatform.Mixed.key,
    [style.wechatBg]: payPlatform === PayPlatform.Weixin.key, // 新支付系统的key与订单里的支付key不对等
    [style.alipayBg]: payPlatform === PayPlatform.Zfb.key,
  });
  let type;
  switch (payPlatform) {
    case PayPlatform.Mixed.key:
      type = 'mixedpay2';
      break;
    case PayPlatform.Weixin.key:
      type = 'wxpay2';
      break;
    case PayPlatform.Zfb.key:
      type = 'alipay2';
      break;
    default:
      break;
  }
  return (
    <Card className={cardClassName}>
      <div className={style.payMeanBody}>
        <Icon type={type} />
        <div>
          <div>{payWayShowName || formatPayPlatform(payPlatform)}</div>
          <div className="text-overflow">{payAccount}</div>
        </div>
      </div>
    </Card>
  );
};

export default ScanPay;
