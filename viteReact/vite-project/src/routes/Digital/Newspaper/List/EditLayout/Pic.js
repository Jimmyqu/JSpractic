import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'antd';
import MarginBar from '@/components/MarginBar';
import { mergeUrlParams } from '@/utils/utils';
import styles from './index.less';

// const drawBorderPixel = (ctx, x, y, w, h) => {
//   ctx.fillStyle = '#f5222d';
//   const size = 5; // 自定义像素点大小
//   ctx.fillRect(x - size / 2, y - size / 2, size, size);
//   // ...同理通过ctx.fillRect再画出其余像素点
//   ctx.fillRect(x + w - size / 2, y - size / 2, size, size);
//   ctx.fillRect(x - size / 2, y + h - size / 2, size, size);
//   ctx.fillRect(x + w - size / 2, y + h - size / 2, size, size);

//   ctx.fillRect(x + w / 2 - size / 2, y - size / 2, size, size);
//   ctx.fillRect(x + w / 2 - size / 2, y + h - size / 2, size, size);
//   ctx.fillRect(x - size / 2, y + h / 2 - size / 2, size, size);
//   ctx.fillRect(x + w - size / 2, y + h / 2 - size / 2, size, size);
// };

const tag = Date.now();

export default function ({ file, useOcr, scale, onTransform, onBuildArea }) {
  const { url } = file;
  const [originImg, setOriginImg] = useState(); // 原始图片
  const [canvasNode, setCanvasNode] = useState(); // canvas ref
  const [btnGroupNode, setBtnGroupNode] = useState();
  const [startCoordinate, setStartCoordinate] = useState([0, 0]); // 开始坐标
  const [dragging, setDragging] = useState(false);
  const [curPoisition, setCurPoisition] = useState(null);
  const [trimPositionMap, setTrimPositionMap] = useState([]);
  const fileSyncUpdating = useSelector(state => state.loading.effects['digital/postImgFileWithAliOcr']);
  const base64ImgUploading = useSelector(state => state.loading.effects['global/uploadBase64Img']);
  const dispatch = useDispatch();

  const initCanvas = () => {
    if (url == null) {
      return;
    }
    if (canvasNode == null) {
      return;
    }

    const image = new Image();
    setOriginImg(image);
    image.crossOrigin = 'anonymous';
    image.addEventListener('load', () => {
      const ctx = canvasNode.getContext('2d');
      ctx.clearRect(0, 0, canvasNode.width, canvasNode.height);
      canvasNode.width = image.width * scale;
      canvasNode.height = image.height * scale;
      ctx.drawImage(image, 10, 10, canvasNode.width - 20, canvasNode.height - 20); // 四边留出10px间距
    });
    // 如果url是跨域的，且在此之前已被非CORS方式加载过，且服务端也未在非CORS请求时响应Vary: Origin头：
    // 则此时会直接使用缓存的响应结果，导致浏览器跨域错误
    // fix：在服务端不做修改的前提下，使用新的url强迫重新以CORS加载，服务端响应需要的Access-Control-Allow-Origin
    image.src = mergeUrlParams(url, {
      t: tag,
    });
  };

  useEffect(() => {
    initCanvas();
  }, [canvasNode, url, scale]);

  const drawTrim = (x, y, w, h, flag) => {
    const ctx = canvasNode.getContext('2d');

    // 绘制蒙层
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; // 蒙层颜色
    ctx.fillRect(0, 0, canvasNode.width, canvasNode.height);

    // 将蒙层凿开
    ctx.globalCompositeOperation = 'source-atop';
    // 裁剪选择框
    ctx.clearRect(x, y, w, h);
    if (!flag && trimPositionMap.length > 0) {
      trimPositionMap.map(item => ctx.clearRect(item.startX, item.startY, item.width, item.height));
    }

    // 绘制8个边框像素点(后期做裁剪框拉伸再用)
    // ctx.globalCompositeOperation = 'source-over';
    // drawBorderPixel(ctx, x, y, w, h);
    // if (!flag && trimPositionMap.length > 0) {
    //   trimPositionMap.map(item => drawBorderPixel(ctx, item.startX, item.startY, item.width, item.height));
    // }

    // 保存当前区域坐标信息
    setCurPoisition({
      width: w,
      height: h,
      startX: x,
      startY: y,
      // position: [
      //   (x, y),
      //   (x + w, y),
      //   (x, y + h),
      //   (x + w, y + h),
      //   (x + w / 2, y),
      //   (x + w / 2, y + h),
      //   (x, y + h / 2),
      //   (x + w, y + h / 2),
      // ],
      position: [y, y, y + h, y + h, y, y + h, y + h / 2, y + h / 2],
      canvasWidth: canvasNode.width,
    });

    ctx.restore();

    // 再次使用drawImage将图片绘制到蒙层下方
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.drawImage(originImg, 10, 10, canvasNode.width - 20, canvasNode.height - 20);
    ctx.restore();
  };

  const judgeTrimAreaIsOverlap = () => {
    if (trimPositionMap.length > 0) {
      const fond = trimPositionMap.find(
        item =>
          Math.abs(curPoisition.startX - item.startX) < item.width &&
          Math.abs(curPoisition.startY - item.startY) < item.height
      );
      if (fond == null) {
        const ctx = canvasNode.getContext('2d');
        ctx.clearRect(0, 0, canvasNode.width, canvasNode.height);
        drawTrim(curPoisition.startX, curPoisition.startY, curPoisition.width, curPoisition.height, 'onlyTrimCurrent');
        setTrimPositionMap([curPoisition]);
      } else {
        const posMap = [...trimPositionMap, curPoisition];
        setTrimPositionMap(posMap);
      }
      return;
    }

    setTrimPositionMap([curPoisition]);
  };

  const handleMouseDownEvent = e => {
    setDragging(true);
    const { offsetX, offsetY } = e.nativeEvent;
    setStartCoordinate([offsetX, offsetY]);

    if (btnGroupNode == null) {
      return;
    }
    btnGroupNode.style.display = 'none';
  };

  const handleMouseMoveEvent = e => {
    if (!dragging) {
      return;
    }
    const ctx = canvasNode.getContext('2d');
    // 每一帧都需要清除画布(取最后一帧绘图状态, 否则状态会累加)
    ctx.clearRect(0, 0, canvasNode.width, canvasNode.height);

    const { offsetX, offsetY } = e.nativeEvent;

    // 触底滚动
    const modalBody = document.querySelector('.ant-modal-body');
    const { height } = modalBody.getBoundingClientRect();
    if (Math.abs(offsetY - height - modalBody.scrollTop) < 50) {
      modalBody.scrollTop += 10;
    }

    // 计算临时裁剪框的宽高
    const tempWidth = offsetX - startCoordinate[0];
    const tempHeight = offsetY - startCoordinate[1];
    // 调用绘制裁剪框的方法
    drawTrim(startCoordinate[0], startCoordinate[1], tempWidth, tempHeight);
  };

  const handleMouseRemoveEvent = () => {
    // 保存后将其置为false，表示结束当前流程
    setDragging(false);

    // 处理裁剪按钮的样式
    if (curPoisition == null) {
      return;
    }
    if (btnGroupNode == null) {
      return;
    }

    btnGroupNode.style.display = 'block';
    const { startX, startY, width, height } = curPoisition;
    const btnGroupWidth = btnGroupNode.getBoundingClientRect().width;
    btnGroupNode.style.left = width < 0 ? `${startX - btnGroupWidth}px` : `${startX + width - btnGroupWidth}px`;
    btnGroupNode.style.top = height < 0 ? `${startY}px` : `${startY + height}px`;

    // 判断裁剪区是否重叠
    judgeTrimAreaIsOverlap();
  };

  const handleCancle = () => {
    const ctx = canvasNode.getContext('2d');
    // 清空
    ctx.clearRect(0, 0, canvasNode.width, canvasNode.height);
    ctx.drawImage(originImg, 10, 10, canvasNode.width - 20, canvasNode.height - 20);
    setTrimPositionMap([]);
    setCurPoisition(null);

    if (btnGroupNode == null) {
      return;
    }
    btnGroupNode.style.display = 'none';
  };

  const getMinTrimReactArea = () => {
    const startX = Math.min(...trimPositionMap.map(item => item.startX));
    const endX = Math.max(...trimPositionMap.map(item => item.startX + item.width));
    const startY = Math.min(...trimPositionMap.map(item => item.startY));
    const endY = Math.max(...trimPositionMap.map(item => item.startY + item.height));
    return {
      startX,
      startY,
      minWidth: endX - startX,
      minHeight: endY - startY,
    };
  };

  // 获得裁剪后的图片文件
  const getImgTrimData = flag => {
    if (trimPositionMap.length === 0) {
      return;
    }

    const ctx = canvasNode.getContext('2d');

    // 重新构建一个canvas，计算出包含多个裁剪框的最小矩形
    const trimCanvasNode = document.createElement('canvas');
    const { startX, startY, minWidth, minHeight } = getMinTrimReactArea();
    trimCanvasNode.width = minWidth;
    trimCanvasNode.height = minHeight;
    const trimCtx = trimCanvasNode.getContext('2d');
    trimCtx.clearRect(0, 0, trimCanvasNode.width, trimCanvasNode.height);
    trimPositionMap.map(pos => {
      // 取到裁剪框的像素数据
      const data = ctx.getImageData(pos.startX, pos.startY, pos.width, pos.height);
      // 输出在canvas上
      return trimCtx.putImageData(data, pos.startX - startX, pos.startY - startY);
    });
    const trimData = trimCanvasNode.toDataURL();

    (flag === 'justImg'
      ? dispatch({
          type: 'global/uploadBase64Img',
          payload: {
            file: trimData,
          },
        })
      : dispatch({
          type: 'digital/postImgFileWithAliOcr',
          payload: {
            img: trimData,
          },
        })
    ).then(result => {
      onTransform(result, flag);
    });
  };

  const getTrimCood = () => {
    onBuildArea(
      // 校验偏差
      trimPositionMap.map(({ startX, startY, canvasWidth, ...otherProps }) => ({
        ...otherProps,
        startX: startX - 10,
        startY: startY - 10,
        canvasWidth: canvasWidth - 20,
      }))
    );
  };

  return (
    <section className={styles.modaLLayout}>
      <canvas
        ref={setCanvasNode}
        onMouseDown={handleMouseDownEvent}
        onMouseMove={handleMouseMoveEvent}
        onMouseUp={handleMouseRemoveEvent}
      />
      <div ref={setBtnGroupNode} className={styles.buttonWrap}>
        <MarginBar right inline>
          <Button
            type="link"
            icon="close"
            size="small"
            ghost
            disabled={fileSyncUpdating || base64ImgUploading}
            onClick={handleCancle}
          >
            取消
          </Button>
        </MarginBar>
        {useOcr ? (
          <>
            <MarginBar left right inline>
              <Button
                type="link"
                icon="file-image"
                size="small"
                ghost
                loading={base64ImgUploading}
                disabled={fileSyncUpdating}
                onClick={() => getImgTrimData('justImg')}
              >
                转为图片
              </Button>
            </MarginBar>
            <MarginBar left inline>
              <Button
                type="link"
                icon="file-text"
                size="small"
                ghost
                loading={fileSyncUpdating}
                disabled={base64ImgUploading}
                onClick={() => getImgTrimData('justText')}
              >
                转为文字
              </Button>
            </MarginBar>
          </>
        ) : (
          <MarginBar left inline>
            <Button
              type="link"
              icon="file-text"
              size="small"
              ghost
              disabled={fileSyncUpdating || base64ImgUploading}
              onClick={getTrimCood}
            >
              确定
            </Button>
          </MarginBar>
        )}
      </div>
    </section>
  );
}
