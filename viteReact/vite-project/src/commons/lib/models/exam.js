/**
 * 认证人员角色
 */
export const ExamAuthRole = {
  OTHER: {
    key: 0,
    value: '其它',
  },
  STUDENT: {
    key: 1,
    value: '学生',
  },
  TEACHER: {
    key: 2,
    value: '老师',
  },
};

/**
 * 考试模式
 */
export const PracticeTypes = {
  ORDER: {
    key: 1,
    value: '顺序练习',
  },
  RANDOM: {
    key: 2,
    value: '随机练习',
  },
  SIMULATE: {
    key: 6,
    value: '模拟考试',
  },
  FORMAL: {
    key: 7,
    value: '正式考试',
  },
  MYWRONG: {
    key: 8,
    value: '我的错题',
  },
  MANAGE: {
    key: 9,
    value: '试卷阅览',
  },
};

/**
 * 考题类型
 */
export const QuestionTypes = {
  SINGLE: {
    key: 1,
    value: '单选',
  },
  MULTIPLY: {
    key: 2,
    value: '多选',
  },
  JUDGE: {
    key: 3,
    value: '判断',
  },
};

/**
 * 绑班方式
 */
export const ExamBindTypes = {
  System: {
    key: 1,
    value: '系统设置', // 手动选择
  },
  Auto: {
    key: 2,
    value: '自动绑定',
  },
};

export default {
  ExamAuthRole,
  PracticeTypes,
  QuestionTypes,
  ExamBindTypes,
};
