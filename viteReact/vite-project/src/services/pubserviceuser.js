/* eslint-disable import/prefer-default-export */
import { postJSON, get } from '@/utils/request';

export async function postSaveCertCfg(params) {
  return postJSON('/certConfig/save.do', params);
}

export async function removeCertCfgByIds(params) {
  return postJSON('/certConfig/delete.do', params);
}

export async function queryCertCfgById(params) {
  return get('/certConfig/getId.do', params);
}

export async function postSaveAuditCfg(params) {
  return postJSON('/auditConfig/save.do', params);
}

export async function queryCertCfgListForSelect() {
  return get('/certConfig/certConfigList.do');
}

export async function removeAuditCfgByIds(params) {
  return postJSON('/auditConfig/delete.do', params);
}

export async function queryAuditNodeGroupListForSelect(params) {
  return get('/auditGroup/groupList.do', params);
}

export async function postSaveAuditNode(params) {
  return postJSON('/auditNode/save.do', params);
}

export async function removeAuditNodeByIds(params) {
  return postJSON('/auditNode/delete.do', params);
}

export async function postBatchSaveAuditNodeGroup(params) {
  return postJSON('/auditGroup/add.do', params);
}

export async function postEditAuditNodeGroupById(params) {
  return postJSON('/auditGroup/update.do', params);
}

export async function removeAuditNodeGroupByIds(params) {
  return postJSON('/auditGroup/delete.do', params);
}

export async function postAddAuditNodeGroupUser(params) {
  return postJSON('/auditGroupUser/add.do', params);
}

export async function removeAuditNodeGroupUserByIds(params) {
  return postJSON('/auditGroupUser/delete.do', params);
}

export async function postEditAuditNodeGroupUserById(params) {
  return postJSON('/auditGroupUser/update.do', params);
}

export async function removeCertInfoByIds(params) {
  return postJSON('/commonExtConfig/delete.do', params);
}

export async function postEditCertInfoById(params) {
  return postJSON('/commonExtConfig/update.do', params);
}

export async function postAddCertInfoById(params) {
  return postJSON('/commonExtConfig/add.do', params);
}

export async function queryExtFieldCategoryList() {
  return get('/commonExtField/extCategoryList.do');
}

export async function queryCertUserCareerList() {
  return get('/certDataList/certCareer.do');
}

export async function queryCertUserExtConfigSearch(params) {
  return get('/certDataList/extConfigSearch.do', params);
}

export async function queryCertDataList(params) {
  return get('/certDataList/dataList.do', params);
}

export async function postUpdateCertUser(params) {
  return postJSON('/certDataList/update.do', params);
}

export async function postAuditCertUser(params) {
  return postJSON('/certDataList/audit.do', params);
}

export async function postAddCertUser(params) {
  return postJSON('/certDataList/add.do', params);
}

export async function postDeleteCertUsers(params) {
  return postJSON('/certDataList/delete.do', params);
}

export async function postCertDataDetailInfo(params) {
  return postJSON('/certDataList/detail.do', params);
}

export async function postCancelCert(params) {
  return postJSON('/certDataList/cancelCert.do', params);
}

export async function queryCertUserInfo(params) {
  return get('/sysUserCert/getId.do', params);
}

export async function querySysUserCertExtConfigSearch(params) {
  return get('/sysUserCert/extConfigSearch.do', params);
}

export async function querySysUserCertCareerList() {
  return get('/sysUserCert/certCareer.do');
}

export async function certUserlinkPubAccountUser(params) {
  return postJSON('/personnelCert/relationMembersUser.do', params);
}

export async function postUpdateCertUserDetailInfo(params) {
  return postJSON('/sysUserCert/detail.do', params);
}

export async function queryCertAvailableAuditState(params) {
  return get('/auditNode/auditState.do', params);
}

export async function auditKeySave(params) {
  return postJSON('/commonKeyGenerator/save.do', params);
}

export async function auditKeyDelete(params) {
  return postJSON('/commonKeyGenerator/delete.do', params);
}

export async function updateCertNo(params) {
  return postJSON('/certDataList/updateCertNo.do', params);
}

export async function saveExportTemplate(params) {
  return postJSON('/exportTemplate/saveExportTemplate.do', params);
}

export async function postDeleteCertTemplate(params) {
  return postJSON('/exportTemplate/delTemplateByIds.do', params);
}

export async function postEditCertTemplate(params) {
  return postJSON('/exportTemplate/editTemplate.do', params);
}

export async function queryCertDataListByRelType(params) {
  return get('/exportTemplate/getDataListByRelType.do', params);
}

export async function queryKeyListByRelTypeAndImg(params) {
  return get('/exportTemplate/getKeyListByRelTypeAndImg.do', params);
}

export async function queryKeyListByRelTypeAndExcel(params) {
  return get('/exportTemplate/getKeyListByRelTypeAndExcel.do', params);
}

export async function postSaveImageKeys(params) {
  return postJSON('/exportTemplate/saveImageKeys.do', params);
}

export async function queryImageKeysByTemplateId(params) {
  return get('/exportTemplate/getImageKeysByTemplateId.do', params);
}

export async function postExportExcel(params) {
  return get('/exportTemplate/exportExcel.do', params);
}

export async function postExportImage(params) {
  return get('/exportTemplate/exportImage.do', params);
}

export async function postToZipImage(params) {
  return postJSON('/exportTemplate/zipImage.do', params);
}
