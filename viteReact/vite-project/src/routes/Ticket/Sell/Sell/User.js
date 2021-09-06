import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push, goBack } from 'connected-react-router';
import { Button, Spin } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import MarginBar from '@/components/MarginBar';
import FetchUser from '@/components/FetchUser';
import { getPageQuery } from '@/utils/utils';

@connect(({ orderprocessing, ticketselling, loading }) => ({
  orderprocessing,
  ticketselling,
  fetching: loading.effects['pubticket/fetchTicket'],
  newSaving: loading.effects['pubuser/createUser'],
}))
class TicketSellingUser extends Component {
  static contextTypes = {
    checkOpFailed: PropTypes.func,
    checkOpFailedAndGoBack: PropTypes.func,
    getNextStepPath: PropTypes.func,
  };

  state = {
    currentDeal: undefined,
  };

  async componentDidMount() {
    const { reltype, id } = getPageQuery();
    const {
      dispatch,
      match: { params },
      orderprocessing: { dealInfo },
    } = this.props;
    if (reltype) {
      const result = await dispatch({
        type: 'pubticket/fetchTicket',
        payload: params.id,
      });
      const { selectPubStudy, validPubStudy, validFace } = result || {};
      dispatch({
        type: 'ticketselling/ticketsellingNextStep',
        payload: [
          {
            selectPubStudy,
            validPubStudy,
            validFace,
            relType: reltype,
            dataId: params.id,
          },
        ],
      });
      return;
    }
    if (dealInfo == null && id) {
      await dispatch({
        type: 'orderprocessing/fetchOrder',
      });
    }
    const { checkOpFailedAndGoBack } = this.context;
    checkOpFailedAndGoBack();
  }

  handleUserChange = deal => {
    this.setState({
      currentDeal: deal,
    });
  };

  handleNextStep = () => {
    const {
      dispatch,
      orderprocessing: { dealInfo },
    } = this.props;
    const { getNextStepPath } = this.context;
    const { deal } = dealInfo || {};
    const { currentDeal } = this.state;
    const data = currentDeal || deal;

    dispatch({
      type: 'ticketselling/userNextStep',
      payload: data,
    }).then(() => {
      dispatch(push(getNextStepPath()));
    });
  };

  handleGoBack = () => {
    const { dispatch } = this.props;
    dispatch(goBack());
  };

  render() {
    const { checkOpFailed } = this.context;
    const {
      orderprocessing: { dealInfo },
      fetching,
      newSaving,
    } = this.props;
    if (checkOpFailed()) {
      return fetching ? (
        <Spin spinning>
          <div>&nbsp;</div>
        </Spin>
      ) : null;
    }
    const { currentDeal } = this.state;

    const { deal } = dealInfo || {};

    const data = currentDeal || deal || {};

    return (
      <>
        <FetchUser deal={data} onChange={this.handleUserChange} />
        <FooterToolbar>
          <MarginBar left top inline>
            <Button disabled={newSaving || fetching} onClick={this.handleGoBack}>
              返回
            </Button>
          </MarginBar>
          <MarginBar left top inline>
            <Button type="primary" disabled={fetching || !data.pubAccountId} onClick={this.handleNextStep}>
              下一步
            </Button>
          </MarginBar>
        </FooterToolbar>
      </>
    );
  }
}

export default TicketSellingUser;
