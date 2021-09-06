import { Component } from 'react';
import { connect } from 'react-redux';
import { push, replace } from 'connected-react-router';
import { Card, Button } from 'antd';
import MarginBar from '@/components/MarginBar';
import AmountColor from '@/components/Amount/Color';
import OrderPrint from '@/components/OrderPrint';
import { formatMoney } from '@/utils/format';
import { getPageQuery, print } from '@/utils/utils';

@connect(({ orderprocessing, loading }) => ({
  orderprocessing,
  fetching: loading.effects['print/fetch'],
}))
class OrderPayResult extends Component {
  constructor(props) {
    super(props);
    const {
      match: { params },
      orderprocessing,
    } = props;
    const { dealInfo } = orderprocessing;
    if (dealInfo && dealInfo.deal) {
      this.dealId = dealInfo.deal.id;
      return;
    }
    const query = getPageQuery();
    if (query.id) {
      this.dealId = query.id;
      return;
    }
    if (params && params.id) {
      this.dealId = params.id;
    }
  }

  componentDidMount() {
    if (this.btn) {
      this.btn.buttonNode.focus();
    }
  }

  handleGoBack = () => {
    const {
      orderprocessing: { dealInfo },
      dispatch,
    } = this.props;
    const isAmountTopUp = dealInfo && dealInfo.dealPublicAccountList && dealInfo.dealPublicAccountList.length > 0;
    dispatch({
      type: 'orderprocessing/clearOrder',
    }).then(() => {
      if (isAmountTopUp) {
        dispatch(replace(`/basic/pub/info/${dealInfo.dealPublicAccountList[0].publicAccountId}/dealflow`));
        return;
      }
      dispatch(replace('.'));
    });
  };

  handlePrint = () => {
    const { orderprocessing } = this.props;
    const { dealInfo } = orderprocessing;
    // const { dispatch } = this.props;
    // dispatch(replace(`/basic/deal/${this.dealId}/print`));
    print(dealInfo);
  };

  goToDealDetail = () => {
    const { dispatch } = this.props;
    dispatch(push(`/basic/deal/${this.dealId}/detail`));
  };

  render() {
    const { orderprocessing, fetching } = this.props;
    const { dealInfo } = orderprocessing;
    return (
      <div>
        <Card className="no-print">
          <div className="text-center">
            <h1>支付成功</h1>
            {dealInfo && dealInfo.changePaidPrice > 0 && (
              <h2>
                找零：¥
                <AmountColor>{formatMoney(dealInfo.changePaidPrice)}</AmountColor>元
              </h2>
            )}
            <MarginBar top={36}>
              <Button onClick={this.handleGoBack}>返回</Button>
              {this.dealId && (
                <>
                  <MarginBar left top inline>
                    <Button type="primary" onClick={this.goToDealDetail}>
                      订单详情
                    </Button>
                  </MarginBar>
                  <MarginBar left top inline>
                    <Button
                      type="danger"
                      loading={fetching}
                      onClick={this.handlePrint}
                      ref={node => {
                        this.btn = node;
                      }}
                    >
                      打印(Enter)
                    </Button>
                  </MarginBar>
                </>
              )}
            </MarginBar>
          </div>
        </Card>
        <OrderPrint id={this.dealId} onlyPrint />
      </div>
    );
  }
}

export default OrderPayResult;
