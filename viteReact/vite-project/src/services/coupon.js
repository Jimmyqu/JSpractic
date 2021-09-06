import { postJSON, get } from '@/utils/request';

export async function postCouponVerify(params) {
  return postJSON('/couponCodeList/check.do', params);
}

export async function cancelCouponVerifyByIds(params) {
  return postJSON('/couponCodeList/check/cancel.do', params);
}

export async function queryCodeDetail(params) {
  return get('/couponCodeList/details.do', params);
}

export async function updateCouponVerifyById(params) {
  return postJSON('/couponCodeList/save.do', params);
}
