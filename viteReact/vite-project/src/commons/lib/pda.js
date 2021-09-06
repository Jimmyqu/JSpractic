import { isPDA } from './utils';
import { formatDateTime, formatDate } from './format';
import { CalendarTypes } from './models/pubticket';

// 由于Android不能脱离window调用，为了节省代码使用shortCall
function shortCall(name, ...args) {
  window.Android[name](...args);
}

/**
 * pda扫码
 * @param  {...any} args
 */
export async function openScan(...args) {
  const name = 'openScan';
  return new Promise((resolve, reject) => {
    if (window.Android == null || window.Android[name] == null) {
      reject(new Error('PDA api is not available'));
      return;
    }
    const cbName = `${name}${Date.now()}`;
    // 注册回调
    window[cbName] = function (argsStr) {
      let resultArr;
      try {
        resultArr = JSON.parse(argsStr);
      } catch (e) {
        reject(e);
        return;
      }
      resolve(resultArr);
    };
    try {
      window.Android[name](JSON.stringify([cbName, ...args]));
    } catch (e) {
      reject(e);
    }
  });
}

// /**
//  * 打印
//  * @param {*} base64
//  * @param {*} offsetX
//  */
// export async function printImage(base64) {
//   if (isPDA()) {
//     const name = 'printImage';
//     return new Promise((resolve, reject) => {
//       window.getListenerState = function (msg) {
//         resolve(msg);
//       };
//       if (window.Android == null || window.Android[name] == null) {
//         reject(new Error('PDA api is not available'));
//         return;
//       }
//       try {
//         // window.Android.getVersion();
//         window.Android.printStartNumber();
//         window.Android[name](base64);
//         window.Android.printLine(4);
//         window.Android.printEndNumber();
//       } catch (e) {
//         reject(e);
//       }
//     });
//   }
//   return Promise.reject(new Error('该方法仅支持PDA调用'));
// }

/**
 * 通用打印
 * @param {*} selector
 */
export function genericPrint(dealInfo) {
  if (isPDA()) {
    if (dealInfo == null) {
      return Promise.reject(new Error(`PDA打印异常：订单信息无效`));
    }
    const { deal, dealTicketList } = dealInfo;
    // 暂时只支持活动票务
    if (deal && dealTicketList && dealTicketList.length > 0) {
      return new Promise((resolve, reject) => {
        window.getListenerState = function (msg) {
          resolve(msg);
        };
        const { salesName, id } = deal;
        const { startTime, seatDataName, matrix, calendarType, fromDate, toDate } = dealTicketList[0];
        try {
          shortCall('printState'); // 打印机状态获取
          shortCall('printStartNumber'); // 开始
          shortCall('setConcentration', 25); // 浓度
          // 营销中心
          shortCall('setFontSize', 1); // 字大小,0=小，1=中，2=大
          shortCall('setTextBold', true); // 是否加粗
          shortCall('printAlignment', 1); // 对齐方式,0=left,1=center,2=right
          shortCall('printText', salesName); // 文本
          shortCall('setTextBold', false); // 是否加粗
          shortCall('printLine'); // 换行
          shortCall('printDashLine'); // 分割线
          shortCall('printLine'); // 换行

          shortCall('setFontSize', 0); // 字大小,0=小，1=中，2=大
          shortCall('printText', '演出时间'); // 文本
          // shortCall('setTextBold', true); // 是否加粗
          shortCall('printLine'); // 换行
          if (calendarType === CalendarTypes.VALIDITYSCHEDULE.key) {
            shortCall('printText', `${formatDate(fromDate)}-${formatDate(toDate)}`); // 文本
          } else {
            shortCall('printText', formatDateTime(startTime)); // 文本
          }
          // shortCall('printTwoColumn', 'left', 'right'); // 两列
          shortCall('printLine', 2); // 换行
          // shortCall('setTextBold', false); // 是否加粗

          if (seatDataName) {
            shortCall('printText', '座位号'); // 文本
            // shortCall('setTextBold', true); // 是否加粗
            shortCall('printLine'); // 换行
            shortCall('printText', `${seatDataName.levelCategoryName}-${seatDataName.areaCategoryName}`); // 文本
            shortCall('printLine'); // 换行
            shortCall(
              'printText',
              `${seatDataName.rowsName}-${
                seatDataName.seatValue ? `${seatDataName.seatValue}座` : seatDataName.seatName
              }`
            ); // 文本
            shortCall('printLine', 2); // 换行
            // shortCall('setTextBold', false); // 是否加粗
          }

          if (matrix && matrix.validCode) {
            shortCall('printText', '验证码'); // 文本
            // shortCall('setTextBold', true); // 是否加粗
            shortCall('printLine'); // 换行
            shortCall('printText', matrix.validCode); // 文本
            shortCall('printLine', 2); // 换行
            // shortCall('setTextBold', false); // 是否加粗
          }

          shortCall('printText', '订单号'); // 文本
          // shortCall('setTextBold', true); // 是否加粗
          shortCall('printLine'); // 换行
          shortCall('printText', id); // 文本
          shortCall('printLine', 2); // 换行
          // shortCall('setTextBold', false); // 是否加粗

          shortCall('printDashLine'); // 分割线
          shortCall('printLine'); // 换行

          shortCall('printText', '欢迎光临，建议保留小票'); // 文本
          shortCall('printLine', 2); // 换行

          shortCall('printDashLine'); // 分割线
          shortCall('printLine', 6); // 换行

          // shortCall('printTabSpace', 2); // 空格
          // shortCall('printLine'); // 换行

          // shortCall('printThreeColumn', 'iphone6', 'iphone7', 'iphone8'); // 三列
          // shortCall('printLine'); // 换行

          // shortCall('printBarcode', '123456', 80, 2); // 一维码
          // shortCall('printLine'); // 换行

          // shortCall('printQR', '1234456', 200, 200);
          // shortCall('printLine', 2); // 换两行

          shortCall('printEndNumber'); // 结束
        } catch (e) {
          reject(new Error(`PDA打印异常：${e.message}`));
        }
      });
    }
    return Promise.reject(new Error(`PDA打印异常：暂不支持该类型数据在PDA上打印`));
  }
  window.print();
  return Promise.resolve();
}
