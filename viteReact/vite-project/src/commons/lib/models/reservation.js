/**
 *预约状态
 */
export const ReservationStates = {
  Cancel: {
    key: -1,
    value: '已取消',
  },
  Booked: {
    key: 0,
    value: '已预约',
  },
  Verify: {
    key: 1,
    value: '未确认',
  },
  Victor: {
    key: 2,
    value: '已确认',
  },
  Lose: {
    key: 3,
    value: '未选中',
  },
};

/**
 *下发状态
 */
export const SendStatus = {
  Fail: {
    key: -1,
    value: '下发失败',
  },
  Waiting: {
    key: 0,
    value: '待下发',
  },
  Success: {
    key: 1,
    value: '已下发',
  },
};

export default {
  ReservationStates,
  SendStatus,
};
