/**
 * 库存操作类型
 */
export const StockTypes = {
  STOCKIN: {
    key: 0,
    value: '入库',
  },
  STOCKOUT: {
    key: 1,
    value: '出库',
  },
  DEALRETURN: {
    key: 2,
    value: '退货',
  },
  BREAKAGE: {
    key: 3,
    value: '报损',
  },
  CARRYIN: {
    key: 4,
    value: '调拔入库',
  },
  CARRYOUT: {
    key: 5,
    value: '调拔出库',
  },
  INVENTORY_PROFIT: {
    key: 6,
    value: '盘盈',
  },
  INVENTORY_LOSS: {
    key: 7,
    value: '盘亏',
  },
  CORRECT_STOCK: {
    key: 8,
    value: '更正库存',
  },
};

/**
 * 库存状态
 */
export const StockStatus = {
  Enable: {
    key: 0,
    value: '可用',
  },
  Disable: {
    key: 1,
    value: '禁用',
  },
};

export default {
  StockTypes,
  StockStatus,
};
