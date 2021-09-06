import { ContactModel } from '@/commons/lib/models';
import { getExtValidField, removeContact, saveContact, fetchStudyByUser, fetchStudyById } from '@/services/api';
import { isIDNumberAndMatchBirthday, isIDNumber, isHKIDNumber, isMobile, isNumerical } from '@/utils/utils';

export default {
  // 联系人
  namespace: 'contact',

  state: {
    ...ContactModel,
  },

  effects: {
    *delete({ payload }, { call }) {
      const ids = payload;
      yield call(removeContact, {
        ids,
      });
    },
    *newOrEdit({ payload }, { call }) {
      return yield call(saveContact, payload);
    },
    *getValidField({ payload }, { call, select }) {
      const { dataId, relType } = payload;
      const { ContactOrderFields, ContactValidCfgs } = yield select(state => state.contact);
      const obj = {
        // cloud 非必要可以尽量少要求填写信息
        contactValidCfgs: [...ContactValidCfgs],
        extFields: [],
      };
      if (dataId && relType) {
        const result = yield call(getExtValidField, payload);
        const { commonExtFieldList, commonRequiredFieldList } = result || {};
        obj.extFields = commonExtFieldList;
        if (Array.isArray(commonRequiredFieldList) && commonRequiredFieldList.length > 0) {
          const allFields = Object.values(ContactOrderFields);
          const list = commonRequiredFieldList.filter(item => allFields.some(({ key }) => key === item.fieldName));
          if (list.length > 0) {
            obj.contactValidCfgs = list;
          }
        }
      }
      return obj;
    },
    fetchByUser: [
      function* fetchByUser({ payload }, { call }) {
        const pubAccountId = payload;
        if (pubAccountId == null) {
          return null;
        }
        return yield call(fetchStudyByUser, {
          pubAccountId,
        });
      },
      {
        type: 'takeLatest',
      },
    ],
    *createDefaultContactRulesMapping({ payload }, { select }) {
      const { form } = payload || {};
      // 从portal复制过来的
      // 静态字段默认内置规则
      // 默认第一个放了是否必填校验的配置，主要对其占位，即第一个一定是纯是否必填校验，不放其他校验配置
      // 但选人的编辑模式下只显示必填字段，故此都是必填的，只有在纯联系人管理中使用该是否必填校验的配置
      // https://code.aliyun.com/ydmap-code/ydmap-ssr-portal-pages/blob/master/-vue-features/components/contact/mixins/contact-field.js#L36
      const { ContactOrderFields, CertificateTypes } = yield select(state => state.contact);
      return {
        [ContactOrderFields.RealName.key]: [
          {
            required: true,
            message: '请填写姓名',
          },
        ],
        [ContactOrderFields.Gender.key]: [
          {
            required: true,
            message: '请选择性别',
          },
        ],
        [ContactOrderFields.Birthday.key]: [
          {
            required: true,
            message: '请选择出生日期',
          },
          {
            message: '身份证号码与出生日期不匹配',
            validator: (rule, value, fn) => {
              const cardType = form.getFieldValue(ContactOrderFields.CardType.key);
              const cardNum = form.getFieldValue(ContactOrderFields.CardNum.key);
              if (value && cardType === CertificateTypes.IDCard.key && cardNum) {
                if (isIDNumberAndMatchBirthday(cardNum, value)) {
                  if (form.getFieldError(ContactOrderFields.CardNum.key)) {
                    form.validateFields([ContactOrderFields.CardNum.key]);
                  }
                } else {
                  fn([new Error('invalid')]);
                  return;
                }
              }
              fn();
            },
          },
        ],
        [ContactOrderFields.CardType.key]: [
          {
            required: false,
            message: '请填写证件类型',
          },
          {
            message: '',
            validator: (rule, value, fn) => {
              const cardType = form.getFieldValue(ContactOrderFields.CardType.key);
              const birthday = form.getFieldValue(ContactOrderFields.Birthday.key);
              if (+cardType === Number(cardType) || birthday) {
                form.validateFields([ContactOrderFields.Birthday.key, ContactOrderFields.CardNum.key]);
              }
              fn([]);
            },
          },
        ],
        [ContactOrderFields.Telephone.key]: [
          {
            required: false,
            message: '请填写固定电话',
          },
        ],
        [ContactOrderFields.Height.key]: [
          {
            required: false,
            message: '请填写身高',
          },
          {
            message: '请填写正确的整数身高，单位厘米',
            validator: (rule, value, fn) => {
              if (value == null || value.length === 0) {
                fn([]);
                return;
              }
              const num = +value;
              if (num === Math.floor(num) && num >= 30 && num <= 300) {
                fn([]);
                return;
              }
              fn([new Error('invalid')]);
            },
          },
        ],
        [ContactOrderFields.Weight.key]: [
          {
            required: false,
            message: '请填写体重',
          },
          {
            message: '体重请填写最多两位小数',
            validator: (rule, value, fn) => {
              if (
                value == null ||
                value.length === 0 ||
                (isNumerical(value) && /^\d+(\.\d{0,2})?$/.test(value.toString()))
              ) {
                fn([]);
                return;
              }
              fn([new Error('invalid')]);
            },
          },
        ],
        [ContactOrderFields.CardNum.key]: [
          {
            required: false,
            message: '请填写证件号码',
          },
          {
            message: '请输入合法的身份证号码',
            validator: (rule, value, fn) => {
              if (!(value || rule.required)) {
                fn([]);
                return;
              }
              const cardType = form.getFieldValue(ContactOrderFields.CardType.key);
              if (
                (cardType === CertificateTypes.IDCard.key && !isIDNumber(value)) ||
                (cardType === CertificateTypes.HKIDCard.key && !isHKIDNumber(value))
              ) {
                fn([new Error('invalid')]);
                return;
              }
              fn([]);
            },
          },
          {
            message: '身份证号码与出生日期不匹配',
            validator: (rule, value, fn) => {
              const cardType = form.getFieldValue(ContactOrderFields.CardType.key);
              const birthday = form.getFieldValue(ContactOrderFields.Birthday.key);
              if (value && cardType === CertificateTypes.IDCard.key && birthday) {
                if (isIDNumberAndMatchBirthday(value, birthday)) {
                  if (form.getFieldError(ContactOrderFields.Birthday.key)) {
                    form.validateFields([ContactOrderFields.Birthday.key]);
                  }
                } else {
                  fn([new Error('invalid')]);
                  return;
                }
              }
              fn();
            },
          },
        ],
        [ContactOrderFields.Mobile.key]: [
          {
            required: true,
            message: '请填写手机号',
          },
          {
            message: '请输入合法的手机号码',
            validator: (rule, value, fn) => {
              if (!(value || rule.required) || isMobile(value)) {
                fn([]);
              } else {
                fn([new Error('invalid')]);
              }
            },
          },
        ],
      };
    },
    *fetchById({ payload }, { call }) {
      const studyId = payload;
      if (!studyId) {
        return null;
      }
      return yield call(fetchStudyById, {
        studyId,
      });
    },
  },

  reducers: {},
};
