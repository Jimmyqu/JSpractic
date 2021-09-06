/* eslint-disable import/prefer-default-export */
import { get, postJSON, post } from '@/utils/request';

export async function fetchCategoryList() {
  return get('/commonMessage/getMessageStatusList.do');
}

export async function fetchTemplateCode(params) {
  return get('/messageTemplate/messageTemplateCode.do', params);
}

export async function getSrvList() {
  return get('/messageTemplate/getSrvList.do');
}

export async function saveMessagePushConfig(params) {
  return postJSON('/messagePushConfig/saveMessagePushConfig.do', params);
}

export async function applyPushConfig(params) {
  return post('/messagePushConfig/applyPushConfig.do', params);
}

export async function delByIds(params) {
  return post('/messageReceiveUser/delByIds.do', params);
}

export async function excelLoad(params) {
  return post('/messageReceiveUser/excelLoad.do', params);
}

export async function mobileLoad(params) {
  return post('/messageReceiveUser/mobileLoad.do', params);
}

export async function delMessage(params) {
  return post('/messagePushConfig/delMessagePushConfig.do', params);
}

export async function runSend(params) {
  return post('/messagePushConfig/runSend.do', params);
}

export async function messageConfigInfo(params) {
  return get('/messagePushConfig/messagePushConfigInfo.do', params);
}

export async function addUser(params) {
  return post('/messageReceiveUser/addUser.do', params);
}
