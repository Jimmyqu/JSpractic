import { get, postJSON } from '@/utils/request';

/**
 * 申报基础资料表单固定字段
 * @param {*} params
 */
export async function queryDeclareFixedFields(params) {
  return get('/exerciseList/getDeclareFixedFields.do', params);
}

/**
 * 申报类型列表, 配置tree
 * @param {*} params
 */
export async function queryDeclareTypes(params) {
  return get('/exerciseList/listDeclareType.do', params);
}

/**
 * 申报基础资料表单扩展字段
 * @param {*} params
 */
export async function queryDeclareFields(params) {
  return get('/exerciseList/getDeclareFields.do', params);
}

export async function deleteActivity(params) {
  return postJSON('/exerciseList/deleted.do', params);
}

export async function queryActivityDeclareLog(params) {
  return get('/exerciseList/listDeclareLog.do', params);
}

export async function queryActivityNodeDetail(params) {
  return get('/exerciseList/nodeDetail.do', params);
}

export async function queryActivityNodeList(params) {
  return get('/exerciseList/listAllNode.do', params);
}

export async function queryActivityDeclareCompanyList(params) {
  return get('/exerciseList/listDeclareCompany.do', params);
}

export async function saveActivity(params) {
  return postJSON('/exerciseList/save.do', params);
}

export async function saveActivityNode(params) {
  return postJSON('/exerciseList/nodeSave.do', params);
}

export async function submitActivityNode(params) {
  return postJSON('/exerciseList/nodeSubmit.do', params);
}

export async function auditActivityNode(params) {
  return postJSON('/exerciseList/audit.do', params);
}

export async function saveActivityExtensions(params) {
  return postJSON('/exerciseList/extensionsSave.do', params);
}

export async function queryProjectGroupList(params) {
  return get('/exerciseProject/queryProjectGroupList.do', params);
}

export async function queryExerciseDeclareFillList(params) {
  return get('/exerciseProject/queryExerciseDeclareFillList.do', params);
}
