// 发票

/**
 * 发票抬头类型
 */
export const InvoiceIssueTypes = {
  ENTERPRISE: {
    key: 1,
    value: '单位',
  },
  PERSONAL: {
    key: 2,
    value: '个人',
  },
};

/**
 * 开票方式
 */
export const InvoiceModeTypes = {
  PAPER: {
    key: 0,
    value: '纸质',
  },
  ELECTRONIC: {
    key: 1,
    value: '电子',
  },
};

/**
 * 发票类型
 */
export const InvoiceTypes = {
  GENERAL_INVOICE: {
    key: 1,
    value: '增值税普通发票',
  },
  SPECIAL_INVOICE: {
    key: 2,
    value: '增值税专用发票',
  },
  OTHER: {
    key: 99,
    value: '其他',
  },
};

/**
 * 开票状态
 */
export const InvoiceStatus = {
  SUCCESS: {
    key: 0,
    value: '已开票',
  },
  CANCEL: {
    key: 1,
    value: '作废',
  },
  STAY_AUDIT: {
    key: 2,
    value: '待审核',
  },
  REVERSED: {
    key: 3,
    value: '已撤销',
  },
  INVOICE_FAIL: {
    key: 4,
    value: '审核未通过',
  },
};

/**
 * 发票接收方式
 */
export const InvoiceReceiveModeTypes = {
  EXPRESS: {
    key: 1,
    value: '快递',
  },
  DELIVERY: {
    key: 2,
    value: '自取',
  },
};

export default {
  InvoiceIssueTypes,
  InvoiceModeTypes,
  InvoiceTypes,
  InvoiceStatus,
  InvoiceReceiveModeTypes,
};
