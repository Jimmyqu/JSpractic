// 投稿、报料

/**
 *投稿、报料公共状态
 */
const commonStatus = {
  ADPOTED: {
    key: 1,
    value: '已采用',
  },
  UNADPOTED: {
    key: 2,
    value: '未采用',
  },
  WITHDRAWN: {
    key: 3,
    value: '已撤销',
  },
};

/**
 *投稿状态
 */
export const ContributeStates = {
  ...commonStatus,
  SUBMITED: {
    key: 0,
    value: '已投稿',
  },
};

/**
 *报料状态
 */
export const ReleaseStatus = {
  ...commonStatus,
  RELEASED: {
    key: 0,
    value: '已报料',
  },
};

export default {
  ContributeStates,
  ReleaseStatus,
};
