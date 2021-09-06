/**
 * 报纸类型
 */
export const PaperTypes = {
  PAPER: {
    key: 1,
    value: '电子报',
  },
  BOOK: {
    key: 2,
    value: '电子书',
  },
};

/**
 * 报纸配置
 */
export const PaperConfigurations = {
  BG_MUSIC: {
    key: 10,
    value: '背景音乐',
  },
  EDITION: {
    key: 21,
    value: '报纸版次',
  },
  VERSION_NAME: {
    key: 22,
    value: '报纸版名',
  },
  COLUMN: {
    key: 23,
    value: '报纸栏目',
  },
  DISPLAY: {
    key: 24,
    value: '报纸显示方式',
  },
};

/**
 * 报纸状态
 */
export const NewspaperEditStatus = {
  EDITING: {
    key: 0,
    value: '编辑中',
  },
  PUBLISHED: {
    key: 1,
    value: '已发布',
  },
};

/**
 * 版面跳转链接类型
 */
export const LayoutUrlType = {
  DETAIL: {
    key: 0,
    value: '跳转正文',
  },
  OUTSIDE: {
    key: 1,
    value: '跳转外链接',
  },
  PAGE: {
    key: 2,
    value: '页面',
  },
};

/**
 * 版面状态
 */
export const LayoutEditStatus = {
  EDITING: {
    key: 0,
    value: '编辑中',
  },
  CANUSED: {
    key: 1,
    value: '可用',
  },
};

export default {
  PaperTypes,
  PaperConfigurations,
  NewspaperEditStatus,
  LayoutUrlType,
  LayoutEditStatus,
};
