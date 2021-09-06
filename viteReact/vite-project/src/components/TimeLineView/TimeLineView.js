import { useState, useEffect, useCallback, createRef } from 'react';
import { Button, Icon, Row, Col, Card } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import IconFont from '@/components/Icon';
import CarouselDateSwitcher from '@/components/CarouselDateSwitcher';
import { screenfullIsEnabled, screenfullRequest } from '@/commons/lib/media';
import SearchForm from './SearchForm';
import TimeLineTable from './TimeLineTable';

import styles from './index.less';

function DateView(props) {
  const dispatch = useDispatch();
  const [currentDate, setCurrentDate] = useState();
  const [showFullscreenBtn, setShowFullscreenBtn] = useState(false);
  const [isModifyData, setIsModifyData] = useState(false);

  const [screen, setCurrentScreen] = useState(createRef());
  const [searchCondition, setSearchCondition] = useState(null);
  const [salesOpenTime, setSalesOpenTime] = useState([]);
  const isCourseLoading = useSelector(state => state.loading.effects['pubcourse/fetchCourseDateList']);
  const [timeLineData, setTimeLineData] = useState([]);
  const {
    switchStyle,
    dateSearch: { fields },
    isMobile,
  } = props;

  useEffect(() => {
    setCurrentScreen(screen);
    setShowFullscreenBtn(screenfullIsEnabled() && screen != null);
  }, []);

  const initCourseList = useCallback(async () => {
    const salesTimes = await dispatch({
      type: 'venue/fetchCourseSalesOpenTime',
      payload: {
        salesId: searchCondition.salesId,
      },
    });
    const courseList = await dispatch({
      type: 'pubcourse/fetchCourseDateList',
      payload: {
        ...searchCondition,
        classDate: currentDate,
        page: 1,
        rows: 999,
      },
    });
    setSalesOpenTime([salesTimes.startTime, salesTimes.endTime]);
    setTimeLineData(courseList);
  }, [searchCondition, currentDate]);

  useEffect(() => {
    if (!isModifyData) {
      return;
    }
    initCourseList(); // 修改了弹窗数据
    setIsModifyData(false);
  }, [isModifyData]);

  useEffect(() => {
    if (!currentDate || !searchCondition) {
      return;
    }
    initCourseList();
  }, [searchCondition, currentDate]);

  return (
    <>
      <Row>
        <Col xs={24} sm={24} lg={24} xl={18}>
          <SearchForm fields={fields} disabled={isCourseLoading} setSearchCondition={setSearchCondition} />
        </Col>
        <Col xs={24} sm={24} lg={24} xl={6}>
          <div className={styles.btnContainer}>
            <Button.Group>
              <Button type="primary">
                <Icon type="ordered-list" />
                日历
              </Button>
              <Button onClick={() => switchStyle(true)}>
                <Icon type="appstore" />
                卡片
              </Button>
            </Button.Group>
            {showFullscreenBtn && (
              <Button
                className={styles.fullscreen}
                title="表格全屏化"
                onClick={() => screenfullRequest(screen.current)}
              >
                <IconFont type="fullscreen-2" />
              </Button>
            )}
          </div>
        </Col>
      </Row>
      <CarouselDateSwitcher date={currentDate} onChange={val => setCurrentDate(val)} />
      <Card bordered={false} className={styles.noPadding} loading={isCourseLoading}>
        <TimeLineTable
          setIsModifyData={setIsModifyData}
          date={currentDate}
          data={timeLineData}
          openTime={salesOpenTime}
          isMobile={isMobile}
          ref={screen}
        />
      </Card>
    </>
  );
}

export default DateView;
