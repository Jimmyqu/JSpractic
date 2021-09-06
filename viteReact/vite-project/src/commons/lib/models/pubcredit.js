// 白条还款子订单

/**
 * 子订单状态
 */
export const DealStatus = {
  DEAL_START: {
    key: 0,
    value: '订单开始',
  },
  DEAL_REPAYMENTS: {
    key: 1,
    value: '还款中',
  },
  DEAL_CANCEL: {
    key: 3,
    value: '已取消',
  },
  DEAL_COMPLETE: {
    key: 88,
    value: '交易成功',
  },
};

export default {
  DealStatus,
};
