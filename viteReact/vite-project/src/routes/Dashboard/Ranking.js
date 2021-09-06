import { useState, useEffect } from 'react';
import { Row, Col, Card, Icon, Tooltip } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import IntervalChart from '@/components/Charts/IntervalChart';
import styles from './index.less';

function Ranking({ data }) {
  const { subDealSalesVOList = [], analysisStartDate, analysisEndDate, salesIds } = data;
  const [rankChart, setRankChart] = useState([]);
  const [ranking, setRanking] = useState([]);
  const dispatch = useDispatch();
  const { RelTypes } = useSelector(state => state.global);
  const { DealStatus: pubplatform } = useSelector(state => state.pubplatform);
  const { DealStatus: pubcourse } = useSelector(state => state.pubcourse);
  const { DealStatus: pubservice } = useSelector(state => state.pubservice);
  const { DealStatus: pubaccount } = useSelector(state => state.pubaccount);
  const { DealStatus: pubsignup } = useSelector(state => state.pubsignup);
  const { DealStatus: pubscan } = useSelector(state => state.pubscan);
  const { DealStatus: pubcredit } = useSelector(state => state.pubcredit);

  const goToDetail = item => {
    let dealState = '';
    let pathname;
    if (item.salesNum > 0) {
      switch (item.relType) {
        case RelTypes.DEAL_SPORT_PLATFORM_TICKET.key:
          pathname = 'spticket';
          break;
        case RelTypes.DEAL_PLATFORM.key:
          pathname = 'platform';
          break;
        case RelTypes.DEALITEM.key:
          pathname = 'item';
          dealState = pubplatform.DEAL_COMPLETE.key;
          break;
        case RelTypes.DEALSERVICEUSER.key:
          pathname = 'serviceuser';
          dealState = [pubservice.DEAL_PASS.key, pubservice.DEAL_COMPLETE.key].join(',');
          break;
        case RelTypes.DEAL_COURSE.key:
          pathname = 'course';
          dealState = pubcourse.COURSE_COMPLETE.key;
          break;
        case RelTypes.DEALPUBLICACCOUNT.key:
          pathname = 'account';
          dealState = pubaccount.DEAL_RECHARGE_COMPLETED.key;
          break;
        case RelTypes.DEAL_SIGNUP.key:
          pathname = 'signup';
          dealState = [pubsignup.CHECKING.key, pubsignup.CHECKED.key, pubsignup.COMPLETE.key].join(',');
          break;
        case RelTypes.DEALSCANCODE.key:
          pathname = 'scan';
          dealState = pubscan.DEAL_RECHARGE_COMPLETED.key;
          break;
        case RelTypes.DEALPUBLICCREDIT.key:
          pathname = 'credit';
          dealState = pubcredit.DEAL_COMPLETE.key;
          break;
        case RelTypes.DEAL_SERVICEPUB.key:
          pathname = 'pubservice';
          dealState = pubservice.DEAL_COMPLETE.key;
          break;
        default:
          return '';
      }
      dispatch(
        push({
          pathname: `/basic/deal/${pathname}`,
          search: `salesId=${salesIds}&updateStartTime=${analysisStartDate}&updateEndTime=${analysisEndDate}&dealState=${dealState}`,
        })
      );
    }
  };

  useEffect(() => {
    const rankChartData = subDealSalesVOList.map(({ relTypeValue, salesNum }) => ({
      x: relTypeValue,
      value: salesNum,
    }));
    const rankingData = subDealSalesVOList.sort((a, b) => {
      const x = 'salesNum';
      return b[x] - a[x];
    });
    setRankChart(rankChartData);
    setRanking(rankingData);
  }, [data]);

  return (
    <Card
      bordered={false}
      title={
        <span>
          订单销售情况及排行
          <Tooltip placement="right" title="订单销售情况及排行：每个业务类型所销售的订单数占比分析">
            <Icon type="question" className={styles.question} />
          </Tooltip>
        </span>
      }
      className={styles.pubPadding}
    >
      <Row gutter={[15, 20]} className={styles.rankingContainer}>
        <Col xs={24} xl={18} className={styles.chartwarpper}>
          <h4>销售情况</h4>
          <div className={styles.chart}>
            <IntervalChart
              height={450}
              minWidth="700px"
              padding={[25, 45, 50, 50]}
              label={{ offset: 20 }}
              size={25}
              data={rankChart}
              title="销售情况"
              fullClassName={styles.rankingFull}
            />
          </div>
        </Col>
        <Col xs={24} xl={6}>
          <h4>销售排名</h4>
          <div className={styles.rankingList}>
            <Row className={styles.title}>
              <Col span={6}>排序</Col>
              <Col span={10}>订单类型</Col>
              <Col span={8}>订单数</Col>
            </Row>
            {ranking.map((item, index) => (
              <Row className={styles.list} key={item.relType}>
                <Col span={6}>
                  <span className={index > 2 ? styles.bottom : styles.top}>{index + 1}</span>
                </Col>
                <Col span={10}>{item.relTypeValue}</Col>
                <Col span={8} onClick={() => goToDetail(item)} className={styles.salesNum}>
                  {item.salesNum}
                </Col>
              </Row>
            ))}
          </div>
        </Col>
      </Row>
    </Card>
  );
}

export default Ranking;
