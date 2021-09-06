// 二维码数据管理集中模块

/**
 * 二维码行为（服务于什么作用）
 */
export const QrCodeMatrixActions = {
  CheckTicket: {
    key: 100,
    value: '验证活动票务',
  },
  CheckSPTicket: {
    key: 101,
    value: '验证体育票务',
  },
  FetchGoods: {
    key: 102,
    value: '扫码选择商品',
  },
  CourseClassSign: {
    key: 103,
    value: '人员课程扫码签到签退',
  },
  CheckPlatform: {
    key: 104,
    value: '验证场地',
  },
};

export default {
  QrCodeMatrixActions,
};
