// 扫码子订单

/**
 * 子订单状态
 */
export const DealStatus = {
  DEAL_START: {
    key: 0,
    value: '订单开始',
  },
  DEAL_RECHARGE: {
    key: 1,
    value: '收款中',
  },
  DEAL_RECHARGE_COMPLETED: {
    key: 2,
    value: '已收款',
  },
  DEAL_CANCEL: {
    key: 5,
    value: '已取消',
  },
};

export default {
  DealStatus,
};
