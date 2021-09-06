// 课程子订单

/**
 * 子订单状态
 */
export const DealStatus = {
  DEAL_START: {
    key: 0,
    value: '订单开始',
  },
  COURSE_WAIT: {
    key: 1,
    value: '预约中',
  },
  COURSE_REVIEW: {
    key: 2,
    value: '审核中',
  },
  COURSE_PASS: {
    key: 3,
    value: '已预约',
  },
  DEAL_CANCEL: {
    key: 4,
    value: '已取消',
  },
  COURSE_NOT_REVIEW: {
    key: 5,
    value: '审核未通过',
  },
  COURSE_COMPLETE: {
    key: 88,
    value: '已完成',
  },
};

/**
 * 课程状态
 */
export const CourseStatus = {
  G_Booking: {
    key: 1,
    value: '预约',
  },
  G_BookingEnd: {
    key: 2,
    value: '预约结束',
  },
  G_Full: {
    key: 3,
    value: '满员',
  },
  G_Training: {
    key: 4,
    value: '上课中',
  },
  G_End: {
    key: 5,
    value: '已结束',
  },
  BookWait: {
    key: 11,
    value: '待开始',
  },
  Booking: {
    key: 12,
    value: '报名中',
  },
  BookFull: {
    key: 13,
    value: '满员',
  },
  BookEnd: {
    key: 14,
    value: '报名结束',
  },
  TrainWait: {
    key: 21,
    value: '待开课',
  },
  Training: {
    key: 22,
    value: '培训中',
  },
  TrainEnd: {
    key: 23,
    value: '培训结束',
  },
};

/**
 * 课程类型
 */
export const CourseTypes = {
  FiexdCourse: {
    key: 1,
    value: '约课',
  },
  Period: {
    key: 2,
    value: '固定班/渐进式',
  },
};

/**
 * 签到方式
 */
export const SignModeTypes = {
  Batch: {
    key: 1,
    value: '批量考勤',
  },
  Scan: {
    key: 2,
    value: '扫码考勤',
  },
  Supplement: {
    key: 3,
    value: '补签',
  },
};

/**
 * 签到状态
 */
export const SignStatus = {
  Yes: {
    key: 1,
    value: '已到',
  },
  No: {
    key: 2,
    value: '未到',
  },
};

export default {
  DealStatus,
  CourseStatus,
  CourseTypes,
  SignModeTypes,
  SignStatus,
};
