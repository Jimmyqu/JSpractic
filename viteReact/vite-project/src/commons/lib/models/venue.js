// 场馆，项目，行业，职业

/**
 * 体育场馆的项目
 */
export const ProfessionTypes = {
  SPORTS_TENNIS: {
    key: 200_001,
    value: '网球',
  },
  SPORTS_BADMINTON: {
    key: 200_002,
    value: '羽毛球',
  },
  SPORTS_PINGPONG: {
    key: 200_003,
    value: '乒乓球',
  },
  SPORTS_SNOOKER: {
    key: 200_004,
    value: '台球',
  },
  SPORTS_FOOTBALL: {
    key: 200_011,
    value: '足球',
  },
  SPORTS_BASKETBALL: {
    key: 200_012,
    value: '篮球',
  },
  SPORTS_SWIMING: {
    key: 200_013,
    value: '游泳',
  },
  SPORTS_GOLF: {
    key: 200_014,
    value: '高尔夫',
  },
  SPORTS_VOLLEYBALL: {
    key: 200_015,
    value: '排球',
  },
  SPORTS_BOWL: {
    key: 200_016,
    value: '保龄球',
  },
  SPORTS_FENCING: {
    key: 200_017,
    value: '击剑',
  },
  SPORTS_TRAMPOLINE: {
    key: 200_021,
    value: '蹦床',
  },
  SPORTS_TAEKWONDO: {
    key: 200_022,
    value: '跆拳道',
  },
  SPORTS_RUN: {
    key: 200_023,
    value: '跑步',
  },
  SPORTS_OTHER: {
    key: 200_024,
    value: '其他',
  },
  SPORTS_MULTIPLEFUNCTION: {
    key: 200_025,
    value: '多功能',
  },
  SPORTS_CYCLING: {
    key: 200_026,
    value: '骑行',
  },
  SPORTS_BODYBUILDING: {
    key: 200_027,
    value: '健身',
  },
  SPORTS_DANCE: {
    key: 200_028,
    value: '舞蹈',
  },
  SPORTS_KTV: {
    key: 200_029,
    value: '练歌房',
  },
  SPORTS_BASKETBALL_TICKET: {
    key: 200_030,
    value: '篮球散场',
  },
  SPORTS_FOOTBALL_TICKET: {
    key: 200_031,
    value: '足球散场',
  },
  SPORTS_BODYBUILDING_TICKET: {
    key: 200_032,
    value: '健身房',
  },
  SPORTS_YOGA: {
    key: 200_033,
    value: '瑜伽',
  },
  SPORTS_CHESS: {
    key: 200_034,
    value: '棋牌',
  },
  SPORTS_TEAHOUSE: {
    key: 200_035,
    value: '茶室',
  },
  SPORTS_ICE_AND_SNOW: {
    key: 200_044,
    value: '冰雪',
  },
  SPORTS_BASEBALL: {
    key: 200_036,
    value: '棒球',
  },
  SPORTS_GATEBALL: {
    key: 200_037,
    value: '门球',
  },
  SPORTS_SOFTBALL: {
    key: 200_038,
    value: '柔力球',
  },
  SPORTS_METEORBALL: {
    key: 200_039,
    value: '流星球',
  },
  SPORTS_MARTIALARTS: {
    key: 200_040,
    value: '武术',
  },
  SPORTS_HEXAGRAMBOXING: {
    key: 200_041,
    value: '太极',
  },
  SPORTS_SHOOTING: {
    key: 200_042,
    value: '射击',
  },
  SPORTS_SWORDPLAY: {
    key: 200_043,
    value: '击剑',
  },
  SPORTS_CLIMBING: {
    key: 200_048,
    value: '攀岩',
  },
  SPORTS_ATHLETICS: {
    key: 200_049,
    value: '田径',
  },
  SPORTS_FUNGAMES: {
    key: 200_050,
    value: '趣味运动',
  },
  SPORTS_BROADCAST_GYMNASTICS: {
    key: 200_051,
    value: '广播体操',
  },
  SPORTS_GYMNASTICS: {
    key: 200_052,
    value: '体操',
  },
  SPORTS_FISHING: {
    key: 200_053,
    value: '钓鱼',
  },
  SPORTS_CHEERLEADING: {
    key: 200_054,
    value: '啦啦操',
  },
  SPORTS_SURFING: {
    key: 200_055,
    value: '冲浪',
  },
  SPORTS_SKATING: {
    key: 200_056,
    value: '滑冰',
  },
  SPORTS_SKI: {
    key: 200_057,
    value: '滑雪',
  },
  SPORTS_LIMITBMAX: {
    key: 200_058,
    value: '极限小轮车',
  },
  SPORTS_KARTING: {
    key: 200_059,
    value: '卡丁车',
  },
  SPORTS_ROWING: {
    key: 200_060,
    value: '赛艇',
  },
  SPORTS_HANDBALL: {
    key: 200_062,
    value: '手球',
  },
  SPORTS_HOCKEY: {
    key: 200_063,
    value: '软式曲棍球',
  },
  SPORTS_RUGBY: {
    key: 200_064,
    value: '橄榄球',
  },
  SPORTS_ARCHERY: {
    key: 200_065,
    value: '射箭',
  },
  SPORTS_BADMINTON_TICKET: {
    key: 200_066,
    value: '羽毛球散场',
  },
  SPORTS_PINGPONG_TICKET: {
    key: 200_067,
    value: '乒乓球散场',
  },
  SPORTS_TENNIS_TICKET: {
    key: 200_068,
    value: '网球散场',
  },
  SPORTS_SQUASH: {
    key: 200_069,
    value: '壁球',
  },
  SPORTS_LIFE_PAVILION: {
    key: 200_070,
    value: '生活馆',
  },
  SPORTS_FENCING_TICKET: {
    key: 200_082,
    value: '击剑散场',
  },
  INDOOR_FLIGHT: {
    key: 200_083,
    value: '室内飞行',
  },
  RUNWAY: {
    key: 200_084,
    value: '跑道',
  },
  EQUESTRIAN: {
    key: 200_085,
    value: '马术',
  },
  GOLF_TICKET: {
    key: 200_086,
    value: '高尔夫散场',
  },
  // 可能不属于体育和文化的项目，而且暂时没使用，屏蔽
  // SHOPPING: {
  //   key: 300000,
  //   value: '电商行业',
  // },
  // SHOPPING_BUY: {
  //   key: 300001,
  //   value: '网购会员',
  // },
  // SHOPPING_SRV1: {
  //   key: 300002,
  //   value: '商城平台',
  // },
  // 可能不属于体育和文化的项目，而且暂时没使用，屏蔽
  // SERVICEINDUSTRY_SERVICE: {
  //   key: 800001,
  //   value: '营销',
  // },
  // TOURISMINDUSTRYL_MARKETING: {
  //   key: 800002,
  //   value: '管理',
  // },
};

/**
 * 文化场馆的项目
 */
const CultureTypes = {
  CULTURAL_RELICS: {
    key: 500_001,
    value: '古迹/旧址',
  },
  CULTURAL_MEDIA: {
    key: 500_002,
    value: '影剧',
  },
  CULTURAL_MUSEUM: {
    key: 500_003,
    value: '博物',
  },
  CULTURAL_CENTER: {
    key: 500_004,
    value: '文化',
  },
  CULTURAL_LIBRARY: {
    key: 500_005,
    value: '图书',
  },
  CULTURAL_ART: {
    key: 500_006,
    value: '美术',
  },
  CULTURAL_RECREATION: {
    key: 500_007,
    value: '文娱',
  },
  // 屏蔽此项
  // CULTURAL_SRV1: {
  //   key: 500008,
  //   value: '文化平台',
  // },
  CULTURAL_OTHER: {
    key: 500_009,
    value: '其他',
  },
  CULTURAL_MUSIC: {
    key: 500_010,
    value: '音乐',
  },
  CULTURAL_OPERA: {
    key: 500_011,
    value: '戏曲',
  },
  CULTURAL_DANCE: {
    key: 500_012,
    value: '舞蹈',
  },
};

/**
 * 职业
 */
export const Careers = {
  SPORTS_TEACH: {
    key: 200_006,
    value: '教练',
  },
  SPORTS_TRAINER: {
    key: 200_007,
    value: '裁判',
  },
  SPORTS_TEACHER: {
    key: 200_047,
    value: '老师',
  },
  SPORTS_ATHLETE: {
    key: 200_005,
    value: '运动员',
  },
  SPORTS_ARSF: {
    key: 200_008,
    value: '穿线师',
  },
  SPORTS_SRV3: {
    key: 200_018,
    value: '穿线师管理',
  },
  SPORTS_ARSF_LEVEL1: {
    key: 200_019,
    value: '认证穿线师',
  },
  SPORTS_ARSF_LEVEL2: {
    key: 200_020,
    value: '金牌穿线师',
  },
  CERT_PUB: {
    key: 200_072,
    value: '认证会员',
  },
  SERVICEINDUSTRY_VOLUNTEER: {
    key: 710_001,
    value: '义工',
  },
  SERVICEINDUSTRY_BELLWORKER: {
    key: 710_002,
    value: '钟点工',
  },
  SERVICEINDUSTRY_INSPECTOR: {
    key: 710_003,
    value: '巡查人员',
  },
  SERVICEINDUSTRY_VOLUNTEERS: {
    key: 710_004,
    value: '志愿者',
  },
  TOURISMINDUSTRYL_MARKETING_GUIDE: {
    key: 810_001,
    value: '导游',
  },
  TOURISMINDUSTRYL_MARKETING_NARRATOR: {
    key: 810_002,
    value: '解说员',
  },
  TOURISMINDUSTRYL_MARKETING_ADVISER: {
    key: 810_003,
    value: '旅游顾问',
  },
  TOURISMINDUSTRYL_ADMINISTRATION_CONSULTANT: {
    key: 810_004,
    value: '旅游咨询师',
  },
  TOURISMINDUSTRYL_ADMINISTRATION_ADMINISTRATION: {
    key: 810_005,
    value: '行政管理',
  },
  LIFEGUARD: {
    key: 810_006,
    value: '救生员',
  },
  AED_STAFF: {
    key: 810_007,
    value: 'AED人员',
  },
  INSTRUCTOR: {
    key: 810_008,
    value: '指导员',
  },
  TALENT: {
    key: 810_009,
    value: '达人',
  },
};

/**
 * 行业
 */
export const Industries = {
  SPORTS: {
    key: 200_000,
    value: '体育行业',
  },
  SHOPPING: {
    key: 300_000,
    value: '电商行业',
  },
  TEA: {
    key: 400_000,
    value: '茶行业',
  },
  CULTURAL: {
    key: 500_000,
    value: '文化行业',
  },
  COURSE: {
    key: 600_000,
    value: '课程管理',
  },
  SERVICEINDUSTRY: {
    key: 700_000,
    value: '服务行业',
  },
  TOURISMINDUSTRY: {
    key: 800_000,
    value: '旅游行业',
  },
};

/**
 * 营销中心类型
 */
export const VenueTypes = {
  SPORTPLATFORM: {
    key: 1,
    value: '体育场馆',
  },
  SALES: {
    key: 2,
    value: '店铺',
  },
  ORGANIZATION: {
    key: 3,
    value: '机构/服务商/品牌商',
  },
  CULTURE: {
    key: 4,
    value: '文化场馆',
  },
  WAREHOUSE: {
    key: 5,
    value: '仓库',
  },
};

/**
 * 可用状态
 */
export const VenueStatus = {
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
 * 场馆设施
 */
export const VenueInstallationType = {
  FLOOR: {
    key: 'floor',
    value: '地板',
  },
  LIGHTING: {
    key: 'lighting',
    value: '灯光',
  },
  BATH: {
    key: 'bath',
    value: '洗浴',
  },
  REST_AREA: {
    key: 'rest_area',
    value: '休息区',
  },
  PARKING: {
    key: 'parking',
    value: '停车',
  },
  LEASE: {
    key: 'lease',
    value: '租借',
  },
  SELLING_GOODS: {
    key: 'selling_goods',
    value: '卖品',
  },
  MAINTAIN: {
    key: 'maintain',
    value: '维护',
  },
  LOCKERS: {
    key: 'lockers',
    value: '储物',
  },
  OTHER_SERVICES: {
    key: 'other_services',
    value: '其他服务',
  },
};

/**
 * 场馆预约类型
 */
export const BookingTypes = {
  Booking: {
    key: 0,
    value: '预订',
  },
  Reservation: {
    key: 1,
    value: '预约',
  },
  Free: {
    key: 2,
    value: '免费开放',
  },
};

export default {
  VenueStatus,
  ProfessionTypes,
  VenueInstallationType,
  CultureTypes,
  Careers,
  Industries,
  VenueTypes,
  BookingTypes,
};
