import { asyncInjectScript, asyncInjectCSS, isWeiXin, isSZSMT } from './utils';

const constraints = {
  audio: false,
  // video: { width: 1280, height: 720 },
  // video: {
  //   width: {
  //     min: 1280,
  //   },
  //   height: {
  //     min: 720,
  //   },
  // },
  video: {
    facingMode: 'user', // 优先使用前置摄像头，如果有
    // width: {
    //   min: 1024,
    //   ideal: 1280,
    //   max: 1920,
    // },
    // height: {
    //   min: 776,
    //   ideal: 720,
    //   max: 1080,
    // },
  },
};

function getUserMediaPromise(c) {
  const navigator = window.navigator;
  if (navigator.mediaDevices == null || navigator.mediaDevices.getUserMedia == null) {
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/getUserMedia
    const getUserMedia =
      navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (getUserMedia == null) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject('您使用的浏览器当前不支持获取MediaStream，无法调用摄像头');
    }
    return new Promise((resolve, reject) => {
      getUserMedia(c, resolve, reject);
    });
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  return navigator.mediaDevices.getUserMedia(c);
}

export function getMediaStream() {
  return tryGetUserMedia(constraints);
}

/**
 * 获取摄像头MediaStream
 */
export async function tryGetUserMedia(...args) {
  // eslint-disable-next-line no-console
  console.info('tryGetUserMedia called.');
  try {
    return await getUserMediaPromise(...args);
  } catch (e) {
    switch (e.name) {
      case 'OverconstrainedError':
      case 'ConstraintNotSatisfiedError':
        // eslint-disable-next-line prefer-promise-reject-errors
        throw new Error(`${e.constraint}无法满足约束${e.message == null ? '' : `,${e.message}`}`);
      case 'NotReadableError':
      case 'TrackStartError':
        // eslint-disable-next-line prefer-promise-reject-errors
        throw new Error('设备因为一些错误无法被访问');
      case 'AbortError':
        // eslint-disable-next-line prefer-promise-reject-errors
        throw new Error('设备被占用');
      case 'NotAllowedError':
      case 'PermissionDeniedError':
        // eslint-disable-next-line prefer-promise-reject-errors
        throw new Error('用户拒绝或出于安全原因未被授权使用设备');
      case 'NotFoundError':
      case 'DeviceNotFoundError':
        // eslint-disable-next-line prefer-promise-reject-errors
        throw new Error('未找到可用设备');
      case 'SecurityError':
        // eslint-disable-next-line prefer-promise-reject-errors
        throw new Error('用户禁用了媒体功能');
      case 'TypeError':
        // eslint-disable-next-line prefer-promise-reject-errors
        throw new Error('媒体约束条件异常或在不安全的环境中尝试获取媒体设备使用权');
      default:
        throw e;
    }
  }
}

/**
 * 把媒体流挂载到元素上
 * @param {*} dom
 * @param {*} mediaStream
 * @param {*} callback
 */
export function connectVideo(dom, mediaStream, callback) {
  if (dom == null || mediaStream == null || !(mediaStream instanceof MediaStream)) {
    return;
  }
  if (dom instanceof Element && dom.tagName === 'VIDEO') {
    // eslint-disable-next-line unicorn/prefer-add-event-listener
    dom.onloadedmetadata = function (e) {
      dom.play();
      if (typeof callback === 'function') {
        callback();
      }
    };
    // Older browsers may not have srcObject
    if ('srcObject' in dom) {
      dom.srcObject = mediaStream;
    } else {
      // Avoid using this in new browsers, as it is going away.
      dom.src = window.URL.createObjectURL(mediaStream);
    }
    return;
  }
  throw new Error('只能使用video元素挂载视频');
}

/**
 * 断开并销毁 mediaStream
 * @param {*} mediaStream
 */
export function destroyMediaStream(mediaStream) {
  // eslint-disable-next-line no-console
  console.info('destroyMediaStream called ->', mediaStream);
  if (mediaStream == null || !(mediaStream instanceof MediaStream)) {
    return;
  }
  if (mediaStream.stop) {
    mediaStream.stop();
    return;
  }
  for (const mediaStreamTrack of mediaStream.getTracks()) {
    mediaStreamTrack.stop();
  }
}

/**
 * 创建一个Audio 上下文
 */
export function createAudioContext() {
  if (process.browser) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    return new AudioContext();
  }
  return null;
}

/**
 * 播放音频
 * @param {*} audioCtx
 * @param {*} response
 * @param {*} offset
 */
export function playAudio(audioCtx, arrayBuffer, offset = 0) {
  const trackSource = audioCtx.createBufferSource();
  audioCtx.decodeAudioData(
    arrayBuffer,
    function (buffer) {
      trackSource.buffer = buffer;
      trackSource.connect(audioCtx.destination);

      if (offset === 0) {
        trackSource.start();
        // offset = audioCtx.currentTime;
      } else {
        trackSource.start(0, audioCtx.currentTime - offset);
      }
      // return trackSource;
    },
    function (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  );
}

/**
 * 高德地图JS
 */
export const amapJsApiKey = '054eab390cdcaf88c69ceb9f0fe2cbe4';
/**
 * 由于不同地图组件需要使用的插件可能不同，但是异步加载只会做一次，所以这里搜集业务需要用到的所有插件，在地图js加载时全部加载
 * //TODO: 后续研究异步加载插件来改善
 */
export const amapPlugins = [
  // driving.searchOnAMAP 失效，工单客服告诉我需要加载这个AMap.Adaptor插件
  // 但是 https://lbs.amap.com/api/jsapi-v2/update 里明明说的意思是 AMap.Adaptor让1.x的代码运行2.0的高德地图，最好直接使用2.0的API，那么此插件就不需要啊
  // 经过多番自行排除和尝试，发现，截止2021-06-24日，高德地图2.0版本想要拉起app，基于目前的代码需要满足：
  // 1. 有AMap.Adaptor插件
  // 2. AMap.Driving插件不能从url的plugin加载，必须使用AMap.plugin方法动态加载
  // 这属于巨坑的bug吧！？文档也没有写这个AMap.Driving要特殊对待。
  // 于是我添加AMap.Adaptor
  'AMap.Adaptor',
  //
  'AMap.Geolocation',
  // 于是我注释AMap.Driving, 并在代码处改为动态加载
  // 'AMap.Driving',
  'AMap.Geocoder',
];

/**
 * 高德地图Web API key
 */
// export const amapWebApiKey = '12e0755a1477686d432edb5cab38c87e';

/**
 * 获取当前位置信息
 * @param {*} jsConfig
 */
export function getLocation(jsConfig) {
  return new Promise((resolve, reject) => {
    // 微信获取
    const wx = window.jWeixin;
    if (jsConfig && isWeiXin() && wx) {
      wx.config({
        debug: false,
        appId: jsConfig.appId,
        timestamp: jsConfig.timestamp,
        nonceStr: jsConfig.nonStr,
        signature: jsConfig.signature,
        jsApiList: ['getLocation'],
      });

      wx.error(res => {
        reject(new Error(res.errMsg));
        if (wx.__errorHandler) {
          wx.__errorHandler(res);
        }
      });

      wx.ready(() => {
        wx.getLocation({
          type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success(res) {
            resolve({
              lng: res.longitude,
              lat: res.latitude,
            });
          },
        });
      });
      return;
    }
    if (isSZSMT()) {
      const sc = window.sc;
      sc.gps(
        {
          // 定位方式（默认为1），0：从缓存获取，1：实时定位获取（V2.9.0新增）
          type: 1,
        },
        res => {
          const { code, message, data } = res;
          if (code === 0) {
            const info = data || {};
            // data 本身有longitude，latitude，还有其他字段
            const { longitude, latitude, ...rest } = info;
            resolve({
              lng: longitude,
              lat: latitude,
              ...rest,
            });
            return;
          }
          reject(new Error(message || code));
        }
      );
      return;
    }
    if (navigator.geolocation == null) {
      reject(new Error('您的设备不支持定位功能'));
      return;
    }
    // navigator.geolocation.getCurrentPosition(
    //   position => {
    //     alert(`${position.coords.longitude},${position.coords.latitude}`);
    //   },
    //   error => {
    //     let msg;
    //     switch (error.code) {
    //       case error.PERMISSION_DENIED:
    //         msg = '未在https安全域名下使用或者用户拒绝了地理定位请求';
    //         break;
    //       case error.POSITION_UNAVAILABLE:
    //         msg = '位置信息不可用';
    //         break;
    //       case error.TIMEOUT:
    //         msg = '获取用户位置的请求超时';
    //         break;
    //       case error.UNKNOWN_ERROR:
    //         msg = '定位时出现未知错误';
    //         break;
    //       default:
    //         reject(error);
    //         return;
    //     }
    //     alert(msg);
    //   }
    // );
    navigator.geolocation.getCurrentPosition(
      position => {
        resolve({
          lng: position.coords.longitude,
          lat: position.coords.latitude,
        });
      },
      error => {
        let msg;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = '未在https安全域名下使用或者用户拒绝了地理定位请求';
            break;
          case error.POSITION_UNAVAILABLE:
            msg = '位置信息不可用';
            break;
          case error.TIMEOUT:
            msg = '获取用户位置的请求超时';
            break;
          case error.UNKNOWN_ERROR:
            msg = '定位时出现未知错误';
            break;
          default:
            reject(error);
            return;
        }
        reject(new Error(msg));
      }
    );
  });
}

/**
 * 经纬度逆向位置信息
 * @param {*} fetchFn
 * @param {*} lng
 * @param {*} lat
 */
export function reGeocode(fetchFn, location) {
  if (typeof fetchFn !== 'function') {
    return Promise.reject(new Error('需要提供获取数据功能函数'));
  }
  if (location == null || location.lng == null || location.lat == null) {
    return Promise.reject(new Error('坐标参数不完整'));
  }
  return fetchFn({
    location: `${location.lng},${location.lat}`,
  }).then(data => {
    const result = data || {};
    if (result.status == null || result.status === '0') {
      throw new Error(result.info || '逆地理失败');
    }
    const { addressComponent, formatted_address: address } = result.regeocode || {};
    const { province, city, district, township, streetNumber } = addressComponent || {};
    return {
      province,
      city,
      district,
      township,
      address,
      ...streetNumber,
    };
  });
}

/**
 * 获取浏览器fullscreen相关属性
 */
function getScreenFullOpition() {
  const result = {};
  if (process.browser) {
    const optionMap = [
      ['requestFullscreen', 'exitFullscreen', 'fullscreenElement', 'fullscreenEnabled'],
      // New WebKit
      ['webkitRequestFullscreen', 'webkitExitFullscreen', 'webkitFullscreenElement', 'webkitFullscreenEnabled'],
      // Old WebKit
      ['webkitRequestFullScreen', 'webkitCancelFullScreen', 'webkitCurrentFullScreenElement', 'webkitCancelFullScreen'],
      ['mozRequestFullScreen', 'mozCancelFullScreen', 'mozFullScreenElement', 'mozFullScreenEnabled'],
      ['msRequestFullscreen', 'msExitFullscreen', 'msFullscreenElement', 'msFullscreenEnabled'],
    ];
    const currentOptions = optionMap.find(item => item && item[1] in document && item[2] in document);
    if (currentOptions == null) {
      return result;
    }
    for (const [idx, key] of currentOptions.entries()) {
      result[optionMap[0][idx]] = key;
    }
  }
  return result;
}

// 初始化
const fullscreenOp = getScreenFullOpition();

/**
 * 是否可以全屏展示
 */

export function screenfullIsEnabled() {
  return Boolean(document[fullscreenOp.fullscreenEnabled]);
}

/**
 * 全屏展示
 * @param {*} element
 */
export function screenfullRequest(element) {
  return new Promise((resolve, reject) => {
    element = element || document.documentElement;
    Promise.resolve(element[fullscreenOp.requestFullscreen]()).catch(reject);
  });
}

/**
 * 初始化AliPlayer
 * @param {*} opts
 */
export async function initAliPlayer(id, opts = {}) {
  // await asyncInjectCSS('https://g.alicdn.com/de/prismplayer/2.8.3/skins/default/aliplayer-min.css');
  asyncInjectCSS('https://g.alicdn.com/de/prismplayer/2.9.6/skins/default/aliplayer-min.css');
  const Aliplayer = await asyncInjectScript(
    'https://g.alicdn.com/de/prismplayer/2.9.6/aliplayer-h5-min.js',
    'Aliplayer'
  );
  return new Promise(resolve => {
    // eslint-disable-next-line no-new
    new Aliplayer(
      {
        id,
        ...opts,
      },
      player => {
        resolve(player);
      }
    );
  });
}

const isSupportSpeechSynthesis = process.browser
  ? !!(window.SpeechSynthesisUtterance && window.speechSynthesis)
  : false;
const SpeechSynthesisVoiceArr = new Set(['zh-CN', 'zh-HK', 'zh-TW', 'en-US', 'en-GB']);
let voices;
function loadVoices() {
  voices = window.speechSynthesis
    .getVoices()
    // localService 为false的可能需要翻墙
    .filter(voice => SpeechSynthesisVoiceArr.has(voice.lang) && voice.localService);
  // voices.sort((a, b) => {
  //   if (a.localService && b.localService) {
  //     return 0;
  //   }
  //   if (b.localService) {
  //     return 1;
  //   }
  //   return -1;
  // });
}

if (isSupportSpeechSynthesis) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = function () {
    loadVoices();
  };
}

export function speechSynthesisSpeak(text, lang = 'zh-CN') {
  if (!(isSupportSpeechSynthesis && SpeechSynthesisVoiceArr.has(lang))) {
    return false;
  }
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
  const useVoice = voices.find(voice => voice.lang === lang);
  if (useVoice == null) {
    return false;
  }
  const msg = new window.SpeechSynthesisUtterance(text);
  // // eslint-disable-next-line unicorn/prefer-add-event-listener
  // msg.onboundary = function (e) {
  //   console.log(e);
  // };
  // // eslint-disable-next-line unicorn/prefer-add-event-listener
  // msg.onerror = function (e) {
  //   console.log(e);
  // };
  // msg.onstart = function (e) {
  //   console.log(e);
  // };
  // msg.onend = function (e) {
  //   console.log(e);
  // };
  // msg.onmark = function (e) {
  //   console.log(e);
  // };
  // // eslint-disable-next-line unicorn/prefer-add-event-listener
  // msg.onpause = function (e) {
  //   console.log(e);
  // };
  // msg.onresume = function (e) {
  //   console.log(e);
  // };
  msg.voice = useVoice;
  msg.lang = lang;

  msg.rate = 1; // 播放语速
  msg.pitch = 1; // 音调高低
  // // msg.text = "播放文本"
  msg.volume = 1; // 播放音量

  window.speechSynthesis.speak(msg);
  return true;
}
