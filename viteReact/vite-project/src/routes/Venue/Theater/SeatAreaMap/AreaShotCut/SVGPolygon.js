import classNames from 'classnames';
import styles from './index.less';

function isMovingDot(id, movingDot, dot) {
  return movingDot?.polygonId === id && movingDot.x === dot.x && movingDot.y === dot.y;
}

function getUseDot(id, cursorDot, movingDot, dot) {
  return isMovingDot(id, movingDot, dot)
    ? {
        x: cursorDot.x - (movingDot.cursorX - movingDot.x), // 由初始时的差异值计算，避免切换时位置跳动
        y: cursorDot.y - (movingDot.cursorY - movingDot.y), // 由初始时的差异值计算，避免切换时位置跳动
      }
    : dot;
}

export default ({
  isOther,
  editing,
  polygon,
  isEnClosed,
  dotWidth,
  dotClick,
  lineClick,
  movingDot,
  cursorDot,
  dotMouseDown,
  mapCtrlKey,
}) => {
  const { id, isDeleted, selected, areaExtSettings } = polygon;
  const dots = areaExtSettings?.dots;
  if (isDeleted || dots == null || dots.length === 0) {
    return null;
  }
  // 是闭合的
  const enClosed = isEnClosed(polygon);
  if ((!editing || isOther) && enClosed) {
    return (
      <polygon
        className={classNames({
          [styles.whenOtherEditing]: editing,
        })}
        points={dots.map(({ x, y }) => `${x},${y}`).join(' ')}
      />
    );
  }
  const offset = dotWidth / 2; // 半个点的宽度
  return (
    <>
      {/* 线条，基于当前点和下一个点连线 */}
      {dots.map((dot, idx) => {
        // 目前闭合多边形采用的是把第一个dot实例在列表最后再放一次的方式
        const nextDot = dots[idx + 1];
        if (nextDot == null) {
          // 线条基于所有的点来链接，刚好需要冗余的那个点(和第一个点重叠)来把第一个点和最后一个点(视觉上的最后一个)连起来
          return;
        }
        const useDot = getUseDot(id, cursorDot, movingDot, dot);
        const useNextDot = getUseDot(id, cursorDot, movingDot, nextDot);
        return (
          <line
            key={`line-${id}-${useDot.x}-${useDot.y}-${useNextDot.x}-${useNextDot.y}`}
            className={classNames({
              [styles.enClosed]: enClosed,
              [styles.selected]: selected,
            })}
            x1={useDot.x}
            y1={useDot.y}
            x2={useNextDot.x}
            y2={useNextDot.y}
            // 与图形上的点击监听使用同一个事件名
            onMouseUp={e => {
              if (movingDot) {
                return;
              }
              e.stopPropagation();
              if (enClosed) {
                const { layerX: x, layerY: y } = e.nativeEvent;
                lineClick(
                  {
                    x,
                    y,
                  },
                  id,
                  // 此index是线start的dot的index，不是end的dot
                  idx
                );
              }
            }}
          />
        );
      })}
      {/* 点 */}
      {dots.map((dot, idx) => {
        // 目前闭合多边形采用的是把第一个dot实例在列表最后再放一次的方式
        const lastDot = idx === dots.length - 1;
        // 闭合情况下，最后冗余的那个点丢弃不显示
        if (lastDot && enClosed) {
          return;
        }
        const thisIsMovingDot = isMovingDot(id, movingDot, dot);
        const useDot = getUseDot(id, cursorDot, movingDot, dot);

        const dotCanRemove = enClosed && dots.length > 3 + 1;
        return (
          <rect
            key={`rect-${id}-${useDot.x}-${useDot.y}-${thisIsMovingDot.toString()}`}
            className={classNames({
              [styles.lastDot]: lastDot,
              [styles.selected]: selected,
              // 至少有三个点才能形成一个平面, 又由于闭合多边形冗余了一个点，所以至少要有4个实际的点(不算冗余点)
              [styles.canRemove]: dotCanRemove,
              [styles.canMoving]: dotCanRemove && mapCtrlKey,
              [styles.dotMoving]: thisIsMovingDot,
            })}
            x={useDot.x - offset} // 实际显示的时候往左上移动了半个点的宽度
            y={useDot.y - offset} // 实际显示的时候往左上移动了半个点的宽度
            width={dotWidth}
            height={dotWidth}
            onMouseDown={e => {
              e.stopPropagation();
              // 由于与最后一个点的点击连线闭合功能冲突(如何区分拖拽和点击)，所以先实现为的闭合的才能拖拽
              if (enClosed) {
                const { layerX, layerY } = e.nativeEvent;
                dotMouseDown(
                  dot,
                  id,
                  // 以线段来看上一个点
                  dots[idx - 1] || dots[dots.length - 2], // 多减一个，因为dots里最后冗余了和第一个一样的点
                  // 以线段来看下一个点
                  dots[idx + 1] || dots[0], // 由于最后一个点丢弃不显示，这里默认取0是对的
                  layerX,
                  layerY
                );
              }
            }}
            onMouseMove={e => {
              // movingDot的onMouseUp在上层处理
              if (thisIsMovingDot) {
                return;
              }
              e.stopPropagation();
            }}
            // 与图形上的点击监听使用同一个事件名
            onMouseUp={e => {
              // movingDot的onMouseUp在上层处理
              if (thisIsMovingDot) {
                return;
              }
              e.stopPropagation();
              // e.nativeEvent.stopImmediatePropagation();
              dotClick(dot, id);
            }}
          />
        );
      })}
    </>
  );
};
