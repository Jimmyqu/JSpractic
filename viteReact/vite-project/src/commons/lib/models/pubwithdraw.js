// 余额提现/服务折现子订单

/**
 * 子订单状态
 */
export const DealStatus = {
  DEAL_START: {
    key: 0,
    value: '订单开始',
  },
  DEAL_WITHDRAW: {
    key: 1,
    value: '提现中',
  },
  DEAL_WITHDRAW_COMPLETED: {
    key: 2,
    value: '已提现',
  },
};

/**
 * 提现类型
 */
export const WithdrawTypes = {
  PUBLIC_ACCOUNT: {
    key: 1,
    value: '账户提现',
  },
  PUBLIC_SERVICE_ACCOUNT: {
    key: 2,
    value: '会员服务折现',
  },
};

export default {
  DealStatus,
  WithdrawTypes,
};
