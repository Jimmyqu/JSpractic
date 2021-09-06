import { stringify, parse } from 'qs';
import signature, { HttpMethodTypes } from '@/commons/lib/signature';
import { baseURL, getPageQuery } from '@/utils/utils';
import { notification } from './feedback';

// 故意数组混淆一下
const xssKeyArr = [
  'Y',
  '8',
  '6',
  'u',
  '8',
  's',
  'r',
  'U',
  'S',
  'h',
  '1',
  '1',
  'k',
  '0',
  '3',
  'C',
  'W',
  'y',
  'x',
  '8',
  'Q',
  'o',
  'v',
  'o',
  'g',
  'k',
  'E',
  '7',
  'M',
  '7',
  'Q',
  'Z',
];

let dispatch;
// eslint-disable-next-line import/no-mutable-exports
let store;

export { store };

const codeMessage = {
  // '200': '服务器成功返回请求的数据。',
  // '201': '新建或修改数据成功。',
  // '202': '一个请求已经进入后台排队（异步任务）。',
  // '204': '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行任何操作。',
  401: '请登录后再操作。',
  403: '您未授权访问请求的页面或资源，请联系相关人员后再试。',
  404: '发出请求的页面或资源不存在，服务器没有进行操作。',
  406: '请求的格式无法获得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护中。',
  504: '网关超时。',
};

function checkStatus(response, custOptions = {}) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = response.statusText || codeMessage[response.status.toString()];
  const { silent } = custOptions;
  if (!silent && response.status !== 401) {
    notification.error(`Code: ${response.status}`, errortext);
  }
  const error = new Error(errortext);
  error.code = response.status;
  error.response = response;
  throw error;
}

// 部分接口用途一致，为避免后端冗余太多，列出不需要前缀的接口
const noBaseURLWhitelist = new Set([]);

function mergeUrl(url, newOptions) {
  if (url) {
    const { baseURL: bsu } = newOptions || {};
    if (!noBaseURLWhitelist.has(url.split('?')[0])) {
      return `${bsu == null ? baseURL : bsu}${url}`;
    }
  }
  return url;
}

const xssKey = xssKeyArr.join('');

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
function request(url, options, custOptions = {}) {
  const newOptions = {
    // credentials: 'include'
    credentials: 'same-origin',
    ...options,
    headers: {
      ...options?.headers,
      'X-Requested-With': 'XMLHttpRequest',
    },
  };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT' || newOptions.method === 'DELETE') {
    // eslint-disable-next-line dot-notation
    newOptions.headers['Accept'] = 'application/json';
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers['Content-Type'] = 'application/json; charset=utf-8';
      newOptions.body = JSON.stringify(newOptions.body);
    }
  }

  return (
    fetch(mergeUrl(url, custOptions), newOptions)
      // .then(response => {
      //   return checkStatus(response, custOptions);
      // })
      .then(response => {
        try {
          if (newOptions.method === 'DELETE' || response.status === 204) {
            return response.text();
          }
          return response.json().catch(() => ({
            code: response.status,
          }));
        } catch (e) {
          if (response.status in codeMessage) {
            // 有配置
            return {
              code: response.status,
            };
          }
          throw e;
        }
      })
      .then(data => {
        const result = data || {};
        // 只check不使用返回值
        checkStatus(
          {
            status: result.code,
            statusText: result.msg,
          },
          custOptions
        );
        return result.data;
      })
      .catch(e => {
        const status = e.code;
        if (status === 401) {
          dispatch({
            type: 'login/logout',
            payload: window.location.href,
          });
          return;
        }
        if (status == null) {
          notification.error(`请检查网络，若连接正常请联系管理员：${e.message}`);
        }
        throw e;
      })
  );
}

export async function get(u, prms, options) {
  let url = u;
  const params = prms || {};
  params.t = Date.now();
  if (params) {
    const sp = url.split('?');
    const str = sp[1] || '';
    const obj = parse(str);
    Object.assign(obj, params);
    const serialize = stringify(obj);
    if (serialize) {
      url = `${sp[0]}?${serialize}`;
    }
  }
  // duration 在登陆后的某个接口才有，有时钟偏移的设备登陆之前以及登陆接口就有问题了，目前采取后台不检查那些接口的方式处理
  const duration = store?.getState()?.user?.currentUser?.duration || 0;
  const mapping = await signature(getPageQuery(url), null, HttpMethodTypes.Get, xssKey, -duration);
  return request(
    url,
    {
      headers: mapping,
    },
    options
  );
}

export async function post(url, params, o) {
  const opts = o || {};
  if (opts.form == null) {
    opts.form = true;
  }
  // duration 在登陆后的某个接口才有，有时钟偏移的设备登陆之前以及登陆接口就有问题了，目前采取后台不检查那些接口的方式处理
  const duration = store?.getState()?.user?.currentUser?.duration || 0;
  const mapping = await signature(
    getPageQuery(url),
    params,
    opts.form ? HttpMethodTypes.Post : HttpMethodTypes.PostJSON,
    xssKey,
    -duration
  );
  const options = {
    method: 'POST',
    headers: mapping,
  };
  if (params) {
    if (opts.form) {
      const formData = new FormData();
      Object.keys(params).forEach(key => {
        // fetch(cloud) 主动兼容一下 axios(portal) 发送不同参数到服务器导致的签名差异------------start
        if (params[key] == null) {
          formData.append(key, '');
          return;
        }
        // fetch(cloud) 主动兼容一下 axios(portal) 发送不同参数到服务器导致的签名差异------------end
        formData.append(key, params[key]);
      });
      options.body = formData;
      // options.headers = {
      //   'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      // }
      // options.body = Object.keys(params)
      //   .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      //   .join('&')
    } else {
      options.body = params;
    }
  }
  return request(url, options, opts);
}

export function postJSON(url, params, opts) {
  return post(url, params, {
    ...opts,
    form: false,
  });
}

// 用临时用这种方式解决循环依赖
export default (d, s) => {
  if (dispatch == null) {
    dispatch = d;
  }
  if (store == null) {
    store = s;
  }
};
