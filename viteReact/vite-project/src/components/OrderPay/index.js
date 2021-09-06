import { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Card, Row, Col, Input, Alert, Button } from 'antd';
import { connect } from 'react-redux';
import { goBack, replace } from 'connected-react-router';
import { formatMoney, formatPayPlatform } from '@/utils/format';
import { CDN_STATIC_HOST } from '@/utils/utils';
import { notification } from '@/utils/feedback';
import MarginBar from '@/components/MarginBar';
import AmountColor from '@/components/Amount/Color';
import Modal from '@/components/Modal';
import FooterToolbar from '@/components/FooterToolbar';
import WeixinSubscribeQrCodeTip from '@/components/ScanCode/WeixinSubscribeQrCodeTip';
import style from './index.less';

@connect(({ orderprocessing, payment, deal, loading }) => ({
  orderprocessing,
  payment,
  deal,
  initing: loading.effects['orderprocessing/fetchContentInfo'],
}))
class OrderPay extends Component {
  static contextTypes = {
    playPayAudio: PropTypes.func,
    scanQRCode: PropTypes.func,
  };

  state = {
    qrCodeInfo: undefined,
    payOrderStatus: undefined,
    visible: false,
    isBarPaying: false,
    scanValue: null,
    showQrCode: false,
  };

  async componentDidMount() {
    const { dispatch } = this.props;
    const data = await dispatch({
      type: 'orderprocessing/fetchContentInfo',
    });
    if (data) {
      if (this.isUnmounted) {
        return;
      }
      this.setState({
        qrCodeInfo: data,
      });
      if (this.barCodeNode) {
        this.barCodeNode.focus();
      }
      this.toQueryPayStatus();
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'deal/breakPolling',
    });
    this.isUnmounted = true;
  }

  handleGoBack = () => {
    const { dispatch } = this.props;
    dispatch(goBack());
  };

  toQueryPayStatus = async () => {
    const {
      dispatch,
      deal: { PayStatus },
    } = this.props;

    const { qrCodeInfo } = this.state;
    if (qrCodeInfo == null) {
      return;
    }
    // saga轮询
    dispatch({
      type: 'deal/queryPayStatusPolling',
      payload: {
        dealId: qrCodeInfo.dealId,
        expect: PayStatus.HASPAID.key,
      },
    })
      .then(res => {
        const { playPayAudio } = this.context;
        playPayAudio(res.payWay, qrCodeInfo.qrPayAmount);
        dispatch(replace('./result'));
      })
      .catch(e => {
        // 重新发起
        if (e.name === 'FailedBrokenError') {
          notification.error('异常', e.message);
          this.toQueryPayStatus();
        }
      })
      .finally(() => {
        this.setState({
          isBarPaying: false,
        });
      });
  };

  handleVisibleChange = visible => {
    this.setState({
      visible,
    });
  };

  handleScanValueChange = e => {
    this.setState({
      scanValue: e.target.value,
    });
  };

  handleScanBtnClick = (value, e) => {
    // 扫码枪回车
    if (e.keyCode === 13) {
      this.doPayByCode(value);
      return;
    }
    const { scanQRCode } = this.context;
    if (scanQRCode(this.doPayByCode)) {
      return;
    }
    this.setState({
      showQrCode: true,
    });
  };

  doPayByCode = async value => {
    const { dispatch } = this.props;
    const { qrCodeInfo } = this.state;
    const available = value && value.trim().length > 0;
    if (!available) {
      return;
    }
    this.setState({
      showQrCode: false,
      scanValue: '',
      isBarPaying: true,
    });
    dispatch({
      type: 'orderprocessing/barCodePay',
      payload: {
        authCode: value,
        content: qrCodeInfo.payContent,
      },
    }).catch(() => {
      this.setState({
        isBarPaying: false,
      });
    });
  };

  render() {
    const { initing } = this.props;
    const { qrCodeInfo, visible, payOrderStatus, scanValue, showQrCode, isBarPaying } = this.state;
    const { codeUrl, title = '...', salesName = '...', payWay, qrPayAmount } = qrCodeInfo || {};
    return (
      <Card
        title={qrCodeInfo ? '我的收银台' : '加载中...'}
        headStyle={{ textAlign: 'center' }}
        bodyStyle={{ background: 'rgb(240, 242, 245)' }}
        loading={qrCodeInfo == null}
      >
        <Row>
          <Col md={2} />
          <Col md={20}>
            <Row>
              <Col md={18} xs={24}>
                <div className={style.tip}>正在使用扫码支付</div>
                <div className={style.title}>
                  付款：
                  {title} 收款方：
                  {salesName}
                </div>
              </Col>
              <Col md={6} xs={24} className={style.right}>
                <AmountColor>{formatMoney(qrPayAmount)}</AmountColor>元
              </Col>
            </Row>
            <Card bodyStyle={{ padding: '8px 24px' }}>
              <Row className={style.content}>
                <Col md={12}>
                  <MarginBar top>
                    <div className={style.logicTitle}>扫用户付款码</div>
                    <MarginBar top>
                      <Input.Search
                        size="large"
                        placeholder={
                          isBarPaying
                            ? '等待响应结果，可能需要顾客输入密码以确认支付...'
                            : `扫顾客${formatPayPlatform(payWay)}付款一维/二维码, 收款${formatMoney(qrPayAmount)}元`
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
                    </MarginBar>
                    <MarginBar top>
                      <Alert message="使用扫码枪扫码前，请确保光标定位在上方输入框内！" type="info" showIcon />
                    </MarginBar>
                    {showQrCode && (
                      <MarginBar top>
                        <WeixinSubscribeQrCodeTip />
                      </MarginBar>
                    )}
                  </MarginBar>
                </Col>
                <Col md={12}>
                  <MarginBar top>
                    {initing ? (
                      <Card loading bordered={false} />
                    ) : (
                      <>
                        <div className={style.logicTitle}>用户扫码支付</div>
                        <MarginBar top>
                          <img
                            className={classNames('img-max', style.qrcodeImg)}
                            src={codeUrl || `${CDN_STATIC_HOST}/themes/cloud/images/ewm-1.jpg`}
                            alt="qrcode"
                          />
                        </MarginBar>
                        <div style={{ padding: '15px 0 80px' }}>
                          请顾客打开
                          {formatPayPlatform(payWay)}
                          APP扫描上方二维码完成支付
                        </div>
                      </>
                    )}
                  </MarginBar>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col md={2} />
        </Row>

        <Modal title="支付成功" visible={visible} onVisibleChange={this.handleVisibleChange}>
          {payOrderStatus && (
            <div>
              <div>¥{payOrderStatus.payMoney}</div>
              <Row>
                <Col md={12}>付款人</Col>
                <Col md={12} className="text-center">
                  {payOrderStatus.payUser}
                </Col>
              </Row>
              <Row>
                <Col md={12}>方式</Col>
                <Col md={12} className="text-center">
                  {payOrderStatus.payType}
                </Col>
              </Row>
              <Row>
                <Col md={12}>支付时间</Col>
                <Col md={12} className="text-center">
                  {payOrderStatus.payTime}
                </Col>
              </Row>
              <Row>
                <Col md={12}>收款营销中心</Col>
                <Col md={12} className="text-center">
                  {payOrderStatus.toSalesName}
                </Col>
              </Row>
              <Row>
                <Col md={12}>创建人</Col>
                <Col md={12} className="text-center">
                  {payOrderStatus.operUser}
                </Col>
              </Row>
            </div>
          )}
        </Modal>

        <FooterToolbar>
          <MarginBar left top inline>
            <Button onClick={this.handleGoBack}>返回</Button>
          </MarginBar>
        </FooterToolbar>
      </Card>
    );
  }
}

export default OrderPay;
