import { Component } from 'react';
import { connect } from 'react-redux';
import { Divider, Button, message } from 'antd';
import { downloadImgByBase64, CDN_STATIC_HOST } from '@/utils/utils';
import { drawQrCode } from '@/commons/lib/qrcode';
import Modal from '.';
import styles from './receipt-qrcode-download.less';

@connect(({ payment, loading }) => ({
  payment,
  fetching: loading.effects['payment/fetchReceiptInfo'],
}))
class ReceiptQRCodeDownloadModal extends Component {
  state = {
    receiptQRCodeInfo: undefined,
  };

  // 修改以下三个值必须修改图片，或者改为动态获取
  // 视觉宽
  imgWidth = 338;

  // 视觉高
  imgHeight = 440;

  // 实际大小倍数
  times = 3.5;

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { visible: nextVisible } = nextProps;
    const { visible } = this.props;
    if (nextVisible && !visible) {
      const { dispatch } = this.props;
      dispatch({
        type: 'payment/fetchReceiptInfo',
      }).then(result => {
        this.setState(
          {
            receiptQRCodeInfo: result,
          },
          () => {
            this.drawCanvas(this.canvas, result);
          }
        );
      });
    }
  }

  createImgPromise = url => {
    return new Promise(resolve => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.addEventListener('load', function () {
        resolve(this);
      });
      img.src = url;
    });
  };

  drawCanvas = (canvas, receiptQRCodeInfo) => {
    if (canvas == null) {
      return;
    }
    Promise.all([
      this.createImgPromise(`${CDN_STATIC_HOST}/images/receipt-qrcode-bg.png`),
      this.createImgPromise(`${CDN_STATIC_HOST}/images/cloud/pay-model/pay-wechat-c.png`),
      this.createImgPromise(`${CDN_STATIC_HOST}/images/cloud/pay-model/pay-alipay-c.png`),
    ]).then(([bgImg, wechatPayImg, aliPayImg]) => {
      this.canvas = canvas;
      const {
        payment: { payMeanlist, PayPlatform },
      } = this.props;
      const { salesName, srvUrl, salesId, publicAccountId } = receiptQRCodeInfo || {};
      const list = payMeanlist || [];
      // 新支付系统的key与订单里的支付key不对等
      const hasMixedPay = list.some(item => item.payPlatform === PayPlatform.Mixed.key);
      const hasWechatPay = hasMixedPay || list.some(item => item.payPlatform === PayPlatform.Weixin.key);
      const hasAlipay = hasMixedPay || list.some(item => item.payPlatform === PayPlatform.Zfb.key);

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height); // 擦除一次
      // canvas已经配置为和原图一样大小了
      // 背景图
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      ctx.textAlign = 'center';
      // 营销中心名称
      ctx.fillStyle = '#fff';
      ctx.font = `${this.matrixing(18)}px normal`;

      const textMaxWidth = canvas.width - this.matrixing(0); // 左右padding

      this.drawText(
        salesName || '',
        canvas.width / 2,
        this.matrixing(84),
        textMaxWidth,
        ctx,
        this.matrixing(20) // 行间距微调
      );

      const payModeTop = this.matrixing(370);

      // 支付方式之间间距
      const payModeMargin = this.matrixing(100);
      // 支付方式图片与文本之间间距
      const textMarginTop = this.matrixing(20);

      // 支付方式文本
      ctx.font = `${this.matrixing(12)}px normal`;
      ctx.fillStyle = '#999';
      // ctx.textAlign = 'start';
      if (hasWechatPay && wechatPayImg) {
        const payModeLeft = hasAlipay
          ? (this.matrixing(this.imgWidth) - wechatPayImg.width - payModeMargin) / 2
          : (this.matrixing(this.imgWidth) - wechatPayImg.width) / 2;
        ctx.drawImage(wechatPayImg, payModeLeft, payModeTop);

        this.drawText(
          '微信支付',
          payModeLeft + wechatPayImg.width / 2,
          payModeTop + wechatPayImg.height + textMarginTop,
          textMaxWidth,
          ctx
        );
      }

      if (hasAlipay && aliPayImg) {
        const payModeLeft = hasWechatPay
          ? (this.matrixing(this.imgWidth) - wechatPayImg.width + payModeMargin) / 2
          : (this.matrixing(this.imgWidth) - wechatPayImg.width) / 2;
        ctx.drawImage(aliPayImg, payModeLeft, payModeTop);

        this.drawText(
          '支付宝支付',
          payModeLeft + aliPayImg.width / 2,
          payModeTop + aliPayImg.height + textMarginTop,
          textMaxWidth,
          ctx
        );
      }

      // 绘制二维码

      const qrcodePandding = this.matrixing(12); // 二维码白边
      const size = 709 - qrcodePandding * 2; // 二维码大小，根据背景图算出来709 + 237 * 2 = 1183 （1183 X 1540， 338 x 440 的等比3.5倍）

      const originLeft = this.matrixing(68) + qrcodePandding; // 237 / 3.5
      const originTop = this.matrixing(135) + qrcodePandding;

      if (srvUrl == null || salesId == null || publicAccountId == null) {
        // eslint-disable-next-line no-console
        console.log(srvUrl, salesId, publicAccountId);
        return;
      }

      drawQrCode(ctx, `${srvUrl}/pay/checkout?salesId=${salesId}&publicAccountId=${publicAccountId}`, size, {
        originLeft,
        originTop,
      });
    });
  };

  drawText = (t, x, y, w, context, textMarginTop = 0) => {
    const chr = t.split('');
    let temp = '';
    const row = [];

    for (let a = 0; a < chr.length; a += 1) {
      if (context.measureText(temp).width < w) {
        //
      } else {
        row.push(temp);
        temp = '';
      }
      temp += chr[a];
    }

    row.push(temp);

    for (let b = 0; b < row.length; b += 1) {
      context.fillText(row[b], x, y + (b + 1) * textMarginTop);
    }
  };

  download = () => {
    if (this.canvas == null) {
      return;
    }
    // const base64Str = this.canvas.toDataURL('image/png');
    const base64Str = this.canvas.toDataURL(); // 默认为 image/png
    // window.location.href = base64Str.replace('image/png', 'image/octet-stream');

    const { receiptQRCodeInfo } = this.state;
    const { salesName } = receiptQRCodeInfo || {};
    // 字符内容转变成blob地址
    try {
      downloadImgByBase64(base64Str, `${salesName || '收款码'}.png`);
    } catch (e) {
      message.error('下载失败, 请更换浏览器再试');
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  matrixing = val => this.times * (val || 0);

  render() {
    const { fetching, payment, ...restProps } = this.props;
    const { receiptQRCodeInfo } = this.state;
    return (
      <Modal {...restProps} loading={fetching}>
        <div className="text-center">
          <canvas
            ref={node => this.drawCanvas(node, receiptQRCodeInfo)}
            width={this.matrixing(this.imgWidth)}
            height={this.matrixing(this.imgHeight)}
            className={styles.canvas}
            style={{
              width: this.imgWidth,
              height: this.imgHeight,
            }}
          >
            您的浏览器不支持HTML5 Canvas画布元素。
          </canvas>
        </div>
        <Divider />
        <div className={styles.footer}>
          <div className={styles.left}>
            <div className={styles.leftTop}>点击下载商家收款码</div>
            <div>下载尺寸10x13cm（1183x1540像素 300dpi）</div>
          </div>
          <div className={styles.right}>
            <Button onClick={this.download}>下载收款码</Button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ReceiptQRCodeDownloadModal;
