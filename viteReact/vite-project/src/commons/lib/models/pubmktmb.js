// 分销子订单

/**
 * 子订单状态
 */
export const DealStatus = {
  DEAL_START: {
    key: 0,
    value: '订单开始',
  },
  DEAL_SALES: {
    key: 1,
    value: '销售中',
  },
  DEAL_CANCEL: {
    key: 2,
    value: '已取消',
  },
  DEAL_COMPLETE: {
    key: 88,
    value: '交易完成',
  },
};

/**
 * 分销分成状态
 */
export const PerformanceReportStatus = {
  NOT_DIVIDED_INTO: {
    key: 0,
    value: '未分成',
  },
  ALREADY_DIVIDED_INTO: {
    key: 1,
    value: '已分成',
  },
};

/**
 * 分成方式
 */
export const PerformanceModeTypes = {
  NUMBER_MONEY: {
    key: 1,
    value: '按数量提成金额',
  },
  PERCENTAGE: {
    key: 2,
    value: '按成交价百分比',
  },
};

export default {
  DealStatus,
  PerformanceReportStatus,
  PerformanceModeTypes,
};
