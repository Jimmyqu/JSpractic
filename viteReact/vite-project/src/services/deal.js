import { get, postJSON } from '@/utils/request';

export async function queryDealMiniInfo(params) {
  return get('/deal/queryDealMiniInfo.do', params);
}

export async function queryDealDetailInfo(params) {
  return get('/deal/queryById.do', params);
}

export async function queryDealDetailInfoByProjectNumber(params) {
  return get('/deal/getByProjectNumber.do', params);
}

export async function postDealSign(params) {
  return postJSON('/deal/sign.do', params);
}

export async function queryPrintConfig(params) {
  return get('/deal/getPrintingConfig.do', params);
}

export async function postDealCancel(params) {
  return postJSON('/deal/cancel.do', params);
}

export async function postDealCancelMulti(params) {
  return postJSON('/deal/batchCancel.do', params);
}

export async function queryUnpaidGoodsDealList(params) {
  return get('/dealItem/queryByUnpaid.do', params);
}

export async function saveOrder(params) {
  return postJSON('/deal/save.do', params);
}

export async function saveOrderMessage(params) {
  return postJSON('/deal/saveMsg.do', params);
}

export async function queryOrderSummary(params) {
  return get('/deal/main.do', params);
}

export async function fastSaveOrder(params) {
  return postJSON('/deal/saveAndCheckout.do', params);
}

export async function toDealPay(params) {
  return postJSON('/pay/dealPay.do', params);
}

export async function getPaymentInfo(params) {
  return postJSON('/pay/getQrPayInfo.do', params);
}

export async function checkoutOrderJustUpdate(params) {
  return postJSON('/deal/update.do', params);
}

export async function calcPubServicePrice(params) {
  return get('/deal/calcPubServicePrice.do', params);
}

export async function queryPayStatus(params) {
  return get('/dealPay/getStatus.do', params);
}

export async function postBarCodePay(params) {
  return postJSON('/pay/barCodePay.do', params);
}

export async function getQuickPayWay(params) {
  return get('/dealPay/getQuickPayWay.do', params);
}
