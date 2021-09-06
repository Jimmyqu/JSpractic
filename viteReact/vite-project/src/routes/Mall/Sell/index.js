import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { getRoutes, getPageQuery } from '@/utils/utils';
import OrderSteps from '@/components/OrderSteps';
import NotFound from '@/routes/Exception/404';

@connect()
class MallIndex extends Component {
  stepList = [
    {
      path: 'mall',
      title: '选择商品',
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

  static contextTypes = {
    getScopeAuthorizedBtnTypes: PropTypes.func,
  };

  static childContextTypes = {
    isAuthorized: PropTypes.func,
  };

  // 覆盖 isAuthorized
  getChildContext() {
    const { getScopeAuthorizedBtnTypes } = this.context;
    const authorizedBtnTypes = getScopeAuthorizedBtnTypes('/basic/mall/sell');
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
    if (nextLocation !== location && nextLocation.pathname === '/basic/mall/sell') {
      this.execClear();
    }
  }

  execClear() {
    const { id } = getPageQuery();
    if (id) {
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'mallselling/clearOrder',
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
          <Redirect exact from="/basic/mall/sell" to={`/basic/mall/sell/${this.stepList[0].path}`} />
          <Route render={NotFound} />
        </Switch>
      </OrderSteps>
    );
  }
}

export default MallIndex;
