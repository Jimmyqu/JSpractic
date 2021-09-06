import { Component, createRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Spin, Card, Empty } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { isSameDay } from '@/utils/utils';
import Sales from './Sales';
import Message from './Message';
import Ranking from './Ranking';
import Analysis from './Analysis.js';
import SearchForm from './SearchForm';
import styles from './index.less';

@connect(({ loading }) => ({
  fetchOverViewLoading: loading.effects['dashboard/fetchView'],
}))
class Dashboard extends Component {
  static contextTypes = {
    isAuthorized: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.ref = createRef();
    this.ansyRef = createRef();
    const { isAuthorized } = context;
    const isSales =
      isAuthorized('totalSalesAmount') ||
      isAuthorized('portalSalesAmount') ||
      isAuthorized('cloudSalesAmount') ||
      isAuthorized('waitPay') ||
      isAuthorized('totalRefundAmount');
    const isMessage = isAuthorized('msgNotice') || isAuthorized('orderChart');
    const isRanking = isAuthorized('orderSalesRanking');
    const isAnalysis = isAuthorized('payModeAnalysis') || isAuthorized('memberAnalysis');
    const isSomeOneAvailable = isSales || isMessage || isRanking || isAnalysis;
    this.state = {
      mainData: {},
      isSales,
      isMessage,
      isRanking,
      isAnalysis,
      isSomeOneAvailable,
    };
  }

  componentDidMount() {
    const { isSomeOneAvailable } = this.state;
    if (isSomeOneAvailable) {
      this.fetchOverView();
    }
  }

  fetchOverView = () => {
    const { dispatch } = this.props;
    const { isAuthorized } = this.context;
    const { startValue, endValue, venue } = this.ref.current;
    const analysisStartDate = startValue.startOf('day').format('x');
    const analysisEndDate = endValue.endOf('day').format('x');
    const salesIds = venue[0] === 0 ? [] : venue;
    dispatch({
      type: 'dashboard/fetchView',
      payload: {
        analysisStartDate,
        analysisEndDate,
        salesIds,
      },
    }).then(data => {
      this.setState({
        mainData: {
          ...data,
          analysisStartDate,
          analysisEndDate,
          salesIds,
          isSameDay: isSameDay(startValue, endValue),
          isAuthorized,
        },
      });
    });
  };

  render() {
    const { mainData, isMessage, isSomeOneAvailable, isSales, isRanking, isAnalysis } = this.state;
    const { fetchOverViewLoading } = this.props;

    return (
      <PageHeaderLayout>
        {isSomeOneAvailable ? (
          <div className={styles.container}>
            <SearchForm ref={this.ref} handlerClick={this.fetchOverView} />
            <Spin spinning={fetchOverViewLoading}>
              {isSales && <Sales data={mainData} />}
              {isMessage && (
                <Message
                  messageList={mainData.commonMessageVOList || []}
                  chartList={mainData.currentDealSalesVOList || []}
                  salesIds={mainData.salesIds}
                />
              )}
              {isRanking && Object.keys(mainData).length > 0 && <Ranking data={mainData} />}
              {isAnalysis && Object.keys(mainData).length > 0 && <Analysis data={mainData} ref={this.ansyRef} />}
            </Spin>
          </div>
        ) : (
          <Card bordered={false} loading={fetchOverViewLoading} className={styles.empty}>
            <Empty />
          </Card>
        )}
      </PageHeaderLayout>
    );
  }
}

export default Dashboard;
