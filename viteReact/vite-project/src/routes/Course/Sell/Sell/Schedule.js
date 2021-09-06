import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { stringify } from 'qs';
import omit from 'omit.js';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { push, replace } from 'connected-react-router';
import { Button, Card, Tag, Alert, Icon, Select, Spin } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import FooterToolbar from '@/components/FooterToolbar';
import MarginBar from '@/components/MarginBar';
import CarouselDateSwitcher from '@/components/CarouselDateSwitcher';
import AuthComponent from '@/components/AuthComponent';
import PlatformCourseDetailModal from '@/components/Modal/PlatformCourseDetailModal';
import DealCancelModal from '@/components/Modal/DealCancelModal';
import { getPageQuery } from '@/utils/utils';
import { formatHM } from '@/utils/format';
import EditSalesQuotaModal from './EditSalesQuotaModal';
import EditScheduleModal from './EditScheduleModal';
import TeachersAdjustModal from './TeachersAdjustModal';
import PlatformsAdjustModal from './PlatformsAdjustModal';

import styles from './index.less';

const { CheckableTag } = Tag;

const { FeatureAction } = PlatformCourseDetailModal;

let timeout;

function Schedule({ match: { params } }, { getNextStepPath, isAuthorized }) {
  const dispatch = useDispatch();
  const { CourseTypes, CourseStatus } = useSelector(state => state.pubcourse);
  const fetching = useSelector(state => state.loading.effects['pubcourse/fetchCourse']);
  const scheduleFetching = useSelector(state => state.loading.effects['pubcourse/fetchCourseSchedule']);
  const courseListByNameFetching = useSelector(state => state.loading.effects['pubcourse/fetchFixedCourseByName']);

  const [nowId, setNowId] = useState(+params.id);
  const [courseData, setCourseData] = useState();
  const [carouselDate, setCarouselDate] = useState();
  const [courseAboutInfo, setCourseAboutInfo] = useState();
  const [scheduleList, setscheduleList] = useState([]);
  const [checkedItem, setCheckedItem] = useState();
  const [fixedCourseSearchList, setFixedCourseSearchList] = useState([]);

  const [editSalesQuotaVisible, setEditSalesQuotaVisible] = useState(false);
  const [editScheduleVisible, setEditScheduleVisible] = useState(false);
  const [teachersAdjustVisible, setTeachersAdjustVisible] = useState(false);
  const [platformsAdjustVisible, setPlatformsAdjustVisible] = useState(false);
  const [platformCourseDetailVisible, setPlatformCourseDetailVisible] = useState(false);
  const [cancelDealId, setCancelDealId] = useState();
  const [flag, setFlag] = useState(Date.now());

  const [actionHasEffect, setActionHasEffect] = useState();

  const authViewStudy = isAuthorized('view-study');
  const authAdjustTeacher = isAuthorized('adjust-teacher');
  const authAdjustPlatform = isAuthorized('adjust-platform');
  const authEditQuota = isAuthorized('edit-quota');
  const authEditSchedule = isAuthorized('edit-schedule');

  const query = getPageQuery();
  const nextPath = getNextStepPath();

  const loadSchedule = useCallback(async () => {
    const result = await dispatch({
      type: 'pubcourse/fetchCourseSchedule',
      payload: {
        courseDataId: nowId,
        dateTime: carouselDate,
      },
    });
    const list = result || [];
    setscheduleList(list);
    setCheckedItem(list.find(item => item.courseDataId === nowId) || list[0]);
  }, [nowId, carouselDate]);

  const loadCourseClassInfo = useCallback(async () => {
    if (checkedItem == null) {
      setCourseAboutInfo();
      return;
    }
    const infoResult = await dispatch({
      type: 'pubcourse/getCourseClassInfo',
      payload: checkedItem.courseDataId,
    });
    setCourseAboutInfo(infoResult);
  }, [checkedItem]);

  useEffect(() => {
    if (!carouselDate) {
      return;
    }
    (async () => {
      loadSchedule();
      const result = await dispatch({
        type: 'pubcourse/fetchCourse',
        payload: nowId,
      });
      const { courseType } = result || {};
      if (courseType === CourseTypes.FiexdCourse.key) {
        setCourseData(result);
        return;
      }
      setTimeout(() => {
        dispatch(
          replace({
            pathname: './pick',
            search: stringify(omit(query, ['date', 'action'])),
          })
        );
      }, 0);
    })();
  }, [nowId, carouselDate]);

  useEffect(() => {
    loadCourseClassInfo();
  }, [checkedItem]);

  useEffect(() => {
    if (actionHasEffect) {
      return;
    }
    const { date, action } = query;
    if (!date || !checkedItem) {
      return;
    }
    setActionHasEffect(true);
    switch (action) {
      case FeatureAction.Teacher:
        if (authAdjustTeacher) {
          setTeachersAdjustVisible(true);
        }
        break;
      case FeatureAction.Platform:
        if (authAdjustPlatform) {
          setPlatformsAdjustVisible(true);
        }
        break;
      case FeatureAction.Quota:
        if (authEditQuota) {
          setEditSalesQuotaVisible(true);
        }
        break;
      case FeatureAction.Schedule:
        if (authEditSchedule) {
          setEditScheduleVisible(true);
        }
        break;
      default:
        break;
    }
  }, [checkedItem]);

  const { courseName } = courseData || {};
  const { singleBookingSurplusNum } = courseAboutInfo || {};
  const empty = scheduleList == null || scheduleList.length === 0;
  const canSignup = singleBookingSurplusNum > 0;

  return (
    <PageHeaderLayout title="排期时间">
      <Card
        bordered={false}
        bodyStyle={{
          paddingBottom: 0,
        }}
      >
        课程名称&nbsp;&nbsp;
        <Select
          className={styles.selectSearch}
          placeholder="输入关键字搜索"
          showSearch
          onSearch={value => {
            if (timeout) {
              clearTimeout(timeout);
              timeout = null;
            }

            if (value == null || value.trim().length === 0) {
              return;
            }

            timeout = setTimeout(async () => {
              const result = await dispatch({
                type: 'pubcourse/fetchFixedCourseByName',
                payload: value,
              });
              setFixedCourseSearchList(result);
            }, 500);
          }}
          onChange={id => {
            // 路由相同 不会导致页面重新渲染
            dispatch(
              replace({
                pathname: `../${id}/schedule`,
                search: stringify(query),
              })
            );
            setNowId(id);
          }}
          value={nowId}
          defaultActiveFirstOption={false}
          filterOption={false}
          loading={courseListByNameFetching}
          notFoundContent={fetching ? <Spin /> : undefined}
        >
          {courseData && (
            // 当前这个直接显示
            <Select.Option key={nowId} value={nowId}>
              {courseName}
            </Select.Option>
          )}
          {(fixedCourseSearchList || []).map(item =>
            // 排除当前这个
            !item.courseDataId || item.courseDataId === nowId ? null : (
              <Select.Option key={item.courseDataId || item.courseName} value={item.courseDataId}>
                {item.courseName}
              </Select.Option>
            )
          )}
        </Select>
        {checkedItem && (
          <MarginBar left inline>
            已选 {formatHM(checkedItem.classStartTime)}-{formatHM(checkedItem.classEndTime)}
          </MarginBar>
        )}
        <CarouselDateSwitcher onChange={date => setCarouselDate(date)} date={+query.date} />
      </Card>
      <Card bordered={false} loading={fetching || scheduleFetching} className={styles.scheduleTagWrapper}>
        {empty ? (
          <Alert
            className="text-center"
            message={
              <>
                <Icon type="info-circle" className="primary-color" />
                &nbsp; 该日期暂无场排期！
              </>
            }
            type="info"
          />
        ) : (
          //
          scheduleList.map(scheduleItem => {
            const { courseDataId, classStartTime, classEndTime, teacherList, platformList } = scheduleItem;
            return (
              <MarginBar top inline key={courseDataId}>
                <CheckableTag
                  className={styles.scheduleTag}
                  checked={scheduleItem === checkedItem}
                  onChange={checked => checked && setCheckedItem(scheduleItem)}
                >
                  {formatHM(classStartTime)}-{formatHM(classEndTime)}
                  {teacherList?.length > 0 ? '-' : ''}
                  {teacherList?.map(teacher => teacher.realName).join(', ')}
                  {platformList?.length > 0 ? '-' : ''}
                  {platformList
                    ?.map(
                      platform =>
                        `${platform.parentPlatformName || ''}${platform.parentPlatformName ? ':' : ''}${
                          platform.platformName
                        }`
                    )
                    .join(', ')}
                </CheckableTag>
              </MarginBar>
            );
          })
        )}
      </Card>
      <FooterToolbar>
        {checkedItem && (
          <>
            <MarginBar top right={20} inline>
              <Button type="primary">
                <Link to={`/basic/pub/pubservicesold?objectName=${courseName}`}>查看课程班级</Link>
              </Button>
            </MarginBar>
            <AuthComponent auth={authViewStudy}>
              <MarginBar left top inline>
                <Button type="primary" onClick={() => setPlatformCourseDetailVisible(true)}>
                  查看学员
                </Button>
              </MarginBar>
            </AuthComponent>
            <AuthComponent auth={authAdjustTeacher}>
              <MarginBar left top inline>
                <Button type="primary" onClick={() => setTeachersAdjustVisible(true)}>
                  教职人员
                </Button>
              </MarginBar>
            </AuthComponent>
            <AuthComponent auth={authAdjustPlatform}>
              <MarginBar left top inline>
                <Button type="primary" onClick={() => setPlatformsAdjustVisible(true)}>
                  调整场地
                </Button>
              </MarginBar>
            </AuthComponent>
            <AuthComponent auth={authEditQuota}>
              <MarginBar left top inline>
                <Button type="primary" onClick={() => setEditSalesQuotaVisible(true)}>
                  调整名额
                </Button>
              </MarginBar>
            </AuthComponent>
          </>
        )}
        <AuthComponent auth={authEditSchedule}>
          <MarginBar left top inline>
            <Button type="primary" onClick={() => setEditScheduleVisible(true)}>
              调整排期
            </Button>
          </MarginBar>
        </AuthComponent>
        <MarginBar left top inline>
          <Button
            onClick={() => {
              const { courseDataId } = checkedItem;
              dispatch(
                push({
                  pathname: '../../attendance',
                  search: stringify({
                    courseDataId,
                  }),
                })
              );
            }}
          >
            学员考勤
          </Button>
        </MarginBar>
        <MarginBar left top inline>
          <Button
            onClick={() => {
              const { courseId, courseDataId } = checkedItem;
              dispatch(
                push({
                  pathname: '../../list',
                  search: stringify({
                    courseId,
                    courseDataId,
                  }),
                })
              );
            }}
          >
            课程信息
          </Button>
        </MarginBar>
        <MarginBar left top inline>
          <Button disabled={fetching || scheduleFetching} onClick={() => dispatch(push('../list'))}>
            返回课程列表
          </Button>
        </MarginBar>
        {!empty && (
          <MarginBar left top inline>
            <Button
              type="primary"
              disabled={fetching || scheduleFetching || !checkedItem || !canSignup}
              onClick={() => {
                const { neworder } = query;
                if (neworder) {
                  dispatch(
                    push({
                      pathname: `../${checkedItem.courseDataId}/user`,
                      search: stringify(query),
                    })
                  );
                  return;
                }
                dispatch(push(`../${checkedItem.courseDataId}/${nextPath}`));
              }}
            >
              {canSignup ? '下一步' : CourseStatus.BookFull.value}
            </Button>
          </MarginBar>
        )}
      </FooterToolbar>
      <PlatformCourseDetailModal
        title="查看学员"
        inSchedule
        courseDataId={checkedItem?.courseDataId}
        visible={platformCourseDetailVisible}
        onVisibleChange={setPlatformCourseDetailVisible}
        onDealCancel={setCancelDealId}
        flag={flag}
      />
      <EditSalesQuotaModal
        visible={editSalesQuotaVisible}
        onVisibleChange={setEditSalesQuotaVisible}
        date={carouselDate}
        referData={{
          ...checkedItem,
          ...courseAboutInfo,
        }}
        onOk={loadCourseClassInfo}
      />
      <EditScheduleModal
        visible={editScheduleVisible}
        onVisibleChange={setEditScheduleVisible}
        date={carouselDate}
        referData={checkedItem}
        courseDataId={nowId}
        onOk={() => {
          loadSchedule();
        }}
      />
      <TeachersAdjustModal
        courseDataId={nowId}
        referData={checkedItem}
        visible={teachersAdjustVisible}
        onVisibleChange={setTeachersAdjustVisible}
        onOk={() => {
          loadSchedule();
        }}
      />
      <PlatformsAdjustModal
        courseDataId={nowId}
        referData={checkedItem}
        visible={platformsAdjustVisible}
        onVisibleChange={setPlatformsAdjustVisible}
        onOk={() => {
          loadSchedule();
        }}
      />
      <DealCancelModal
        dealId={cancelDealId}
        visible={!!cancelDealId}
        onVisibleChange={visible => {
          if (visible) {
            return;
          }
          setCancelDealId(null);
        }}
        onOk={() => {
          setCancelDealId(null);
          setFlag(Date.now());
        }}
      />
    </PageHeaderLayout>
  );
}

Schedule.contextTypes = {
  getNextStepPath: PropTypes.func,
  isAuthorized: PropTypes.func,
};

export default Schedule;
