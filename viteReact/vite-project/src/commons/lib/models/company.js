// 单位

/**
 * 可用状态
 */
export const CompanyStatus = {
  Enable: {
    key: 0,
    value: '可用',
  },
  Disabled: {
    key: 1,
    value: '禁用',
  },
};

/**
 * 证照类型
 */
export const IdCardTypes = {
  AllInOne: {
    key: 1,
    value: '三合一',
  },
  BuzLicense: {
    key: 2,
    value: '营业执照',
  },
  OrgRegCodeLicense: {
    key: 3,
    value: '组织机构代码证',
  },
};

/**
 * 审核状态
 */
export const AuditStatus = {
  WaitSubmit: {
    key: 0,
    value: '待提交资料',
  },
  Success: {
    key: 1,
    value: '已通过',
  },
  Failed: {
    key: 2,
    value: '未通过',
  },
  Wait: {
    key: 3,
    value: '待审核',
  },
  Back: {
    key: 4,
    value: '被驳回',
  },
};

export default {
  CompanyStatus,
  IdCardTypes,
  AuditStatus,
};
