import { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, Route } from 'react-router-dom';
import classNames from 'classnames';
import PageHeader from '@/components/PageHeader';
import { triggerEvent } from '@/utils/utils';
import Forbidden from '@/routes/Exception/403';
import styles from './PageHeaderLayout.less';

class PageHeaderLayout extends Component {
  static contextTypes = {
    isMobile: PropTypes.bool,
    isAuthorized: PropTypes.func,
  };

  static childContextTypes = {
    switchGlobalFooterHeight: PropTypes.func,
    resetGlobalFooterHeight: PropTypes.func,
    getGlobalFooterHeight: PropTypes.func,
    getWrapperHeight: PropTypes.func,
    outSideContentClassName: PropTypes.string,
  };

  constructor(props, context) {
    super(props, context);
    this.defaultGlobalFooterHeight = 0;
    this.globalFooterHeight = this.defaultGlobalFooterHeight;
    this.otherHeight = undefined;
  }

  getChildContext() {
    return {
      getGlobalFooterHeight: () => this.globalFooterHeight,
      getWrapperHeight: () => this.otherHeight, // 滚动区域以外的高度总和
      outSideContentClassName: styles.content,
      switchGlobalFooterHeight: height => {
        this.globalFooterHeight = height;
        this.calcHeight();
      },
      resetGlobalFooterHeight: () => {
        this.globalFooterHeight = this.defaultGlobalFooterHeight;
        this.calcHeight();
      },
    };
  }

  componentDidMount() {
    this.calcHeight();
  }

  componentDidUpdate() {
    this.calcHeight();
  }

  componentWillUnmount() {}

  calcHeight() {
    const { isMobile } = this.context;
    let height = 0;
    if (this.topNode) {
      height += Math.max(this.topNode.offsetHeight, this.topNode.clientHeight);
    }
    if (this.headerNode) {
      height += Math.max(this.headerNode.offsetHeight, this.headerNode.clientHeight);
    }
    height +=
      48 + // globalheader
      (isMobile ? 0 : 8 * 2) + //  PageHeaderLayout__content margin-top 和 主动保留下边距间隔,
      this.globalFooterHeight + // globalfooter or FooterToolbar遮挡globalfooter时高度是不同的
      0;
    if (this.otherHeight !== height) {
      this.otherHeight = height;
      this.forceUpdate();
      triggerEvent(window, 'resize');
    }
  }

  render() {
    const { children, wrapperClassName, hideInBreadcrumb, title: appendTitle, top, ...restProps } = this.props;
    const { tabList, tabActiveKey } = restProps;
    const { isMobile, isAuthorized } = this.context;
    const activeTabItem = (tabList || []).find(item => item.key === tabActiveKey);

    if (activeTabItem && !isAuthorized(activeTabItem.auth)) {
      return <Route render={Forbidden} />;
    }
    return (
      <div className={classNames(styles.wrapper, wrapperClassName)}>
        <div
          ref={topNode => {
            this.topNode = topNode;
          }}
        >
          {top}
        </div>
        <PageHeader
          key="pageheader"
          hideInBreadcrumb={hideInBreadcrumb || isMobile}
          appendTitle={appendTitle}
          {...restProps}
          refNode={headerNode => {
            this.headerNode = headerNode;
          }}
          linkElement={Link}
        />
        {children ? (
          <div
            className={classNames(styles.content, {
              [styles.contentMobile]: isMobile,
            })}
            style={{ maxHeight: `calc(100vh - ${this.otherHeight}px)` }}
          >
            {children}
          </div>
        ) : null}
      </div>
    );
  }
}

export default PageHeaderLayout;
