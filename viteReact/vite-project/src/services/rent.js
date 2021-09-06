import { get, postJSON, post } from '@/utils/request';

export async function postEditOrNewLeaseConfig(params) {
  return postJSON('/leaseConfig/save.do', params);
}

export async function postDeleteLeaseConfig(params) {
  return postJSON('/leaseConfig/delete.do', params);
}

export async function fetchLeaseGroupList(params) {
  return get('/leaseGroup/list.do', params);
}

export async function postLeaseBatchImport(params) {
  return post('/leaseProject/batchImport.do', params);
}

export async function postDeleteleaseGroup(params) {
  return postJSON('/leaseGroup/delete.do', params);
}

export async function postEditOrNewLeaseGroup(params) {
  return postJSON('/leaseGroup/save.do', params);
}

export async function postDeleteLeasePriceGroup(params) {
  return postJSON('/leasePriceGroup/delete.do', params);
}

export async function postEditOrNewLeasePriceGroup(params) {
  return postJSON('/leasePriceGroup/save.do', params);
}

export async function postDeleteLeasePriceConfig(params) {
  return postJSON('/leasePriceConfig/delete.do', params);
}

export async function postEditOrNewLeasePriceConfig(params) {
  return postJSON('/leasePriceConfig/save.do', params);
}

export async function queryLeaseRentHome(params) {
  return get('/leaseProject/homePage.do', params);
}

export async function postDeleteLease(params) {
  return postJSON('/leaseProject/delete.do', params);
}

export async function postEditOrNewLease(params) {
  return postJSON('/leaseProject/save.do', params);
}

export async function fetchLeasePriceGroupList(params) {
  return get('/leasePriceGroup/list.do', params);
}

export async function postBatchEditLease(params) {
  return postJSON('/leaseProject/saveList.do', params);
}

export async function postBatchSetLeaseState(params) {
  return postJSON('/leaseProject/saveState.do', params);
}
