import { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { push, goBack } from 'connected-react-router';
import { Card, Row, Col, Button, Collapse } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import MarginBar from '@/components/MarginBar';
import { createMarkup } from '@/utils/utils';
import { formatMoney, formatDate, formatHM, formatDay } from '@/utils/format';
import styles from './index.less';

@connect(({ pubcourse, loading }) => ({
  pubcourse,
  fetching: loading.effects['pubcourse/fetchCourse'],
}))
class CoursePick extends Component {
  static contextTypes = {
    getNextStepPath: PropTypes.func,
    selectPubStudy: PropTypes.bool,
  };

  state = {
    data: undefined,
    infoResult: undefined,
  };

  async componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const [result, infoResult] = await Promise.all([
      dispatch({
        type: 'pubcourse/fetchCourse',
        payload: params.id,
      }),
      dispatch({
        type: 'pubcourse/getCourseClassInfo',
        payload: params.id,
      }),
    ]);
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      data: result || {},
      infoResult,
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleGoBack = () => {
    const { dispatch } = this.props;
    dispatch(goBack());
  };

  handleNextStep = () => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { getNextStepPath } = this.context;
    const { data } = this.state;
    const { validFace } = data || {};
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
    }).then(() => {
      dispatch(push(getNextStepPath()));
    });
  };

  render() {
    const {
      match: { params },
      fetching,
      pubcourse: { CourseStatus, CourseTypes },
    } = this.props;
    const { data, infoResult } = this.state;
    const { courseName, images, courseDetail, courseDataTotal, price, classSchedules, courseType } = data || {};

    const isFiexdCourse = courseType === CourseTypes.FiexdCourse.key;

    const canSignup = (infoResult || {}).singleBookingSurplusNum > 0;

    const currentId = +params.id;
    return (
      <>
        <Card bordered={false} loading={fetching} headStyle={{ textAlign: 'center' }} title={courseName || '课程'}>
          {images && images.url && (
            <Row>
              <Col sm={24} md={6} />
              <Col sm={24} md={12} className="text-center">
                <img className="img-max" src={images.url} alt="backgroud img" />
              </Col>
              <Col sm={24} md={6} />
            </Row>
          )}
        </Card>

        <Card bordered={false} loading={fetching}>
          <Row>
            <Col sm={24} md={6} />
            <Col sm={24} md={12}>
              <Collapse bordered={false} defaultActiveKey={['3']}>
                <Collapse.Panel header="课程介绍" key="1">
                  {/* 课程的富文本不是来自newsid资讯配置 */}
                  {/* eslint-disable-next-line react/no-danger */}
                  <div dangerouslySetInnerHTML={createMarkup(courseDetail)} />
                </Collapse.Panel>
                <Collapse.Panel header="课时收费" key="2">
                  {isFiexdCourse ? (
                    <>每节课时</>
                  ) : (
                    <span>
                      共<span className={styles.price}>{courseDataTotal}</span>节课时
                    </span>
                  )}
                  <span className={styles.price}>￥{formatMoney(price)}</span>
                </Collapse.Panel>
                <Collapse.Panel header="课程安排" key="3">
                  <ul>
                    {(classSchedules || []).map(item => (
                      <li
                        key={item.classEndTime}
                        className={classNames({
                          'primary-color': item.courseDataId === currentId,
                        })}
                      >
                        {formatDate(item.classStartTime)} {formatDay(item.classStartTime)}
                        {formatHM(item.classStartTime)} 至 {formatHM(item.classEndTime)}
                      </li>
                    ))}
                  </ul>
                </Collapse.Panel>
              </Collapse>
            </Col>
            <Col sm={24} md={6} />
          </Row>
        </Card>

        <FooterToolbar>
          <MarginBar left top inline>
            <Button onClick={this.handleGoBack}>返回</Button>
          </MarginBar>
          {data && (
            <MarginBar left top inline>
              {canSignup ? (
                <Button type="primary" disabled={fetching} onClick={this.handleNextStep}>
                  售课
                </Button>
              ) : (
                <Button disabled>{CourseStatus.BookFull.value}</Button>
              )}
            </MarginBar>
          )}
        </FooterToolbar>
      </>
    );
  }
}

export default CoursePick;
