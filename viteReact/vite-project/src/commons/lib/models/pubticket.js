import RelTypes from './reltypes';
// 票务子订单

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
    value: '购票中',
  },
  DEAL_PASS: {
    key: 2,
    value: '已购票',
  },
  DEAL_CANCEL: {
    key: 3,
    value: '已取消',
  },
  DEAL_COMPLETE: {
    key: 88,
    value: '订单完成',
  },
};

/**
 * 验票状态
 */
export const CheckoutStatus = {
  Verified: {
    key: 'Verified',
    value: '订单完成/已验票',
  },
  Unverified: {
    key: 'Unverified',
    value: '已购票/未验',
  },
  UnCheckout: {
    key: 'UnCheckout',
    value: '未结算',
  },
  Cancel: {
    key: 'Cancel',
    value: '已取消',
  },
};

/**
 * cloud售票状态
 */
export const ViewStatus = {
  Wait: {
    key: 1,
    value: '待开售',
  },
  Selling: {
    key: 2,
    value: '售票',
  },
  SoldOut: {
    key: 3,
    value: '已售罄',
  },
  Done: {
    key: 4,
    value: '已结束',
  },
};

/**
 * 排期日程类型
 */
export const CalendarTypes = {
  FIXEDSCHEDULE: {
    key: 0,
    value: '固定日程',
  },
  VALIDITYSCHEDULE: {
    key: 1,
    value: '有效期日程',
  },
};

/**
 * 核验类型/方式
 */
export const CheckModeTypes = {
  QR_SELECT_CHECK: {
    key: 1,
    value: '扫码查询',
  },
  QR_CONFIRM_CHECK: {
    key: 2,
    value: '扫码核验',
  },
  CODE_CHECK: {
    key: 3,
    value: '扫码快速核验',
  },
  DEVICE_QR_CHECK: {
    key: 4,
    value: '设备扫码验证',
  },
  FACE_CHECK: {
    key: 5,
    value: '人脸验证',
  },
  SIGN: {
    key: 6,
    // 复用并改为手工签到 ???
    value: '无码签到',
  },
  IC_CHECK: {
    key: 7,
    value: 'IC验证',
  },
  SIGN_OUT: {
    key: 8,
    value: '手工签退',
  },
};

/**
 * 核验状态
 */
export const CheckStatus = {
  UNCHECKED: {
    key: 0,
    value: '未核验',
  },
  CHECKED: {
    key: 1,
    value: '已核验',
  },
  PARTIAL_CHECKED: {
    key: 2,
    value: '部分核验',
  },
};

/**
 * 磁卡下单类型
 */
export const CheckModeDealTypes = {
  NORMAL: {
    key: 0,
    value: '普通下单',
  },
  PUBSERVICEACCOUNT: {
    key: 1,
    value: '会员服务下单',
  },
  SYSTEMUSER: {
    key: 2,
    value: '系统用户',
  },
};

/**
 * 磁卡类型
 */
export const MagneticCardTypes = {
  ICCard: {
    key: 0,
    value: 'IC/物理卡',
  },
  IDCard: {
    key: 1,
    value: '身份证',
  },
};

/**
 * 磁卡状态
 */
export const MagneticCardStatus = {
  Enable: {
    key: 0,
    value: '可用',
  },
  Disable: {
    key: 1,
    value: '禁用',
  },
  Lost: {
    key: 2,
    value: '作废',
  },
};

/**
 * 磁卡数据（用户）类型
 */
export const MagneticCardUserTypeList = [
  RelTypes.SYS_USER,
  RelTypes.PUBSERVICE_ACCOUNT,
  RelTypes.PUBACCOUNT_USER,
  RelTypes.PUBSTUDY_USER,
];

/**
 * 座位区域分类
 */
export const SeatCategoryTypes = {
  FLOOR: {
    key: 1,
    value: '楼层',
  },
  REGION: {
    key: 2,
    value: '区域',
  },
  GRADE: {
    key: 3,
    value: '等级',
  },
};

/**
 * 座位分类
 */
export const SeatTypes = {
  NORMAL: {
    key: 0,
    value: '普通座',
  },
  COUPLE: {
    key: 1,
    value: '情侣座',
  },
  // GHOST: {
  //   key: 2,
  //   value: '空座',
  // },
};

/**
 * 座位属性分类
 */
export const SeatFeatTypes = {
  NORMAL: {
    key: 0,
    value: '普通观影区',
  },
  BETTER_VISION: {
    key: 1,
    value: '最佳观影区',
  },
};

/**
 * 座位状态
 */
export const SeatStatus = {
  Available: {
    key: 0,
    value: '可用',
  },
  InOrder: {
    key: 1,
    value: '已预订',
  },
  Disabled: {
    key: 2,
    value: '已锁票',
  },
};

/**
 * exerciseTag
 */
export const Tags = {
  NORMAL: {
    key: 0,
    value: '正常',
  },
  GOV_SUBSIDIES: {
    key: 1,
    value: '政府补贴',
  },
  LOWPRICE: {
    key: 2,
    value: '低价',
  },
  FREE: {
    key: 3,
    value: '免费',
  },
  PREFERENTIAL: {
    key: 4,
    value: '优惠',
  },
  DISCOUNT: {
    key: 5,
    value: '折扣',
  },
  SUBSIDIES: {
    key: 6,
    value: '补贴',
  },
  DISCOUNTCOUPON: {
    key: 7,
    value: '惠民',
  },
};

export default {
  DealStatus,
  CheckoutStatus,
  ViewStatus,
  CalendarTypes,
  CheckModeTypes,
  CheckStatus,
  CheckModeDealTypes,
  MagneticCardTypes,
  MagneticCardUserTypeList,
  MagneticCardStatus,
  SeatStatus,
  SeatCategoryTypes,
  SeatTypes,
  SeatFeatTypes,
  Tags,
};
