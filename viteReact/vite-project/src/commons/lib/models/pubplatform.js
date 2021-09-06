// 场地子订单

/**
 * 子订单状态
 */
export const DealStatus = {
  DEAL_START: {
    key: 0,
    value: '订单开始',
  },
  DEAL_WAIT: {
    key: 1,
    value: '预订中',
  },
  DEAL_PASS: {
    key: 2,
    value: '已预订',
  },
  DEAL_CANCEL: {
    key: 3,
    value: '已取消',
  },
  DEAL_COMPLETE: {
    key: 88,
    value: '交易成功',
  },
};

/**
 * 场地订单类型
 */
export const PlatformDealTypes = {
  Platform: {
    key: 0,
    value: '场地',
  },
  ForeverRange: {
    key: 1,
    value: '固定场',
  },
  Course: {
    key: 2,
    value: '课程占场',
  },
  Locked: {
    key: 3,
    value: '锁场',
  },
};

/**
 * 场地锁场状态
 */
export const PlatformLockStatus = {
  Locked: {
    key: 1,
    value: '已锁场',
  },
  LockFailed: {
    key: 2,
    value: '锁场失败',
  },
  Canceled: {
    key: 3,
    value: '已取消',
  },
};

export default {
  DealStatus,
  PlatformLockStatus,
  PlatformDealTypes,
};
