import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { goBack } from 'connected-react-router';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Card, Button } from 'antd';
import Result from '@/components/Result';
import { getRoutes, getPageQuery } from '@/utils/utils';
import OrderSteps from '@/components/OrderSteps';
import NotFound from '@/routes/Exception/404';

@connect(({ orderprocessing }) => ({
  orderprocessing,
}))
class TicketSell extends Component {
  static contextTypes = {
    getScopeAuthorizedBtnTypes: PropTypes.func,
  };

  static childContextTypes = {
    isAuthorized: PropTypes.func,
  };

  // 覆盖 isAuthorized
  getChildContext() {
    const { getScopeAuthorizedBtnTypes } = this.context;
    const authorizedBtnTypes = getScopeAuthorizedBtnTypes('/basic/ticket/sell');
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
    const { location, match } = this.props;
    const { id } = match.params || {};
    if (nextLocation !== location && nextLocation.pathname === '/basic/ticket/sell/:id'.replace(':id', id)) {
      this.execClear();
    }
  }

  getStepList() {
    const { orderprocessing } = this.props;
    const { dealInfo } = orderprocessing;
    const { selectPubStudy, pushSeat } = dealInfo?.deal || {};
    return [
      {
        path: 'pick',
        title: '销售票务',
      },
      {
        path: 'user',
        title: '选择会员',
      },
      {
        path: 'sell',
        title: '确认票务信息',
      },
      selectPubStudy && {
        path: 'fill',
        title: '填写人员信息',
      },
      pushSeat && {
        path: 'seat',
        title: '选座位',
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
      type: 'ticketselling/clearOrder',
    });
  }

  render() {
    const { match, routerData, dispatch } = this.props;
    const { id } = match.params || {};
    const invalid = id && !/^\d+$/.test(id);

    const stepList = this.getStepList();
    return invalid ? (
      <Card bordered={false}>
        <Result
          type="error"
          title="错误"
          description="会员服务id参数错误"
          actions={
            <Button type="primary" onClick={() => dispatch(goBack())}>
              返回
            </Button>
          }
        />
      </Card>
    ) : (
      <OrderSteps stepList={stepList}>
        <Switch>
          {getRoutes(match.path, routerData).map(item => (
            <Route key={item.key} path={item.path} component={item.component} exact={item.exact} />
          ))}
          <Redirect exact from="/basic/ticket/sell/:id" to={`/basic/ticket/sell/:id/${stepList[0].path}`} />
          <Route render={NotFound} />
        </Switch>
      </OrderSteps>
    );
  }
}

export default TicketSell;
