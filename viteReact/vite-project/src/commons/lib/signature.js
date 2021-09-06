import moment from 'moment';
import isPlainObject from 'lodash/isPlainObject';
import MD5 from 'md5.js';
import { uuid } from './utils';

/**
 * 请求类型
 */
export const HttpMethodTypes = {
  Get: 'get',
  Post: 'post',
  PostJSON: 'postJSON',
};

/**
 * 通过从0开始累进下标的值步进取ArrayBuffer的部分节选
 * @param {*} array
 */
function getFileBufferByIndexPow(array, length = 10_000) {
  // 文件过大时不要尝试在浏览器调适工具里引用相关对象，会卡住
  if (array == null) {
    return [];
  }
  const result = [];
  for (
    let idx = 0, step = 0, index = 0, total = array.length;
    idx < length;
    idx++, step++, index = (index + step) % total
  ) {
    result.push(array[index]);
  }
  return result;
}

/**
 * 拆解JSON
 * JSON参数类型：
 * 1.对象
 * 2.数组
 * postJSON只有这两种，表单post和get都会封装成对象来解析，所以不存在直接body传递基本类型的情况
 */
async function destructuring(map, key, val, method) {
  if (typeof key === 'string') {
    const useKey = method === HttpMethodTypes.Get ? encodeURIComponent(key) : key;
    if (val == null && (method === HttpMethodTypes.Get || method === HttpMethodTypes.Post)) {
      map[useKey] = '';
      return;
    }
    if (typeof val === 'string' || typeof val === 'boolean' || typeof val === 'number') {
      if (method === HttpMethodTypes.PostJSON && Number.isNaN(val)) {
        return;
      }
      map[useKey] = encodeURIComponent(val.toString());
      return;
    }
    if (method === HttpMethodTypes.Post && Array.isArray(val)) {
      map[useKey] = encodeURIComponent(val.toString());
      return;
    }
    if (process.browser && val instanceof File) {
      map[useKey] = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          // 文件过大时不要尝试在浏览器调适工具里引用相关对象，会卡住
          const charArray = [...new Int8Array(reader.result)];
          const pickArray = getFileBufferByIndexPow(charArray);
          const md5 = new MD5().update(pickArray.join('-')).digest('hex');
          resolve(md5);
        });
        reader.readAsArrayBuffer(val);
      });
      return;
    }
    // TODO: 未完工
    // // 对开发人员统一要求日期类的值传递number值，由于antd(cloud)日期类表单组建默认使用moment类型处理数据，所以提交后台时理论上应该转换一下再提交
    // // 如果代码处忘记处理moment，或者误传了不需要的moment参数，fetch/axios会直接toString(), 所以这里也识别一下
    if (moment.isMoment(val) || val instanceof Date) {
      map[useKey] = encodeURIComponent(val.toISOString());
    }
    // // 其他类型都默认toString
    // if (val) {
    //   map[useKey] = encodeURIComponent(val.toString());
    // }
    // return;
  }
  if (isPlainObject(val)) {
    const prefix = key == null ? '' : key + '.';
    const list = Object.entries(val);
    for (let i = 0; i < list.length; i++) {
      const [k, value] = list[i];
      await destructuring(map, key && method === HttpMethodTypes.Get ? `${key}[${k}]` : `${prefix}${k}`, value, method);
    }
    return;
  }
  if (Array.isArray(val)) {
    const prefix = key == null ? '' : key;
    for (let i = 0; i < val.length; i++) {
      await destructuring(map, `${prefix}[${i}]`, val[i], method);
    }
  }
}

/**
 *
 * @param {map} mapObj
 * @param {map|array} params
 * @returns {string} md5
 */
async function generateSignature(mapObj, urlParams, bodyParams, method, appSecure) {
  const newMap = {
    ...mapObj,
  };
  await destructuring(newMap, null, urlParams, method);
  if (bodyParams) {
    await destructuring(newMap, null, bodyParams, method);
  }
  const entries = Object.entries(newMap);
  entries.sort(([key], [key2]) => {
    if (key < key2) {
      return -1;
    }
    if (key > key2) {
      return 1;
    }
    return 0;
  });
  entries.push(['_key', appSecure]);
  const str = entries.map(([key, value]) => `${key}=${value}`).join('&');
  const md5 = new MD5().update(str).digest('hex');
  // console.log(md5, str);
  return md5;
}

/**
 * 根据参数自动生成请求签名头
 */
export default async (urlParams, bodyParams, method, appSecure, timeOffset = 0) => {
  if (appSecure == null) {
    return {};
  }
  const id = uuid();
  const reqId = id.replace(/-/g, '');

  const now = Date.now();
  const headMapping = {
    nonce: reqId,
    timestamp: now + timeOffset,
  };
  const signStr = await generateSignature(headMapping, urlParams, bodyParams, method, appSecure);
  Object.assign(headMapping, {
    signature: signStr.toUpperCase(),
  });
  return headMapping;
};
