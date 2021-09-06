import { get, postJSON, post } from '@/utils/request';

export async function queryPubUserCount() {
  return get('/publicAccount/queryPubAccountCount.do');
}

export async function fetchUserListBySomething(params) {
  return get('/publicAccount/queryPubAccountList.do', params);
}

export async function createNewPubUser(params) {
  return postJSON('/publicAccount/save.do', params);
}

export async function fetchPubUserInfo(params) {
  return get('/publicAccount/queryById.do', params);
}

export async function saveUserBasicInfo(params) {
  return postJSON('/publicAccount/basicSave.do', params);
}

export async function postTopUpAmount(params) {
  return postJSON('/publicAccount/recharge.do', params);
}

export async function withdrawAmount(params) {
  return postJSON('/dealWithdraw/savePubAccount.do', params);
}

export async function postTopUpFee(params) {
  return postJSON('/publicAccount/addFee.do', params);
}

export async function adjustmentCreditQuota(params) {
  return postJSON('/publicAccountCredit/quotaAdjustment.do', params);
}

export async function payBackCredit(params) {
  return postJSON('/publicAccountCredit/repayment.do', params);
}

export async function resetPwd(params) {
  return post('/publicAccount/resetPwd.do', params);
}

export async function changeMemberLevel(params) {
  return postJSON('/userMemberLevelAction/changeMemberLevel.do', params);
}

export async function queryMemberLevelByLevelId(params) {
  return get('/memberLevelAction/findByLevelId.do', params);
}

export async function postSaveMemberLevel(params) {
  return postJSON('/memberLevelAction/addOrUpdateMemberLevel.do', params);
}

export async function deleteMemberLevel(params) {
  return post('/memberLevelAction/del.do', params);
}

export async function queryMemberByEquitylId(params) {
  return get('/memberLevelEquityAction/findByEquitylId.do', params);
}

export async function postSaveMemberEquity(params) {
  return postJSON('/memberLevelEquityAction/addOrUpdateMemberLevel.do', params);
}

export async function deleteMemberEquity(params) {
  return post('/memberLevelEquityAction/del.do', params);
}

export async function relevanceBusiness(params) {
  return postJSON('/memberLevelEquityAction/relevanceBusiness.do', params);
}

export async function getMemberLevelEquity(params) {
  return get('/MemberLevelConfigEquityRelAction/dataList.do', params);
}

export async function getLevelList(params) {
  return get('/memberLevelAction/findLevelListByCompanyId.do', params);
}

export async function getListByCompanyId(params) {
  return get('/memberLevelEquityAction/findListByCompanyId.do', params);
}

export async function postSaveOuterRel(params) {
  return postJSON('/memberLevelOuterRelAction/addOrUpdateMemberLevel.do', params);
}

export async function deleteOuterRel(params) {
  return post('/memberLevelOuterRelAction/del.do', params);
}

export async function getSrv(params) {
  return get('/memberLevelAction/findSrvByLogin.do', params);
}

export async function getLevelInfo(params) {
  return get('/memberLevelAction/findLevelInfo.do', params);
}

export async function saveLevelInfo(params) {
  return postJSON('/memberLevelAction/changeLevelInfo.do', params);
}

export async function queryMemberUpgradeMode(params) {
  return get('/memberLevelAction/findUpgradeMode.do', params);
}

export async function queryAllMemberUpgradeMode(params) {
  return get('/memberLevelAction/findAllUpgradeMode.do', params);
}
