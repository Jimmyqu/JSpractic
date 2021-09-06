import { get, postJSON } from '@/utils/request';

export async function queryCurrent() {
  return get('/queryUserInfo.do');
}

export async function queryMenu() {
  return get('/querySysMenuList.do');
}

export async function querySysUserIds(params) {
  return get('/querySysUserListByMobile.do', params);
}

export async function postChangePwd(params) {
  return postJSON('/sysUser/userPwd.do', params);
}

export async function postChangeMyPwd(params) {
  return postJSON('/sysUser/sysUserPwd.do', params);
}

export async function loadRoleList(params) {
  return get('/sysUser/loadRoleList.do', params);
}

export async function postChangeAuth(params) {
  return postJSON('/sysUser/addUserRole.do', params);
}

export async function postEditOrNew(params) {
  return postJSON('/sysUser/save.do', params);
}

export async function fetchUserListBySomething(params) {
  return get('/sysUser/querySysUserList.do', params);
}

export async function postSendSMS(params) {
  return postJSON('/commonSms/send.do', params);
}

export async function postToCheckSMSForForgot(params) {
  return postJSON('/sysUser/newMoile.do', params);
}

export async function postChangePwdForForgot(params) {
  return postJSON('/sysUser/forgetPwd.do', params);
}
