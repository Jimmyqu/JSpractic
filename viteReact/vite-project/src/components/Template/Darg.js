import { useState, useRef, useEffect, useCallback } from 'react';
import classnames from 'classnames';
import throttle from 'lodash/throttle';
import styles from './index.less';

export default ({
  container,
  isStatic = false,
  onContextMenu,
  onDoubleClick,
  // setCurrentStyle,
  currentItem,
  contentStyle,
  children,
}) => {
  const points = ['tl', 'tr', 'tm', 'bl', 'bm', 'br', 'rm', 'lm'];
  const dragBox = useRef();
  const direction = useRef();
  const isDown = useRef();
  const oriPos = useRef({
    cX: 0, // mouse position
    cY: 0,
  });
  const [style, setStyle] = useState(contentStyle);

  const transform = useCallback((d, o, p) => {
    const localStyle = { ...o };
    const offsetX = p.x - o.cX;
    const offsetY = p.y - o.cY;
    let top;
    let left;
    let width;
    let height;
    switch (d) {
      // move
      case 'move':
        top = o.top + offsetY;
        left = o.left + offsetX;
        width = dragBox.current?.offsetWidth || 0;
        height = dragBox.current?.offsetHeight || 0;
        localStyle.top = Math.max(0, Math.min(top, height - localStyle.height));
        localStyle.left = Math.max(0, Math.min(left, width - localStyle.width));
        break;
      // topmid
      case 'tm':
        localStyle.height -= offsetY;
        localStyle.top += offsetY;
        break;
      // bottommid
      case 'bm':
        localStyle.height += offsetY;
        break;
      case 'rm':
        localStyle.width += offsetX;
        break;
      case 'lm':
        localStyle.width -= offsetX;
        localStyle.left += offsetX;
        break;
      case 'tl':
        localStyle.height -= offsetY;
        localStyle.width -= offsetX;
        localStyle.top += offsetY;
        localStyle.left += offsetX;
        break;
      case 'br':
        localStyle.height += offsetY;
        localStyle.width += offsetX;
        break;
      case 'tr':
        localStyle.height -= offsetY;
        localStyle.width += offsetX;
        localStyle.top += offsetY;
        break;
      case 'bl':
        localStyle.height += offsetY;
        localStyle.width -= offsetX;
        localStyle.left += offsetX;
        break;
      default:
        return localStyle;
    }
    return localStyle;
  }, []);

  const onMouseDown = (e, d) => {
    e.persist();
    e.stopPropagation();
    direction.current = d;
    isDown.current = true;

    const cY = e.clientY;
    const cX = e.clientX;
    oriPos.current = {
      ...style,
      cX,
      cY,
    };

    const foo = throttle(function (we) {
      if (!isDown.current || isStatic) return;
      const y = we.clientY;
      const x = we.clientX;

      const newStyle = transform(direction.current, oriPos.current, { x, y });
      setStyle(newStyle);
      // eslint-disable-next-line no-param-reassign
      currentItem.contentStyle = { ...currentItem.contentStyle, ...newStyle };
    }, 17);

    window.addEventListener('mousemove', foo);

    window.addEventListener('mouseup', function () {
      // TODO push历史数据
      isDown.current = false;
      window.removeEventListener('mousemove', foo);
    });
  };

  useEffect(() => {
    dragBox.current = typeof container === 'object' ? container : document.querySelector(container);
    if (!['relative', 'absolute', 'fixed'].includes(dragBox.current.style.position)) {
      dragBox.current.style.position = 'relative';
    }
  }, []);

  return (
    <div>
      <div
        onContextMenu={onContextMenu}
        style={style}
        className={styles.dargWrapper}
        onDoubleClick={onDoubleClick}
        onMouseDown={e => onMouseDown(e, 'move')}
      >
        {isStatic ? (
          <div>{children}</div>
        ) : (
          <div>
            {children}
            {!isStatic &&
              points.map(item => (
                <div
                  onMouseDown={e => onMouseDown(e, item)}
                  className={classnames(styles.points, styles[`points_${item}`])}
                  key={item}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
