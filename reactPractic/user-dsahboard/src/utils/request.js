import fetch from 'dva/fetch';

async function parseJSON(response) {
  // console.log(response.json())
  let res =await response.json() 
  return {
    data:res,
    data_count:response.headers.get('x-total-count')?response.headers.get('x-total-count'):0
  };
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options) {

  let res = await fetch(url, options)
  return parseJSON(checkStatus(res))

  // return fetch(url, options)
  //   .then(checkStatus)
  //   .then(parseJSON)
  //   .then(data => (data))
  //   .catch(err => ({ err }));
}
