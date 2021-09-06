import { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Drawer, Badge } from 'antd';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Store from '@/components/Store';
import Unpaid from '@/components/Store/Unpaid';
import MarginBar from '@/components/MarginBar';
import FooterToolbar from '@/components/FooterToolbar';
import FastSaveOrderButton from '@/components/Button/FastSaveOrderButton';

@connect(({ deal, store, loading }) => ({
  deal,
  store,
  saving: loading.effects['orderprocessing/saveOrder'],
  fastSaving: loading.effects['mallselling/fastSaveOrder'],
}))
@Form.create()
class Sell extends Component {
  static contextTypes = {
    getNextStepPath: PropTypes.func,
  };

  state = {
    cartData: {},
    drawerVisible: false,
    stateResult: {},
  };

  async componentDidMount() {
    this.handleFetchUnpaidCount();
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleFetchUnpaidCount = async () => {
    const { dispatch } = this.props;
    const result = await dispatch({
      type: 'store/fetchStateResult',
    });

    if (result == null) {
      return;
    }

    if (this.isUnmounted) {
      return;
    }

    this.setState({
      stateResult: result,
    });
  };

  handleCartContentChange = cartData => {
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      cartData,
    });
  };

  handleNextStep = summary => {
    const { dispatch } = this.props;
    const { getNextStepPath } = this.context;
    const {
      cartData: { list, useMarktingMngmtMemberIds },
    } = this.state;
    dispatch({
      type: 'mallselling/mallNextStep',
      payload: {
        list,
        ids: useMarktingMngmtMemberIds,
      },
      summary,
    }).then(id => {
      if (summary) {
        if (id) {
          dispatch(
            push({
              pathname: './summary',
              search: `id=${id}`,
            })
          );
        }
        return;
      }
      dispatch(push(getNextStepPath()));
    });
  };

  handleDrawerClose = () => {
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      drawerVisible: false,
    });
  };

  handleDrawerShow = () => {
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      drawerVisible: true,
    });
  };

  toSummary = () => {
    this.handleNextStep(true);
  };

  toFastSummary = (mode, changePaidPrice, totalPrice) => {
    const {
      dispatch,
      deal: { PayWayTypes: dealPayMod },
    } = this.props;
    const {
      cartData: { list, useMarktingMngmtMemberIds },
    } = this.state;
    return dispatch({
      type: 'mallselling/fastSaveOrder',
      payload: {
        list,
        ids: useMarktingMngmtMemberIds,
        payMode: mode,
        changePaidPrice, // 找零金额
      },
    }).then(data => {
      const { payContent, dealId } = data || {};
      if (dealId) {
        if (totalPrice === 0 || mode === dealPayMod.CASH.key) {
          dispatch(push('./result'));
          return;
        }
        dispatch(
          push({
            pathname: './pay',
            search: `content=${payContent}`,
          })
        );
      }
    });
  };

  render() {
    const { saving, fastSaving } = this.props;
    const {
      cartData: { totalNum = 0, totalPrice = 0 },
      drawerVisible,
      stateResult,
    } = this.state;

    const { unpaidDealitemCount, marketingTeamMemberCount } = stateResult;
    const unpaidGoodsDealCount = unpaidDealitemCount || 0;
    return (
      <PageHeaderLayout>
        <Store marketingTeamMemberCount={marketingTeamMemberCount} onContentChange={this.handleCartContentChange} />
        <FooterToolbar>
          <MarginBar left top inline right={unpaidGoodsDealCount > 0 ? 16 : undefined}>
            <Badge count={unpaidGoodsDealCount}>
              <Button disabled={saving} loading={fastSaving} onClick={this.handleDrawerShow}>
                未结算订单
              </Button>
            </Badge>
          </MarginBar>
          {totalNum > 0 && (
            <>
              <MarginBar left top inline>
                <FastSaveOrderButton
                  disabled={saving}
                  loading={fastSaving}
                  totalPrice={totalPrice}
                  onSummary={this.toFastSummary}
                >
                  快速结算
                </FastSaveOrderButton>
              </MarginBar>
              <MarginBar left top inline>
                <Button disabled={fastSaving} loading={saving} onClick={this.toSummary}>
                  散客结算
                </Button>
              </MarginBar>
              <MarginBar left top inline>
                <Button type="primary" disabled={saving || fastSaving} onClick={() => this.handleNextStep()}>
                  下一步
                </Button>
              </MarginBar>
            </>
          )}
        </FooterToolbar>

        <Drawer title="未结算订单" visible={drawerVisible} onClose={this.handleDrawerClose} width={480}>
          <Unpaid handleFetchUnpaidCount={this.handleFetchUnpaidCount} />
        </Drawer>
      </PageHeaderLayout>
    );
  }
}

export default Sell;
