import { EventTypes } from './pubsignup';
import { DeclareNodeDataTypes as NodeDataTypes } from './activity';

/**
 *资质审核状态
 */
export const ProjectAuditStates = {
  Wait: {
    key: -1,
    value: '待审核',
  },
  Approved: {
    key: 0,
    value: '审核通过',
  },
  Rejected: {
    key: 1,
    value: '驳回',
  },
  Cancel: {
    key: 4,
    value: '取消',
  },
};

/**
 * 活动类型
 */
export const ExerciseTypes = EventTypes;

/**
 *活动审核状态
 */
export const CheckStatus = {
  Approved: {
    key: 0,
    value: '审核通过',
  },
  Wait: {
    key: 1,
    value: '待审核',
  },
  Rejected: {
    key: 2,
    value: '未通过',
  },
  Disabled: {
    key: 4,
    value: '禁用',
  },
};

/**
 *审核节点状态，只有审核节点有意义
 */
export const DeclareNodeAuditStatus = {
  Wait: {
    key: -1,
    value: '待审核',
  },
  Pass: {
    key: 0,
    value: '审核通过',
  },
  Rejected: {
    key: 1,
    value: '驳回', // 驳回本轮
  },
  Retrail: {
    key: 2,
    value: '驳回重填', // 驳回到基础资料
  },
  Disabled: {
    key: 3,
    value: '驳回禁用', // 驳回后不可编辑
  },
};

// 节点类型
export const DeclareNodeTypes = {
  DATA: {
    key: 1,
    value: '资料',
  },
  AUDIT_SELF: {
    key: 2,
    value: '本单位审核',
  },
  AUDIT_REQ: {
    key: 3,
    value: '申请单位审核',
  },
  BASIC: {
    key: 100,
    value: '基础信息',
  },
};

// 资料节点类型
export const DeclareNodeDataTypes = {
  ...NodeDataTypes, // 1，相册 2，文件 4，富文本
  VIDEO: {
    key: 3,
    value: '视频',
  },
  // 后台处理图片与相册略有不同，界面目前一视同仁
  IMAGE: {
    key: 5,
    value: '图片',
  },
};

export default {
  ProjectAuditStates,
  ExerciseTypes,
  CheckStatus,
  DeclareNodeTypes,
  DeclareNodeDataTypes,
  DeclareNodeAuditStatus,
};
