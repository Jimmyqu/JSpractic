import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push, goBack } from 'connected-react-router';
import { Card, Row, Col, Button } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import FooterToolbar from '@/components/FooterToolbar';
import MarginBar from '@/components/MarginBar';
import NewsIframe from '@/components/Iframe/NewsIframe';
import { formatModel } from '@/utils/format';

@connect(({ pubticket, ticketselling, loading }) => ({
  pubticket,
  ticketselling,
  fetching: loading.effects['pubticket/fetchTicket'],
}))
class TicketSellInfo extends Component {
  static contextTypes = {
    getNextStepPath: PropTypes.func,
    selectPubStudy: PropTypes.bool,
  };

  state = {
    data: undefined,
  };

  async componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const result = await dispatch({
      type: 'pubticket/fetchTicket',
      payload: params.id,
    });
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      data: result || {},
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleNextStep = () => {
    const { dispatch } = this.props;
    const { data } = this.state;
    const { relType, ticketId, selectPubStudy, validPubStudy, validFace } = data || {};
    const { getNextStepPath } = this.context;
    dispatch({
      type: 'ticketselling/ticketsellingNextStep',
      payload: [
        {
          selectPubStudy,
          validPubStudy,
          validFace,
          relType,
          dataId: ticketId,
        },
      ],
    }).then(() => {
      dispatch(push(getNextStepPath()));
    });
  };

  handleGoBack = () => {
    const { dispatch } = this.props;
    dispatch(goBack());
  };

  render() {
    const {
      fetching,
      pubticket: { ViewStatus },
    } = this.props;
    const { data } = this.state;
    const { ticketName, detailList, viewStatus, fileItemVO } = data || {};
    const soldOut = viewStatus === ViewStatus.SoldOut.key;

    const htmlContent = detailList || [];
    return (
      <PageHeaderLayout title="票务销售">
        <Card bordered={false} loading={fetching} headStyle={{ textAlign: 'center' }} title={ticketName}>
          <Row>
            <Col span={24} className="text-center">
              <img
                className="img-max"
                src={
                  fileItemVO == null || fileItemVO.url === null
                    ? '//image.ydmap.cn/default_file/default_load_img.png'
                    : `${fileItemVO.url}`
                }
                alt="backgroud img"
              />
            </Col>
          </Row>
        </Card>

        {htmlContent.map(({ newsId, title }, i) => (
          <Card
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            loading={fetching}
            headStyle={{ textAlign: 'center' }}
            title={title}
          >
            <Row>
              <Col sm={24} md={4} />
              <Col sm={24} md={16}>
                <NewsIframe title={title} newsId={newsId} />
              </Col>
              <Col sm={24} md={4} />
            </Row>
          </Card>
        ))}

        <FooterToolbar>
          <MarginBar left top inline>
            <Button onClick={this.handleGoBack}>返回</Button>
          </MarginBar>
          {data && (
            <MarginBar left top inline>
              {!soldOut ? (
                <Button type="primary" loading={fetching} onClick={this.handleNextStep}>
                  售票
                </Button>
              ) : (
                <Button disabled>{formatModel(ViewStatus, viewStatus)}</Button>
              )}
            </MarginBar>
          )}
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}

export default TicketSellInfo;
