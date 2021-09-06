import { Component, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Switch, Route, Redirect } from 'react-router-dom';
import { stringify } from 'qs';
import { Spin } from 'antd';
import { getRoutes, getPageQuery } from '@/utils/utils';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Forbidden from '@/routes/Exception/403';
import NotFound from '@/routes/Exception/404';

@connect()
class AuthTabsPageHeaderLayout extends Component {
  static contextTypes = {
    getScopeAuthorizedBtnTypes: PropTypes.func,
  };

  static childContextTypes = {
    isAuthorized: PropTypes.func,
  };

  // 覆盖 isAuthorized
  getChildContext() {
    const authorizedBtnTypes = this.getAllAuthorizedKeys();
    return {
      isAuthorized: auth => {
        if (auth == null) {
          return true;
        }
        return authorizedBtnTypes.includes(auth);
      },
    };
  }

  getAllAuthorizedKeys() {
    const { getScopeAuthorizedBtnTypes } = this.context;
    const { authScopePath } = this.props;
    if (authScopePath == null) {
      return [];
    }
    return getScopeAuthorizedBtnTypes(authScopePath);
  }

  handleTabChange = key => {
    const { dispatch, match, searchAlive } = this.props;
    // searchAlive表示跳转时原路径的查询参数保留
    const query = getPageQuery();
    let searchObj;
    if (searchAlive === true) {
      searchObj = query;
    } else if (Array.isArray(searchAlive)) {
      const obj = {};
      searchAlive.forEach(name => {
        obj[name] = query[name];
      });
      searchObj = obj;
    }
    dispatch(
      push({
        pathname: `${match.url}/${key}`,
        search: stringify(searchObj),
      })
    );
  };

  getTabActiveKey = () => {
    const { match, location, getTabActiveKey } = this.props;
    if (typeof getTabActiveKey === 'function') {
      return getTabActiveKey();
    }
    return location.pathname.replace(`${match.path}/`, '');
  };

  render() {
    const {
      match,
      routerData,
      location,
      tabList = [],
      authScopePath,
      indexPath = authScopePath,
      children,
      loading,
      getTabActiveKey,
      ...rest
    } = this.props;

    const routes = getRoutes(match.path, routerData);
    const tabActiveKey = this.getTabActiveKey();
    // const tabActiveKey = location.pathname.replace(`${match.path.replace(':id', id)}/`, '');

    const authKeys = this.getAllAuthorizedKeys();

    const defaultPath = (tabList.find(item => item.auth == null || authKeys.includes(item.auth)) || tabList[0] || {})
      .key;

    if (!loading && defaultPath == null) {
      return <Route render={Forbidden} />;
    }

    const renderChildren = loading ? (
      <Spin />
    ) : (
      <Switch>
        {routes.map(item => (
          <Route key={item.key} path={item.path} component={item.component} exact={item.exact} />
        ))}
        <Redirect exact from={indexPath} to={`${indexPath}/${defaultPath}`} />
        <Route render={NotFound} />
      </Switch>
    );

    return (
      <PageHeaderLayout {...rest} tabList={tabList} tabActiveKey={tabActiveKey} onTabChange={this.handleTabChange}>
        {children
          ? Children.map(children, child =>
              cloneElement(child, {
                ...child.props,
                authedChildren: renderChildren,
              })
            )
          : renderChildren}
      </PageHeaderLayout>
    );
  }
}

export default AuthTabsPageHeaderLayout;
