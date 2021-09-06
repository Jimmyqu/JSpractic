import { CompanyModel } from '@/commons/lib/models';
import { postCompanyAudit, postCompanyEdit } from '@/services/company';

export default {
  // 用户行为
  namespace: 'company',

  state: {
    ...CompanyModel,
  },

  effects: {
    *auth({ payload }, { call }) {
      yield call(postCompanyAudit, payload);
    },
    *edit({ payload }, { call }) {
      yield call(postCompanyEdit, payload);
    },
  },

  reducers: {},
};
