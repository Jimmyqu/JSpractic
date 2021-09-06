import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { getRoutes } from '@/utils/utils';
import OrderSteps from '@/components/OrderSteps';
import NotFound from '@/routes/Exception/404';

@connect(({ orderprocessing, venue }) => ({
  orderprocessing,
  venue,
}))
class BookingIndex extends Component {
  static contextTypes = {
    getScopeAuthorizedBtnTypes: PropTypes.func,
  };

  static childContextTypes = {
    isAuthorized: PropTypes.func,
  };

  stepList = [
    {
      path: 'locker',
      title: '储物柜',
    },
    {
      path: 'user',
      title: '选择会员',
    },
    {
      path: 'summary',
      title: '核对订单信息',
    },
    {
      path: 'pay',
      title: '支付',
    },
    {
      path: 'result',
      title: '支付结果',
    },
  ];

  authScopePath = '/basic/rent/locker';

  // 覆盖 isAuthorized
  getChildContext() {
    const { getScopeAuthorizedBtnTypes } = this.context;
    const authorizedBtnTypes = getScopeAuthorizedBtnTypes(this.authScopePath);
    return {
      isAuthorized: auth => {
        if (auth == null) {
          return true;
        }
        return authorizedBtnTypes.includes(auth);
      },
    };
  }

  componentDidMount() {
    this.execClear();
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillUpdate({ location: nextLocation }) {
    const { location } = this.props;
    if (nextLocation !== location && nextLocation.pathname === this.authScopePath) {
      this.execClear();
    }
  }

  execClear() {
    const { dispatch } = this.props;
    dispatch({
      type: 'lockerselling/clearOrder',
    });
  }

  render() {
    const { match, routerData } = this.props;
    return (
      <OrderSteps stepList={this.stepList}>
        <Switch>
          {getRoutes(match.path, routerData).map(item => (
            <Route key={item.key} path={item.path} component={item.component} exact={item.exact} />
          ))}
          <Redirect exact from={this.authScopePath} to={`${this.authScopePath}/${this.stepList[0].path}`} />
          <Route render={NotFound} />
        </Switch>
      </OrderSteps>
    );
  }
}

export default BookingIndex;
