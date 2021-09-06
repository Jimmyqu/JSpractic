// 报名子订单

/**
 * 子订单状态
 */
export const DealStatus = {
  START: {
    key: 0,
    value: '报名开始',
  },
  RUNNABLE: {
    key: 1,
    value: '报名中',
  },
  CHECKING: {
    key: 2,
    value: '审核中',
  },
  CHECKED: {
    key: 3,
    value: '审核通过',
  },
  REFUSE: {
    key: 4,
    value: '审核拒绝',
  },
  CANCEL: {
    key: 5,
    value: '取消报名',
  },
  COMPLETE: {
    key: 88,
    value: '报名完成',
  },
};

/**
 * 事件类型
 */
export const EventTypes = {
  March: {
    key: 1,
    value: '赛事',
  },
  Activity: {
    key: 2,
    value: '活动',
  },
  Train: {
    key: 3,
    value: '培训',
  },
  Presumably: {
    key: 4,
    value: '文化影剧',
  },
};

/**
 * 报名类型
 */
export const SignUpModeTypes = {
  PERSONAGE: 0,
  GROUP: 1,
  MEMBER: 2,
};

/**
 * 活动状态
 */
export const ActivityStatus = {
  SignUp: {
    key: 1,
    value: '已报名',
  },
  Ing: {
    key: 2,
    value: '进行中',
  },
  Done: {
    key: 3,
    value: '已结束',
  },
};

export default {
  DealStatus,
  EventTypes,
  SignUpModeTypes,
  ActivityStatus,
};
