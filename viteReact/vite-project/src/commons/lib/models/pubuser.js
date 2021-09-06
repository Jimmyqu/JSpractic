// pub用户
import RelTypes from './reltypes';
/**
 * 白条操作类型
 */
export const CreditTypes = {
  ADD: {
    key: 1,
    value: '增加额度',
  },
  SUB: {
    key: 2,
    value: '减少额度',
  },
  PAYBACK: {
    key: 3,
    value: '还款',
  },
  PAY: {
    key: 4,
    value: '支付订单',
  },
  CANCEL: {
    key: 5,
    value: '取消订单',
  },
  CANCEL_REPAYMENT: {
    key: 6,
    value: '取消还款',
  },
};

/**
 * 性别
 */
export const Genders = {
  Male: {
    key: 1,
    value: '男',
  },
  Female: {
    key: 2,
    value: '女',
  },
};

/**
 * 会员类型
 */
export const PubAccountTypes = {
  Basic: {
    key: 0,
    value: '普通会员',
  },
  Prestored: {
    key: 1,
    value: '预存会员',
  },
  VIP: {
    key: 2,
    value: 'VIP会员',
  },
};

/**
 * 用户可用状态
 */
export const UserStatus = {
  Enable: {
    key: 0,
    value: '可用',
  },
  Disable: {
    key: 1,
    value: '禁用',
  },
};

/**
 * 证件类型
 */
export const IDCardTypes = {
  IDCard: {
    key: 0,
    value: '身份证',
  },
  Passport: {
    key: 1,
    value: '护照',
  },
  DrivingLicence: {
    key: 2,
    value: '驾驶证',
  },
  Other: {
    key: 3,
    value: '其他',
  },
  HKIDCard: {
    key: 4,
    value: '香港身份证',
  },
  MainlandTravelPermitForHKMacao: {
    key: 5,
    value: '港澳回乡证',
  },
  MainlandTravelPermitForTaiwan: {
    key: 6,
    value: '台湾回乡证',
  },
};

/**
 * 用户类型
 */
export const UserTypes = {
  SYS_USER: {
    key: 0,
    value: '系统用户',
  },
  PUBACCOUNT_USER: {
    key: 1,
    value: '会员',
  },
};

/**
 * 业务数据类型
 */
export const BusinessTypes = {
  PUBSERVICE: RelTypes.PUBSERVICE,
};

/**
 * 会员权益
 */
export const MemberIntersts = {
  SERVICE: {
    key: 1,
    value: '服务特权',
  },
  FIELD: {
    key: 2,
    value: '场地特权',
  },
  HOLIDAY: {
    key: 3,
    value: '节日特权',
  },
  INTEGRAL: {
    key: 4,
    value: '积分特权',
  },
  ACTIVITY: {
    key: 5,
    value: '活动特权',
  },
  VIP: {
    key: 6,
    value: '贵宾特权',
  },
};

export default {
  CreditTypes,
  Genders,
  UserStatus,
  IDCardTypes,
  PubAccountTypes,
  UserTypes,
  BusinessTypes,
  MemberIntersts,
};
