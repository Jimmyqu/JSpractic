import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { getRoutes } from '@/utils/utils';
import NotFound from '@/routes/Exception/404';

@connect()
class UserBasic extends Component {
  static contextTypes = {
    getScopeAuthorizedBtnTypes: PropTypes.func,
  };

  static childContextTypes = {
    isAuthorized: PropTypes.func,
  };

  // 覆盖 isAuthorized
  getChildContext() {
    const { getScopeAuthorizedBtnTypes } = this.context;
    const authorizedBtnTypes = getScopeAuthorizedBtnTypes('/basic/pub');
    return {
      isAuthorized: auth => {
        if (auth == null) {
          return true;
        }
        return authorizedBtnTypes.includes(auth);
      },
    };
  }

  render() {
    const { match, routerData } = this.props;
    return (
      <Switch>
        {getRoutes(match.path, routerData).map(item => (
          <Route key={item.key} path={item.path} component={item.component} exact={item.exact} />
        ))}
        <Redirect exact from="/basic/pub/info" to="/basic/pub/info/nav" />
        <Route render={NotFound} />
      </Switch>
    );
  }
}

export default UserBasic;
