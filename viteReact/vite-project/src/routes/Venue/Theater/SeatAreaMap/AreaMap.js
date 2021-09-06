import { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import throttle from 'lodash/throttle';
import { Button, Card, Col, Row, Upload } from 'antd';
import MarginBar from '@/components/MarginBar';
import { FileAccept, formUploadOtherProps, genUploadImgCustomRequest } from '@/utils/upload';
import { formatImageUrl } from '@/utils/format';
import { isMacOS, isMobileDevice } from '@/utils/utils';
import { modal } from '@/utils/feedback';
import AreaShotCut from './AreaShotCut';
import styles from './index.less';

@connect()
class AreaMap extends Component {
  static contextTypes = {
    getWrapperHeight: PropTypes.func,
  };

  // 点的宽度
  dotWidth = 10;

  state = {
    uploadingFile: null, // 为了上传的同时计算显示适配的宽度(不是图片本身的宽度)，临时存储这个文件(组件里的对象，不是File
    canvasHeight: null,
    height: null,

    // map是否按下ctrl(mac上是command)
    mapCtrlKey: false,
    // map移动位置存储
    // 暂不考虑属于移动设备但又支持鼠标事件的混合使用情况，如iPad Pro插鼠标
    mapLeft: 0,
    mapTop: 0,
    // 正在移动
    mapMoving: false,
    // 有移动(区别点击和拖动)
    hasMoved: false,
    // map移动鼠标按下原始值
    offsetX: null,
    offsetY: null,

    // map实时鼠标值
    cursorX: null,
    cursorY: null,

    // 当前条件，所有的点拖动位置修改相关state
    // 当前正在移动的dot，并且起到标记正在移动的效果
    movingDot: null,
  };

  bgGap = 20;

  canvas = null;

  // eslint-disable-next-line react/destructuring-assignment
  customImgRequest = genUploadImgCustomRequest({ dispatch: this.props.dispatch });

  componentDidMount() {
    this.onResize();
    window.addEventListener('resize', this.onResize);
    document.body.addEventListener('keydown', this.mapKeyDown);
    document.body.addEventListener('keyup', this.mapKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    document.body.removeEventListener('keydown', this.mapKeyDown);
    document.body.removeEventListener('keyup', this.mapKeyUp);
  }

  onResize = throttle(() => {
    const { getWrapperHeight } = this.context;
    const wh = getWrapperHeight();
    this.setState({
      height: `calc(100vh - ${wh + 151}px)`,
    });
  }, 50);

  updateImg = async (fileObj, w, h) => {
    const { dataId, dispatch, updateFile } = this.props;
    await dispatch({
      type: 'pubticket/updateSeatAreaImg',
      payload: {
        fileKey: fileObj?.fileKey,
        platformId: dataId,
        imageWidth: w,
        imageHeight: h,
      },
    });
    this.setState({
      mapTop: 0,
      mapLeft: 0,
    });
    updateFile(fileObj);
  };

  imgRef = img => {
    if (img == null) {
      return;
    }
    img.addEventListener('load', async e => {
      const dom = e.target || e.srcElement;
      const { uploadingFile } = this.state;
      const { file } = this.props;
      if (uploadingFile) {
        await this.updateImg(uploadingFile.response, dom.width, dom.height);
      }
      // 如果有图片，强制使用它上传时配置的宽和高，避免在不同界面大小下坐标对不上
      const imageWidth = file?.imageWidth || dom.width;
      const imageHeight = file?.imageHeight || dom.height;
      this.setState({
        canvasWidth: imageWidth,
        canvasHeight: imageHeight,
        uploadingFile: null,
      });
      if (this.canvas) {
        const ctx = this.canvas.getContext('2d');
        ctx.drawImage(dom, 0, 0, imageWidth, imageHeight);
      }
      this.onResize();
    });
  };

  canvasRef = node => {
    this.canvas = node;
  };

  mapKeyDown = e => {
    this.setState({
      mapCtrlKey: isMacOS() ? e.metaKey : e.ctrlKey,
    });
  };

  mapKeyUp = () => {
    this.setState({
      mapCtrlKey: false,
    });
  };

  mapMouseDown = e => {
    const { layerX, layerY } = e.nativeEvent;
    this.setState({
      mapMoving: true,
      offsetX: layerX,
      offsetY: layerY,
      cursorX: layerX,
      cursorY: layerY,
    });
  };

  mapMouseUp = () => {
    this.setState({
      mapMoving: false,
      hasMoved: false,
    });
  };

  mapMouseUpReal = e => {
    const { mapMoving, hasMoved, movingDot, cursorX, cursorY } = this.state;
    this.mapMouseUp();
    const { editAreaData, addDot, moveDot } = this.props;
    if (movingDot) {
      // 拖拽松手了
      this.setState({
        movingDot: null,
      });
      moveDot(movingDot, cursorX, cursorY);
    }
    if (!mapMoving || hasMoved) {
      return;
    }
    if (editAreaData == null) {
      return;
    }
    const { layerX, layerY } = e.nativeEvent;
    addDot({
      x: layerX + 0.5, // 以鼠标为中心作为点
      y: layerY + 0.5, // 以鼠标为中心作为点
    });
  };

  mapMouseMove = e => {
    const { layerX: x, layerY: y } = e.nativeEvent;
    const { editAreaData } = this.props;
    const editing = editAreaData != null;
    if (editing) {
      this.setState({
        cursorX: x,
        cursorY: y,
      });
    }
    const { mapMoving } = this.state;
    if (mapMoving) {
      const { clientWidth, clientHeight } = e.currentTarget.parentNode;
      this.setState(({ canvasWidth, canvasHeight, mapLeft, mapTop, offsetX, offsetY }) => {
        let top = mapTop + (y - offsetY);
        let left = mapLeft + (x - offsetX);
        if (top >= this.bgGap) {
          top = this.bgGap;
        } else if (top <= -(canvasHeight - clientHeight) - this.bgGap) {
          top = -(canvasHeight - clientHeight) - this.bgGap;
        }
        if (left >= this.bgGap) {
          left = this.bgGap;
        } else if (left <= -(canvasWidth - clientWidth) - this.bgGap) {
          left = -(canvasWidth - clientWidth) - this.bgGap;
        }
        return {
          mapLeft: left,
          mapTop: top,
          hasMoved: true,
        };
      });
    }
  };

  // mapWheel = e => {
  //   // const {  clientWidth, clientHeight } = e.currentTarget;
  //   const { deltaX, deltaY, deltaZ } = e;
  //   console.log(deltaX, deltaY > 0 ? '向下' : '向上', deltaZ);
  // };

  dotClick = (dot, polygonId) => {
    const { editAreaData, addDot, removeDot, isEnClosed } = this.props;
    if (editAreaData == null) {
      return;
    }
    const polygon = editAreaData.polygons.find(item => item.id === polygonId);
    const enClosed = isEnClosed(polygon);
    const dots = polygon?.areaExtSettings?.dots || [];
    // 已经闭合, 成处理删除，仍然保持闭合
    if (enClosed) {
      // 至少有三个点才能形成一个平面, 又由于闭合多边形冗余了一个点，所以至少要有4个实际的点(不算冗余时)
      if (dots.length > 3 + 1) {
        removeDot(dot, polygonId);
      }
      return;
    }
    // 至少有三个点才能形成一个平面
    if (dots.length >= 3 && dots[0] === dot) {
      // 如果是第一个，把它连起来
      // 直接传入第一个来闭合
      addDot(dot);
    }
  };

  lineClick = (dot, polygonId, index) => {
    const { insertDot } = this.props;
    insertDot(dot, polygonId, index);
  };

  dotMouseDown = (dot, polygonId, prevDot, nextDot, cursorX, cursorY) => {
    const { mapCtrlKey } = this.state;
    if (mapCtrlKey) {
      this.setState({
        cursorX,
        cursorY,
        movingDot: {
          ...dot,

          // 冗余一些其他信息
          polygonId,
          prevDot,
          nextDot,
          cursorX,
          cursorY,
        },
      });
    }
  };

  render() {
    const {
      loading,
      imgFileUploading,
      dataSaving,
      file,
      editAreaData,
      allPolygons,
      canBack,
      canForward,
      goBack,
      goForward,
      isInEnClosed,
      isEnClosed,
      removePolygon,
    } = this.props;
    const {
      uploadingFile,
      canvasHeight,
      canvasWidth,
      height,
      mapLeft,
      mapTop,
      cursorX,
      cursorY,
      movingDot,
      mapCtrlKey,
    } = this.state;

    const fileUploading = imgFileUploading || uploadingFile != null;

    const editing = editAreaData != null;

    const selectedPolygonIndex = editing ? editAreaData.polygons?.findIndex(item => item.selected) : null;

    const cursorDot = {
      x: cursorX,
      y: cursorY,
    };
    // 鼠标放置到了某个已闭合的多边形上
    const hasMouseOverOnEnClosedPolygon = editing
      ? editAreaData.polygons?.some(item => isInEnClosed(cursorDot, item))
      : false;
    return (
      <Card bordered={false} loading={loading} className={styles.areaMapCard}>
        <Row>
          <Col md={12}>
            <MarginBar inline top>
              <Upload
                {...formUploadOtherProps}
                disabled={editing}
                accept={FileAccept.IMG}
                customRequest={this.customImgRequest}
                onChange={({ file: f }) => {
                  if (f && f.status === 'done') {
                    const reader = new FileReader();
                    reader.addEventListener('load', async e => {
                      const { result } = e.target || e.srcElement;
                      this.setState({
                        uploadingFile: {
                          ...f,
                          // 补一个字段，先计算出来
                          base64: result,
                        },
                      });
                    });
                    reader.readAsDataURL(f.originFileObj); // 将binary转换成base64
                  }
                }}
              >
                <Button type="primary" loading={fileUploading} disabled={editing}>
                  {file == null ? '上传' : '重新上传'}图片
                </Button>
              </Upload>
            </MarginBar>
            {file && (
              <MarginBar inline left top>
                <Button
                  type="danger"
                  onClick={() =>
                    modal.confirm('确认删除平面图删除吗？', {
                      onOk: () => {
                        this.updateImg();
                      },
                    })
                  }
                  loading={fileUploading}
                  disabled={editing}
                >
                  删除
                </Button>
              </MarginBar>
            )}
          </Col>
          {editing && (
            <Col md={12} className="text-right">
              {selectedPolygonIndex >= 0 && (
                <MarginBar inline left top>
                  <Button type="danger" onClick={() => removePolygon(selectedPolygonIndex)}>
                    删除
                  </Button>
                </MarginBar>
              )}
              <MarginBar inline left top>
                <Button icon="undo" type="primary" disabled={!canBack || dataSaving} onClick={goBack}>
                  上一步
                </Button>
              </MarginBar>
              <MarginBar inline left top>
                <Button icon="redo" type="primary" disabled={!canForward || dataSaving} onClick={goForward}>
                  下一步
                </Button>
              </MarginBar>
            </Col>
          )}
        </Row>
        <div className={styles.btnTips}>
          *重新上传或者删除图片都将会将会清除所有区域配置; 提供的图片其尺寸的大小和质量需能足够清晰的体现平面内容;
        </div>
        <MarginBar top>
          <div
            className={classNames(styles.areaMap, {
              [styles.mobileDevice]: isMobileDevice(),
              [styles.noImg]: file?.url == null,
              [styles.editing]: editing,
            })}
            style={{
              maxHeight: height,
            }}
            onMouseOut={this.mapMouseUp}
            onBlur={this.mapMouseUp}
          >
            {(uploadingFile || file?.url) && (
              <>
                <img
                  ref={this.imgRef}
                  src={uploadingFile?.base64 || formatImageUrl(file.url, '')}
                  // 如果有图片，强制使用它上传时配置的宽和高，避免在不同界面大小下坐标对不上
                  style={
                    file
                      ? {
                          width: file.imageWidth,
                          height: file.imageWidth,
                        }
                      : undefined
                  }
                  alt="theater area img"
                />
                <canvas
                  ref={this.canvasRef}
                  height={canvasHeight}
                  width={canvasWidth}
                  // TODO: 缩放待实现
                  // onWheel={this.mapWheel}
                  style={{
                    left: mapLeft,
                    top: mapTop,
                  }}
                >
                  您的浏览器不支持Canvas
                </canvas>
                <div
                  className={classNames(styles.areaBg, {
                    [styles.cursorForSelect]: hasMouseOverOnEnClosedPolygon,
                  })}
                  style={{
                    width: canvasWidth,
                    height: canvasHeight,
                    left: mapLeft,
                    top: mapTop,
                  }}
                  // 移动端不依赖mouse事件，直接使用滚动来控制视图的位移
                  // 暂不考虑属于移动设备但又支持鼠标事件的混合使用情况，如iPad Pro插鼠标
                  onMouseDown={this.mapMouseDown}
                  onMouseUp={this.mapMouseUpReal}
                  onMouseMove={this.mapMouseMove}
                >
                  <AreaShotCut
                    mapCtrlKey={mapCtrlKey}
                    dotWidth={this.dotWidth}
                    allPolygons={allPolygons}
                    editAreaData={editAreaData}
                    isEnClosed={isEnClosed}
                    dotClick={this.dotClick}
                    lineClick={this.lineClick}
                    movingDot={movingDot}
                    cursorDot={cursorDot}
                    dotMouseDown={this.dotMouseDown}
                  />
                </div>
              </>
            )}
          </div>
        </MarginBar>
      </Card>
    );
  }
}

export default AreaMap;
