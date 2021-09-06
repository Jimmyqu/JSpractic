/**
 * 租赁类型
 */
export const LeaseTypes = {
  LOCKER: {
    key: 1,
    value: '储物柜',
  },
  // GOOD: {
  //   key: 2,
  //   value: '商品',
  // },
};

/**
 * 退款方式
 */
export const RefundModeTypes = {
  REALTIME: {
    key: 1,
    value: '实时退款',
  },
  // DELAY: {
  //   key: 2,
  //   value: '延时退款',
  // },
};

/**
 * 退款状态
 */
export const RefundStatus = {
  PENDING: {
    key: 1,
    value: '未退款',
  },
  DONE: {
    key: 2,
    value: '已退款',
  },
};

// /**
//  * 在线预订
//  */
// export const OnlineOrderStates = {
//   DISABLE: {
//     key: 0,
//     value: '关闭',
//   },
//   ENABLE: {
//     key: 1,
//     value: '开启',
//   },
// };

/**
 * 租赁状态
 */
export const RentStates = {
  CANUSE: {
    key: 0,
    value: '可用',
  },
  LEASE_PAY_WAIT: {
    key: 1,
    value: '支付中',
  },
  PORTALORDER: {
    key: 2,
    value: '手机端预订',
  },
  PCORDER: {
    key: 3,
    value: '营业员预订',
  },
  LOCKED: {
    key: 6,
    value: '锁定',
  },
  DISABLED: {
    key: 7,
    value: '禁用',
  },
};

/**
 * 租赁logs状态
 */
export const RentLogStates = {
  ...RentStates,
  CANCEL: {
    key: 4,
    value: '已取消',
  },
  COMPLETE: {
    key: 5,
    value: '已完成',
  },
  CLEAN: {
    key: 8,
    value: '清柜',
  },
};

/**
 * 租赁分组状态
 */
export const RentGroupStates = {
  Enable: {
    key: 0,
    value: '可用',
  },
  Disabled: {
    key: 1,
    value: '禁用',
  },
};
/**
 * 状态操作
 */
export const RentOperationTypes = {
  LOCK: {
    key: 1,
    value: '锁定',
  },
  DISLOCK: {
    key: 2,
    value: '解锁',
  },
  DISABLE: {
    key: 3,
    value: '禁用',
  },
  ENABLE: {
    key: 4,
    value: '解禁',
  },
  CLEAN: {
    key: 5,
    value: '清柜',
  },
};

/**
 * 子订单状态
 */
export const DealStatus = {
  // portal下单未支付
  LEASE_WAIT: {
    key: 1,
    value: '租赁中',
  },
  // cloud下单未支付
  LEASE_PASS: {
    key: 2,
    value: '已租',
  },
  // 付款成功并租借中
  LEASE_USED: {
    key: 3,
    value: '使用中',
  },
  // 未付款取消，当常规取消
  LEASE_CANCEL: {
    key: 4,
    value: '已取消',
  },
  // 已付款取消，当归还（由于使用取消订单的方式来执行归还操作）
  COURSE_COMPLETE: {
    key: 88,
    value: '已归还',
  },
};

export default {
  LeaseTypes,
  RefundModeTypes,
  RefundStatus,
  // OnlineOrderStates,
  RentStates,
  RentLogStates,
  RentGroupStates,
  DealStatus,
  RentOperationTypes,
};
