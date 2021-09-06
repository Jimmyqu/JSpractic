import { PubMarketingMemberModel } from '@/commons/lib/models';
import { savePerformanceReport } from '@/services/pubmktmb';

export default {
  // marketingmember
  namespace: 'pubmktmb',

  state: {
    ...PubMarketingMemberModel,
  },

  effects: {
    *checkout({ payload }, { call }) {
      const id = payload;
      yield call(savePerformanceReport, {
        id,
      });
    },
  },

  reducers: {},
};
