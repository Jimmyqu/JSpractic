import { AnalysisCalcModeTypes } from './pubservice';
// 统计

/**
 * 用户行为
 */
export const ActionTypes = {
  DEFAULT: {
    key: 0,
    value: '默认',
  },
  DEAL_SUMMARY: {
    key: 100,
    value: '合计',
  },
  DEAL_ADD: {
    key: 101,
    value: '添加订单', // 支付
  },
  DEAL_UPDATE: {
    key: 102,
    value: '更新订单',
  },
  DEAL_CHECKOUT: {
    key: 103,
    value: '结算订单',
  },
  DEAL_CANCEL: {
    key: 104,
    value: '取消订单',
  },
  DEAL_DELETE: {
    key: 105,
    value: '删除订单',
  },
  DEAL_RECOVERY: {
    key: 106,
    value: '恢复订单',
  },
  DEAL_SIGN: {
    key: 107,
    value: '签到',
  },
  DEAL_TICKET_CHECK: {
    key: 108,
    value: '验票',
  },
  DEAL_UPDATE_MESSAGE: {
    key: 109,
    value: '更新消息信息',
  },
  PUBACCOUNT_RECHARGE: {
    key: 201,
    value: '充值',
  },
  PUBACCOUNT_REFUND: {
    key: 202,
    value: '退款',
  },
  PUBACCOUNT_CONSUME: {
    key: 203,
    value: '消费',
  },
  PUBACCOUNT_RECHARGE_WECHAT: {
    key: 204,
    value: '微信转入',
  },
  PUBACCOUNT_RECHARGE_ZFB: {
    key: 205,
    value: '支付宝转入',
  },
  PUBACCOUNT_WITHDRAW: {
    key: 206,
    value: '账户提现',
  },
  PUBSERVICEACCOUNT_WITHDRAW: {
    key: 207,
    value: '服务折现',
  },
  PUBACCOUNT_CREDIT_REPAYMENT: {
    key: 208,
    value: '白条还款',
  },
  SCANQ: {
    key: 301,
    value: '扫码收款',
  },
  CODE_SCANQ: {
    key: 302,
    value: '条码扫码收款',
  },
  PUBSERVICE_ADD: {
    key: 401,
    value: '会员服务-添加',
  },
  PUBSERVICE_DELETE: {
    key: 402,
    value: '会员服务-删除',
  },
  ITEM_STOCKIN: {
    key: 501,
    value: '进货',
  },
  ITEM_STOCKOUT: {
    key: 502,
    value: '出货',
  },
  ITEM_DEALRETURN: {
    key: 503,
    value: '退货',
  },
  ITEM_BREAKAGE: {
    key: 504,
    value: '报损',
  },
  ITEM_CARRYIN: {
    key: 505,
    value: '调拔入库',
  },
  ITEM_CARRYOUT: {
    key: 506,
    value: '调拔出库',
  },
  COURSE_ADD: {
    key: 601,
    value: '课程-增加',
  },
  COURSE_SUB: {
    key: 602,
    value: '课程-减少',
  },
  SINGUP_ADD: {
    key: 701,
    value: '增加名额',
  },
  SINGUP_SUB: {
    key: 702,
    value: '减少名额',
  },
  PUBLIC_CREDIT_ADD: {
    key: 801,
    value: '增加额度',
  },
  PUBLIC_CREDIT_SUB: {
    key: 802,
    value: '减少额度',
  },
  TICKET_ADD: {
    key: 901,
    value: '增加数量',
  },
  TICKET_SUB: {
    key: 902,
    value: '减少数量',
  },
  PUBACCOUNT_FEE_ADD: {
    key: 1001,
    value: '增加积分',
  },
  PUBACCOUNT_FEE_SUB: {
    key: 1002,
    value: '减少积分',
  },
};

/**
 * 显示方式
 */
export const DisplayTypes = {
  Date: {
    key: 0,
    value: '按日期',
  },
  Merged: {
    key: 1,
    value: '合并显示',
  },
};

export default {
  ActionTypes,
  DisplayTypes,
  AnalysisCalcModeTypes,
};
