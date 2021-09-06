// 账户充值子订单

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
    value: '充值中',
  },
  DEAL_RECHARGE_COMPLETED: {
    key: 2,
    value: '已充值',
  },
  DEAL_REFUND: {
    key: 3,
    value: '退款中',
  },
  DEAL_REFUND_COMPLETED: {
    key: 4,
    value: '已退款',
  },
  DEAL_CANCEL: {
    key: 5,
    value: '已取消',
  },
};

export default {
  DealStatus,
};
