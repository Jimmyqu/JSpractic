import { useState, useEffect, useCallback, useRef, forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import { Popover } from 'antd';
import moment from 'moment';
import { formatHM } from '@/commons/lib/format';
import EditSalesQuotaModal from '@/routes/Course/Sell/Sell/EditSalesQuotaModal';
import EditScheduleModal from '@/routes/Course/Sell/Sell/EditScheduleModal';
import TeachersAdjustModal from '@/routes/Course/Sell/Sell/TeachersAdjustModal';
import PlatformsAdjustModal from '@/routes/Course/Sell/Sell/PlatformsAdjustModal';
import DealCancelModal from '@/components/Modal/DealCancelModal';
import PlatformCourseDetailModal from '@/components/Modal/PlatformCourseDetailModal';
import styles from './index.less';

const { FeatureAction } = PlatformCourseDetailModal;

function getMinute(start, end) {
  return moment.duration(moment(end).valueOf() - moment(start).valueOf()).as('minutes');
}

function createTimeList(start, end) {
  const totalHours = moment.duration(moment(end).valueOf() - moment(start).valueOf()).as('hour');
  const housList = [];
  if (totalHours === 0) {
    return [];
  }
  for (let i = 0; i <= Math.ceil(totalHours); i += 1) {
    housList.push(`${moment(start + 3_600_000 * i).format('kk')}:00`);
  }
  return housList;
}

function createTop(start, end) {
  const startTime = `${moment(end).format('YYYY-MM-DD')} ${start}`;
  const endTime = `${moment(end).format('YYYY-MM-DD HH:mm')}`;
  const totlTop = getMinute(startTime, endTime);
  return totlTop;
}

const TimeLineTable = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const mins = 5; // 5分钟一格
  const { data, openTime, date, setIsModifyData, isMobile } = props;
  const hour = Math.ceil(moment.duration(moment(openTime[1]).valueOf() - moment(openTime[0]).valueOf()).as('hour'));
  const timeList = createTimeList(openTime[0], openTime[1]);
  const [courseId, setCourseId] = useState(null); // 当前课程ID
  const [dealId, setDealId] = useState(null); // 点击取消ID
  const [checkedItem, setCheckedItem] = useState();
  const [openCourseInfo, setOpenCourseInfo] = useState(null); // 课程剩余人数信息
  const [flag, setFlag] = useState(Date.now()); // 刷新modal数据用
  const flagRef = useRef(flag); // 留个始终不变的对比修改

  const [platformCourseDetailVisible, setPlatformCourseDetailVisible] = useState(false);
  const [dcModalVisible, setDcModalVisible] = useState(false);
  const [editSalesQuotaVisible, setEditSalesQuotaVisible] = useState(false);
  const [editScheduleVisible, setEditScheduleVisible] = useState(false);
  const [teachersAdjustVisible, setTeachersAdjustVisible] = useState(false);
  const [platformsAdjustVisible, setPlatformsAdjustVisible] = useState(false);
  const [offsetH, setOffsetH] = useState(0);

  const loadSchedule = useCallback(async () => {
    const result = await dispatch({
      type: 'pubcourse/fetchCourseSchedule',
      payload: {
        courseDataId: courseId,
        dateTime: date,
      },
    });
    const list = result || [];
    setCheckedItem(list.find(item => item.courseDataId === courseId) || list[0]);
  }, [courseId, date]);

  const handleShowModal = useCallback(action => {
    switch (action) {
      case FeatureAction.Teacher:
        setTeachersAdjustVisible(true);
        break;
      case FeatureAction.Platform:
        setPlatformsAdjustVisible(true);
        break;
      case FeatureAction.Quota:
        setEditSalesQuotaVisible(true);
        break;
      case FeatureAction.Schedule:
        setEditScheduleVisible(true);
        break;
      default:
        return null;
    }
  }, []);

  useEffect(() => {
    if (ref.current && !isMobile) {
      setOffsetH(ref.current.getClientRects()[0].top);
    }
  }, []);

  useEffect(() => {
    if (courseId && date) {
      loadSchedule();
    }
  }, [courseId, date, teachersAdjustVisible]);

  return (
    <div ref={ref} className={styles.container} style={{ height: `calc(100vh - ${offsetH}px - 20px - 28px)` }}>
      <div className={styles.timelineHeader}>
        {data?.length ? (
          data.map(item => (
            <div className={styles.title} key={item.courseId}>
              {item.courseName}
            </div>
          ))
        ) : (
          <div className={styles.nullTitle}>暂无课程</div>
        )}
      </div>
      {timeList?.length ? (
        <div className={styles.timelineContent}>
          <div className={styles.timeSlot}>
            {timeList.map(item => (
              <div className={styles.time} key={item}>
                {item}
              </div>
            ))}
          </div>
          <div className={styles.timeWrapper} style={{ height: hour * 60 }}>
            <div className={styles.total}>
              {Array.from({ length: hour })
                .fill('')
                .map((hourItem, i) => (
                  <div key={i.toString()} className={styles.hour}>
                    {Array.from({ length: 60 / mins })
                      .fill('')
                      .map((minItem, j) => (
                        <div key={j.toString()} className={styles.tenMin}>
                          &nbsp;
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          </div>
          <div className={styles.courseWrapper}>
            {data.map(item => (
              <div className={styles.cousreInfo} key={item.courseId}>
                {item.courseCalendarDataList.map(courseItem => {
                  const {
                    id,
                    courseType,
                    classStartTime,
                    classEndTime,
                    sysUserDataList,
                    payNum,
                    surplusNum,
                    arriveNum,
                    platformDataList,
                  } = courseItem;
                  return (
                    <div
                      key={id}
                      className={[
                        styles.classInfo,
                        surplusNum === 0 ? styles.disableCousre : styles.availableCousre,
                      ].join(' ')}
                      style={{
                        height: getMinute(classStartTime, classEndTime),
                        maxHeight: hour * 60,
                        top:
                          getMinute(classStartTime, classEndTime) > hour * 60
                            ? 0
                            : createTop(timeList[0], classStartTime),
                      }}
                      onClick={() => {
                        setCourseId(id);
                        setPlatformCourseDetailVisible(true);
                      }}
                    >
                      <span className={[courseType === 1 ? styles.fixedCousre : styles.dateCousre]} />
                      <div>
                        <p>
                          {formatHM(classStartTime)}-{formatHM(classEndTime)} &nbsp;
                          {sysUserDataList?.map(i => i.realName).join(',')}
                        </p>
                        <p>{platformDataList?.map(i => i.platformName).join(',')}</p>
                        <p>
                          已付<strong className={styles.payNum}>{payNum}</strong> 余
                          <strong className={styles.surplusNum}>{surplusNum}</strong> | 已到{arriveNum}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <Popover content={<span>{moment().format('HH:mm')}</span>} title="当前时间">
            <div
              className={styles.timeLine}
              style={{
                width: 42,
                top: createTop(timeList[0], Date.now()) || 0,
              }}
            >
              &nbsp;
            </div>
          </Popover>
        </div>
      ) : null}
      <PlatformCourseDetailModal
        courseDataId={courseId}
        dealId={dealId}
        flag={flag}
        setFlagToRefresh={() => setFlag(Date.now())}
        setCourseInfo={setOpenCourseInfo}
        visible={platformCourseDetailVisible}
        onVisibleChange={visible => {
          if (!visible) {
            if (flagRef.current !== flag) {
              setIsModifyData(true);
            }
            setPlatformCourseDetailVisible(false);
          }
        }}
        onFeatFire={handleShowModal}
        onDealCancel={id => {
          setDealId(id);
          setDcModalVisible(true);
        }}
        isTimeLine
      />
      <DealCancelModal
        dealId={dealId}
        visible={dcModalVisible}
        onVisibleChange={setDcModalVisible}
        onOk={() => {
          setFlag(Date.now());
        }}
      />
      <TeachersAdjustModal
        courseDataId={courseId}
        visible={teachersAdjustVisible}
        referData={checkedItem}
        onVisibleChange={setTeachersAdjustVisible}
        onOk={() => setFlag(Date.now())}
      />
      <EditSalesQuotaModal
        courseDataId={courseId}
        referData={{ ...checkedItem, singleBookingSurplusNum: openCourseInfo?.bookingSurplusNum }}
        date={date}
        visible={editSalesQuotaVisible}
        onVisibleChange={setEditSalesQuotaVisible}
        onOk={() => setFlag(Date.now())}
      />
      <EditScheduleModal
        referData={{ ...checkedItem, classDate: date }}
        date={date}
        courseDataId={courseId}
        visible={editScheduleVisible}
        onVisibleChange={setEditScheduleVisible}
        onOk={() => setFlag(Date.now())}
      />
      <PlatformsAdjustModal
        referData={checkedItem}
        courseDataId={courseId}
        visible={platformsAdjustVisible}
        onVisibleChange={setPlatformsAdjustVisible}
        onOk={() => setFlag(Date.now())}
      />
    </div>
  );
});

export default TimeLineTable;
