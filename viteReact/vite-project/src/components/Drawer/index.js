import { isValidElement, Children, cloneElement, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Drawer as D, Icon, Button, Spin } from 'antd';
import MarginBar from '@/components/MarginBar';
import styles from './index.less';

function Drawer(
  {
    handler,
    onVisibleChange,
    placement,
    className,
    onClose,
    footer: f,
    children,
    onOk,
    loading: drawerLoading,
    title,
    ...rest
  },
  { isMobile }
) {
  const [loading, setLoading] = useState();
  const [footerHeight, setFooterHeight] = useState(0);
  const [bodyHeight, setBodyHeight] = useState(0);

  const onSure = useCallback(() => {
    setLoading(true);
    let result;
    try {
      result = onOk?.();
    } finally {
      setLoading(false);
    }
    // onOk 返回Promise则Promise正常结束后关闭，否则调用完后直接关闭
    Promise.resolve(result)
      .then(() => {
        onVisibleChange(false);
      })
      .catch(e => {
        // eslint-disable-next-line no-console
        console.error(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [onOk]);

  let footer =
    f === null ? null : (
      <>
        <MarginBar inline top left>
          <Button onClick={() => onVisibleChange(false)} disabled={loading || drawerLoading}>
            取消
          </Button>
        </MarginBar>
        <MarginBar inline top left>
          <Button type="primary" onClick={onSure} disabled={drawerLoading} loading={loading}>
            确定
          </Button>
        </MarginBar>
      </>
    );

  // 不想要按钮可以footer={null}
  if (f != null) {
    footer = Children.map(f, child => {
      if (child == null) {
        return null;
      }
      const { link, ...btnRest } = child.props;
      const { children: ch, onClick, ...restProps } = btnRest;
      switch (link) {
        case 'cancel':
          return (
            <MarginBar inline top left>
              {cloneElement(child, {
                ...restProps,
                disabled: drawerLoading || restProps.disabled,
                children: ch || '关闭',
                onClick: () => {
                  onClick?.();
                  onVisibleChange(false);
                },
              })}
            </MarginBar>
          );
        case 'ok':
          return (
            <MarginBar inline top left>
              {cloneElement(child, {
                type: 'primary',
                ...restProps,
                loading: loading || restProps.loading,
                disabled: drawerLoading || restProps.disabled,
                children: ch || '确定',
                onClick: onSure,
              })}
            </MarginBar>
          );
        default:
          return (
            <MarginBar inline top left>
              {child}
            </MarginBar>
          );
      }
    });
  }

  const hasTitle = title !== undefined;

  return (
    <D
      handler={
        isValidElement(handler) ? (
          handler
        ) : (
          <div
            className={classNames(styles.handler, handler?.className)}
            onClick={() => {
              if (typeof onVisibleChange === 'function') {
                onVisibleChange(!rest.visible);
              }
            }}
          >
            {handler?.icon || <Icon type="setting" />}
          </div>
        )
      }
      destroyOnClose
      width={520}
      height={bodyHeight > 0 ? bodyHeight : undefined}
      {...rest}
      className={classNames(
        styles.drawer,
        {
          [styles.hasTitle]: hasTitle,
        },
        className
      )}
      placement={isMobile ? 'bottom' : placement}
      onClose={() => onVisibleChange(false)}
    >
      <div
        ref={div => {
          if (isMobile && div) {
            setBodyHeight(Math.max(div?.offsetHeight, div?.clientHeight) || 0);
          }
        }}
      >
        {/* 为了方便计算自动设置的高度，把title强制放到body里 */}
        {hasTitle && <div className={classNames('ant-drawer-header', styles.headerInbody)}>{title}</div>}
        <div
          className={styles.bodyInbody}
          // 由于Drawer本身不支持footer, 封装的footer 是放到body里的，footer的高度对body有遮挡，弄个div撑起来
          style={{
            // 24 是 drawer-body 的下方padding
            paddingBottom: Math.max(footerHeight - 24, 0),
          }}
        >
          <Spin spinning={!!drawerLoading}>{children}</Spin>
          {/* 不想要按钮可以footer={null} */}
          {footer != null && (
            <div
              className={styles.footerInbody}
              ref={div => {
                setFooterHeight(Math.max(div?.offsetHeight, div?.clientHeight) || 0);
              }}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </D>
  );
}

Drawer.contextTypes = {
  isMobile: PropTypes.bool,
};

export default Drawer;
