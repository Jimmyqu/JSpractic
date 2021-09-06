import { get, postJSON, post } from '@/utils/request';

export async function queryExpressCompanyList(params) {
  return get('/shipping/companyList.do', params);
}

export async function queryDeliverInfo(params) {
  return get('/dealShipping/queryById.do', params);
}

export async function updateConsignee(params) {
  return postJSON('/dealShipping/updateConsignee.do', params);
}

export async function toDeliver(params) {
  return postJSON('/dealShipping/save.do', params);
}

export async function queryShippingSalesInfo(params) {
  return get('/dealShipping/shippingeAddress.do', params);
}

export async function postBatchShipping(params) {
  return post('/dealShipping/batchShippinge.do', params);
}

export async function toBatchDeliver(params) {
  return postJSON('/dealShipping/confirmShippinge.do', params);
}
