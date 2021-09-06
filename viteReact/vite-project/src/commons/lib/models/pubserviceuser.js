import RelTypes from './reltypes';

// 服务人员子订单

/**
 * 子订单状态
 */
export const DealStatus = {
  DEAL_START: {
    key: 0,
    value: '订单开始',
  },
  DEAL_WAIT: {
    key: 1,
    value: '预订中',
  },
  DEAL_PASS: {
    key: 2,
    value: '已预订',
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

/**
 * 认证流程类型
 */
export const CertFlowNodes = {
  Audit: {
    key: 1,
    value: '审核',
  },
  Pay: {
    key: 2,
    value: '支付',
  },
  AutoPublish: {
    key: 3,
    value: '系统证书颁发',
  },
  ManualPublish: {
    key: 4,
    value: '手动上传证书',
  },
};

/**
 * 认证流程状态
 */
export const CertCfgStates = {
  Enable: {
    key: 0,
    value: '可用',
  },
  Disable: {
    key: 1,
    value: '禁用',
  },
};

/**
 * 认证类型
 */
export const CertTypes = {
  Profession: {
    ...RelTypes.PROFESSION,
  },
  Match: {
    ...RelTypes.MATCH,
  },
};

/**
 * 认证类型
 */
export const CertTemplateType = {
  Img: {
    key: 1,
    value: '图片模板',
  },
  Table: {
    key: 2,
    value: '表格模板',
  },
};

/**
 * 认证编号生成方式
 */
export const CertNumberRule = {
  Auto: {
    key: 0,
    value: '自动生成',
  },
  Rule: {
    key: 1,
    value: '按规则生成',
  },
};

/**
 * 显示方式
 */
export const CertShowMode = {
  Show: {
    key: 1,
    value: '显示',
  },
  Hidden: {
    key: 2,
    value: '个人隐藏',
  },
  GlobalHidden: {
    key: 3,
    value: '公众隐藏',
  },
};

/**
 * 审核流程节点
 */
export const AuditNodeTypes = {
  Accept: {
    key: 0,
    value: '通过',
  },
  Reject: {
    key: 1,
    value: '驳回',
  },
  RejectReview: {
    key: 2,
    value: '驳回重审',
  },
  RejectClose: {
    key: 3,
    value: '驳回禁用',
  },
};

/**
 * 认证流程状态
 */
export const CertExtStates = {
  CertStart: {
    key: 0,
    value: '认证开始',
  },
  PayWait: {
    key: 1,
    value: '支付中',
  },
  Cancel: {
    key: 2,
    value: '已取消',
  },
  InEdit: {
    key: 3,
    value: '编辑中',
  },
  InAudit: {
    key: 4,
    value: '审核中',
  },
  Disable: {
    key: 5,
    value: '禁用',
  },
  Complete: {
    key: 88,
    value: '已完成',
  },
};

/**
 * 用户类型
 */
export const UserTypes = {
  SYS_USER: {
    key: 1,
    value: '系统用户',
  },
  PUBACCOUNT_USER: {
    key: 2,
    value: '会员用户',
  },
};

export default {
  DealStatus,
  CertFlowNodes,
  CertCfgStates,
  AuditNodeTypes,
  CertExtStates,
  UserTypes,
  CertNumberRule,
  CertShowMode,
  CertTypes,
  CertTemplateType,
};
