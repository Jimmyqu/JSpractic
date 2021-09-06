import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { goBack, replace } from 'connected-react-router';
import { Button } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import MarginBar from '@/components/MarginBar';
import FetchUser from '@/components/FetchUser';
import FastSaveOrderButton from '@/components/Button/FastSaveOrderButton';
import { add } from '@/commons/lib/math';

@connect(({ deal, orderprocessing, lockerselling, loading }) => ({
  deal,
  orderprocessing,
  lockerselling,
  saving: loading.effects['orderprocessing/saveOrder'] || loading.effects['lockerselling/fastSaveOrder'],
  newSaving: loading.effects['pubuser/createUser'],
}))
class CourseSellingUser extends Component {
  static contextTypes = {
    checkOpFailed: PropTypes.func,
    checkOpFailedAndGoBack: PropTypes.func,
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

  toFastSummary = (mode, changePaidPrice, totalPrice) => {
    const {
      dispatch,
      orderprocessing: { dealInfo },
      deal: { PayWayTypes },
    } = this.props;
    return dispatch({
      type: 'lockerselling/fastSaveOrder',
      payload: {
        list: dealInfo?.dealLeaseList,
        payMode: mode,
        changePaidPrice, // 找零金额
      },
    }).then(data => {
      const { payContent, dealId } = data || {};
      if (dealId) {
        if (totalPrice === 0 || mode === PayWayTypes.CASH.key) {
          dispatch(replace('./result'));
          return;
        }
        dispatch(
          replace({
            pathname: './pay',
            search: `content=${payContent}`,
          })
        );
      }
    });
  };

  handleNextStep = summary => {
    const {
      dispatch,
      orderprocessing: { dealInfo },
    } = this.props;
    const { deal } = dealInfo || {};
    const { currentDeal } = this.state;
    const data = currentDeal || deal;

    dispatch({
      type: 'lockerselling/userNextStep',
      payload: data,
      summary,
    }).then(id => {
      if (id) {
        dispatch(
          replace({
            pathname: './summary',
            search: `id=${id}`,
          })
        );
      }
    });
  };

  handleGoBack = () => {
    const { dispatch } = this.props;
    dispatch(goBack());
  };

  render() {
    const { checkOpFailed } = this.context;
    if (checkOpFailed()) {
      return null;
    }
    const {
      orderprocessing: { dealInfo },
      newSaving,
      saving,
      lockerselling: { leaseLockerBoxData },
    } = this.props;
    const { currentDeal } = this.state;
    // limitPayModes 这样用依赖于租赁订单不支持修改
    const { limitPayModes } = leaseLockerBoxData || {};

    const { deal, dealLeaseList } = dealInfo || {};

    const data = currentDeal || deal || {};

    return (
      <>
        <FetchUser deal={data} onChange={this.handleUserChange} />
        <FooterToolbar>
          <MarginBar left top inline>
            <Button disabled={saving || newSaving} onClick={this.handleGoBack}>
              返回
            </Button>
          </MarginBar>
          <MarginBar left top inline>
            <FastSaveOrderButton
              disabled={newSaving}
              loading={saving}
              limitPayModes={limitPayModes}
              totalPrice={(dealLeaseList || []).reduce(
                (prev, { rentalAmount, depositAmount }) => add(prev, add(rentalAmount || 0, depositAmount || 0)),
                0
              )}
              onSummary={this.toFastSummary}
            >
              快速结算
            </FastSaveOrderButton>
          </MarginBar>
          <MarginBar left top inline>
            <Button disabled={newSaving} loading={saving} onClick={() => this.handleNextStep(true)}>
              散客结算
            </Button>
          </MarginBar>
          <MarginBar left top inline>
            <Button
              type="danger"
              disabled={newSaving || !data.pubAccountId}
              loading={saving}
              onClick={() => this.handleNextStep()}
            >
              结算
            </Button>
          </MarginBar>
        </FooterToolbar>
      </>
    );
  }
}

export default CourseSellingUser;
