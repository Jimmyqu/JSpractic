import { sessionStore } from './store';

function getKey() {
  if (process.browser) {
    return `form-store:${location.href.split('#')[0]}`;
  }
  return null;
}

/**
 * 编
 * @param {*} mapping
 */
function encode(mapping) {
  return mapping;
}

/**
 * 解
 * @param {*} data
 */
function decode(data) {
  return data || {};
}

/**
 * 保存一次
 * @param {*} mapping
 */
function saveStoreMapping(mapping) {
  sessionStore.put(getKey(), encode(mapping));
}

/**
 * 获取存储
 */
function getStoreMapping() {
  return decode(sessionStore.get(getKey()));
}

/**
 * 存储表单
 * @param {*} formId
 * @param {*} formValues
 */
export function saveFormData(formId, formValues) {
  if (formId == null || formValues == null) {
    return;
  }
  const store = getStoreMapping();
  store[formId] = formValues;
  saveStoreMapping(store);
}

/**
 * 获取表单存储
 * @param {*} formId
 */
export function getFormData(formId) {
  if (formId == null) {
    return;
  }
  const store = getStoreMapping();
  return store[formId];
}
