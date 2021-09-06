import { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { connect } from 'react-redux';
import { push, goBack, replace } from 'connected-react-router';
import MarginBar from '@/components/MarginBar';
import FooterToolbar from '@/components/FooterToolbar';
import Store from '@/components/Store';

@connect(({ loading, orderprocessing }) => ({
  orderprocessing,
  saving: loading.effects['orderprocessing/saveOrder'],
}))
class Mall extends Component {
  static contextTypes = {
    checkOpFailed: PropTypes.func,
    checkOpFailedAndGoBack: PropTypes.func,
    getNextStepPath: PropTypes.func,
    selectPubStudy: PropTypes.bool,
    validPubStudy: PropTypes.bool,
  };

  state = {
    cartData: {},
  };

  componentDidMount() {
    const { checkOpFailedAndGoBack } = this.context;
    checkOpFailedAndGoBack();
  }

  handleNextStep = (repl, summary) => {
    const { dispatch } = this.props;
    const {
      cartData: { list },
    } = this.state;
    const { getNextStepPath } = this.context;
    dispatch({
      type: 'booking/mallNextStep',
      payload: list,
      summary,
    }).then(id => {
      if (summary) {
        if (id) {
          dispatch(
            (repl ? replace : push)({
              pathname: './summary',
              search: `id=${id}`,
            })
          );
        }
        return;
      }
      dispatch((repl ? replace : push)(getNextStepPath()));
    });
  };

  handleCartContentChange = cartData => {
    this.setState({
      cartData,
    });
  };

  handleEmptyLoaded = () => {
    const {
      orderprocessing: { dealInfo },
    } = this.props;
    const { selectPubStudy } = (dealInfo || {}).deal || {};
    this.handleNextStep(true, !selectPubStudy);
  };

  handleGoBack = () => {
    const { dispatch } = this.props;
    dispatch(goBack());
  };

  render() {
    const { checkOpFailed, selectPubStudy, validPubStudy } = this.context;
    if (checkOpFailed()) {
      return null;
    }
    const {
      saving,
      orderprocessing: { dealInfo },
    } = this.props;
    return (
      <>
        <Store isBooking onContentChange={this.handleCartContentChange} onEmptyLoad={this.handleEmptyLoaded} />
        <FooterToolbar>
          <MarginBar left top inline>
            <Button disabled={saving} onClick={this.handleGoBack}>
              返回修改
            </Button>
          </MarginBar>
          {!(selectPubStudy && validPubStudy) && (
            <MarginBar left top inline>
              <Button type="danger" loading={saving} onClick={() => this.handleNextStep(false, true)}>
                结算
              </Button>
            </MarginBar>
          )}
          {selectPubStudy && !dealInfo.deal.isIndividual && (
            <MarginBar left top inline>
              <Button type="primary" loading={saving} onClick={() => this.handleNextStep()}>
                下一步
              </Button>
            </MarginBar>
          )}
        </FooterToolbar>
      </>
    );
  }
}

export default Mall;
