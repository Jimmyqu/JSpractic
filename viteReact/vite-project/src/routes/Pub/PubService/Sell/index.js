import { Component } from 'react';
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
class PubServiceSell extends Component {
  componentDidMount() {
    this.execClear();
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillUpdate({ location: nextLocation }) {
    const { location, match } = this.props;
    const { id } = match.params || {};
    if (nextLocation !== location && nextLocation.pathname === '/basic/pub/pubservice/:id'.replace(':id', id)) {
      this.execClear();
    }
  }

  getStepList() {
    const { orderprocessing } = this.props;
    const { dealInfo } = orderprocessing;
    const { selectPubStudy } = (dealInfo || {}).deal || {};
    return [
      {
        path: 'sell',
        title: '销售服务',
      },
      {
        path: 'user',
        title: '选择会员',
      },
      selectPubStudy && {
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
      type: 'pubserviceselling/clearOrder',
    });
  }

  render() {
    const { match, routerData, dispatch, location } = this.props;
    const { id } = match.params || {};
    const invalid = id && !/^\d+$/.test(id);
    if (invalid) {
      return (
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
      );
    }
    const stepPath = location.pathname.replace(`${match.path.replace(':id', id)}/`, '');

    const stepList = this.getStepList();
    return (
      <OrderSteps stepList={stepList} ignore={!stepList.some(item => item.path === stepPath)}>
        <Switch>
          {getRoutes(match.path, routerData).map(item => (
            <Route key={item.key} path={item.path} component={item.component} exact={item.exact} />
          ))}
          <Redirect exact from="/basic/pub/pubservice/:id" to={`/basic/pub/pubservice/:id/${stepList[0].path}`} />
          <Route render={NotFound} />
        </Switch>
      </OrderSteps>
    );
  }
}

export default PubServiceSell;
