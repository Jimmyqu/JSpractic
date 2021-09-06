// 消息
import { PubAccountTypes } from './pubuser';

/**
 * 发送状态
 */
export const SendStatus = {
  WAIT: {
    key: 1,
    value: '待发送',
  },
  SENDING: {
    key: 2,
    value: '发送中',
  },
  ALREADY_SEND: {
    key: 3,
    value: '已发送',
  },
  SEND_FAIL: {
    key: 4,
    value: '发送失败',
  },
  CANCEL_SEND: {
    key: 5,
    value: '取消发送',
  },
  PART_FAIL: {
    key: 6,
    value: '部分失败',
  },
};

/**
 * 提交状态
 */
export const AuthStatus = {
  Editing: {
    key: 0,
    value: '编辑中',
  },
  Examineing: {
    key: 1,
    value: '审核中',
  },
  Passed: {
    key: 2,
    value: '通过',
  },
  Rejected: {
    key: 3,
    value: '驳回',
  },
  NoPass: {
    key: 4,
    value: '不通过',
  },
};

/**
 * 下发类型
 */
export const PushType = {
  // StationMsg: {
  //   key: 1,
  //   value: '站内消息群发',
  // },
  ShortMessage: {
    key: 2,
    value: '短信群发',
  },
  WeChat: {
    key: 3,
    value: '微信群发',
  },
};

/**
 * 下发方式
 */
export const PushMode = {
  // Timing: {
  //   key: 1,
  //   value: '定时下发',
  // },
  Immediate: {
    key: 2,
    value: '即时下发',
  },
};

/**
 * 会员类型
 */
export const MsgAccountType = {
  NoPlatform: {
    key: -1,
    value: '非平台用户',
  },
  ...PubAccountTypes,
};

/**
 * 微信短信消息发送状态
 */
export const WechatSendStatus = {
  SUCCESS: {
    key: 0,
    value: '发送成功',
  },
  FAIL: {
    key: -1,
    value: '发送失败',
  },
};

/**
 * 号码来源
 */
export const UserSource = {
  Excel: {
    key: 0,
    value: '文件导入',
  },
  PubAccount: {
    key: 1,
    value: '选择会员',
  },
  Hand: {
    key: 2,
    value: '手动导入',
  },
};

export default {
  SendStatus,
  AuthStatus,
  PushType,
  PushMode,
  MsgAccountType,
  WechatSendStatus,
  UserSource,
};
