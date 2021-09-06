import { get, postJSON } from '@/utils/request';

export async function queryDigitalMediaList(params) {
  return get('/digitalMediaList/dataList.do', params);
}

export async function postEditOrNewPaper(params) {
  return postJSON('/digitalMediaList/save.do', params);
}

export async function deletePaper(params) {
  return postJSON('/digitalMediaList/delete.do', params);
}

export async function queryMediaTemplateData(params) {
  return get('/digitalMediaTemplate/dataList.do', params);
}

export async function postEditOrNewPaperConfig(params) {
  return postJSON('/digitalMediaTemplate/save.do', params);
}

export async function deletePaperConfig(params) {
  return postJSON('/digitalMediaTemplate/delete.do', params);
}

export async function postEditOrAddNewspaper(params) {
  return postJSON('/digitalNewspaper/save.do', params);
}

export async function postEditPublishState(params) {
  return postJSON('/digitalNewspaper/savePublishState.do', params);
}

export async function deleteNewspaper(params) {
  return postJSON('/digitalNewspaper/delete.do', params);
}

export async function queryLayoutList(params) {
  return get('/digitalNewspaperLayout/dataList.do', params);
}

export async function postEditOrAddNewspaperLayout(params) {
  return postJSON('/digitalNewspaperLayout/save.do', params);
}

export async function queryNewspaperLayoutDetail(params) {
  return get('/digitalNewspaperLayout/details.do', params);
}

export async function deleteNewspaperLayout(params) {
  return postJSON('/digitalNewspaperLayout/delete.do', params);
}

export async function editTemplate(params) {
  return postJSON('/digitalNewspaperLayout/saveBatch.do', params);
}

export async function queryNewspaperNewsData(params) {
  return get('/digitalNewspaperNews/dataList.do', params);
}

export async function queryNewspaperNewsDetail(params) {
  return get('/digitalNewspaperNews/details.do', params);
}

export async function postEditOrAddNewspaperNews(params) {
  return postJSON('/digitalNewspaperNews/save.do', params);
}

export async function deleteNewspaperNews(params) {
  return postJSON('/digitalNewspaperNews/delete.do', params);
}

export async function postImgFileWithAliOcr(params) {
  return postJSON('/digital/ocr/advanced.do', params);
}
