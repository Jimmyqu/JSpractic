import { useEffect, useState, useMemo, useCallback, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { Link } from 'react-router-dom';
import { Button, Row, Col } from 'antd';
import Modal from '@/components/Modal';
import Table from '@/components/Datatable/BaseTable';
import { formatDate, formatHM, formatMoneyLen2, formatGender, formatAge } from '@/utils/format';
import MarginBar from '@/components/MarginBar';
import CourseAttendanceModal from '@/components/Modal/CourseAttendanceModal';
import AuthComponent from '@/components/AuthComponent';

const tableAlign = 'center';

const FeatureAction = {
  Teacher: 'tch',
  Platform: 'plt',
  Quota: 'qta',
  Schedule: 'schdl',
};

function PlatformCourseDetailModal({
  dealId,
  courseDataId: cdId,
  onDealCancel,
  inSchedule,
  flag,
  isTimeLine,
  setFlagToRefresh,
  setCourseInfo,
  onFeatFire,
  ...restProps
}) {
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [dom, setDom] = useState();
  const [attendanceModalState, attendanceModaldispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'show':
        return {
          ...state,
          attendanceVisible: true,
          data: action.payload,
        };
      case 'hide':
        return {
          attendanceVisible: false,
        };
      default:
        throw new Error('unknown');
    }
  }, {});
  const { attendanceVisible, data: attendanceData } = attendanceModalState;
  const { DealStatus: MainDealStatus } = useSelector(state => state.deal);
  const { CourseTypes } = useSelector(state => state.pubcourse);

  const fetching = useSelector(state => state.loading.effects['pubcourse/fetch']);

  const setAttendanceVisible = useCallback((show, payload) => {
    attendanceModaldispatch({
      type: show ? 'show' : 'hide',
      payload,
    });
  }, []);
  const load = useCallback(() => {
    if (dealId == null && cdId == null) {
      return;
    }
    if (restProps.visible) {
      dispatch({
        type: 'pubcourse/fetch',
        payload: {
          dealId,
          courseDataId: cdId,
        },
      }).then(res => {
        setData(res);
        if (typeof setCourseInfo === 'function') {
          setCourseInfo(res.details);
        }
      });
    }
  }, [dealId, cdId, restProps.visible]);

  useEffect(load, [dealId, cdId, restProps.visible, flag]);

  useEffect(() => {
    return () => {
      setDom(null);
    };
  }, []);
  const { details, dealCourseStudyInfoVOList } = data || {};

  const { courseDataId, courseType, classDate } = details || {};

  // 可链接相关“调整”功能
  const hasExt = courseType === CourseTypes.FiexdCourse.key;

  const dataSource = useMemo(() => (details ? [details] : []), [details]);
  const columnsCourse = useMemo(
    () => [
      {
        title: '课程名称',
        align: tableAlign,
        dataIndex: 'courseName',
        width: 130,
      },
      {
        title: '日期',
        align: tableAlign,
        dataIndex: 'classDate',
        render: formatDate,
        width: 90,
      },
      {
        title: '时间',
        align: tableAlign,
        key: 'classTIme',
        render: (_, { classStartTime, classEndTime }) => `${formatHM(classStartTime)}-${formatHM(classEndTime)}`,
        width: 90,
      },
      {
        title: '场地',
        align: tableAlign,
        dataIndex: 'coursePlatform',
        render: value => (value || []).map(name => <div key={name}>{name}</div>),
        width: 120,
      },
      {
        title: '课程单价',
        align: tableAlign,
        dataIndex: 'price',
        render: formatMoneyLen2,
        width: 100,
      },
    ],
    []
  );

  const columnsOther = useMemo(
    () => [
      {
        title: '教职人员',
        align: tableAlign,
        dataIndex: 'teachingStaff',
        render: value => (value || []).map(name => <div key={name}>{name}</div>),
        width: 150,
      },
      {
        title: '学员人数',
        align: tableAlign,
        dataIndex: 'studentNum',
        width: 90,
      },
      {
        title: '未支付',
        align: tableAlign,
        dataIndex: 'payNum',
        width: 90,
      },
      {
        title: '剩余名额',
        align: tableAlign,
        dataIndex: 'bookingSurplusNum',
        width: 90,
      },
      {
        title: '已到',
        align: tableAlign,
        dataIndex: 'arriveNum',
        width: 90,
      },
    ],
    []
  );

  const columnsStudy = useMemo(
    () => [
      {
        title: '主订单',
        align: tableAlign,
        dataIndex: 'study.dealId',
        render: value => <Link to={`/basic/deal/${value}/detail`}>{value}</Link>,
        width: 90,
      },
      {
        title: '会员/手机号',
        align: tableAlign,
        key: 'pubAccount',
        render: (_, { study: { pubAccountId, pubRealName, pubMobile } }) => (
          <Link to={`/basic/pub/info/${pubAccountId}`}>
            <div>{pubRealName}</div>
            <div>{pubMobile}</div>
          </Link>
        ),
        width: 120,
      },
      {
        title: '学员名/手机号',
        align: tableAlign,
        key: 'realName',
        render: (_, { study: { realName, mobile } }) => (
          <div>
            <div>{realName}</div>
            <div>{mobile}</div>
          </div>
        ),
        width: 120,
      },
      {
        title: '性别',
        align: tableAlign,
        dataIndex: 'study.sex',
        render: formatGender,
        width: 70,
      },
      {
        title: '年龄',
        align: tableAlign,
        dataIndex: 'study.birthday',
        render: value => formatAge(value),
        width: 70,
      },
      {
        title: '成交价',
        align: tableAlign,
        dataIndex: 'study.payFeeTotal',
        render: formatMoneyLen2,
        width: 90,
      },
      {
        title: '考勤',
        align: tableAlign,
        key: 'attendance',
        render: (_, { study: { signIn, signOut, eventTime, eventTag, pubStudyId, dealId: orderId } }) => {
          if (signIn == null && signOut == null && eventTime == null) {
            return null;
          }
          return (
            <Link to={`/basic/course/attendance?dealId=${orderId}&pubStudyId=${pubStudyId}`}>
              {signIn && <span className="link">已到</span>}
              {signOut && (
                <MarginBar inline left className="link">
                  已退
                </MarginBar>
              )}
              {eventTime && (
                <MarginBar inline left className="link">
                  {eventTag || '?'}
                </MarginBar>
              )}
            </Link>
          );
        },
        width: 80,
      },
      {
        title: '操作',
        align: tableAlign,
        key: 'operation',
        render: (_, { study: { dealId: orderId, dealState, publicStudyCourseId } }) => {
          if (dealState === MainDealStatus.REVIEW.key) {
            return null;
          }
          return (
            <>
              {dealState == null || dealState === MainDealStatus.NOT_PAY.key ? (
                <Button
                  type="danger"
                  onClick={() => {
                    dispatch(
                      push({
                        pathname: `/basic/course/sell/${courseDataId}/summary`,
                        search: `id=${orderId}`,
                      })
                    );
                  }}
                >
                  去支付
                </Button>
              ) : (
                <>
                  {publicStudyCourseId ? (
                    <Button
                      type="primary"
                      onClick={
                        //
                        () =>
                          setAttendanceVisible(true, {
                            publicStudyCourseId,
                          })
                      }
                    >
                      考勤
                    </Button>
                  ) : null}
                </>
              )}
              <MarginBar inline left>
                <Button onClick={() => onDealCancel(orderId, dom)}>取消</Button>
              </MarginBar>
            </>
          );
        },
        width: 170,
      },
    ],
    [data]
  );

  const routerToCourseSchedule = useCallback(
    action => {
      dispatch(
        push({
          pathname: `/basic/course/sell/${courseDataId}/schedule`,
          search: `neworder=1&action=${action}&date=${classDate}`,
        })
      );
    },
    [data]
  );

  const onBtnClick = onFeatFire || routerToCourseSchedule;

  return (
    <Modal
      title="课程详情"
      width={1000}
      {...restProps}
      loading={fetching}
      footer={[
        ...(inSchedule && !isTimeLine
          ? []
          : [
              ...(hasExt
                ? [
                    <AuthComponent key="teacher" auth="adjust-teacher">
                      <Button disabled={fetching} onClick={() => onBtnClick(FeatureAction.Teacher)}>
                        教职人员
                      </Button>
                    </AuthComponent>,
                    <AuthComponent key="platform" auth="adjust-platform">
                      <Button disabled={fetching} onClick={() => onBtnClick(FeatureAction.Platform)}>
                        调整场地
                      </Button>
                    </AuthComponent>,
                    <AuthComponent key="quota" auth="edit-quota">
                      <Button disabled={fetching} onClick={() => onBtnClick(FeatureAction.Quota)}>
                        调整名额
                      </Button>
                    </AuthComponent>,
                    <AuthComponent key="schedule" auth="edit-schedule">
                      <Button disabled={fetching} onClick={() => onBtnClick(FeatureAction.Schedule)}>
                        调整排期
                      </Button>
                    </AuthComponent>,
                  ]
                : []),
              <Button
                key="scheduling"
                disabled={data == null || fetching}
                onClick={() => {
                  dispatch(
                    push({
                      pathname: `/basic/course/sell/${courseDataId}/schedule`,
                      search: `neworder=1&date=${classDate}`,
                    })
                  );
                }}
              >
                课程排期
              </Button>,
              <Button
                key="course"
                disabled={data == null || fetching}
                onClick={() => {
                  dispatch(
                    push({
                      pathname: '/basic/course/list',
                      search: `courseDataId=${courseDataId}`,
                    })
                  );
                }}
              >
                课程信息
              </Button>,
              <Button
                key="signup"
                type="primary"
                disabled={data == null || fetching}
                onClick={() => {
                  dispatch(
                    push({
                      pathname: `/basic/course/sell/${courseDataId}/${isTimeLine ? 'user' : 'schedule'}`,
                      search: `neworder=1&date=${classDate}`,
                    })
                  );
                }}
              >
                报名预约
              </Button>,
            ]),
        <Button key="cancel" link="cancel" disabled={fetching}>
          关闭
        </Button>,
      ].filter(Boolean)}
    >
      <Row>
        <Col>
          <Row>
            <Col>课程排期信息</Col>
            {/* <Col span={4} className="text-right">
              <span className="link">{formatModel(DealStatus, courseStatus)}</span>
            </Col> */}
          </Row>
        </Col>
        <Col>
          <Table
            bordered
            pagination={false}
            rowKey="courseDataId"
            countColsWidth
            columns={columnsCourse}
            dataSource={dataSource}
          />
          <MarginBar top>
            <Table
              bordered
              pagination={false}
              rowKey="courseDataId"
              countColsWidth
              columns={columnsOther}
              dataSource={dataSource}
            />
          </MarginBar>
        </Col>
        <Col>学员信息</Col>
        <Col>
          <Table
            bordered
            pagination={false}
            rowKey={record => record.study.id}
            countColsWidth
            columns={columnsStudy}
            dataSource={dealCourseStudyInfoVOList}
            scroll={{
              y: 238,
            }}
          />
        </Col>
      </Row>
      <div ref={setDom} />
      <CourseAttendanceModal
        data={attendanceData}
        visible={attendanceVisible}
        onVisibleChange={setAttendanceVisible}
        onOk={() => (isTimeLine ? setFlagToRefresh() : setTimeout(load, 0))}
      />
    </Modal>
  );
}

PlatformCourseDetailModal.FeatureAction = {
  ...FeatureAction,
};

export default PlatformCourseDetailModal;
