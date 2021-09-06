import { CouponModel } from '@/commons/lib/models';
import { postCouponVerify, cancelCouponVerifyByIds, queryCodeDetail, updateCouponVerifyById } from '@/services/coupon';

export default {
  // 优惠码/券 （不是会员服务）
  namespace: 'coupon',

  state: {
    ...CouponModel,
  },

  effects: {
    *verify({ payload }, { call }) {
      yield call(postCouponVerify, payload);
    },
    *cancelVerify({ payload }, { call }) {
      yield call(cancelCouponVerifyByIds, {
        id: payload,
      });
    },
    *fetchCode({ payload }, { call }) {
      return yield call(queryCodeDetail, {
        couponCode: payload,
      });
    },
    *updateVerify({ payload }, { call }) {
      yield call(updateCouponVerifyById, payload);
    },
  },

  reducers: {},
};
