import { useMemo } from 'react';
import classNames from 'classnames';
import { Row, Col } from 'antd';
import { ResizableBox } from 'react-resizable';
import styles from './index.less';

const scale = 86.5 / 54;

function createConstraints(width) {
  return [width, width / scale];
}
// const minConstraints = createConstraints(320);
// const maxConstraints = createConstraints(640);
const initialConstraints = createConstraints(520);

export default ({
  className,
  formDate,
  study,
  onFrontResizeStart,
  onFrontResizeStop,
  onFrontResize,
  onBackResizeStart,
  onBackResizeStop,
  onBackResize,
  //
  frontResizing,
  backResizing,
  resizeData,
  cardNo,
  serviceName,
  transColor,
  hiddenCardNo,
}) => {
  const { frontBG, backBG, avatar, text: backText, cardNoColor, textColor } = formDate;

  const useCardNoColorStyle = useMemo(
    () => ({
      color: transColor(cardNoColor),
    }),
    [cardNoColor]
  );
  const useTextColorStyle = useMemo(
    () => ({
      color: transColor(textColor),
    }),
    [textColor]
  );

  const { realName, id } = study || {};

  const { url: frontImg } = ((frontBG || [])[0] || {}).response || {};
  const { url: backImg } = ((backBG || [])[0] || {}).response || {};
  const { url: avatarImg } = ((avatar || [])[0] || {}).response || {};

  const useiInitialConstraints = resizeData ? [resizeData.size.width, resizeData.size.height] : initialConstraints;

  const frontSurface = (
    <div
      className={styles.surface}
      style={
        backResizing
          ? {
              width: resizeData.size.width,
              height: resizeData.size.height,
            }
          : null
      }
    >
      {frontImg && <img src={frontImg} className="img-max" alt="front img" />}
      <div className={styles.content}>
        <span
          className={classNames(styles.border, styles.cardNo, {
            hidden: hiddenCardNo,
          })}
          style={useCardNoColorStyle}
        >
          NO.{cardNo}
        </span>
      </div>
    </div>
  );

  const backSurface = (
    <div
      className={styles.surface}
      style={
        frontResizing
          ? {
              width: resizeData.size.width,
              height: resizeData.size.height,
            }
          : null
      }
    >
      {backImg && <img src={backImg} className="img-max" alt="front img" />}
      <div className={styles.content}>
        <div className={styles.back}>
          <div className={styles.backLeft}>
            <div className={styles.backLeftTop}>
              {avatarImg && <img src={avatarImg} className="img-max" alt="front img" />}
            </div>
            <div className={classNames(styles.border, styles.backLeftName)} style={useTextColorStyle}>
              {realName}
            </div>
            <div className={classNames(styles.border, styles.backLeftId)} style={useTextColorStyle}>
              NO.{id}
            </div>
          </div>
          <div className={classNames('text-left', styles.backRight)}>
            <div
              className={classNames('text-overflow-line2', styles.border, styles.backRightTop)}
              style={useTextColorStyle}
            >
              {serviceName}
            </div>
            <div
              className={classNames('text-pre-wrap', styles.border, styles.backRightBottom)}
              style={useTextColorStyle}
            >
              {backText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className={classNames(className, styles.horizontalCard)}>
      <Row>
        <Col span={24} className={styles.frontSurfaceWapper}>
          {backResizing ? (
            frontSurface
          ) : (
            <ResizableBox
              width={useiInitialConstraints[0]}
              height={useiInitialConstraints[1]}
              minConstraints={useiInitialConstraints}
              maxConstraints={useiInitialConstraints}
              // minConstraints={minConstraints}
              // maxConstraints={maxConstraints}
              onResizeStart={onFrontResizeStart}
              onResizeStop={onFrontResizeStop}
              onResize={onFrontResize}
              lockAspectRatio
            >
              {frontSurface}
            </ResizableBox>
          )}
          <div className={styles.cardDescr}>正面图片(封面)卡片尺寸86.5mm x 54mm</div>
        </Col>
        <Col span={24} className={styles.backSurfaceWapper}>
          {frontResizing ? (
            backSurface
          ) : (
            <ResizableBox
              width={useiInitialConstraints[0]}
              height={useiInitialConstraints[1]}
              minConstraints={useiInitialConstraints}
              maxConstraints={useiInitialConstraints}
              // minConstraints={minConstraints}
              // maxConstraints={maxConstraints}
              onResizeStart={onBackResizeStart}
              onResizeStop={onBackResizeStop}
              onResize={onBackResize}
              lockAspectRatio
            >
              {backSurface}
            </ResizableBox>
          )}
          <div className={styles.cardDescr}>反面图片(人像面)卡片尺寸86.5mm x 54mm</div>
        </Col>
      </Row>
    </div>
  );
};
