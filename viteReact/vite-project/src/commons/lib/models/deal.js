// 主订单
import RelTypes from './reltypes';
/**
 * 结算状态
 */
export const CheckoutStatus = {
  Checkout: {
    key: 'Checkout',
    value: '已结算',
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
 * 主订单状态
 */
export const DealStatus = {
  NEWS: {
    key: 0,
    value: '订单开始',
  },
  NOT_PAY: {
    key: 1,
    value: '待支付',
  },
  NOT_USE: {
    key: 2,
    value: '待使用',
  },
  COMPLETE: {
    key: 3,
    value: '已完成',
  },
  CANCEL: {
    key: 4,
    value: '已取消',
  },
  REFUNDED: {
    key: 5,
    value: '已退款',
  },
  BUY_TICKET: {
    key: 6,
    value: '已购票',
  },
  REVIEW: {
    key: 7,
    value: '审核中',
  },
  BOOKING: {
    key: 8,
    value: '预订中',
  },
  NOT_REVIEW: {
    key: 9,
    value: '审核未通过',
  },
};

/**
 * 物流状态
 */
export const DealShippingStatus = {
  NONE: {
    key: 0,
    value: '无物流',
  },
  WAIT_SEND: {
    key: 1,
    value: '待发货',
  },
  WAIT_CONSIGNEE: {
    key: 2,
    value: '待收货',
  },
  CONFIRM_CONSIGNEE: {
    key: 3,
    value: '已收货',
  },
};

/**
 * 订单和流水的支付状态 dealPayState
 */
export const PayStatus = {
  UNPAID: {
    key: 0,
    value: '未支付',
  },
  HASPAID: {
    key: 1,
    value: '已支付',
  },
  OTHERPAY: {
    key: 2,
    value: '未付清',
  },
  REFUNDING: {
    key: 3,
    value: '退款中',
  },
  REFUNDED: {
    key: 4,
    value: '已退款',
  },
  REFUND_FAIL: {
    key: 5,
    value: '退款失败',
  },
};

/**
 * 支付方式
 */
export const PayWayTypes = {
  // UNPAID: {
  //   key: 0,
  //   value: '未支付',
  // },
  GROUP: {
    key: 0,
    value: '快捷',
  },
  CASH: {
    key: 101,
    value: '现金',
  },
  ZFB: {
    key: 2,
    value: '支付宝',
  },
  ACCOUNT: {
    key: 103,
    value: '会员账户',
  },
  PUBSERVICE: {
    key: 105,
    value: '会员服务',
  },
  WECHAT: {
    key: 1,
    value: '微信',
  },
  POINTS: {
    key: 107,
    value: '积分',
  },
  CREDIT: {
    key: 109,
    value: '白条',
  },
  ZFB_TO_ACCOUNT: {
    key: 111,
    value: '支付宝转入账户',
  },
  WECHAT_TO_ACCOUNT: {
    key: 113,
    value: '微信转入账户',
  },
  BANKTRANSFER: {
    key: 115,
    value: '转账',
  },
  BANKCARD: {
    key: 119,
    value: '银行卡刷卡',
  },
  // DIFFERENTPAY: {
  //   key: 99,
  //   value: '组合',
  // },
  // SCANCODE: {
  //   key: 100,
  //   value: '扫码',
  // },
};

/**
 * 账单类型
 */
export const BillTypes = {
  RECHARGE: {
    key: 2,
    value: '充值',
  },
  PAYMENT: {
    key: 1,
    value: '支付',
  },
  REFUND: {
    key: 101,
    value: '退款',
  },
  WITHDRAWCASH: {
    key: 102,
    value: '账户提现',
  },
  CREDITREPAYMENT: {
    key: 3,
    value: '白条还款',
  },
  WITHDRAWPUBSERVICE: {
    key: 103,
    value: '服务折现',
  },
};

/**
 * 子订单类型
 */
export const SubSeqTypes = {
  DEAL_ITEM: {
    ...RelTypes.DEALITEM,
    value: '商品',
  },
  DEAL_PLATFORM: {
    ...RelTypes.DEAL_PLATFORM,
    value: '场地',
  },
  DEAL_SERVICEUSER: {
    ...RelTypes.DEALSERVICEUSER,
    value: '服务人员',
  },
  DEAL_ITEMSNAP: {
    ...RelTypes.DEALITEMSNAP,
    value: '商品快照',
  },
  DEAL_SERVICEPUB: {
    ...RelTypes.DEAL_SERVICEPUB,
    value: '会员服务',
  },
  DEAL_TICKET: {
    ...RelTypes.DEALTICKET,
    value: '票务',
  },
  DEAL_SIGNUP: {
    ...RelTypes.DEAL_SIGNUP,
    value: '报名',
  },
  DEAL_SPORTPLATFORMTICKET: {
    ...RelTypes.DEAL_SPORT_PLATFORM_TICKET,
    value: '场馆票务',
  },
  DEAL_COURSE: {
    ...RelTypes.DEAL_COURSE,
    value: '课程',
  },
  DEAL_PUBLICCREDIT: {
    ...RelTypes.DEALPUBLICCREDIT,
    value: '白条',
  },
  DEAL_SCANCODE: {
    ...RelTypes.DEALSCANCODE,
    value: '扫码',
  },
  DEAL_PUBLICACCOUNT: {
    ...RelTypes.DEALPUBLICACCOUNT,
    value: '会员账户',
  },
  DEAL_WITHDRAW: {
    ...RelTypes.DEALWITHDRAW,
    value: '提现',
  },
  DEAL_MARKETING_MEMBER: {
    ...RelTypes.DEAL_MARKETING_MEMBER,
    value: '分销人员',
  },
};

/**
 * 订单来源分类
 */
export const SrvTypes = {
  PC: {
    key: 0,
    value: 'PC端',
  },
  PORTAL: {
    key: 1,
    value: '无线端',
  },
};

/**
 * 改价类型
 */
export const ChangePriceTypes = {
  UnChange: {
    key: 0,
    value: '未改价',
  },
  Change: {
    key: 1,
    value: '已改价',
  },
};

export default {
  CheckoutStatus,
  DealStatus,
  DealShippingStatus,
  PayStatus,
  PayWayTypes,
  BillTypes,
  SubSeqTypes,
  SrvTypes,
  ChangePriceTypes,
};
