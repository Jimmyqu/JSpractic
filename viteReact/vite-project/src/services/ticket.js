import { get, post, postJSON } from '@/utils/request';

export async function checkTicket(params) {
  return postJSON('/dealTicket/save.do', params);
}

export async function postReplaceSeat(params) {
  return postJSON('/dealTicket/replaceTicketSeat.do', params);
}

export async function queryTicketDetail(params) {
  return get('/ticket/detail.do', params);
}

export async function queryConfirmTicketInfo(params) {
  return get('/ticket/confirmTicketInfo.do', params);
}

export async function postNewOrEditSeatCategory(params) {
  return postJSON('/seatCategory/save.do', params);
}

export async function removeSeatCategoryByIds(params) {
  return post('/seatCategory/delete.do', params);
}

export async function querySeatCategoryList(params) {
  return get('/seatCategory/selectCategoryType.do', params);
}

export async function removeSeatByIds(params) {
  return post('/seatNumber/delete.do', params);
}

export async function queryAllSeat(params) {
  return get('/seatNumber/list.do', params);
}

export async function postSeatsList(params) {
  return postJSON('/seatNumber/save.do', params);
}

export async function postEditSeatsBatch(params) {
  return postJSON('/seatNumber/batchSeatDesc.do', params);
}

export async function postEditSeat(params) {
  return postJSON('/seatNumber/update.do', params);
}

export async function querySeatAreaDataList(params) {
  return get('/seatAreaData/list.do', params);
}

export async function postSeatAreaImg(params) {
  return postJSON('/seatAreaData/uploadPictures.do', params);
}

export async function postSeatAreaDataList(params) {
  return postJSON('/seatAreaData/save.do', params);
}

export async function sortShowIndex(params) {
  return postJSON('/exerciseList/ticketTop.do', params);
}

export async function cleanShowIndex(params) {
  return postJSON('/exerciseList/cleanTop.do', params);
}
