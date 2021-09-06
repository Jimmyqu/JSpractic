import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { getRoutes, getPageQuery } from '@/utils/utils';
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

  // 覆盖 isAuthorized
  getChildContext() {
    const { getScopeAuthorizedBtnTypes } = this.context;
    const authorizedBtnTypes = getScopeAuthorizedBtnTypes('/basic/platform/booking');
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
    if (nextLocation !== location && nextLocation.pathname === '/basic/platform/booking') {
      this.execClear();
    }
  }

  getStepList() {
    const { orderprocessing, venue } = this.props;
    const { dealInfo } = orderprocessing;
    const { currentPlatformItem } = venue;
    const { selectPubStudy, isIndividual } = (dealInfo || {}).deal || {};

    const isTicket = currentPlatformItem && currentPlatformItem.itemType === 2;
    return [
      {
        path: 'booking',
        title: '订场',
      },
      {
        path: 'user',
        title: '选择会员',
      },
      !isTicket && {
        path: 'serviceuser',
        title: '选择服务人员',
      },
      {
        path: 'mall',
        title: '选择商品',
      },
      selectPubStudy &&
        !isIndividual && {
          path: 'fill',
          title: '填写人员信息',
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
    ].filter(Boolean);
  }

  execClear() {
    const { id } = getPageQuery();
    if (id) {
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'booking/clearOrder',
    });
  }

  render() {
    const { match, routerData } = this.props;
    const stepList = this.getStepList();
    return (
      <OrderSteps stepList={stepList}>
        <Switch>
          {getRoutes(match.path, routerData).map(item => (
            <Route key={item.key} path={item.path} component={item.component} exact={item.exact} />
          ))}
          <Redirect exact from="/basic/platform/booking" to={`/basic/platform/booking/${stepList[0].path}`} />
          <Route render={NotFound} />
        </Switch>
      </OrderSteps>
    );
  }
}

export default BookingIndex;
