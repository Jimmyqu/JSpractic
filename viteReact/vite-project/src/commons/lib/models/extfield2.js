// 新版：动态扩展字段
import { ExtDataTypes } from './extfield';

/**
 * 输入录入类型
 */
const InTypes = {
  Single: {
    key: 1,
    value: '单项',
  },
  Multi: {
    key: 2,
    value: '多项',
  },
};

/**
 * 扩展字段类型
 */
const NewExtDataTypes = {
  ...ExtDataTypes,
  Pcd: {
    key: 15,
    value: '省市区',
  },
  DateRange: {
    key: 16,
    value: '日期范围',
  },
  HourAndMinuteRange: {
    key: 17,
    value: '日期时分范围',
  },
  DateTimeRange: {
    key: 18,
    value: '时刻范围',
  },
};

/**
 * 日期类型-范围
 */
export const TimestampRangeTypeKeys = [
  // 数组
  NewExtDataTypes.DateRange.key,
  NewExtDataTypes.HourAndMinuteRange.key,
  NewExtDataTypes.DateTimeRange.key,
];

/**
 * 日期类型
 */
export const TimestampTypeKeys = [
  // 单个
  NewExtDataTypes.Date.key,
  NewExtDataTypes.HourAndMinute.key,
  NewExtDataTypes.DateTime.key,
  // 数组
  ...TimestampRangeTypeKeys,
];

/**
 * 文件类型的key
 */
export const FileTypeKeys = [NewExtDataTypes.ImgFile.key, NewExtDataTypes.DocFile.key, NewExtDataTypes.VideoFile.key];

/**
 * 对于支持单个值又可以支持多个值的，统一多值处理的类型，本身只支持单个值，和只支持多个值的之外的那些
 */
export const VolatileValueTypeKeys = [NewExtDataTypes.Select.key, NewExtDataTypes.Contact.key];

export { NewExtDataTypes as ExtDataTypes };

export default {
  ExtDataTypes: NewExtDataTypes,
  FileTypeKeys,
  VolatileValueTypeKeys,
  TimestampTypeKeys,
  TimestampRangeTypeKeys,
  InTypes,
};
