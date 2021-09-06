import {
  isMobile,
  isIDNumber15,
  isIDNumber18,
  getMomentByIdNumber,
  isComplexPwd8,
  isComplexPwd,
  isIDNumber,
} from './utils';
import { ExtfieldModel, Extfield2Model, Extfield3Model } from './models';

function createValidator(check) {
  return (rule, value, fn) => {
    // (rule, value, fn, source, options)
    if ((rule.required === false && (value == null || value.length === 0)) || check(value)) {
      fn([]);
    } else {
      fn([new Error('required')]);
    }
  };
}

const checkMobile = createValidator(isMobile);

const checkIDCardNumber = createValidator(isIDNumber);

const checkNumber = createValidator(value => /^\d+$/.test(value));

export { checkMobile, checkIDCardNumber, checkNumber };

export function checkUpload(rule, value, fn) {
  // (rule, value, fn, source, options)
  const list = Array.isArray(value) ? value : (value || []).fileList;
  if (rule.required && (value == null || list.length === 0)) {
    fn('请上传文件');
    return;
  }
  if (list && list.some(file => file.status === 'error')) {
    fn('请重新上传');
    return;
  }
  fn([]);
}

/**
 * ExtFormItem buildInValidator
 * antd@3 validator 不会处理return的值，这里return是为了兼容直接方法调用，注意：失败是true, antd@4将会支持返回Promise
 * @param {Object} rule
 * @param {any} value
 * @param {Function} fn
 */
export function checkExtField(rule, value, fn, source, options, field) {
  const { ExtDataTypes } = ExtfieldModel;
  if (
    field == null ||
    field.extDataType === ExtDataTypes.ImgFile.key ||
    field.extDataType === ExtDataTypes.DocFile.key
  ) {
    fn([]);
    return false;
  }
  const regs = field.validRegex || [];
  const range = field.validNumberRange || [];
  let tempValue = value;
  if (field.extDataType === ExtDataTypes.IDCard.key) {
    // 身份证号码类型
    if (isIDNumber18(value) || isIDNumber15(value)) {
      // 18
      tempValue = getMomentByIdNumber(value).valueOf();
    } else if (field.required || (value && value.length > 0)) {
      fn([new Error('required')]);
      return true;
    }
  }
  if (
    (!field.required && (value == null || value.length === 0)) ||
    (regs.every(item => {
      let { regexValue } = item;
      if (regexValue == null) {
        // 无效的
        return true;
      }
      if (regexValue.startsWith('/')) {
        // 裁剪
        regexValue = regexValue.slice(1);
      }
      if (regexValue.endsWith('/')) {
        // 裁剪
        regexValue = regexValue.slice(0, -1);
      }
      if (regexValue.length === 0) {
        // 无效的
        return true;
      }
      try {
        const matched = new RegExp(regexValue, 'gim').test(value);
        return matched;
      } catch {
        // 忽略无效的js
      }
      return true;
    }) &&
      range.every(item => {
        // 日期类要求配置时间戳值，就是按符号比较时间戳的早晚
        // 所以与数字类通用比较
        const val = +tempValue;
        if (Number.isNaN(val)) {
          alert(`[${field.extShowName}]信息配置有误`);
        }
        const referVal = +item.value;
        try {
          switch (item.symbol) {
            case '>':
              return val > referVal;
            case '<':
              return val < referVal;
            case '==':
              return val === referVal;
            case '>=':
              return val >= referVal;
            case '<=':
              return val <= referVal;
            case '!=':
              return val !== referVal;
            default:
            // return true;
          }
        } catch {
          // 忽略无效的js
        }
        return true;
      }))
  ) {
    fn([]);
    return false;
  }
  fn([new Error('invalid')]);
  return true;
}

/**
 * ExtFormItem buildInValidator
 * antd@3 validator 不会处理return的值，这里return是为了兼容直接方法调用，注意：失败是true, antd@4将会支持返回Promise
 * @param {Object} rule
 * @param {any} value
 * @param {Function} fn
 */
export function checkExtField2(rule, value, fn, source, options, field) {
  try {
    const { ExtDataTypes, VolatileValueTypeKeys } = Extfield2Model;
    if (field == null) {
      fn([]);
      return false;
    }
    const { extShowName, required, validRegex, validNumberRange, extDataType } = field;
    let tempValue = value;
    if (!required && (value == null || value.length === 0)) {
      fn([]);
      return false;
    }
    if (extDataType === ExtDataTypes.IDCard.key) {
      // 身份证号码类型
      if (isIDNumber18(value) || isIDNumber15(value)) {
        // 18
        tempValue = getMomentByIdNumber(value).valueOf();
      } else {
        fn([new Error('invalid')]);
        return true;
      }
    }
    // 对于支持单个值又可以支持多个值的，统一多值处理的类型，本身只支持单个值，和只支持多个值的之外的那些
    if (VolatileValueTypeKeys.includes(extDataType)) {
      // 处理为长度
      tempValue = Array.isArray(value) ? value : [value];
    } else {
      if (
        Array.isArray(validRegex) &&
        validRegex.some(item => {
          let { regexValue } = item;
          if (regexValue == null) {
            // 无效的
            return false;
          }
          if (regexValue.startsWith('/')) {
            // 裁剪
            regexValue = regexValue.slice(1);
          }
          if (regexValue.endsWith('/')) {
            // 裁剪
            regexValue = regexValue.slice(0, -1);
          }
          if (regexValue.length === 0) {
            // 无效的
            return false;
          }
          try {
            const matched = new RegExp(regexValue, 'gim').test(value);
            return !matched;
          } catch {
            // 忽略无效的js
          }
          return false;
        })
      ) {
        fn([new Error('invalid')]);
        return true;
      }
    }
    if (
      Array.isArray(validNumberRange) &&
      validNumberRange.some(item => {
        // 日期类要求配置时间戳值，就是按符号比较时间戳的早晚
        // 所以与数字类通用比较
        const val = +tempValue;
        if (Number.isNaN(val)) {
          alert(`[${extShowName}]信息配置有误`);
        }
        const referVal = +item.value;
        try {
          switch (item.symbol) {
            case '>':
              return !(val > referVal);
            case '<':
              return !(val < referVal);
            case '==':
              return !(val === referVal);
            case '>=':
              return !(val >= referVal);
            case '<=':
              return !(val <= referVal);
            case '!=':
              return !(val !== referVal);
            default:
            // return true;
          }
        } catch {
          // 忽略无效的js
        }
        return false;
      })
    ) {
      fn([new Error('invalid')]);
      return true;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('validator:', e);
  }
  fn([]);
  return false;
}

// TODO 如果后台配置表单 会将以前接口返回配置表单字段修改
// 要添加format格式化第二版field字段 到第三版
export function checkExtField3(rule, value, fn, source, options, field) {
  try {
    const { ExtDataTypes, VolatileValueTypeKeys } = Extfield3Model;
    if (field == null) {
      fn([]);
      return false;
    }
    const { attrShowName, formIsRequired, validRegex, validNumberRange, attrValueType } = field;
    // const { extShowName, required, extDataType } = field;
    let tempValue = value;
    if (!formIsRequired && (value == null || value.length === 0)) {
      fn([]);
      return false;
    }
    if (attrValueType === ExtDataTypes.IDCard.key) {
      // 身份证号码类型
      if (isIDNumber18(value) || isIDNumber15(value)) {
        // 18
        tempValue = getMomentByIdNumber(value).valueOf();
      } else {
        fn([new Error('invalid')]);
        return true;
      }
    }
    // 对于支持单个值又可以支持多个值的，统一多值处理的类型，本身只支持单个值，和只支持多个值的之外的那些
    if (VolatileValueTypeKeys.includes(attrValueType)) {
      // 处理为长度
      tempValue = Array.isArray(value) ? value : [value];
    } else {
      if (
        Array.isArray(validRegex) &&
        validRegex.some(item => {
          let { regexValue } = item;
          if (regexValue == null) {
            // 无效的
            return false;
          }
          if (regexValue.startsWith('/')) {
            // 裁剪
            regexValue = regexValue.slice(1);
          }
          if (regexValue.endsWith('/')) {
            // 裁剪
            regexValue = regexValue.slice(0, -1);
          }
          if (regexValue.length === 0) {
            // 无效的
            return false;
          }
          try {
            const matched = new RegExp(regexValue, 'gim').test(value);
            return !matched;
          } catch {
            // 忽略无效的js
          }
          return false;
        })
      ) {
        fn([new Error('invalid')]);
        return true;
      }
    }
    if (
      Array.isArray(validNumberRange) &&
      validNumberRange.some(item => {
        // 日期类要求配置时间戳值，就是按符号比较时间戳的早晚
        // 所以与数字类通用比较
        const val = +tempValue;
        if (Number.isNaN(val)) {
          alert(`[${attrShowName}]信息配置有误`);
        }
        const referVal = +item.value;
        try {
          switch (item.symbol) {
            case '>':
              return !(val > referVal);
            case '<':
              return !(val < referVal);
            case '==':
              return !(val === referVal);
            case '>=':
              return !(val >= referVal);
            case '<=':
              return !(val <= referVal);
            case '!=':
              return !(val !== referVal);
            default:
            // return true;
          }
        } catch {
          // 忽略无效的js
        }
        return false;
      })
    ) {
      fn([new Error('invalid')]);
      return true;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('validator:', e);
  }
  fn([]);
  return false;
}

export function checkPassword(rule, value, fn, source, options) {
  if (rule.isPwdLimit8 ? isComplexPwd8(value) : isComplexPwd(value)) {
    fn([]);
  } else {
    fn([new Error('invalid')]);
  }
}
