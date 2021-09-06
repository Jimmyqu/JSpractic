import { post, get, postJSON } from '@/utils/request';

export async function queryBuildVersion() {
  // return get('/build-version.json', null, { baseURL: '', silent: true });
  return get(
    '/downloadFromUrl.do',
    {
      url: `${window.location.protocol}//${window.location.host}/build-version.json?t=${Date.now()}`,
    },
    { silent: true }
  );
}

export async function doAccountLogin(params) {
  return postJSON('/login.do', params);
}

export async function doAccountLoginByAfs(params) {
  return postJSON('/loginByAfs.do', params);
}

export async function doAccountLogout() {
  return post('/logout.do');
}

export async function queryPayMeanList(params) {
  return get('/scanCodePay/listPayMeans.do', params);
}

export async function fetchQRcodeForScan(params) {
  return postJSON('/pay/qrCodePay.do', params);
}

export async function queryReceiptInfo(params) {
  return get('/scanCodePay/qrCodePayment.do', params);
}

export async function postAddBanUser(params) {
  return postJSON('/publicBlacklist/save.do', params);
}

export async function uploadImgFile(params) {
  return post('/commonFile/uploadFile/1.do', params);
}

export async function uploadDocFile(params) {
  return post('/commonFile/uploadFile/2.do', params);
}

export async function uploadAudioFile(params) {
  return post('/commonFile/uploadFile/15.do', params);
}

export async function uploadPdfToPng(params) {
  return post('/commonFile/uploadFile/pdf2png.do', params);
}

export async function uploadBase64Img(params) {
  return post('/commonFile/uploadBase64File/1.do', params);
}

export async function addFile(params) {
  return postJSON('/commonFile/addFile.do', params);
}

export async function queryFiles(params) {
  return get('/commonFile/queryByFile.do', params);
}

export async function queryFilesByKey(params) {
  return postJSON('/commonFile/queryByFileKeyList.do', params);
}

export async function postStreamFile(params) {
  return postJSON('/commonFile/uploadStreamFile.do', params);
}

export async function postBase64FileWithFaceValid(params) {
  return post('/commonFile/uploadBase64StreamFile.do', params);
}

export async function postStreamFileWithFaceValid(params) {
  return postJSON('/iotFaceData/uploadStreamFaceData.do', params);
}

export async function delStreamFileAndSync(params) {
  return postJSON('/iotFaceData/deleteFaceData.do', params);
}

export async function delStreamFile(params) {
  return postJSON('/commonFile/deleteFile.do', params);
}

export async function updateFileStyle(params) {
  return postJSON('/commonFile/updateStyle.do', params);
}

export async function fetchJsConfig(params) {
  return post('/wechat/getJsConfig.do', params, { silent: true });
}

export async function postWechatScan(params) {
  return postJSON('/matrix/scanCode.do', params);
}

export async function queryInfoByCode(params) {
  return get('/matrix/qrValidCodeQuery.do', params);
}

export async function postVerifyTicket(params) {
  return postJSON('/matrix/checkTicket.do', params);
}

export async function fetchDefaultHomeTown(params) {
  return get('/publicAccount/defaultHomeTown.do', params);
}

export async function getExtValidField(params) {
  return get('/commonExtField/getValidField.do', params);
}

export async function removeContact(params) {
  return postJSON('/publicStudy/removePersonnel.do', params);
}

export async function saveContact(params) {
  return postJSON('/publicStudy/saveStudyPersonnel.do', params);
}

export async function fetchStudyByUser(params) {
  return get('/publicStudy/queryPubStudyList.do', params);
}

export async function fetchStudyById(params) {
  return get('/publicStudy/queryPubStudy.do', params);
}

export async function getCacheValue(params) {
  return get('/designData/queryDataKey.do', params);
}

export async function setCacheValue(params) {
  return postJSON('/designData/save.do', params);
}

export async function postAddICCardBinding(params) {
  return postJSON('/iotIcData/save.do', params);
}

export async function postUpdateIcPhysicsNo(params) {
  return postJSON('/iotIcData/icPhysicsNo.do', params);
}
export async function postUpdateICCardBindState(params) {
  return postJSON('/iotIcData/icState.do', params);
}

export async function postICCardRebindding(params) {
  return postJSON('/iotIcData/update.do', params);
}

export async function queryPersonalizationByPage(params) {
  return get('/sysUserTheme/selectSysUserThemeList.do', params);
}

export async function queryPersonalizationByKey(params) {
  return get('/sysUserTheme/selectSysUserTheme.do', params);
}

export async function postPersonalization(params) {
  return postJSON('/sysUserTheme/save.do', params);
}

export async function updateFaceFile(params) {
  return postJSON('/iotFaceData/updateFaceData.do', params);
}

export async function syncFaceFile(params) {
  return postJSON('/iotFaceData/syncFaceData.do', params);
}
