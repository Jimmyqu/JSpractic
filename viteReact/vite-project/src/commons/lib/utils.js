import moment from 'moment';

export const CDN_STATIC_HOST = '//cdnstatic.ydmap.cn';
export const CDN_IMG_HOST = '//cdnimg.ydmap.cn';
export const DEFAULT_PIC_PATH = `${CDN_IMG_HOST}/news/0`;
export const DEFAULT_PIC_FULLPATH = `${CDN_IMG_HOST}/news/0/300X300.jpg`;
export const DEFAULT_USER_AVATAR_PIC_PATH = `${CDN_IMG_HOST}/user/0`;
export const DEFAULT_PUBUSER_AVATAR_PIC_PATH = `${CDN_IMG_HOST}/publicuser/0`;
export const DEFAULT_GIFT_PIC_PATH = `${CDN_IMG_HOST}/gift/0`;
export const DEFAULT_SALES_PIC_PATH = `${CDN_IMG_HOST}/commonsales/0`;
export const DEFAULT_TICKET_PIC_PATH = `${CDN_IMG_HOST}/exerciselist/0`;
export const DEFAULT_PUBSERVICE_PIC_PATH = `${CDN_IMG_HOST}/pubservice/0`;

export const LOCATION_URL_BASE = process.browser ? `${location.protocol}//${location.host}` : '';

const ua = process.browser ? navigator.userAgent : '';

function userAgentIsWeixin(userAgent = '') {
  return !!/micromessenger/.test(userAgent.toLowerCase());
}

function userAgentIsAlipay(userAgent = '') {
  return !!/alipayclient/.test(userAgent.toLowerCase());
}

function userAgentIsWeLink(userAgent = '') {
  const lowerUA = userAgent.toLowerCase();
  return !!(/welink/.test(lowerUA) || /anyoffice/.test(lowerUA));
}

function userAgentIsISZ(userAgent = '') {
  return !!/szsmt/.test(userAgent.toLowerCase());
}

function userAgentIsPDA(userAgent = '') {
  return !!/pda/.test(userAgent.toLowerCase());
}

export function isWeiXin() {
  if (process.browser) {
    return userAgentIsWeixin(ua);
  }
  return false;
}

export function isWeLink() {
  if (process.browser) {
    return userAgentIsWeLink(ua);
  }
  return false;
}

export function isISZ() {
  if (process.browser) {
    return userAgentIsISZ(ua);
  }
  return false;
}

export function isAlipay() {
  if (process.browser) {
    return userAgentIsAlipay(ua);
  }
  return false;
}

export function isPDA() {
  if (process.browser) {
    return userAgentIsPDA(ua);
  }
  return false;
}

export function isMacOS() {
  if (process.browser) {
    return !!/Macintosh;.+Mac OS X/.test(ua);
  }
  return false;
}

export function isiOS() {
  if (process.browser) {
    return !!/\(i[^;]+;( U;)? CPU.+Mac OS X/.test(ua);
  }
  return false;
}

export function isiOSMobile() {
  if (process.browser) {
    return !!/ip(ad|hone|od)/i.test(ua);
  }
  return false;
}

export function isAndorid() {
  if (process.browser) {
    return ua.includes('Android') || ua.includes('Adr');
  }
  return false;
}

// function isBlackBerry() {
//   if (process.browser) {
//     return /BlackBerry/i.test(ua)
//   }
//   return false
// }

export function isWindowsPhone() {
  if (process.browser) {
    return /iemobile/i.test(ua);
  }
  return false;
}

export function isMobileDevice() {
  // return isAndorid() || isiOSMobile() || isBlackBerry() || isWindowsPhone()
  return isAndorid() || isiOSMobile() || isWindowsPhone() || isPDA();
}

export function isSZSMT() {
  if (process.browser) {
    const sc = window.sc;
    return isISZ() && sc && sc.isSZSMT();
  }
  return false;
}

export function screenSize() {
  if (process.browser) {
    return {
      width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
    };
  }
  return {}; // ssr
}

export function clearHMS(long) {
  if (long == null) {
    return null;
  }
  let mmt = long;
  if (!moment.isMoment(mmt)) {
    mmt = moment(long);
  }
  return mmt.clone().hour(0).minute(0).second(0).millisecond(0);
}

/**
 * 转换旧时间(纠正年月日)
 * 服务器端的startTime和endTime始终是2013年，只有时分秒是正确的
 * @param {number} dateTime 转换参考日期
 * @param {number|moment} long 转换值
 * @param {boolean} fixForLastSlot 是否最后一个slot
 */
export function changeDayForTimeSlot(dateTime, long, fixForLastSlot) {
  if (!isNumber(dateTime)) {
    return long;
  }
  let mmt = null;
  if (moment.isMoment(long)) {
    mmt = long;
  }
  if (isNumber(long)) {
    mmt = moment(long);
  }
  if (moment.isMoment(mmt)) {
    const newMmt = moment(dateTime);
    const hour = mmt.hour();
    const minute = mmt.minute();
    const second = mmt.second();
    const millisecond = mmt.millisecond();
    newMmt.hour(hour).minute(minute).second(second).millisecond(millisecond);
    // 如果是最后一行且为0点
    if (fixForLastSlot && hour === 0 && minute === 0 && second === 0 && millisecond === 0) {
      newMmt.add(1, 'days'); // 加一天
    }
    return newMmt.valueOf();
  }
  return long;
}

/**
 * 是否同一天
 * @param {*} arg1
 * @param {*} arg2
 */
export function isSameDay(arg1, arg2) {
  let mmt = arg1;
  let mmt2 = arg2;
  if (mmt == null || mmt2 == null) {
    return false;
  }
  if (!moment.isMoment(mmt)) {
    mmt = moment(mmt);
  }
  if (!moment.isMoment(mmt2)) {
    mmt2 = moment(mmt2);
  }
  if (mmt.valueOf() === mmt2.valueOf()) {
    return true;
  }
  return mmt.year() === mmt2.year() && mmt.month() === mmt2.month() && mmt.date() === mmt2.date();
}

/**
 * 日期1是否日期2以前，忽略时分秒
 */
export function isBefore(arg1, arg2) {
  if (arg1 == null || arg2 == null) {
    return false;
  }
  let mmt = arg1;
  if (!moment.isMoment(mmt)) {
    mmt = moment(mmt);
  }
  mmt = clearHMS(mmt);
  const mmt2 = clearHMS(arg2);
  if (mmt.year() < mmt2.year()) {
    return true;
  }
  if (mmt.year() > mmt2.year()) {
    return false;
  }
  // 到这里年份相同
  if (mmt.month() < mmt2.month()) {
    return true;
  }
  if (mmt.month() > mmt2.month()) {
    return false;
  }
  // 到这里月份相同
  return mmt.date() < mmt2.date();
}

/**
 * 日期是否今天以前，忽略时分秒
 */
export function isBeforeToday(arg1) {
  return isBefore(arg1, moment());
}

export function dataURLtoBlob(base64Str) {
  if (base64Str == null) {
    return null;
  }
  const arr = base64Str.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = decodeBase64(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n) {
    n -= 1;
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * 判断是否数字
 * @param {*} value
 */
export function isNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * 判断是否类似数组，比如字符串的数字
 * @param {*} value
 */
export function isNumerical(value) {
  if (isNumber(value)) {
    return true;
  }
  if (typeof value === 'string') {
    const str = value.trim();
    if (str.length > 0) {
      return isNumber(+str);
    }
  }
  return false;
}

export function triggerEvent(el, type) {
  // if ('createEvent' in document) {
  // modern browsers, IE9+
  const e = document.createEvent('HTMLEvents');
  e.initEvent(type, false, true);
  el.dispatchEvent(e);
  // }
}

/**
 * 时间戳转换为天数
 * @param {*} number
 */
export function getDayByTimeStamp(long) {
  if (long == null) {
    return null;
  }
  return long / (1000 * 3600 * 24);
}

const mobileReg = /^0?1\d{10}$/;

/**
 * 手机号验证
 * @param {*} str
 */
export function isMobile(str) {
  return mobileReg.test(str);
}

const emailReg = /^[\d_a-z]+(\.[\d_a-z]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/;

/**
 * 邮箱验证
 * @param {*} str
 */
export function isEmail(str) {
  return emailReg.test(str);
}

const complexPwdReg6 = /^(?!\d+$)(?![A-Za-z]+$)[\dA-Za-z]{6,16}$/;

// const complexPwdReg8 = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,16}$/;
const complexPwdReg8 = /^(?!\d+$)(?![A-Za-z]+$)[\dA-Za-z]{8,16}$/;

/**
 * 是否高强度密码
 * @param {*} str
 */
export function isComplexPwd(str) {
  return complexPwdReg6.test(str);
}

export function isComplexPwd8(str) {
  return complexPwdReg8.test(str);
}

/**
 * 15位身份证验证
 * @param {*} str
 */
export function isIDNumber15(str) {
  return /^[1-9]\d{7}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$/.test(str);
}

/**
 * 18位身份证验证
 * @param {*} str
 */
export function isIDNumber18(str) {
  return /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[\dXx]$/.test(str);
}

/**
 * 香港身份证号验证
 * @param {*} val
 */
export function isHKIDNumber(val) {
  let str = val;
  if (str) {
    const strValidChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // basic check length
    if (str.length < 8) {
      return false;
    }

    // handling bracket
    if (str.charAt(str.length - 3) === '(' && str.charAt(str.length - 1) === ')') {
      str = str.slice(0, Math.max(0, str.length - 3)) + str.charAt(str.length - 2);
    }

    // convert to upper case
    str = str.toUpperCase();

    // // regular expression to check pattern and split
    const hkidPat = /^([A-Z]{1,2})(\d{6})([\dA])$/;
    const matchArray = str.match(hkidPat);

    // // not match, return false
    if (matchArray == null) {
      return false;
    }

    // the character part, numeric part and check digit part
    const charPart = matchArray[1];
    const numPart = matchArray[2];
    const checkDigit = matchArray[3];

    // calculate the checksum for character part
    let checkSum = 0;
    if (charPart.length === 2) {
      checkSum += 9 * (10 + strValidChars.indexOf(charPart.charAt(0)));
      checkSum += 8 * (10 + strValidChars.indexOf(charPart.charAt(1)));
    } else {
      checkSum += 9 * 36;
      checkSum += 8 * (10 + strValidChars.indexOf(charPart));
    }

    // calculate the checksum for numeric part
    for (let i = 0, j = 7; i < numPart.length; i += 1, j -= 1) {
      checkSum += j * numPart.charAt(i);
    }

    // verify the check digit
    const remaining = checkSum % 11;
    const verify = remaining === 0 ? 0 : 11 - remaining;

    return verify === Number(checkDigit) || (verify === 10 && checkDigit === 'A');
  }
  return false;
}

/**
 * 身份证号验证
 * @param {*} str
 */
export function isIDNumber(str) {
  if (str) {
    if (str.length === 15) {
      return isIDNumber15(str);
    }
    if (str.length === 18) {
      return isIDNumber18(str);
    }
  }
  return false;
}

/**
 * 身份证号验证并匹配生日
 * @param {*} str
 * @param {*} birthday
 */
export function isIDNumberAndMatchBirthday(str, birthday) {
  if (birthday) {
    const bsdMmt = moment(birthday);
    if (isIDNumber(str)) {
      const idMmt = getMomentByIdNumber(str);
      return isSameDay(bsdMmt, idMmt);
    }
  }
  return false;
}

/**
 * 通过身份证获取生日
 * @param {*} value
 */
export function getMomentByIdNumber(value) {
  if (isIDNumber(value)) {
    if (isIDNumber18(value)) {
      // 18
      return moment(value.slice(6, 14), 'YYYYMMDD');
    }
    if (isIDNumber15(value)) {
      // 15
      return moment(value.slice(6, 12), 'YYMMDD');
    }
  }
  return null;
}

export function uuid() {
  let d = Date.now();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.trunc((d + Math.random() * 16) % 16);
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/**
 * 是否http/https协议开头的url
 * @param {*} url
 */
export function isStartsWithProtocol(url) {
  return /^((http|https|ws|wss):)?\/\/([\w.]+\/?)\S*/.test(url);
}

/**
 * 查找组件垂直相对滚动对象dom
 * @param {Element} referDom
 */
export function getVerticalScrollTarget(referDom) {
  if (!(referDom instanceof Element)) {
    return referDom;
  }

  let currentNode = referDom;
  // see http://w3help.org/zh-cn/causes/SD9013 and http://stackoverflow.com/questions/17016740/onscroll-function-is-not-working-for-chrome
  while (
    currentNode &&
    currentNode.tagName !== 'HTML' &&
    currentNode.tagName !== 'BODY' &&
    currentNode.nodeType === 1
  ) {
    const overflowY = window.getComputedStyle(currentNode).overflowY;
    if (overflowY === 'scroll' || overflowY === 'auto') {
      return currentNode;
    }
    currentNode = currentNode.parentNode;
  }
  return window;
}

/**
 * 将Blob数据下载到本地
 * @param {*} blob
 * @param {*} fileName
 */
export function downloadByBlob(blob, fileName) {
  if (!(blob instanceof Blob)) {
    return;
  }
  // 创建隐藏的可下载链接
  const eleLink = document.createElement('a');
  eleLink.download = fileName || Date.now();
  eleLink.style.display = 'none';
  eleLink.href = window.URL.createObjectURL(blob);
  eleLink.target = '_blank';
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  eleLink.remove();
}

/**
 * 通过base64Str下载为图片，可能有兼容性问题，各自try catch
 * @param {*} base64Str
 */
export function downloadImgByBase64(base64Str, fileName) {
  if (base64Str == null) {
    return;
  }
  // window.location.href = base64Str.replace('image/png', 'image/octet-stream');

  // 字符内容转变成blob地址
  const blob = dataURLtoBlob(base64Str);
  downloadByBlob(blob, fileName);
}

/**
 * 图片预览
 * @param {*} event
 */
export function imagePreview(e) {
  if (e.target.tagName === 'IMG' && isWeiXin()) {
    const imgs = [];
    const imgList = e.currentTarget.querySelectorAll('img');
    Object.values(imgList).map(item => imgs.push(item.currentSrc));
    window.jWeixin.previewImage({
      current: e.target.src,
      urls: imgs,
    });
  }
}

/**
 * 在window上面执行字符串取值,支持abc.abc.abc...多层的形式
 * @param {*} str
 * @param {*} obj
 */
export function execVarsInWindow(str, obj) {
  if (str == null) {
    return;
  }
  const target = obj || window;
  const firstPoint = str.indexOf('.');
  if (firstPoint === 0) {
    throw new Error('变量不能以.开头');
  }
  const vars = str.slice(0, Math.max(0, firstPoint > 0 ? firstPoint : str.length));
  const value = target[vars];
  if (value == null) {
    return null;
  }
  const substr = str.slice(vars.length);
  if (substr.length === 0) {
    return value;
  }
  return execVarsInWindow(substr, value);
}

export const InjectErrorName = 'ScriptInitializationFailed';

/**
 * 异步加载css资源
 */
export function asyncInjectCSS(url) {
  return new Promise((resolve, reject) => {
    if (!process.browser) {
      reject(new Error('This Fun only works in browser'));
      return;
    }
    const cssLinks = [...document.querySelectorAll('link[rel="stylesheet"]')];
    if (cssLinks.some(link => link.href === url)) {
      resolve(false);
      return;
    }
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    if ('onload' in link) {
      link.addEventListener('load', function () {
        resolve(true);
      });
    } else if (link.readyState) {
      // eslint-disable-next-line unicorn/prefer-add-event-listener
      link.onreadystatechange = function () {
        if (link.readyState === 'loaded' || link.readyState === 'complete') {
          // eslint-disable-next-line unicorn/prefer-add-event-listener
          link.onreadystatechange = null;
          resolve(true);
        }
      };
    }
    link.setAttribute('href', url);
    const head = document.querySelectorAll('head')[0];
    head.appendChild(link);
  });
}

/**
 * 异步加载js资源
 * @param {*} url
 * @param {*} globalName
 */
export function asyncInjectScript(url, globalName) {
  return new Promise((resolve, reject) => {
    if (!process.browser) {
      reject(new Error('This feature only works in browser'));
      return;
    }
    if (url == null) {
      reject(new Error("'url' params is required"));
      return;
    }
    if (globalName) {
      const value = execVarsInWindow(globalName);
      // 指定了全局名称，则检查是否存在
      if (value) {
        resolve(value);
        return;
      }
    }
    const tag = document.querySelector(`script[src="${url}"]`);
    const script = tag || document.createElement('script');
    if (tag == null) {
      script.setAttribute('charset', 'utf-8');
    }
    if (globalName == null) {
      if ('onload' in script) {
        script.addEventListener('load', function () {
          resolve();
        });
      } else if (script.readyState) {
        // eslint-disable-next-line unicorn/prefer-add-event-listener
        script.onreadystatechange = function () {
          if (script.readyState === 'loaded' || script.readyState === 'complete') {
            // eslint-disable-next-line unicorn/prefer-add-event-listener
            script.onreadystatechange = null;
            resolve();
          }
        };
      }
    }

    const start = moment();
    if (tag == null) {
      script.setAttribute('src', url);
      // script.setAttribute('async', '')
      const body = document.querySelectorAll('body')[0];
      body.appendChild(script);
    }

    if (globalName) {
      const fn = function () {
        const value = execVarsInWindow(globalName);
        // 指定了全局名称，则检查是否存在
        if (value) {
          // i深圳js-sdk使用Proxy代理了globalName得到的东西，resolve它时会触发Promise规范的隐式调用then方法判断是不是个Promise
          // 但i深圳js-sdk判断then在代理对象不存在，抛出了异常
          // ------------------------------i深圳js-sdk补丁开始------------------------------
          // if (value.then == null) {
          //   // 如果复写为一个空then, asyncInjectScript提供第二个参数的情况，就不能符合预期的返回；then再返回本身也仍然逃不出这个代理
          //   value.then = () => {};
          // }
          // ------------------------------i深圳js-sdk补丁结束------------------------------
          resolve(value);
          return;
        }
        const diff = moment().diff(start, 'milliseconds'); // 之后多少毫秒
        if (diff > 1000 * 5) {
          // 超过x秒报错
          const err = new Error('Inject failed');
          err.name = InjectErrorName;
          reject(err);
        } else {
          setTimeout(fn, 100); // 继续等待
        }
      };
      setTimeout(fn, 0);
    }
  });
}

/**
 * 压缩base64图片
 * @param {*} base64Str, base64字符
 * @param {*} width, 目标宽
 * @param {*} height , 目标高
 */
export function compressImg(base64Str, scale = 1, keepSize = true) {
  return new Promise((resolve, reject) => {
    if (base64Str == null || scale >= 1 || scale <= 0) {
      resolve(base64Str);
      return;
    }
    const img = new Image();
    img.addEventListener('load', function () {
      const originWidth = img.width;
      const originHeight = img.height;
      const targetWidth = originWidth * scale;
      const targetHeight = originHeight * scale;
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const imgFinal = new Image();
      imgFinal.addEventListener('load', function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // 擦除一次
        if (keepSize) {
          canvas.width = originWidth;
          canvas.height = originHeight;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL('image/jpeg', 1));
      });
      imgFinal.src = canvas.toDataURL('image/jpeg', 1);
    });
    img.src = base64Str;
  });
}

/**
 * 兼容wx.getLocalImgData返回的localData
 * @param {*} str, 类base64字符串
 */
export function getLocalImgDataCompatible(str) {
  if (str == null) {
    return null;
  }
  let base64 = str;
  // 安卓没有头部的base64码
  if (!base64.startsWith('data:image')) {
    base64 = `data:image/jpeg;base64,${base64}`;
  }
  // 安卓可能有换行符，iOS上类型是jgp（连jpg都不是）而非jpeg
  return base64.replace(/\r|\n/g, '').replace('data:image/jgp', 'data:image/jpeg');
}

/**
 * encode base64
 * @param {*} value
 */
export function encodeBase64(value) {
  if (value == null) {
    return null;
  }
  value = encodeURIComponent(value);
  if (process.browser) {
    return btoa(value);
  }
  return Buffer.from(value).toString('base64');
}

/**
 * decode base64
 * @param {*} value
 */
export function decodeBase64(value) {
  if (value == null) {
    return null;
  }
  const val = process.browser ? atob(value) : Buffer.from(value, 'base64').toString();
  return decodeURIComponent(val);
}

/**
 * encodeURIComponent 后再 base64
 * @param {*} value
 */
export function encodeRequestValue(value) {
  if (value == null) {
    return null;
  }
  return encodeBase64(encodeURIComponent(value));
}

/**
 * 当值为null时转换为undefined, 否则原样返回
 */
export function toUndefinedIfNull(val) {
  if (val === null) {
    return;
  }
  return val;
}

// 单例
let injectHighchartsPromise;

export function asyncInjectHighcharts() {
  if (injectHighchartsPromise == null) {
    injectHighchartsPromise = asyncInjectScript(
      'https://cdn.highcharts.com.cn/highcharts/8.1.2/highcharts.js',
      'Highcharts'
    );
  }
  return injectHighchartsPromise;
}

/**
 * 加载Highcharts扩展模块，待需要时再完善
 */
// export function asyncInjectHighchartsModules(list) {
//   const arr = [];
//   if (Array.isArray(list)) {
//     arr.push(...list);
//   } else if (typeof list === 'string') {
//     arr.push(list);
//   }
//   const newList = [...new Set(arr)];
//   return Promise.all(
//     newList.map(item => asyncInjectScript('https://code.highcharts.com/8.1.0/highcharts.js', 'Highcharts'))
//   );
// }

/**
 * 传入什么返回什么
 * @param {*} val
 */
export function pureFunc(val) {
  return val;
}

export function trimHTML(htmlStr) {
  if (htmlStr == null) {
    return '';
  }
  const div = document.createElement('div');
  div.innerHTML = htmlStr;
  return div.textContent || div.innerText;
}

/**
 * 清理DOM Node，删除注释、CDATA、DOCTYPE
 * @param {*} node
 */
export function cleanDomNode(n) {
  const treeWalker = document.createTreeWalker(n);
  // 遍历注释节点
  const arrNodeRemove = [];
  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode;
    const { nodeType } = node;
    if (
      nodeType === Node.COMMENT_NODE || // 注释节点
      nodeType === Node.CDATA_SECTION_NODE || // CDATA
      nodeType === Node.DOCUMENT_TYPE_NODE // DOCTYPE
    ) {
      arrNodeRemove.push(node);
    }
  }
  // 删除不要的节点
  arrNodeRemove.forEach(function (node) {
    node.parentNode.removeChild(node);
  });
}

/**
 * 解析XMLDocument为base64
 * @param {*} xmlDoc
 * @returns
 */
export function xmlDocToBase64(xmlDoc) {
  const str = new XMLSerializer().serializeToString(xmlDoc);
  return `data:image/svg+xml;utf8,${encodeURIComponent(str)}`;
}

/**
 * 根据自定义的作色或者属性配置修改XMLDocument, 是一个约定配置
 * @param {*} xmlDoc
 * @param {*} colorInfo
 * 例如 {
          plane: '#f26a3e',
          line: '#f6f6f6',
          tag: {
            opacity: 0,
          },
          selected: {
            opacity: 1,
          },
        };
 * @returns
 */
export function fillAndAttrXmlDoc(xmlDoc, colorInfo) {
  if (colorInfo == null) {
    return;
  }
  // 找到plane、line、tag、selected等支持的配置，修改
  Object.keys(colorInfo).forEach(key => {
    const value = colorInfo[key];
    // svg文件约定：svg标签的直接子节点带有plane样式的是面，带有line样式的是线, 带有tag样式的是中间的东西，带有selected样式的是选中后显示，需要移除tag
    if (value) {
      const planes = xmlDoc.querySelectorAll(`${`svg > .${key}`}`);
      [...planes].forEach(node => {
        // string配置认为是fill
        if (typeof value === 'string') {
          node.setAttribute('fill', value);
          return;
        }
        // 不是string就认为是对象，处理成attr
        Object.keys(value).forEach(attr => {
          if (value[attr] == null) {
            return;
          }
          node.setAttribute(attr, value[attr]);
        });
      });
    }
  });
}

const DefaultShareConfig = process.browser
  ? {
      title: document.title || location.href,
      link: location.href,
      img: `https:${CDN_STATIC_HOST}/themes/mobile/blue/images/ydmap.png`,
      // img: 'https://image.ydmap.cn/default_file/default_load_img.jpg@!img_small_200X200_prew',
      desc: location.href,
    }
  : {};

/**
 * 直接了当地拉起宿主环境的分享交互界面，如果支持
 * @param {*} shareConfig
 * @param {*} callback
 * @returns 是否支持直接拉起
 */
export function pullUpShareDirectlyIfSupport(shareConfig = {}, callback) {
  if (typeof shareConfig === 'function') {
    callback = shareConfig;
    shareConfig = {};
  }
  const { title, link, img, desc } = {
    ...DefaultShareConfig,
    ...shareConfig,
  };
  if (isSZSMT()) {
    const sc = window.sc;
    sc.share(
      {
        title,
        image: img,
        shareUrl: link,
        shareTypes: [
          { platformID: 1, content: desc },
          { platformID: 2, content: desc },
        ],
      },
      res => {
        // 注释掉callback功能：shareTypes 限制了只有微信，没有其他；又由于微信限制无论分享成功与否，都回调成功，所以注释
        // if (res.code === 0) {
        //   return;
        // }
        // if (typeof callback === 'function') {
        //   callback(res.message || res.code);
        // }
      }
    );
    return true;
  }
  // 微信不支持主动拉起分享
  // 有其他支持的场景继续添加
  return false;
}

/**
 * 是否滚动到了底部
 * @param {Element} srcDom
 * @returns
 */
export function isScrollBottom(srcDom) {
  if (srcDom instanceof Element) {
    const { scrollTop, scrollHeight, clientHeight } = srcDom;
    // 不用等于用小于是为了兼容安卓部分情况
    // dom.scrollHeight > dom.clientHeight
    if (scrollHeight > clientHeight) {
      return scrollHeight - (scrollTop + clientHeight) < 1;
    }
    return true;
  }
  return false;
}
