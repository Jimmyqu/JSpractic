// 商品子订单

/**
 * 子订单状态
 */
export const DealStatus = {
  STARTTRADING: {
    key: 0,
    value: '交易开始',
  },
  WAITDELIVERY: {
    key: 1,
    value: '等待发货',
  },
  PICKING: {
    key: 2,
    value: '配货中',
  },
  SHIPPED: {
    key: 3,
    value: '已发货',
  },
  CONFIRMRECEIPT: {
    key: 4,
    value: '确认收货',
  },
  CANCELORDER: {
    key: 5,
    value: '取消订单',
  },
  REVOCATIONORDER: {
    key: 6,
    value: '撤销订单',
  },
  ENDTRADING: {
    key: 77,
    value: '交易结束',
  },
  COMPLETETRADING: {
    key: 88,
    value: '交易完成',
  },
  THEENDTRADING: {
    key: 99,
    value: '交易终结',
  },
};

/**
 * 商品配送方式
 */
export const DeliveryTypes = {
  EXPRESSDELIVERY: {
    key: 1,
    value: '快递',
  },
  PICKUP: {
    key: 2,
    value: '自取',
  },
  DELIVERY: {
    key: 3,
    value: '送货上门',
  },
};

/**
 *商品排序类型
 */
export const QueryTypes = {
  BY_SALEID: {
    key: 1,
    value: '按营销中心',
  },
  BY_GOODNAME: {
    key: 2,
    value: '按商品名称',
  },
};

export default {
  DealStatus,
  DeliveryTypes,
  QueryTypes,
};
