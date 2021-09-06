import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push, goBack } from 'connected-react-router';
import { Button } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import MarginBar from '@/components/MarginBar';
import FetchUser from '@/components/FetchUser';

@connect(({ orderprocessing, pubserviceselling, loading }) => ({
  orderprocessing,
  pubserviceselling,
  saving: loading.effects['orderprocessing/saveOrder'],
  newSaving: loading.effects['pubuser/createUser'],
}))
class User extends Component {
  static contextTypes = {
    checkOpFailed: PropTypes.func,
    checkOpFailedAndGoBack: PropTypes.func,
    getNextStepPath: PropTypes.func,
    selectPubStudy: PropTypes.bool,
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
      type: 'pubserviceselling/userNextStep',
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

  render() {
    const { checkOpFailed, selectPubStudy } = this.context;
    if (checkOpFailed()) {
      return null;
    }
    const {
      orderprocessing: { dealInfo },
      saving,
      newSaving,
    } = this.props;
    const { currentDeal } = this.state;

    const { deal } = dealInfo || {};

    const data = currentDeal || deal || {};

    return (
      <>
        <FetchUser deal={data} onChange={this.handleUserChange} />
        <FooterToolbar>
          <MarginBar left top inline>
            <Button disabled={newSaving || saving} onClick={this.handleGoBack}>
              返回修改
            </Button>
          </MarginBar>
          <MarginBar left top inline>
            <Button type="danger" disabled={newSaving || !data.pubAccountId} loading={saving} onClick={this.toSummary}>
              结算
            </Button>
          </MarginBar>
          {selectPubStudy && (
            <MarginBar left top inline>
              <Button
                type="primary"
                disabled={newSaving || saving || !data.pubAccountId}
                onClick={() => this.handleNextStep()}
              >
                下一步
              </Button>
            </MarginBar>
          )}
        </FooterToolbar>
      </>
    );
  }
}

export default User;
