import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push, goBack } from 'connected-react-router';
import { Button } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import MarginBar from '@/components/MarginBar';
import FetchUser from '@/components/FetchUser';
import FastSaveOrderButton from '@/components/Button/FastSaveOrderButton';
import { add, mul } from '@/commons/lib/math';

@connect(({ venue, deal, orderprocessing, booking, loading }) => ({
  venue,
  deal,
  orderprocessing,
  booking,
  saving: loading.effects['orderprocessing/saveOrder'] || loading.effects['booking/fastSaveOrder'],
  newSaving: loading.effects['pubuser/createUser'],
}))
class User extends Component {
  static contextTypes = {
    checkOpFailed: PropTypes.func,
    checkOpFailedAndGoBack: PropTypes.func,
    getNextStepPath: PropTypes.func,
    selectPubStudy: PropTypes.bool,
    validPubStudy: PropTypes.bool,
  };

  state = {
    currentDeal: undefined,
  };

  componentDidMount() {
    const { checkOpFailedAndGoBack } = this.context;
    checkOpFailedAndGoBack();
  }

  handleUserChange = deal => {
    this.setState({
      currentDeal: deal,
    });
  };

  handleNextStep = summary => {
    const {
      dispatch,
      orderprocessing: { dealInfo },
    } = this.props;
    const { getNextStepPath } = this.context;
    const { deal } = dealInfo || {};
    const { currentDeal } = this.state;
    const data = currentDeal || deal;

    dispatch({
      type: 'booking/userNextStep',
      payload: data,
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

  handleGoBack = () => {
    const { dispatch } = this.props;
    dispatch(goBack());
  };

  toSummary = () => {
    this.handleNextStep(true);
  };

  toFastSummary = (mode, changePaidPrice, totalPrice) => {
    const {
      dispatch,
      deal: { PayWayTypes },
    } = this.props;
    return dispatch({
      type: 'booking/fastSaveOrder',
      payload: {
        payMode: mode,
        changePaidPrice, // 找零金额
      },
    }).then(data => {
      const { payContent, dealId } = data || {};
      if (dealId) {
        if (totalPrice === 0 || mode === PayWayTypes.CASH.key) {
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

  handleIndividual = () => {
    this.setState({
      currentDeal: null,
    });

    this.userComp.setIndividualUser(() => {
      const { dispatch } = this.props;
      const { getNextStepPath } = this.context;
      dispatch(push(getNextStepPath()));
    });
  };

  initUserComp = comp => {
    this.userComp = comp;
  };

  render() {
    const { checkOpFailed, selectPubStudy, validPubStudy } = this.context;
    if (checkOpFailed()) {
      return null;
    }

    const {
      venue: { currentPlatformItem: ci },
      orderprocessing: { dealInfo },
      saving,
      newSaving,
    } = this.props;
    const currentPlatformItem = ci || {};
    const { currentDeal } = this.state;

    const { deal, dealPlatformList, dealSportPlatformTicketList } = dealInfo || {};

    const hasMustFight = (dealPlatformList || []).some(item => item.mustFight);

    const data = currentDeal || deal || {};

    // 必须选择会员
    const isMustFetchUser = currentPlatformItem.isVisitor == null ? false : currentPlatformItem.isVisitor !== 1;
    const isTicket = currentPlatformItem.itemType === 2;

    const totalPrice = isTicket
      ? dealSportPlatformTicketList.reduce(
          (pre, { salesNum, transactionPrice }) => add(pre, mul(salesNum, transactionPrice)),
          0
        )
      : dealPlatformList.reduce((pre, { price }) => add(pre, price || 0), 0);

    const canSummary = !((selectPubStudy && validPubStudy) || isMustFetchUser);
    return (
      <>
        <FetchUser deal={data} onChange={this.handleUserChange} onInit={this.initUserComp} />
        <FooterToolbar>
          <MarginBar left top inline>
            <Button disabled={saving || newSaving} onClick={this.handleGoBack}>
              {isTicket ? '重新购买' : '返回修改'}
            </Button>
          </MarginBar>
          {!hasMustFight && canSummary && (
            <>
              <MarginBar left top inline>
                <FastSaveOrderButton
                  disabled={newSaving}
                  loading={saving}
                  totalPrice={totalPrice}
                  onSummary={this.toFastSummary}
                >
                  快速结算
                </FastSaveOrderButton>
              </MarginBar>
              <MarginBar left top inline>
                <Button disabled={newSaving} loading={saving} onClick={this.handleIndividual}>
                  散客结算
                </Button>
              </MarginBar>
            </>
          )}
          {canSummary && (
            <MarginBar left top inline>
              <Button
                type="danger"
                disabled={newSaving || !data.pubAccountId}
                loading={saving}
                onClick={this.toSummary}
              >
                结算
              </Button>
            </MarginBar>
          )}
          <MarginBar left top inline>
            <Button
              type="primary"
              disabled={newSaving || saving || !data.pubAccountId}
              onClick={() => this.handleNextStep()}
            >
              下一步
            </Button>
          </MarginBar>
        </FooterToolbar>
      </>
    );
  }
}

export default User;
