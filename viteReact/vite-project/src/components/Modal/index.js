import { Component, Children, cloneElement } from 'react';
import classNames from 'classnames';
import { Modal, Spin } from 'antd';
import MarginBar from '@/components/MarginBar';
import styles from './index.less';

export default class CustModal extends Component {
  constructor(props) {
    super(props);
    this.timer = undefined;
    this.state = {
      modalProps: props,
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { modalProps } = this.state;
    const { children: nextChildren, visible } = nextProps;
    if (visible) {
      this.clearTimer();
    }
    // 如果children不传，使用原来的，for loading
    const { children: oChildren } = modalProps;
    let children = oChildren;
    if (nextChildren != null) {
      children = nextChildren;
    }
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      modalProps: {
        ...modalProps,
        ...nextProps,
        children,
      },
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  setConfirmLoading = confirmLoading => {
    if (this.isUnmounted) {
      return;
    }
    setTimeout(() => {
      this.setState(({ modalProps }) => ({
        modalProps: {
          ...modalProps,
          confirmLoading,
        },
      }));
    }, 0);
  };

  defClose = () => {
    const { modalProps } = this.state;
    const { onVisibleChange } = this.props;
    if (!this.isUnmounted) {
      this.setState({
        modalProps: {
          ...modalProps,
          loading: false,
          visible: false,
          confirmLoading: false,
        },
      });
    }

    if (onVisibleChange) {
      onVisibleChange(false);
    }
    // 动画结束后清理，直接清理会可见闪烁
    this.timer = setTimeout(() => {
      this.clearTimer();
      if (this.isUnmounted) {
        return;
      }
      this.setState({
        modalProps: {},
      });
    }, 300);
  };

  defOk = (onOk, ...rest) => {
    return () => {
      if (onOk == null) {
        this.defClose();
        return;
      }
      if (this.isUnmounted) {
        return;
      }
      this.setState(
        ({ modalProps }) => ({
          modalProps: {
            ...modalProps,
            confirmLoading: true,
          },
        }),
        () => {
          const okResult = onOk(
            {
              close: this.defClose,
              setConfirmLoading: this.setConfirmLoading,
              deepCallOk: (ok, ...r) => {
                setTimeout(() => {
                  this.defOk(ok, ...r)();
                }, 300);
              },
            },
            ...rest
          );
          (okResult instanceof Promise ? okResult : Promise.resolve(okResult))
            .then(result => {
              if (result === false) {
                this.setConfirmLoading(false);
                return;
              }
              this.defClose();
            })
            .catch(e => {
              this.setConfirmLoading(false);
              // eslint-disable-next-line no-console
              console.error(e);
            });
        }
      );
    };
  };

  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = null;
  }

  render() {
    const { modalProps } = this.state;
    const { children, onOk, onCancel, loading, footer, confirmLoading, wrapClassName, transparent, ...rest } =
      modalProps;
    // 各自只能出现一次
    let hasOk = false;
    let hasCancel = false;
    const okFn = this.defOk(onOk);
    const props = {
      destroyOnClose: true,
      centered: true,
      ...rest,
      wrapClassName: classNames(
        {
          [styles.transparentModal]: transparent,
        },
        wrapClassName
      ),
      confirmLoading,
      onCancel: () => {
        const { modalProps: p } = this.state;
        if (p.confirmLoading) {
          return;
        }
        (onCancel || this.defClose)();
      },
      onOk: okFn,
      footer: Children.map(footer, child => {
        if (child) {
          const { link, ...fistRestProps } = child.props;
          if (link) {
            const { children: ch, ...restProps } = fistRestProps;
            // link 后 也携带事件？
            // const onClick = restProps.onClick;
            switch (link) {
              case 'ok':
                if (!hasOk) {
                  hasOk = true;
                  const btn = cloneElement(child, {
                    type: modalProps.okType || 'primary',
                    ...restProps,
                    ...modalProps.okButtonProps,
                    loading: confirmLoading || restProps.loading,
                    children: ch || modalProps.okText || '确定',
                    onClick: okFn,
                  });
                  return (
                    <MarginBar left top inline>
                      {btn}
                    </MarginBar>
                  );
                }
                break;
              case 'cancel':
                if (!hasCancel) {
                  hasCancel = true;
                  const btn = cloneElement(child, {
                    ...restProps,
                    ...modalProps.cancelButtonProps,
                    disabled: confirmLoading || restProps.disabled,
                    children: ch || modalProps.cancelText || '关闭',
                    onClick: onCancel || this.defClose,
                  });
                  return (
                    <MarginBar left top inline>
                      {btn}
                    </MarginBar>
                  );
                }
                break;
              default:
            }
          }
          return (
            <MarginBar left top inline>
              {cloneElement(child, {
                ...fistRestProps,
                onClick: () => {
                  if (fistRestProps.onClick) {
                    return fistRestProps.onClick({
                      close: this.defClose,
                      setConfirmLoading: this.setConfirmLoading,
                      deepCallOk: (ok, ...r) => {
                        setTimeout(() => {
                          this.defOk(ok, ...r)();
                        }, 300);
                      },
                    });
                  }
                },
              })}
            </MarginBar>
          );
        }
        return child;
      }),
    };
    return (
      <Modal {...props}>
        <Spin spinning={!!loading}>{children}</Spin>
      </Modal>
    );
  }
}
