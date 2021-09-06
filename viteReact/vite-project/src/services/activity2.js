import { get, postJSON, post } from '@/utils/request';

/**
 * 资质申报动态字段
 * @param {*} params
 */
export async function queryReqFields(params) {
  return get('/reportCompanyList/getReportConfig.do', params);
}

/**
 * 资质申报字段的值
 * @param {*} params
 */
export async function queryReqFieldsValue(params) {
  return get('/reportCompanyList/getReportConfig/value.do', params);
}

export async function postReqFieldsValue(params) {
  return postJSON('/reportCompanyList/saveFiledValue.do', params);
}

export async function postAddNewReviewer(params) {
  return postJSON('/reportAuditUser/save.do', params);
}

export async function postModifySmsConfig(params) {
  return postJSON('/reportAuditUser/sendMessage/save.do', params);
}

export async function postDelReviewer(params) {
  return postJSON('/reportAuditUser/delete.do', params);
}

export async function queryAllNodes(params) {
  return get('/reportExercise/listAllNodes.do', params);
}

/**
 * 查项目配置
 * @param {*} params
 */
export async function queryReqCfg(params) {
  return get('/reportConfig/list.do', params);
}

export async function postReqAudit(params) {
  return postJSON('/reportCompanyList/audit.do', params);
}

export async function queryBasicFields(params) {
  return get('/reportExercise/getDeclareFields.do', params);
}

export async function queryNodeDetail(params) {
  return get('/reportExercise/nodeDetail.do', params);
}

export async function queryActivityLog(params) {
  return get('/reportExercise/findLogList.do', params);
}

export async function queryAuditLog(params) {
  return get('/auditLog/dataList.do', params);
}

export async function postBasicInfo(params) {
  return postJSON('/reportExercise/exerciseSave.do', params);
}

export async function postDataInfo(params) {
  return postJSON('/reportExercise/nodeSave.do', params);
}

export async function postDeleteActivity(params) {
  return post('/reportExercise/delExercise.do', params);
}

export async function postSubmitToAudit(params) {
  return post('/reportExercise/sumbitAudit.do', params);
}

export async function postAudit(params) {
  return postJSON('/reportExercise/audit.do', params);
}

export async function queryExportDetailFieldsConfig(params) {
  return get('/reportConfig/reportConfig.do', params);
}
