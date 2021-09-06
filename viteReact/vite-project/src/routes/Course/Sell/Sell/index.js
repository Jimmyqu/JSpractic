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
class CourseSell extends Component {
  stepList = [
    {
      path: 'schedule',
      title: '选择排期',
    },
    {
      path: 'pick',
      title: '课程详情',
    },
    {
      path: 'user',
      title: '选择会员',
    },
    {
      path: 'sell',
      title: '确认课程信息',
    },
    // 课程强制选人，不参考 selectPubStudy 字段
    {
      path: 'fill',
      title: '填写报名信息',
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

  componentDidMount() {
    this.execClear();
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillUpdate({ location: nextLocation }) {
    const { location, match } = this.props;
    const { id } = match.params || {};
    if (nextLocation !== location && nextLocation.pathname === '/basic/course/sell/:id'.replace(':id', id)) {
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
      type: 'courseselling/clearOrder',
    });
  }

  render() {
    const { match, routerData, dispatch } = this.props;
    const { id } = match.params || {};
    const invalid = id && !/^\d+$/.test(id);

    return invalid ? (
      <Card bordered={false}>
        <Result
          type="error"
          title="错误"
          description="课程id参数错误"
          actions={
            <Button type="primary" onClick={() => dispatch(goBack())}>
              返回
            </Button>
          }
        />
      </Card>
    ) : (
      <OrderSteps stepList={this.stepList}>
        <Switch>
          {getRoutes(match.path, routerData).map(item => (
            <Route key={item.key} path={item.path} component={item.component} exact={item.exact} />
          ))}
          <Redirect exact from="/basic/course/sell/:id" to={`/basic/course/sell/:id/${this.stepList[0].path}`} />
          <Route render={NotFound} />
        </Switch>
      </OrderSteps>
    );
  }
}

export default CourseSell;
