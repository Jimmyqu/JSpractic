// 支付

/**
 * 支付方式
 */
export const PayMethodTypes = {
  QR_CODE: {
    key: 1,
    value: '二维码',
  },
  BAR_CODE: {
    key: 2,
    value: '条码',
  },
  WEB: {
    key: 3,
    value: 'Web',
  },
  USED_WEB: {
    key: 4,
    value: 'H5',
  },
};

/**
 * PayStatus
 * 平台支付状态（支付宝、微信一样的？）
 */
export const PlatformPayStatus = {
  PAY_CLOSE: {
    key: -2,
    value: '支付关闭',
  },
  PAY_FAIL: {
    key: -1,
    value: '支付失败',
  },
  PAY_UNPAID: {
    key: 0,
    value: '待支付',
  },
  PAY_UNDERWAY: {
    key: 1,
    value: '支付中',
  },
  PAY_SUCCESS: {
    key: 2,
    value: '支付成功',
  },
};

export const PayPlatform = {
  Mixed: {
    key: 0,
    value: '综合',
  },
  Weixin: {
    key: 1,
    value: '微信',
  },
  Zfb: {
    key: 2,
    value: '支付宝',
  },
};

/**
 * 微信支付模式
 */
export const WechatPayModeTypes = {
  MERCHANT: {
    key: 1,
    value: '商户',
  },
  SERVICER: {
    key: 2,
    value: '服务商',
  },
};

export default {
  PayMethodTypes,
  PlatformPayStatus,
  PayPlatform,
  WechatPayModeTypes,
};
