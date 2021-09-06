import { Component } from 'react';
import { Card, Row, Col } from 'antd';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import style from './nav.less';
import NavForm from './NavForm';
import QueryForm from './QueryForm';

@connect(({ pubuser }) => ({
  pubuser,
}))
class Nav extends Component {
  state = {
    isAdd: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'pubuser/fetchUserCount',
    });
  }

  handleModeChange = isAdd => {
    this.setState({
      isAdd,
    });
  };

  render() {
    const { pubuser } = this.props;
    const { isAdd } = this.state;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Row gutter={8}>
            <Col span={12}>
              <Card
                onClick={() => this.handleModeChange(false)}
                className={classNames(style.card, {
                  [style.selected]: !isAdd,
                })}
                bodyStyle={{ padding: 8 }}
              >
                会员查询
                <div className={style.descr}>
                  当前会员人数：
                  {pubuser.userCount}
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card
                onClick={() => this.handleModeChange(true)}
                className={classNames(style.card, {
                  [style.selected]: isAdd,
                })}
                bodyStyle={{ padding: 8 }}
              >
                添加会员
              </Card>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={12}>
              {!isAdd && <QueryForm />}
            </Col>
            <Col sm={24} md={12}>
              {isAdd && <NavForm />}
            </Col>
          </Row>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default Nav;
