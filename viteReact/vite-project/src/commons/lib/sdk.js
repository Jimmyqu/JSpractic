import { isWeLink, asyncInjectScript } from './utils';

// 多页面使用在 nuxt.config.js 中配置全局引入

const sdkUrl = {
  welink: 'https://open-doc.welink.huaweicloud.com/docs/jsapi/2.0.7/hwh5-cloudonline.js',
};

export function injectSdk() {
  // 微信和i深圳由于一些考虑，直接全局引入了，后续再看能否利用服务端渲染来选择性加载，或者其他更好的方式
  // i罗湖没有js-sdk，直接和webview暴露的js bridge交互

  // 判断环境引入jssdk
  // welink 不支持在非welink下引入
  if (isWeLink()) {
    // 似乎 welink 的 webview 容器自身会初始化 HWH5 变量，然后引用的脚本扩充这个变量的其他方法，类似接口与实现
    // return asyncInjectScript(sdkUrl.welink, 'HWH5');
    return asyncInjectScript(sdkUrl.welink);
  }
  return Promise.resolve();
}
