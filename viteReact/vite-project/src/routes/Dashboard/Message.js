import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Card, Row, Col, Avatar, List, Icon, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { CDN_STATIC_HOST } from '@/utils/utils';
import TimelineChart from '@/components/Charts/TimelineChart';
import { formatDateTime } from '@/utils/format';
import styles from './index.less';

const iconSrc = `${CDN_STATIC_HOST}/images/cloud/dashboard/`;
const payType = new Set([3, 6, 9, 12, 15, 17, 20, 37, 42]);
const cancelType = new Set([2, 5, 8, 11, 14, 19, 36, 43, 22, 23, 24, 25, 26, 27, 38]);
const checkType = new Set([16]);

function Message({ messageList, chartList, salesIds }, context) {
  const { isAuthorized } = context;
  const [chartData, setChartData] = useState(chartList);
  const [messageData, setMessageData] = useState(messageList);
  const msgNotice = isAuthorized('msgNotice');
  const orderChart = isAuthorized('orderChart');

  const getMsgIconList = useCallback(type => {
    if (payType.has(type)) {
      return `${iconSrc}pay-order.png`;
    }
    if (checkType.has(type)) {
      return `${iconSrc}check-order.png`;
    }
    if (cancelType.has(type)) {
      return `${iconSrc}cancel-order.png`;
    }
    return `${iconSrc}create-order.png`;
  }, []);

  const chartArr = chartList.map(({ curDate, totalPayNum, totalRefundNum }) => ({
    x: curDate,
    y1: totalPayNum,
    y2: totalRefundNum,
  }));
  useEffect(() => {
    setChartData(chartArr);
  }, [chartList]);

  useEffect(() => {
    setMessageData(messageList);
  }, [messageList]);

  return (
    <div className={styles.msgContainer}>
      <Row gutter={[25, 20]}>
        {msgNotice && (
          <Col xs={24} xl={orderChart ? 8 : 24}>
            <Card
              bordered={false}
              className={styles.cardBox}
              title={
                <span>
                  消息通知
                  <Tooltip placement="right" title="消息通知：当前最新的系统操作通知，包含订单和其他操作">
                    <Icon type="question" className={styles.question} />
                  </Tooltip>
                </span>
              }
              extra={<Link to={`/basic/msgmanage/notice?salesIds=${salesIds}`}>查看更多</Link>}
            >
              <List
                className={styles.message}
                itemLayout="horizontal"
                dataSource={messageData}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={getMsgIconList(item.messageType)} />}
                      title={
                        <div className={styles.title}>
                          <b className={styles.titleName}>{item.title}</b>
                          <span>{formatDateTime(item.createTime)}</span>
                        </div>
                      }
                      description={
                        <div className="text-overflow-line1" title={item.content}>
                          {item.content}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        )}
        {orderChart && (
          <Col xs={24} xl={msgNotice ? 16 : 24}>
            <Card
              bordered={false}
              title={
                <span>
                  订单趋势图
                  <Tooltip
                    placement="right"
                    title="订单趋势图：是指当按天计算，每天的同时间内，产生的订单数和收支现金流水金额汇总。"
                  >
                    <Icon type="question" className={styles.question} />
                  </Tooltip>
                </span>
              }
              headStyle={{ height: '64px' }}
              className={classNames(styles.pubPadding, styles.cardBox)}
            >
              <TimelineChart
                type="area"
                color={['key', ['l(90) 0:#01b900 1:#d3ffd3', 'l(90) 0:#ff5c57 1:#ffdbda']]}
                textStyle={{
                  fontSize: '16',
                  fill: '#333',
                  padding: '0 5px',
                }}
                offsetX={-40}
                position="top-right"
                data={chartData}
                padding={[40, 30, 40, 60]}
                height={393}
                titleMap={{ y1: '支付', y2: '退款' }}
                yAxis="y1"
                isFullChart
                modalTitle="订单趋势图"
                fullClassName={styles.timeLineFull}
              />
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
}

Message.contextTypes = {
  isAuthorized: PropTypes.func,
};

export default Message;
