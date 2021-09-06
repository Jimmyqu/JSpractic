import { Component } from 'react';
import { Button, Card } from 'antd';
import { connect } from 'react-redux';
import { goBack } from 'connected-react-router';
import Result from '@/components/Result';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import InvoicedDetail from '@/components/Invoice/InvoicedDetail';

@connect(({ pubinvoice }) => ({
  pubinvoice,
}))
class InvoicedProfile extends Component {
  state = {
    info: undefined,
  };

  async componentDidMount() {
    const {
      match,
      dispatch,
      // routerData
    } = this.props;
    const { id } = match.params || {};
    const invalid = !/^\d+$/.test(id);
    if (invalid) {
      return;
    }
    const result = await dispatch({
      type: 'pubinvoice/fetchInvoicedDetail',
      payload: id,
    });

    if (result == null || this.isUnmounted) {
      return;
    }

    this.setState({
      info: result,
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  render() {
    const {
      match,
      dispatch,
      // routerData
    } = this.props;
    const { id } = match.params || {};
    const invalid = !/^\d+$/.test(id);

    // const routes = getRoutes(match.path, routerData);
    const { info } = this.state;

    return (
      <PageHeaderLayout title="发票详情">
        {invalid ? (
          <Card bordered={false}>
            <Result
              type="error"
              title="错误"
              description="发票id参数错误"
              actions={
                <Button type="primary" onClick={() => dispatch(goBack())}>
                  返回
                </Button>
              }
            />
          </Card>
        ) : (
          <InvoicedDetail data={info} />
        )}
      </PageHeaderLayout>
    );
  }
}

export default InvoicedProfile;
