// 会员服务子订单

/**
 * 子订单状态
 */
export const DealStatus = {
  DEAL_START: {
    key: 0,
    value: '订单开始',
  },
  DEAL_PASS: {
    key: 1,
    value: '已购买',
  },
  DEAL_CANCEL: {
    key: 2,
    value: '已取消',
  },
  DEAL_WAIT: {
    key: 3,
    value: '购买中',
  },
  DEAL_COMPLETE: {
    key: 88,
    value: '订单完成',
  },
};

/**
 * 有效期类型
 */
export const ServiceTypes = {
  UNLIMITEDVALIDITY: {
    key: 0,
    value: '不限有效期',
  },
  DYNAMICINVISIBLE: {
    key: 1,
    value: '动态有效期',
  },
  FIXATIONINVISIBLE: {
    key: 2,
    value: '固定有效期',
  },
};

/**
 * 服务券类型
 */
export const ServiceTagTypes = {
  UNIT: {
    key: 0,
    value: '无',
  },
  FREETICKET: {
    key: 1,
    value: '免费券',
  },
  PREFERENTIALTICKET: {
    key: 2,
    value: '优惠券',
  },
  KIMSTICKET: {
    key: 3,
    value: '代金券',
  },
  SERVECARD: {
    key: 4,
    value: '会员卡',
  },
  MEMBERSHIPCARD: {
    key: 5,
    value: '服务卡',
  },
  COACHCARD: {
    key: 6,
    value: '教练卡',
  },
  NEXTCARD: {
    key: 7,
    value: '次卡',
  },
  DURATIONCARD: {
    key: 8,
    value: '时长卡',
  },
  DISCOUNTCARD: {
    key: 9,
    value: '储值卡',
  },
  STOREDVALUECARD: {
    key: 10,
    value: '优惠卡',
  },
  COURSE_CARD: {
    key: 11,
    value: '课程卡',
  },
  TRAINING_COURSE: {
    key: 12,
    value: '培训班',
  },
  PACKAGE_TICKET: {
    key: 13,
    value: '套票',
  },
  ACTIVITY_CARD: {
    key: 14,
    value: '活动卡',
  },
  DISCOUNT_CARD: {
    key: 15,
    value: '折扣卡',
  },
  MONTHLY_CARD: {
    key: 16,
    value: '月卡',
  },
  SEASON_CARD: {
    key: 17,
    value: '季卡',
  },
  YEAR_CARD: {
    key: 18,
    value: '年卡',
  },
  SWIM_TRAINING_COURSE: {
    key: 19,
    value: '游泳培训',
  },
  GROUP_TICKET: {
    key: 20,
    value: '团体票',
  },
  COUPONS: {
    key: 21,
    value: '消费券',
  },
  ALL_IN_ONE: {
    key: 22,
    value: '一卡通',
  },
};

/**
 * 服务转赠状态
 */
export const ServiceGiveStatus = {
  No: {
    key: 0,
    value: '不可转增',
  },
  Once: {
    key: 1,
    value: '单次转赠',
  },
  ManyTimes: {
    key: 2,
    value: '多次转赠',
  },
};

/**
 * 服务可用状态
 */
export const ServiceStatus = {
  Enable: {
    key: 0,
    value: '可用',
  },
  Disable: {
    key: 1,
    value: '禁用',
  },
  USED: {
    key: 2,
    value: '已用完',
  },
  FREEZE: {
    key: 12,
    value: '已冻结',
  },
  WITHDRAW: {
    key: 13,
    value: '已折现',
  },
};

/**
 * 服务激活状态
 */
export const ServiceActiveStatus = {
  NotApplicable: {
    key: 0,
    value: '无需激活',
  },
  Activated: {
    key: 1,
    value: '已激活',
  },
  Unactivated: {
    key: 2,
    value: '未激活',
  },
};

/**
 * 服务内容类型
 */
export const PubServiceTypes = {
  DISCOUNT: {
    key: 1,
    value: '折扣',
  },
  NUMBER: {
    key: 2,
    value: '次数',
  },
  PREFERENTIAL: {
    key: 3,
    value: '优惠',
  },
  PAY_ONLY: {
    key: 4,
    value: '仅付',
  },
};

/**
 * 服务项目类型
 */
export const PubServiceObjTypes = {
  User: {
    key: 1,
    value: '服务人员',
  },
  Item: {
    key: 6,
    value: '商品',
  },
  Platform: {
    key: 37,
    value: '场地',
  },
  Exerciselist: {
    key: 94,
    value: '赛事活动培训影剧',
  },
  Course: {
    key: 150,
    value: '课程',
  },
};

/**
 * 服务内容单位
 */
export const PubServiceUnitTypes = {
  EVERYTIME: {
    key: 1,
    value: '次',
  },
  PERHOURS: {
    key: 2,
    value: '小时',
  },
  CLASS_TIME: {
    key: 3,
    value: '课时',
  },
  PER_PIECE: {
    key: 4,
    value: '张',
  },
  PIECE: {
    key: 5,
    value: '件',
  },
};

/**
 * 服务叠加类型
 */
export const PubServiceCalcTypes = {
  YES_MANY: {
    key: 0,
    value: '相加并能多次使用',
  },
  YES_ONE: {
    key: 1,
    value: '相加且只能使用一次',
  },
  NO_MANY: {
    key: 2,
    value: '不相加并能多次使用',
  },
  NO_ONE: {
    key: 3,
    value: '不相加且只能使用一次',
  },
};

/**
 * 服务使用方式
 */
export const PubServiceUseModeTypes = {
  AND: {
    key: 0,
    value: '服务值统一使用[和]',
  },
  OR: {
    key: 1,
    value: '服务值单一使用[或]',
  },
};

/**
 * 服务统计计费方式
 */
export const AnalysisCalcModeTypes = {
  SERVICE: {
    key: 1,
    value: '计入服务',
  },
  BUSINESS: {
    key: 2,
    value: '计入业务',
  },
};

/**
 * 服务统计计费状态
 */
export const AnalysisCalcStatus = {
  NotYet: {
    key: 1,
    value: '未计费',
  },
  Done: {
    key: 0,
    value: '已计费',
  },
};

/**
 * 服务统计记入方式
 */
export const AnalysisWriteModeTypes = {
  BEFORE_CONSUME: {
    key: 0,
    value: '消费时记入',
  },
  WhenBuying: {
    key: 1,
    value: '购买时记入',
  },
  AFTER_CONSUME: {
    key: 2,
    value: '消费后记入',
  },
};

/**
 * 消费后结算方式
 */
export const AnalysisCheckouteModeTypes = {
  CONSUME_END_WRITE: {
    key: 0,
    value: '服务消费完成后记入',
  },
  SCHEDULE_WRITE: {
    key: 1,
    value: '定时记入',
  },
  MANUAL_WRITE: {
    key: 2,
    value: '人工记入',
  },
};

/**
 * 服务卡风格定义
 */
export const CouponStyleConfigs = {
  [ServiceTagTypes.FREETICKET.key]: {
    labelBgColor: '#EE1C25',
    contentBgColor: '#fde8e9',
  },
  [ServiceTagTypes.MEMBERSHIPCARD.key]: {
    labelBgColor: '#3AB449',
    contentBgColor: '#ebf7ec',
  },
  [ServiceTagTypes.DISCOUNTCARD.key]: {
    labelBgColor: '#922690',
    contentBgColor: '#f4e9f3',
  },
  [ServiceTagTypes.PREFERENTIALTICKET.key]: {
    labelBgColor: '#F26621',
    contentBgColor: '#fdefe8',
  },
  [ServiceTagTypes.COACHCARD.key]: {
    labelBgColor: '#00A99D',
    contentBgColor: '#e5f6f5',
  },
  [ServiceTagTypes.STOREDVALUECARD.key]: {
    labelBgColor: '#ED008C',
    contentBgColor: '#fde5f3',
  },
  [ServiceTagTypes.KIMSTICKET.key]: {
    labelBgColor: '#F7941E',
    contentBgColor: '#fef4e8',
  },
  [ServiceTagTypes.NEXTCARD.key]: {
    labelBgColor: '#00AEEF',
    contentBgColor: '#e5f6fd',
  },
  [ServiceTagTypes.SERVECARD.key]: {
    labelBgColor: '#FFC001',
    contentBgColor: '#fff8e5',
  },
  [ServiceTagTypes.DURATIONCARD.key]: {
    labelBgColor: '#0071BC',
    contentBgColor: '#e5f0f8',
  },
  [ServiceTagTypes.UNIT.key]: {
    labelBgColor: '#ffffff',
    contentBgColor: '#f9f9f9',
  },
  [ServiceTagTypes.ACTIVITY_CARD.key]: {
    labelBgColor: '#8ec73f',
    contentBgColor: '#f3f9eb',
  },
  [ServiceTagTypes.COURSE_CARD.key]: {
    labelBgColor: '#2e3193',
    contentBgColor: '#eaeaf4',
  },
  [ServiceTagTypes.TRAINING_COURSE.key]: {
    labelBgColor: '#630460',
    contentBgColor: '#efe5ef',
  },
  [ServiceTagTypes.DISCOUNT_CARD.key]: {
    labelBgColor: '#ee155b',
    contentBgColor: '#fde7ee',
  },
  [ServiceTagTypes.PACKAGE_TICKET.key]: {
    labelBgColor: '#c69c6e',
    contentBgColor: '#ffffe5',
  },
  [ServiceTagTypes.MONTHLY_CARD.key]: {
    labelBgColor: '#fe6058',
    contentBgColor: '#ffffe5',
  },
  [ServiceTagTypes.SEASON_CARD.key]: {
    labelBgColor: '#febe2e',
    contentBgColor: '#ffffe5',
  },
  [ServiceTagTypes.YEAR_CARD.key]: {
    labelBgColor: '#27c940',
    contentBgColor: '#ffffe5',
  },
  [ServiceTagTypes.SWIM_TRAINING_COURSE.key]: {
    labelBgColor: '#0099BC',
    contentBgColor: '#e5f4f8',
  },
  [ServiceTagTypes.GROUP_TICKET.key]: {
    labelBgColor: '#ff00ff',
    contentBgColor: '#ffe5ff',
  },
  [ServiceTagTypes.COUPONS.key]: {
    labelBgColor: '#f26c4f',
    contentBgColor: '#fdf0ed',
  },
  [ServiceTagTypes.ALL_IN_ONE.key]: {
    labelBgColor: '#c69e6e',
    contentBgColor: '#f9f5f0',
  },
};

export const DefaultCouponStyleConfig = {
  labelBgColor: '#cccccc',
  contentBgColor: '#f9f9f9',
};

/**
 * 会员服务流水日志操作类型
 */
export const PubServiceflowTypes = {
  BUY_SERVICE: {
    key: 1,
    value: '购买服务',
  },
  CANCEL_SERVICE: {
    key: 2,
    value: '取消服务订单',
  },
  PAY_ORDER: {
    key: 3,
    value: '支付订单',
  },
  CANCEL_ORDER: {
    key: 4,
    value: '取消订单',
  },
  VALID_DATA: {
    key: 5,
    value: '调整状态有效期',
  },
  DELAY: {
    key: 6,
    value: '服务延期',
  },
  FROZEN: {
    key: 7,
    value: '冻结',
  },
  UNFROZEN: {
    key: 8,
    value: '解冻',
  },
  MAKING_CARD: {
    key: 9,
    value: '制卡',
  },
  WITHDRAW: {
    key: 10,
    value: '提现',
  },
  GIVE: {
    key: 11,
    value: '转赠',
  },
  REVICE: {
    key: 12,
    value: '领取',
  },
  CANCEL: {
    key: 13,
    value: '撤销',
  },
  ANALYSIS_CALC: {
    key: 14,
    value: '计费',
  },
  Enable: {
    key: 15,
    value: '启用',
  },
  Disable: {
    key: 16,
    value: '禁用',
  },
};

/**
 * 会员服务制卡状态
 */
export const PubServicePrintCardStatus = {
  NotYet: {
    key: 0,
    value: '未制卡',
  },
  Printing: {
    key: 1,
    value: '制卡中',
  },
  Done: {
    key: 2,
    value: '已制卡',
  },
};

export default {
  DealStatus,
  ServiceTypes,
  ServiceTagTypes,
  ServiceStatus,
  ServiceGiveStatus,
  PubServiceTypes,
  PubServiceObjTypes,
  PubServiceUnitTypes,
  PubServiceCalcTypes,
  AnalysisWriteModeTypes,
  AnalysisCheckouteModeTypes,
  PubServiceUseModeTypes,
  AnalysisCalcModeTypes,
  AnalysisCalcStatus,
  CouponStyleConfigs,
  DefaultCouponStyleConfig,
  PubServiceflowTypes,
  PubServicePrintCardStatus,
  ServiceActiveStatus,
};
