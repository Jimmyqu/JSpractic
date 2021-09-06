// 优惠码/券 不是会员服务

/**
 * 结算状态
 */
export const CouponStatus = {
  Enable: {
    key: 0,
    value: '可用',
  },
  Verified: {
    key: 1,
    value: '已验',
  },
  Disabled: {
    key: 2,
    value: '禁用',
  },
  Expired: {
    key: 3,
    value: '已过期',
  },
  YSF_Enable: {
    key: 99,
    value: '待领取',
  },
};

export const IssueModeTypes = {
  PanicBuying: {
    key: 1,
    value: '会员抢购',
  },
  BatchIssuance: {
    key: 2,
    value: '批量发行',
  },
};

export const IssueTypes = {
  System: {
    key: 0,
    value: '系统发行',
  },
  WeChat: {
    key: 1,
    value: '微信发行',
  },
  YunShanFu: {
    key: 2,
    value: '云闪付发行',
  },
};

export const VerifyActionTypes = {
  Verify: {
    key: 1,
    value: '验证',
  },
  Cancel: {
    key: 2,
    value: '取消',
  },
};

export default {
  CouponStatus,
  IssueTypes,
  IssueModeTypes,
  VerifyActionTypes,
};
