// 联系人
import { IDCardTypes } from './pubuser';
/**
 * 全部联系人静态字段
 */
export const ContactOrderFields = {
  RealName: {
    key: 'realName',
    value: '真实姓名',
  },
  Gender: {
    key: 'sex',
    value: '性别',
  },
  Mobile: {
    key: 'mobile',
    value: '手机号',
  },
  Birthday: {
    key: 'birthday',
    value: '出生日期',
  },
  CardType: {
    key: 'cardType',
    value: '证件类型',
  },
  CardNum: {
    key: 'cardNum',
    value: '证件号码',
  },
  Telephone: {
    key: 'telephone',
    value: '固定电话',
  },
  Height: {
    key: 'height',
    value: '身高',
  },
  Weight: {
    key: 'weight',
    value: '体重',
  },
};

/**
 * 默认静态字段
 */
export const ContactValidCfgs = [
  {
    fieldName: 'realName',
  },
  {
    fieldName: 'sex',
  },
  {
    fieldName: 'mobile',
  },
  {
    fieldName: 'birthday',
  },
];

/**
 * 证件类型
 */
export const CertificateTypes = IDCardTypes;

export default {
  ContactOrderFields,
  ContactValidCfgs,
  CertificateTypes,
};
