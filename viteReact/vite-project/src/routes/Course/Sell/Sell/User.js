import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push, goBack } from 'connected-react-router';
import { Button } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import MarginBar from '@/components/MarginBar';
import FetchUser from '@/components/FetchUser';
import { getPageQuery } from '@/utils/utils';

@connect(({ orderprocessing, courseselling, loading }) => ({
  orderprocessing,
  courseselling,
  fetching: loading.effects['pubcourse/fetchCourse'],
  newSaving: loading.effects['pubuser/createUser'],
}))
class CourseSellingUser extends Component {
  static contextTypes = {
    checkOpFailed: PropTypes.func,
    checkOpFailedAndGoBack: PropTypes.func,
    getNextStepPath: PropTypes.func,
    selectPubStudy: PropTypes.bool,
  };

  state = {
    currentDeal: undefined,
  };

  async componentDidMount() {
    const { neworder, id } = getPageQuery();
    const {
      dispatch,
      match: { params },
      orderprocessing: { dealInfo },
    } = this.props;
    if (neworder) {
      const result = await dispatch({
        type: 'pubcourse/fetchCourse',
        payload: params.id,
      });
      const { validFace } = result || {};
      dispatch({
        type: 'courseselling/pickNextStep',
        payload: {
          dealCourseList: [
            {
              // 课程强制 selectPubStudy、validPubStudy 为 true
              // 必须选人，不用判断 selectPubStudy
              selectPubStudy: true,
              validPubStudy: true,
              validFace,
              courseId: params.id,
              // bookingNum
              // transactionUnitPrice
              // dealCourseDataList: [
              //   {
              //     // courseDataId: 1,
              //   },
              // ],
              // dealCourseStudyList: [
              //   {
              //     // pubStudyId: 1,
              //   },
              // ],
            },
          ],
        },
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
      type: 'courseselling/userNextStep',
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
    if (checkOpFailed()) {
      return null;
    }
    const {
      orderprocessing: { dealInfo },
      fetching,
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
            <Button disabled={fetching || newSaving} onClick={this.handleGoBack}>
              返回
            </Button>
          </MarginBar>
          <MarginBar left top inline>
            <Button type="primary" disabled={fetching || newSaving || !data.pubAccountId} onClick={this.handleNextStep}>
              下一步
            </Button>
          </MarginBar>
        </FooterToolbar>
      </>
    );
  }
}

export default CourseSellingUser;
