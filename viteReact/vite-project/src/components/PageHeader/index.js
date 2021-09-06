import { PureComponent, createElement } from 'react';
import PropTypes from 'prop-types';
import pathToRegexp from 'path-to-regexp';
import { Breadcrumb, Tabs, Row, Col } from 'antd';
import classNames from 'classnames';
import { urlToList } from '@/utils/utils';
import styles from './index.less';

const { TabPane } = Tabs;
export function getBreadcrumb(breadcrumbNameMap, url) {
  let breadcrumb = breadcrumbNameMap[url];
  if (!breadcrumb) {
    Object.keys(breadcrumbNameMap).forEach(item => {
      if (pathToRegexp(item).test(url)) {
        breadcrumb = breadcrumbNameMap[item];
      }
    });
  }
  return breadcrumb || {};
}

export default class PageHeader extends PureComponent {
  static contextTypes = {
    routes: PropTypes.array,
    params: PropTypes.object,
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
    isAuthorized: PropTypes.func,
  };

  state = {
    breadcrumb: null,
  };

  componentDidMount() {
    this.getBreadcrumbDom();
    this.provideNode();
  }

  componentDidUpdate(preProps) {
    const { tabActiveKey } = this.props;
    if (preProps.tabActiveKey !== tabActiveKey) {
      this.getBreadcrumbDom();
    }
    this.provideNode();
  }

  onChange = key => {
    const { onTabChange } = this.props;
    if (onTabChange) {
      onTabChange(key);
    }
  };

  getBreadcrumbProps = () => {
    const { routes, params, location, breadcrumbNameMap } = this.props;
    const {
      routes: croutes,
      params: cparams,
      location: clocation,
      breadcrumbNameMap: cbreadcrumbNameMap,
    } = this.context;
    return {
      routes: routes || croutes,
      params: params || cparams,
      routerLocation: location || clocation,
      breadcrumbNameMap: breadcrumbNameMap || cbreadcrumbNameMap,
    };
  };

  getBreadcrumbDom = () => {
    const { hideInBreadcrumb } = this.props;
    if (hideInBreadcrumb) {
      return;
    }
    const breadcrumb = this.conversionBreadcrumbList();
    this.setState({
      breadcrumb,
    });
  };

  // Generated according to props
  conversionFromProps = () => {
    const { breadcrumbList, breadcrumbSeparator, linkElement = 'a' } = this.props;
    return (
      <Breadcrumb className={styles.breadcrumb} separator={breadcrumbSeparator}>
        {breadcrumbList.map(item => (
          <Breadcrumb.Item key={item.title}>
            {item.href
              ? createElement(
                  linkElement,
                  {
                    [linkElement === 'a' ? 'href' : 'to']: item.href,
                  },
                  item.title
                )
              : item.title}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    );
  };

  conversionFromLocation = (routerLocation, breadcrumbNameMap) => {
    const { breadcrumbSeparator, linkElement = 'a', appendTitle } = this.props;
    // Convert the url to an array
    const pathSnippets = urlToList(routerLocation.pathname);
    // Loop data mosaic routing
    const extraBreadcrumbItems = pathSnippets.map((url, index) => {
      const currentBreadcrumb = getBreadcrumb(breadcrumbNameMap, url);
      if (currentBreadcrumb.inherited || currentBreadcrumb.hideInBreadcrumb || !currentBreadcrumb.name) {
        return null;
      }
      const isLinkable = index !== pathSnippets.length - 1 && currentBreadcrumb.component;
      return (
        <Breadcrumb.Item key={url}>
          {createElement(
            isLinkable ? linkElement : 'span',
            { [linkElement === 'a' ? 'href' : 'to']: url },
            currentBreadcrumb.name
          )}
        </Breadcrumb.Item>
      );
    });
    // Add home breadcrumbs to your head
    // extraBreadcrumbItems.unshift(
    //   <Breadcrumb.Item key="home">
    //     {createElement(
    //       linkElement,
    //       {
    //         [linkElement === 'a' ? 'href' : 'to']: '/',
    //       },
    //       '首页'
    //     )}
    //   </Breadcrumb.Item>
    // );
    return (
      <Breadcrumb className={styles.breadcrumb} separator={breadcrumbSeparator}>
        {extraBreadcrumbItems}
        {appendTitle && (
          <Breadcrumb.Item>
            <span title={appendTitle}>{appendTitle}</span>
          </Breadcrumb.Item>
        )}
      </Breadcrumb>
    );
  };

  /**
   * 将参数转化为面包屑
   * Convert parameters into breadcrumbs
   */
  conversionBreadcrumbList = () => {
    const { breadcrumbList, breadcrumbSeparator } = this.props;
    const { routes, params, routerLocation, breadcrumbNameMap } = this.getBreadcrumbProps();
    if (breadcrumbList && breadcrumbList.length > 0) {
      return this.conversionFromProps();
    }
    // 如果传入 routes 和 params 属性
    // If pass routes and params attributes
    if (routes && params) {
      return (
        <Breadcrumb
          className={styles.breadcrumb}
          routes={routes.filter(route => route.breadcrumbName)}
          params={params}
          itemRender={this.itemRender}
          separator={breadcrumbSeparator}
        />
      );
    }
    // 根据 location 生成 面包屑
    // Generate breadcrumbs based on location
    if (routerLocation && routerLocation.pathname) {
      return this.conversionFromLocation(routerLocation, breadcrumbNameMap);
    }
    return null;
  };

  // 渲染Breadcrumb 子节点
  // Render the Breadcrumb child node
  itemRender = (route, params, routes, paths) => {
    const { linkElement = 'a' } = this.props;
    const last = routes.indexOf(route) === routes.length - 1;
    return last || !route.component ? (
      <span>{route.breadcrumbName}</span>
    ) : (
      createElement(
        linkElement,
        {
          href: paths.join('/') || '/',
          to: paths.join('/') || '/',
        },
        route.breadcrumbName
      )
    );
  };

  provideNode() {
    const { refNode } = this.props;
    if (typeof refNode === 'function') {
      refNode(this.node);
    }
  }

  render() {
    const {
      title,
      logo,
      action,
      content,
      extraContent,
      tabList,
      className,
      tabActiveKey,
      tabDefaultActiveKey,
      tabBarExtraContent,
      helpContent,
    } = this.props;
    const { isAuthorized } = this.context;
    const { breadcrumb } = this.state;

    const clsString = classNames(styles.pageHeader, className);
    const activeKeyProps = {};
    if (tabDefaultActiveKey !== undefined) {
      activeKeyProps.defaultActiveKey = tabDefaultActiveKey;
    }
    if (tabActiveKey !== undefined) {
      activeKeyProps.activeKey = tabActiveKey;
    }

    // empty 处理避免padding
    if (
      breadcrumb == null &&
      logo == null &&
      (title == null || title.length === 0) &&
      action == null &&
      (content == null || content.length === 0) &&
      (extraContent == null || extraContent.length === 0) &&
      (tabList == null || tabList.length === 0 || tabList.filter(item => isAuthorized(item.auth)).length === 0)
    ) {
      return null;
    }

    return (
      <div
        className={clsString}
        ref={node => {
          this.node = node;
        }}
      >
        <Row>
          <Col sm={20}>{breadcrumb}</Col>
          {helpContent && (
            <Col sm={4} className="text-right">
              {helpContent}
            </Col>
          )}
        </Row>
        <div className={styles.detail}>
          {logo && <div className={styles.logo}>{logo}</div>}
          <div className={styles.main}>
            <div className={styles.row}>
              {title && <h1 className={styles.title}>{title}</h1>}
              {action && <div className={styles.action}>{action}</div>}
            </div>
            <div className={styles.row}>
              {content && <div className={styles.content}>{content}</div>}
              {extraContent && <div className={styles.extraContent}>{extraContent}</div>}
            </div>
          </div>
        </div>
        {tabList && tabList.length > 0 && (
          <div className="page-header-tabs-wrapper">
            <Tabs
              className={styles.tabs}
              {...activeKeyProps}
              onChange={this.onChange}
              tabBarExtraContent={tabBarExtraContent}
            >
              {tabList.map(item => (isAuthorized(item.auth) ? <TabPane tab={item.tab} key={item.key} /> : null))}
            </Tabs>
          </div>
        )}
      </div>
    );
  }
}
