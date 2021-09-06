import { ExtfieldModel, Extfield2Model } from '@/commons/lib/models';
import { formFileMapper } from './upload';

/**
 * 按扩展字段列表修改表单值以达到可以直接传递给服务器的程度
 * @param {*} extFieldList
 * @param {*} formValue
 */
export function converFormDataToServerReady(extFieldList, formValue) {
  if (formValue == null || !Array.isArray(extFieldList)) {
    return null;
  }
  const { ExtDataTypes } = ExtfieldModel;
  const override = {};
  extFieldList.forEach(({ extName, extDataType }) => {
    const val = formValue[extName];
    if (val == null) {
      return;
    }
    switch (extDataType) {
      case ExtDataTypes.Date.key:
      case ExtDataTypes.HourAndMinute.key:
      case ExtDataTypes.DateTime.key:
        override[extName] = val.valueOf();
        break;
      case ExtDataTypes.ImgFile.key:
      case ExtDataTypes.DocFile.key:
        override[extName] = Array.isArray(val) ? formFileMapper(val)[0] : formFileMapper(val);
        break;
      default:
    }
  });
  return {
    ...formValue,
    ...override,
  };
}

/**
 * 按扩展字段列表修改表单值以达到可以直接传递给服务器的程度
 * @param {*} extFieldList
 * @param {*} formValue
 * @param {*} ignoreReadOnly
 */
export function converFormDataToServerReady2(extFieldList, formValue, ignoreReadOnly = true) {
  if (formValue == null || !Array.isArray(extFieldList)) {
    return null;
  }
  const { ExtDataTypes, InTypes } = Extfield2Model;
  const override = {
    ...formValue,
  };
  extFieldList.forEach(({ extKeyName, extDataType, single, readyOnly }) => {
    const val = override[extKeyName];
    if (val == null) {
      return;
    }
    if (ignoreReadOnly && readyOnly) {
      delete override[extKeyName];
      // override[extKeyName] = null;
      return;
    }
    // single 改为integer
    const isMulti = single === InTypes.Multi.key;
    switch (extDataType) {
      case ExtDataTypes.Date.key:
      case ExtDataTypes.HourAndMinute.key:
      case ExtDataTypes.DateTime.key:
        override[extKeyName] = val.valueOf();
        break;
      case ExtDataTypes.DateRange.key:
      case ExtDataTypes.HourAndMinuteRange.key:
      case ExtDataTypes.DateTimeRange.key:
        override[extKeyName] = val.map(item => item.valueOf());
        break;
      // 对于支持单个值又可以支持多个值的，统一多值处理的类型，本身只支持单个值，和只支持多个值的之外的那些
      // 文件全部用数组
      case ExtDataTypes.ImgFile.key:
      case ExtDataTypes.DocFile.key:
      case ExtDataTypes.VideoFile.key:
        override[extKeyName] = formFileMapper(val);
        break;
      // 对于支持单个值又可以支持多个值的，统一多值处理的类型，本身只支持单个值，和只支持多个值的之外的那些
      case ExtDataTypes.Select.key:
      case ExtDataTypes.Contact.key:
        override[extKeyName] = isMulti ? val : [val];
        break;
      default:
    }
  });
  return override;
}
