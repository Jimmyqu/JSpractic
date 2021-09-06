import { get, postJSON } from '@/utils/request';

export async function queryPubServiceInfo(params) {
  return get('/pubService/getId.do', params);
}

export async function changePeriod(params) {
  return postJSON('/publicServiceAccount/save.do', params);
}

export async function withdrawAmount(params) {
  return postJSON('/dealWithdraw/savePubServiceAccount.do', params);
}

export async function withdrawAmountToAccount(params) {
  return postJSON('/dealWithdraw/savePubServiceAccountToAccount.do', params);
}

export async function analysisCheckoutForList(params) {
  return postJSON('/pubService/manualCheckout.do', params);
}

export async function analysisCheckoutForSold(params) {
  return postJSON('/publicServiceAccount/manualCheckout.do', params);
}

export async function fetchByUser(params) {
  return get('/publicServiceAccount/queryServiceAccountList.do', params);
}

export async function postBatchDelayPeriod(params) {
  return postJSON('/publicServiceAccount/batchDelay.do', params);
}

export async function postBatchFreeze(params) {
  return postJSON('/publicServiceAccount/batchFrozen.do', params);
}

export async function postUnFreeze(params) {
  return postJSON('/publicServiceAccount/pubServiceThaw.do', params);
}

export async function postLinkPubServiceAndStudy(params) {
  return postJSON('/publicServiceStudy/save.do', params);
}

export async function postSurePrintCard(params) {
  return postJSON('/publicServiceAccount/makingCard.do', params);
}

export async function queryServiceCategoryList() {
  return get('/pubServiceCategory/serviceCategoryList.do');
}

export async function updateServiceRecovery(params) {
  return postJSON('/analysis/serviceAccount/personal/recovery.do', params);
}

export async function updatePubServiceState(params) {
  return postJSON('/publicServiceAccount/serviceState.do', params);
}

export async function updatePubServiceRank(params) {
  return postJSON('/publicServiceAccount/updateRanks.do', params);
}
