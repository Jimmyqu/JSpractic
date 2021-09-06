import { get, postJSON } from '@/utils/request';

export async function querySportPlatformInfo(params) {
  return get('/sportPlatform/querySportPlatformInfo.do', params);
}

export async function querySportOrder(params) {
  return get('/sportPlatformTicket/queryByObject.do', params);
}

export async function updateTicketNumber(params) {
  return postJSON('/sportPlatformTicket/update.do', params);
}

export async function queryPlatformTicketVisitors(params) {
  return get('/sportPlatformTicket/visitors.do', params);
}

export async function querySportPlatformVisitors(params) {
  return get('/sportPlatform/visitors.do', params);
}

export async function queryServiceUser(params) {
  return postJSON('/sportPlatformUser/queryByDealPlatform.do', params);
}

export async function deletePlatformForever(params) {
  return postJSON('/sportPlatformForever/delete.do', params);
}

export async function updatePlatformForeverDatePeriod(params) {
  return postJSON('/sportPlatformForever/update.do', params);
}

export async function queryPlatformForeverServiceUser(params) {
  return get('/sportPlatformForever/querySportPlatformUser.do', params);
}

export async function queryPlatformForeverSportTeam(params) {
  return get('/sportPlatformForever/querySportTeam.do', params);
}

export async function savePlatformForever(params) {
  return postJSON('/sportPlatformForever/save.do', params);
}

export async function savePlatformLock(params) {
  return postJSON('/sportPlatformForeverLock/save.do', params);
}

export async function querySalesInfo(params) {
  return get('/sportPlatformForever/querySalesInfo.do', params);
}

export async function lockeSomePlatform(params) {
  return postJSON('/sportPlatformLock/save.do', params);
}

export async function changeLockeSomePlatform(params) {
  return postJSON('/sportPlatformLock/update.do', params);
}

export async function queryPlatformLockedInfo(params) {
  return get('/sportPlatformLock/queryById.do', params);
}

export async function saveNewLockMessage(params) {
  return postJSON('/sportPlatformLock/saveLockMessage.do', params);
}

export async function cancelPlatformLock(params) {
  return postJSON('/sportPlatformLock/cancelAll.do', params);
}

export async function cancelLockedLogs(params) {
  return postJSON('/sportPlatformLock/cancel.do', params);
}

export async function cancelFoeverLocked(params) {
  return postJSON('/sportPlatformForeverLock/cancel.do', params);
}

export async function deleteFoeverLocked(params) {
  return postJSON('/sportPlatformForeverLock/delete.do', params);
}

export async function changeFoeverLockedDate(params) {
  return postJSON('/sportPlatformForeverLock/update.do', params);
}

export async function queryFoeverLockedExcludeDate(params) {
  return get('/sportPlatformForeverRecord/lockDate.do', params);
}
