// 物流

/**
 * 物流状态
 */
export const ShippingStates = {
  WAIT: {
    key: 1,
    value: '待发货',
  },
  SEND: {
    key: 2,
    value: '已发货',
  },
  CONFIRM: {
    key: 3,
    value: '确认收货',
  },
};

/**
 * 物流公司（默认支持的）
 */
export const ExpressCompanys = {
  SFEXPRESS: {
    key: 'SFEXPRESS',
    value: '顺丰速递',
  },
  ZTO: {
    key: 'ZTO',
    value: '中通快递',
  },
  YTO: {
    key: 'YTO',
    value: '圆通快递',
  },
  STO: {
    key: 'STO',
    value: '申通快递',
  },
  GTO: {
    key: 'GTO',
    value: '国通快递',
  },
  YUNDA: {
    key: 'YUNDA',
    value: '韵达快递',
  },
  HTKY: {
    key: 'HTKY',
    value: '百世汇通',
  },
  TTKDEX: {
    key: 'TTKDEX',
    value: '天天快递',
  },
  CHINAPOST: {
    key: 'CHINAPOST',
    value: '邮政国内小包',
  },
  EMS: {
    key: 'EMS',
    value: '邮政EMS',
  },
  DEPPON: {
    key: 'DEPPON',
    value: '德邦物流',
  },
  ZJS: {
    key: 'ZJS',
    value: '宅急送',
  },
};

export default {
  ShippingStates,
  ExpressCompanys,
};
