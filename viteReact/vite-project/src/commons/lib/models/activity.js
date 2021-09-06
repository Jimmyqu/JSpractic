// 活动申报

/**
 *审核状态
 */
export const AuditStates = {
  NeedNotApprove: {
    key: 0,
    value: '无需审核',
  },
  Yes: {
    key: 1,
    value: '已通过',
  },
  No: {
    key: 2,
    value: '未通过',
  },
  Wait: {
    key: 3,
    value: '待审核',
  },
};

/**
 * 申报状态
 */
export const DeclareResultStates = {
  Wait: {
    key: 0,
    value: '申报中',
  },
  Success: {
    key: 1,
    value: '已通过',
  },
  Failed: {
    key: 2,
    value: '未通过',
  },
};

/**
 * 节点类型
 */
export const DeclareNodeTypes = {
  DATA: {
    key: 1,
    value: '资料',
  },
  AUDIT: {
    key: 2,
    value: '审核',
  },
  BASIC: {
    key: 3,
    value: '基础信息',
  },
  // RICH_DATA: {
  //   key: 4,
  //   value: '富文本资料',
  // },
};

/**
 * 节点类型
 */
export const DeclareNodeDataTypes = {
  ALBUM: {
    key: 1,
    value: '相册',
  },
  FILE: {
    key: 2,
    value: '文件',
  },
  // VIDEO: {
  //   key: 3,
  //   value: '视频',
  // },
  RICH_TEXT: {
    key: 4,
    value: '富文本资料',
  },
};

/**
 * 行业类型
 */
export const IndustryTypes = {
  sport: {
    key: 1,
    value: '体育',
  },
  culture: {
    key: 2,
    value: '文化',
  },
  travel: {
    // 暂不使用
    key: 3,
    value: '旅游',
  },
};

/**
 * 补充资料类型
 */
export const ExtensionsFunctionTypes = {
  Protocol: {
    key: 1,
    value: '协议',
  },
  Invoice: {
    key: 2,
    value: '发票',
  },
  AllocateFund: {
    key: 3,
    value: '拨款',
  },
};

export default {
  AuditStates,
  DeclareResultStates,
  DeclareNodeTypes,
  DeclareNodeDataTypes,
  IndustryTypes,
  ExtensionsFunctionTypes,
};
