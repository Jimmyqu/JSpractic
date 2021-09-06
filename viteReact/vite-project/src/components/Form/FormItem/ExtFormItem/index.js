import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'antd';
import moment from 'moment';
import { checkUpload, checkExtField2 } from '@/commons/lib/validator';
import { formUploadOtherProps } from '@/utils/upload';
import { isNumber } from '@/utils/utils';
import Item from './Item';
import ItemView from './ItemView';
import styles from './index.less';

function getRuleType(ExtDataTypes, extDataType, single) {
  switch (extDataType) {
    case ExtDataTypes.Select.key:
    case ExtDataTypes.Ethnic.key:
      return single ? 'number' : 'array';
    case ExtDataTypes.Date.key:
    case ExtDataTypes.HourAndMinute.key:
    case ExtDataTypes.DateTime.key:
      return 'date';
    case ExtDataTypes.ImgFile.key:
    case ExtDataTypes.DocFile.key:
    case ExtDataTypes.VideoFile.key:
    case ExtDataTypes.Cascader.key:
    case ExtDataTypes.Pcd.key:
    case ExtDataTypes.Contact.key:
    case ExtDataTypes.DateRange.key:
    case ExtDataTypes.HourAndMinuteRange.key:
    case ExtDataTypes.DateTimeRange.key:
      return 'array';
    default:
      return 'string';
  }
}

export default ({ form, field, initialValue, isView, value, ...props }) => {
  if (field == null) {
    return null;
  }
  const { extDataType, extShowName, extKeyName, fieldDescr, single, required, extValue, validAlert } = field;
  if (extKeyName == null) {
    return null;
  }
  const dispatch = useDispatch();
  const { fileCacheByKeyMapping } = useSelector(state => state.global);
  // extfield2 是默认加载的模块
  const { ExtDataTypes, VolatileValueTypeKeys, FileTypeKeys, TimestampTypeKeys, TimestampRangeTypeKeys, InTypes } =
    useSelector(state => state.extfield2);
  // single 改为integer
  const isMulti = single === InTypes.Multi.key;
  let useValue = initialValue == null ? extValue : initialValue;
  useValue = useValue == null || useValue === '' ? undefined : useValue; // 如果是null设置为undefined来显示placeholder

  const isFile = FileTypeKeys.includes(extDataType);

  const fileFetchValue = isFile && Array.isArray(useValue) && typeof useValue?.[0] === 'string' ? useValue : null;

  if (TimestampTypeKeys.includes(extDataType)) {
    if (TimestampRangeTypeKeys.includes(extDataType)) {
      useValue = useValue.map(val => (isNumber(val) ? moment(val) : undefined));
    } else {
      useValue = isNumber(useValue) ? moment(useValue) : undefined;
    }
  } else if (isFile) {
    if (Array.isArray(useValue)) {
      useValue =
        typeof useValue[0] === 'string' ? useValue.map(key => fileCacheByKeyMapping[key]).filter(Boolean) : useValue;
    } else {
      useValue = [];
    }
  }

  useEffect(() => {
    if (!(isFile && fileFetchValue?.length > 0)) {
      return;
    }
    const needFetchKeys = fileFetchValue?.filter(key => typeof key === 'string' && fileCacheByKeyMapping[key] == null);
    if (needFetchKeys.length === 0) {
      return;
    }
    dispatch({
      type: 'global/fetchFilesByKey',
      payload: needFetchKeys,
    });
  }, [isFile, fileFetchValue]);

  if (isView) {
    return <ItemView {...props} field={field} value={useValue} />;
  }
  // 对于支持单个值又可以支持多个值的，统一多值处理的类型，本身只支持单个值，和只支持多个值的之外的那些
  if (VolatileValueTypeKeys.includes(extDataType) && useValue != null) {
    // 把值还原到需要还原的组件上
    if (isMulti) {
      useValue = Array.isArray(useValue) ? useValue : [extValue];
    } else {
      useValue = Array.isArray(useValue) ? useValue[0] : extValue;
    }
  }
  const rules = [];
  const otherProps = {};
  if (FileTypeKeys.includes(extDataType)) {
    Object.assign(otherProps, formUploadOtherProps);
    rules.push({
      required,
      validator: checkUpload,
    });
  } else if (required) {
    rules.push({
      required,
      message: `请填写${extShowName || extKeyName}`,
    });
  }
  rules.push({
    type: getRuleType(ExtDataTypes, extDataType, !isMulti),
    message: validAlert || `${extShowName}填写无效，请重新填写`,
    validator(...args) {
      return checkExtField2(...args, field);
    },
  });
  return (
    <Form.Item label={extShowName || extKeyName}>
      {form.getFieldDecorator(extKeyName, {
        initialValue: useValue,
        rules,
        ...otherProps,
      })(<Item {...props} field={field} />)}
      {fieldDescr != null && <div className={styles.itemDescr}>{fieldDescr}</div>}
    </Form.Item>
  );
};
