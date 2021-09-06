import { PubSignUpModel, PubCourseModel, DealModel } from '@/commons/lib/models';
import { queryPrintConfig, queryDealDetailInfo } from '@/services/deal';

const { DealStatus } = PubSignUpModel;
const { CourseTypes } = PubCourseModel;
const { PayStatus, PayWayTypes } = DealModel;

export default {
  // 账户
  namespace: 'print',

  state: {
    DealStatus,
    CourseTypes,
    PayStatus,
    PayWayTypes,
  },

  effects: {
    *fetch({ payload: dealId }, { all, call }) {
      const params = {
        dealId,
      };
      return yield all({
        dealInfo: call(queryDealDetailInfo, params),
        printConfig: call(queryPrintConfig, params),
      });
    },
  },

  reducers: {},
};
