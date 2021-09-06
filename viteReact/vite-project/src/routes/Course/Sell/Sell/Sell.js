import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push, goBack } from 'connected-react-router';
import { Card, Button, Form } from 'antd';
import VerticalPairColumnTable from '@/components/VerticalPairColumnTable';
import FooterToolbar from '@/components/FooterToolbar';
import AmountInputWapper from '@/components/Amount/InputWapper';
import AmountColor from '@/components/Amount/Color';
import CountInput from '@/components/CountInput';
import MarginBar from '@/components/MarginBar';
import { formatMoney, formatDay, formatMD, formatHM, formatModel } from '@/utils/format';
import { mul } from '@/commons/lib/math';

const { PairColumn } = VerticalPairColumnTable;

@connect(({ pubcourse, orderprocessing, courseselling, venue, loading }) => ({
  pubcourse,
  venue,
  orderprocessing,
  courseselling,
  fetching: loading.effects['pubcourse/fetchCourseInfo'],
}))
@Form.create()
class CourseSellingSell extends Component {
  static contextTypes = {
    checkOpFailed: PropTypes.func,
    checkOpFailedAndGoBack: PropTypes.func,
    getNextStepPath: PropTypes.func,
    selectPubStudy: PropTypes.bool,
  };

  state = {
    data: undefined,
  };

  async componentDidMount() {
    const { checkOpFailedAndGoBack } = this.context;
    if (checkOpFailedAndGoBack()) {
      return;
    }
    const {
      dispatch,
      match: { params },
    } = this.props;
    const result = await dispatch({
      type: 'pubcourse/fetchCourseInfo',
      payload: params.id,
    });
    if (this.isUnmounted) {
      return;
    }
    if (result) {
      this.setState({
        data: result,
      });
    }
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
      form,
      dispatch,
      match: { params },
    } = this.props;
    const { getNextStepPath } = this.context;
    const { data } = this.state;
    const { price, id } = data || {};

    dispatch({
      type: 'courseselling/sellNextStep',
      payload: {
        courseId: params.id,
        bookingNum: form.getFieldValue('num') || 0,
        transactionUnitPrice: price || 0,
        dealCourseDataList: [{ courseDataId: id }],
      },
    }).then(() => {
      dispatch(push(getNextStepPath()));
    });
  };

  render() {
    const { checkOpFailed } = this.context;
    if (checkOpFailed()) {
      return null;
    }
    const {
      fetching,
      form,
      pubcourse: { CourseTypes },
      venue: { ProfessionTypes },
      orderprocessing: { dealInfo },
    } = this.props;
    const { data } = this.state;
    const {
      courseName,
      courseType,
      professionalId,
      price,
      courseDataTotal,
      singleBookingPeopleNum,
      bookingSurplusNum,
      classDate,
      classStartTime,
      classEndTime,
      salesName,
      // id,
      teachers,
    } = data || {};

    const { dealCourseList } = dealInfo || {};
    const course = (dealCourseList || [])[0];

    const max = Math.min(singleBookingPeopleNum || 0, bookingSurplusNum || 0);

    const min = Math.min(max, 1);

    const num = form.getFieldValue('num') || 0;

    const totalPrice = mul(num, price || 0) || 0;

    const isFiexdCourse = courseType === CourseTypes.FiexdCourse.key;
    return (
      <>
        <Form>
          <Card title="课程信息" loading={fetching}>
            <VerticalPairColumnTable>
              <PairColumn label="课程名称">{courseName}</PairColumn>
              <PairColumn label="课程类型">{formatModel(CourseTypes, courseType)}</PairColumn>
              <PairColumn label="所属类别">{formatModel(ProfessionTypes, professionalId)}</PairColumn>
              {isFiexdCourse && <PairColumn label="门店">{salesName}</PairColumn>}
              <PairColumn label="教职人员">{teachers}</PairColumn>
              {isFiexdCourse ? (
                <PairColumn label="时间">
                  {formatDay(classDate)} {formatMD(classDate)} {formatHM(classStartTime)}-{formatHM(classEndTime)}
                </PairColumn>
              ) : (
                <PairColumn label="已选课时(次)">{courseDataTotal}</PairColumn>
              )}
              <PairColumn label="价格">
                <AmountColor>{formatMoney(price)}</AmountColor>
              </PairColumn>
              <PairColumn label="剩余名额">{bookingSurplusNum}</PairColumn>
            </VerticalPairColumnTable>
          </Card>
          <Card title="选择人数" loading={fetching}>
            <VerticalPairColumnTable>
              <PairColumn label="限报名额">{singleBookingPeopleNum}</PairColumn>
              <PairColumn label="报名名额">
                <AmountInputWapper>
                  {form.getFieldDecorator('num', {
                    initialValue: course && course.bookingNum <= max ? course.bookingNum : min,
                  })(<CountInput min={min} max={max} disabled={max <= 0} />)}
                </AmountInputWapper>
              </PairColumn>
              <PairColumn label="合计">
                <AmountColor inputSize>{formatMoney(totalPrice)}</AmountColor>
              </PairColumn>
            </VerticalPairColumnTable>
          </Card>
        </Form>
        <FooterToolbar>
          <MarginBar left top inline>
            <Button disabled={fetching} onClick={this.handleGoBack}>
              返回
            </Button>
          </MarginBar>
          {data && (
            <MarginBar left top inline>
              <Button type="primary" disabled={fetching} onClick={this.handleNextStep}>
                下一步
              </Button>
            </MarginBar>
          )}
        </FooterToolbar>
      </>
    );
  }
}

export default CourseSellingSell;
