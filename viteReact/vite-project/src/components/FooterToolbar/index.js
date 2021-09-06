import { Component, Children } from 'react';
import throttle from 'lodash/throttle';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './index.less';

export default class FooterToolbar extends Component {
  static contextTypes = {
    isMobile: PropTypes.bool,
    switchGlobalFooterHeight: PropTypes.func,
    resetGlobalFooterHeight: PropTypes.func,
  };

  state = {
    width: undefined,
  };

  resizeFooterToolbar = throttle(() => {
    const sider = document.querySelector('.ant-layout-sider');
    if (sider) {
      const { isMobile } = this.context;
      const width = isMobile ? null : `calc(100% - ${sider.style.width})`;
      const { width: stateWidth } = this.state;
      if (stateWidth !== width) {
        this.setState({ width });
      }
    }
  }, 50);

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
    this.resizeFooterToolbar();
  }

  componentDidUpdate() {
    const { switchGlobalFooterHeight } = this.context;
    if (switchGlobalFooterHeight) {
      const height = this.dom ? Math.max(this.dom.offsetHeight, this.dom.clientHeight) : 0;
      switchGlobalFooterHeight(height);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
    const { resetGlobalFooterHeight } = this.context;
    if (resetGlobalFooterHeight) {
      resetGlobalFooterHeight();
    }
  }

  render() {
    const { children, className, extra, ...restProps } = this.props;
    const { width } = this.state;

    if (extra == null && Children.count(children) === 0) {
      return null;
    }
    return (
      <div
        ref={node => {
          this.dom = node;
        }}
        className={classNames(className, styles.toolbar)}
        style={{ width }}
        {...restProps}
      >
        <div className={styles.left}>{extra}</div>
        <div className={styles.right}>{children}</div>
      </div>
    );
  }
}
