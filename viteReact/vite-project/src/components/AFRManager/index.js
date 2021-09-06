import { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import { connect } from 'react-redux';
import { message, Button, Card } from 'antd';
import classNames from 'classnames';
import { getMediaStream, connectVideo, destroyMediaStream } from '@/commons/lib/media';
import MarginBar from '@/components/MarginBar';
import { CDN_STATIC_HOST, isWeiXin, compressImg, getLocalImgDataCompatible } from '@/utils/utils';
import styles from './index.less';

@connect(({ loading }) => ({
  saving: loading.effects['global/saveStreamFile'],
}))
class AFRManager extends Component {
  static contextTypes = {
    weixinConfig: PropTypes.func,
  };

  state = {
    detectImg: undefined, // 检测中的
    finalImg: undefined, // 成品的

    width: undefined,
    height: undefined,

    finalWidth: undefined,
    finalHeight: undefined,
  };

  resizeDetectCanvas = throttle((e, callback) => {
    const { finalImg } = this.state;
    if (finalImg) {
      this.reset();
      return;
    }
    if (this.video == null) {
      return;
    }
    const width = Math.max(this.video.offsetWidth, this.video.clientWidth);
    const height = Math.max(this.video.offsetHeight, this.video.clientHeight);
    if (this.isUnmounted) {
      return;
    }
    this.setState(
      () => ({
        width,
        height,
      }),
      callback
    );
  }, 50);

  componentDidMount() {
    window.addEventListener('resize', this.resizeDetectCanvas);
  }

  componentWillUnmount() {
    this.isUnmounted = true;
    window.removeEventListener('resize', this.resizeDetectCanvas);
    this.destroyMediaStream();
  }

  videoRef = video => {
    this.video = video;
  };

  detectCanvasRef = node => {
    this.detectCanvas = node;
  };

  finalCanvasRef = node => {
    this.finalCanvas = node;
  };

  cutAreaImgRef = node => {
    this.cutAreaImg = node;
  };

  // 拍摄一次
  shootPicture = () => {
    this.resizeDetectCanvas(null, () => {
      const { width, height } = this.state;
      const ctx = this.detectCanvas.getContext('2d');
      ctx.drawImage(this.video, 0, 0, width, height);
      this.setState({
        detectImg: this.detectCanvas.toDataURL(),
      });
    });
  };

  // 拍摄一次
  toShoot = () => {
    if (this.isUnmounted) {
      return;
    }
    this.shootPicture();
    const width = Math.max(this.cutAreaImg.offsetWidth, this.cutAreaImg.clientWidth);
    const height = Math.max(this.cutAreaImg.offsetHeight, this.cutAreaImg.clientHeight);
    this.setState(
      () => ({
        finalWidth: width,
        finalHeight: height,
      }),
      () => {
        const left = this.cutAreaImg.offsetLeft;
        const top = this.cutAreaImg.offsetTop;
        const ctx = this.finalCanvas.getContext('2d');
        ctx.drawImage(this.detectCanvas, left, top, width, height, 0, 0, width, height);
        this.setState({
          finalImg: this.finalCanvas.toDataURL('image/jpeg', 1),
        });
      }
    );
  };

  weixinShooting = () => {
    if (!isWeiXin()) {
      return;
    }
    const { weixinConfig } = this.context;
    weixinConfig(['chooseImage'], () => {
      const wx = window.jWeixin;
      wx.chooseImage({
        count: 1, // 默认9
        // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sizeType: ['compressed'],
        // sourceType: ['album', 'camera'],
        sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          const { localIds } = res || {};
          if (localIds == null || localIds.length === 0) {
            message.error('获取拍摄图片失败');
            return;
          }
          wx.getLocalImgData({
            localId: localIds[0], // 图片的localID
            success: res2 => {
              const { localData } = res2; // localData是图片的base64数据，可以用img标签显示
              compressImg(getLocalImgDataCompatible(localData), 0.5).then(img => {
                this.toUpload(img);
              });
            },
          });
        },
      });
    });
  };

  toDetect = () => {
    if (isWeiXin()) {
      message.info('正在调起摄像头...请手动切换到前置镜头', 3, this.weixinShooting);
      return;
    }
    if (this.video == null) {
      return;
    }
    if (this.reqCameraFlag) {
      return;
    }
    this.reqCameraFlag = setTimeout(() => {
      message.warn('如果摄像头打开异常，请切换到PC或者微信中使用本功能');
    }, 1000 * 5);
    getMediaStream()
      .then(mediaStream => {
        this.mediaStream = mediaStream;
        connectVideo(this.video, mediaStream, this.shootPicture);
      })
      .catch(e => {
        // eslint-disable-next-line no-console
        console.log(e);
        message.error(e.message || e.toString());
        this.destroyMediaStream();
      })
      .finally(() => {
        clearTimeout(this.reqCameraFlag);
        this.reqCameraFlag = null;
      });
  };

  reset = () => {
    this.destroyMediaStream();
    this.setState({
      detectImg: undefined,
      finalImg: undefined,
      height: undefined,
      width: undefined,
    });
  };

  resetFinal = () => {
    this.setState({
      finalImg: undefined,
    });
  };

  toUploadFinalImg = () => {
    const { finalImg } = this.state;
    this.toUpload(finalImg);
  };

  toUpload = async img => {
    const { dispatch, type, id, justFile } = this.props;

    if (id) {
      (justFile // 只获取图片，不执行API保存
        ? Promise.resolve(true) // 直接模拟结果
        : dispatch({
            type: 'global/saveStreamFile',
            payload: {
              file: img,
              linkType: type,
              linkId: id,
            },
          })
      ).then(fileKey => {
        this.afterSave(fileKey, img);
      });
      return;
    }
    dispatch({
      type: 'global/saveBase64File',
      payload: img,
    }).then(({ fileKey }) => {
      this.afterSave(fileKey, img);
    });
  };

  afterSave = (fileKey, img) => {
    const { onSave } = this.props;
    this.reset();
    if (typeof onSave === 'function') {
      onSave({
        fileKey,
        url: img,
      });
    }
  };

  destroyMediaStream = () => {
    if (this.mediaStream) {
      destroyMediaStream(this.mediaStream);
    }
    this.mediaStream = null;
  };

  render() {
    const { detectImg, finalImg, width, height, finalWidth, finalHeight } = this.state;
    const cutting = detectImg && finalImg == null;
    const final = detectImg && finalImg;
    const defaultState = detectImg == null && finalImg == null;
    const { headStyle, saving, onTitleUpdate } = this.props;
    const title = detectImg && finalImg == null ? '人脸识别中···' : '人像拍摄';
    if (onTitleUpdate) {
      setTimeout(() => {
        onTitleUpdate(title);
      }, 0);
    }
    return (
      <Card title={title} headStyle={headStyle}>
        <div
          className={classNames(styles.afrManager, {
            [styles.cutting]: cutting,
            [styles.final]: final,
          })}
        >
          <div className={styles.videoArea}>
            <canvas className={styles.finalCanvas} width={finalWidth} height={finalHeight} ref={this.finalCanvasRef}>
              您的浏览器不支持HTML5 Canvas画布元素。
            </canvas>
            <canvas width={width} height={height} ref={this.detectCanvasRef}>
              您的浏览器不支持HTML5 Canvas画布元素。
            </canvas>
            <video ref={this.videoRef} autoPlay muted playsInline>
              您的浏览器不支持HTML5 Video视频元素。
            </video>
            <div className={styles.cutArea}>
              <img
                ref={this.cutAreaImgRef}
                src={`${CDN_STATIC_HOST}/images/${defaultState ? 'camera-capture-bg.png' : 'cut-area.png'}`}
                alt="cut-area"
                className="img-max"
              />
              <div className={styles.tips}>建议正对着拍摄人脸头像 非正面角度以及头像偏小都会影响识别的精准度</div>
            </div>
            <div className={styles.facialContourArea}>
              <img src={`${CDN_STATIC_HOST}/images/facial-contour-2.png`} alt="facial-contour" className="img-max" />
            </div>
          </div>
          <MarginBar top>
            <div className="text-center">
              {defaultState && (
                <Button type="primary" onClick={this.toDetect}>
                  开始拍照
                </Button>
              )}
              {detectImg && (
                <>
                  {finalImg == null ? (
                    <>
                      <Button onClick={this.reset}>取消</Button>
                      <MarginBar inline left>
                        <Button type="primary" onClick={this.toShoot}>
                          拍照
                        </Button>
                      </MarginBar>
                    </>
                  ) : (
                    <>
                      <Button disabled={saving} onClick={this.resetFinal}>
                        重拍
                      </Button>
                      <MarginBar inline left>
                        <Button type="primary" loading={saving} onClick={this.toUploadFinalImg}>
                          确认上传
                        </Button>
                      </MarginBar>
                    </>
                  )}
                </>
              )}
            </div>
          </MarginBar>
        </div>
      </Card>
    );
  }
}

export default AFRManager;
