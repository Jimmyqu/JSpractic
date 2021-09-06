import { get, post, postJSON } from '@/utils/request';

export async function queryVenueList() {
  return get('/commonSales/dataList.do');
}

export async function queryVenueItemList(params) {
  return get('/commonSales/querySalesItemById.do', params);
}

export async function postUpdateVenue(params) {
  return postJSON('/commonSales/update.do', params);
}

export async function queryCourseSalesOpenTime(params) {
  return get('/commonSales/querySalesId.do', params);
}

export async function fetchPlatformListBySalesId(params) {
  // TODO 通用接口，api路径很奇怪
  return get('/sportPlatform/querySportPlatformListBySalesId.do', params);
}

export async function fetchServiceUserListBySalesId(params) {
  // TODO 通用接口，api路径很奇怪
  return get('/sportPlatformUser/querySportPlatformUserListBySalesId.do', params);
}

// 1.添加和局部更新
export async function postNewOrEditTheaterSetting(params) {
  return postJSON('/culturePlatform/save.do', params);
}

// 2.剩余字段的局部更新
export async function postUpdateTheaterMatrixCfg(params) {
  return postJSON('/culturePlatform/update.do', params);
}

export async function deleteTheaterSetting(params) {
  return post('/culturePlatform/delete.do', params);
}
