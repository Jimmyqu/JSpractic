// 用户行为

/**
 * 用户行为
 */
export const ActionTypes = {
  SIGN_IN: {
    key: 0,
    value: '签到',
  },
  SHARE: {
    key: 1,
    value: '分享',
  },
  SIGNUP: {
    key: 3,
    value: '参加报名',
  },
  SURVEY: {
    key: 4,
    value: '参加调查',
  },
  LOTTERY: {
    key: 5,
    value: '抽奖赠送',
  },
  REGISTER: {
    key: 6,
    value: '注册',
  },
  PAY_DEAL: {
    key: 7,
    value: '支付订单',
  },
  CANCEL_DEAL: {
    key: 8,
    value: '取消订单',
  },
  GIVING: {
    key: 9,
    value: '系统赠送',
  },
  DEDUCTION: {
    key: 10,
    value: '系统扣除',
  },
  POINTS_PAY_DEAL: {
    key: 11,
    value: '支付积分订单',
  },
  POINTS_CANCEL_DEAL: {
    key: 12,
    value: '取消积分订单',
  },
};

export default {
  ActionTypes,
};
