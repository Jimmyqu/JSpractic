import moment from 'moment';
import { getValueByModelKey, RelTypes, ExtfieldModel, DealModel, PubUserModel } from './models';
import { find } from './home-town';
import ethnicList from './data/ethnic.json';
import { mul, div } from './math';
import { isNumber, isMobile, isIDNumber } from './utils';

/**
 * 把值按 '是' 与 '否' 格式化
 */
export function formatBoolean(val) {
  if (val) {
    return '是';
  }
  return '否';
}

// function accMul(arg1, arg2) {
//   let m = 0;
//   const s1 = arg1.toString();
//   const s2 = arg2.toString();
//   m += s1.split('.').length > 1 ? s1.split('.')[1].length : 0;
//   m += s2.split('.').length > 1 ? s2.split('.')[1].length : 0;
//   return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / 10 ** m;
// }

// /**
//  * 数字格式化为中文大写
//  * @param {*} n
//  */
// export function digitUpperCase(n) {
//   const fraction = ['角', '分'];
//   const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
//   const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟', '万']];
//   let num = Math.abs(n);
//   let s = '';
//   fraction.forEach((item, index) => {
//     s += (digit[Math.floor(accMul(num, 10 * 10 ** index)) % 10] + item).replace(/零./, '');
//   });
//   s = s || '整';
//   num = Math.floor(num);
//   for (let i = 0; i < unit[0].length && num > 0; i += 1) {
//     let p = '';
//     for (let j = 0; j < unit[1].length && num > 0; j += 1) {
//       p = digit[num % 10] + unit[1][j] + p;
//       num = Math.floor(num / 10);
//     }
//     s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
//   }

//   return s
//     .replace(/(零.)*零元/, '元')
//     .replace(/(零.)+/g, '零')
//     .replace(/^整$/, '零元整');
// }

/**
 * 电话号码隐藏中间4位
 */
export function formatSecretPhone(phone) {
  return (phone + '').replace(/^(\d{3})\d{5}(\d+)/, '$1*****$2');
}

/**
 * 姓名隐藏
 */
export function formatSecretName(name) {
  if (name == null) {
    return null;
  }

  return (name + '').split('').reduce((acc, cur, idx) => {
    acc = idx === 0 ? acc + cur : acc + '*';
    return acc;
  }, '');
}

/**
 * 符合 key, value 装配的数据格式化
 * @param {*} model
 * @param {*} key
 */
export function formatModel(model, key) {
  const value = getValueByModelKey(model, key);
  return value == null ? key : value;
}

/**
 * 格式化手续费 数据库存的60 显示千分之6
 * @param {*} number
 */
export function formatTransfer(number) {
  return formatMoney(number) + '%';
}

/**
 * 格式化金额，单位分，默认两位小数
 * @param {*} number
 * @param {*} length
 */
export function formatMoney(number, length = 2) {
  let num = number;
  if (num == null) {
    num = 0;
  }
  if (Number.isFinite(num)) {
    return fixedMoney(decodeMoney(num), length);
  }
  return '';
}

/**
 *  格式化金额，单位元，默认两位小数
 * @param {*} number
 * @param {*} length
 */
export function fixedMoney(number, length = 2) {
  let num = number;
  if (num == null) {
    num = 0;
  }
  if (Number.isFinite(num)) {
    return num.toFixed(length);
  }
  return num;
}

/**
 * 放大金额
 * @param {*} number
 */
export function encodeMoney(number) {
  let num = number;
  if (num == null) {
    num = 0;
  }
  if (Number.isFinite(num)) {
    return mul(num, 100);
  }
  return num;
}

/**
 * 还原金额
 * @param {*} number
 */
export function decodeMoney(number) {
  let num = number;
  if (num == null) {
    num = 0;
  }
  if (Number.isFinite(num)) {
    return div(num, 100);
  }
  return num;
}

/**
 * 计算时长，offsets是偏移量，传入时长值用
 * @param {*} targetTime 时长
 * @param {*} o offset偏移量
 * @param {*} s skipDay是否跳过天的显示
 */
export function formatTimeDuration(targetTime, o = 0, s) {
  let offset = o;
  let skipDay = s;
  if (typeof o === 'boolean') {
    skipDay = o;
    offset = 0;
  }
  const negative = targetTime < 0;
  if (targetTime) {
    // 转换成正数再统一补符号，如果有
    let left = Math.abs(targetTime - offset);
    const str = [];
    let days = 0;
    let stamp = 0;
    if (!skipDay) {
      stamp = 1000 * 60 * 60 * 24;
      days = Math.floor(left / stamp);
      left %= stamp;
    }
    stamp = 1000 * 60 * 60;
    const hours = Math.floor(left / stamp);
    left %= stamp;
    stamp = 1000 * 60;
    const minutes = Math.floor(left / stamp);
    left %= stamp;
    const secends = Math.floor(left / 1000);
    left %= 1000;
    const millisecond = left;

    if (days) {
      str.push(days, '天');
    }
    if (hours) {
      str.push(hours, '小时');
    }
    if (minutes) {
      str.push(minutes, '分');
    }
    if (secends) {
      str.push(secends, '秒');
    }
    // if (millisecond) {
    //   str.push(millisecond, '毫秒');
    // }
    if (str.length === 0 && millisecond > 0) {
      str.push(millisecond, 'ms');
    }
    // 补符号
    if (negative && str.length > 0) {
      str.unshift('-');
    }
    return str.join('');
  }
  return 0;
}

/**
 * 千米格式化
 * @param {*} val 米
 * @returns
 */
export function formatKilometer(val) {
  if (!isNumber(val)) {
    return '';
  }
  if (val < 1000) {
    return `${val.toFixed(0)}m`;
  }
  return `${(val / 1000).toFixed(1)}km`;
}

/**
 * 时间戳是否为0点
 * @param {*} long
 */
export function is0Clock(long) {
  if (long == null) {
    return false;
  }
  const mmt = moment.isMoment(long) ? long : moment(long);
  return mmt.hours() === 0 && mmt.minutes() === 0 && mmt.seconds() === 0 && mmt.milliseconds() === 0;
}

export function formatDateTime(long) {
  if (long == null) {
    return null;
  }
  return moment(long).format('YYYY-MM-DD HH:mm:ss');
}

/**
 * 格式化年月日时分秒，保守显示，当这一天刚好是0点时，显示为头一天的24:00:00
 * @param {*} long
 */
export function formatDateTimeCsvt(long) {
  if (long == null) {
    return null;
  }
  const mmt = moment(long);
  if (is0Clock(mmt)) {
    return `${formatDateCsvt(mmt)} 24:00:00`;
  }
  return mmt.format('YYYY-MM-DD HH:mm:ss');
}

export function formatDateTimeCompact(long) {
  if (long == null) {
    return null;
  }
  return moment(long).format('YYYYMMDDHHmmss');
}

export function formatDate(long) {
  if (long == null) {
    return null;
  }
  return moment(long).format('YYYY-MM-DD');
}

/**
 * 格式化年月日，保守显示，当这一天刚好是0点时，显示为头一天
 * @param {*} long 时间
 */
export function formatDateCsvt(long) {
  if (long == null) {
    return null;
  }
  const mmt = moment(long);
  if (is0Clock(mmt)) {
    return formatDate(mmt.clone().subtract(1, 'days'));
  }
  return mmt.format('YYYY-MM-DD');
}

export function formatMonth(long) {
  if (long == null) {
    return null;
  }
  return moment(long).format('YYYY-MM');
}

export function formatDateHM(long) {
  if (long == null) {
    return null;
  }
  return moment(long).format('YYYY-MM-DD HH:mm');
}

/**
 * 格式化年月日时分，保守显示，当这一天刚好是0点时，显示为头一天24:00
 * @param {*} long 时间
 */
export function formatDateHMCsvt(long) {
  if (long == null) {
    return null;
  }
  const mmt = moment(long);
  if (is0Clock(mmt)) {
    return `${formatDateCsvt(mmt)} 24:00`;
  }
  return mmt.format('YYYY-MM-DD HH:mm');
}

export function formatMD(long) {
  if (long == null) {
    return null;
  }
  return moment(long).format('MM-DD');
}

export function formatHM(long) {
  if (long == null) {
    return null;
  }
  return moment(long).format('HH:mm');
}

/**
 * 格式化时分，保守显示，当刚好是0点时，显示为24:00
 * @param {*} long 时间
 */
export function formatHMCsvt(long) {
  if (long == null) {
    return null;
  }
  const mmt = moment(long);
  if (is0Clock(mmt)) {
    return '24:00';
  }
  return mmt.format('HH:mm');
}

export function formatHMS(long) {
  if (long == null) {
    return null;
  }
  return moment(long).format('HH:mm:ss');
}

/**
 * 格式化时分秒，保守显示，当刚好是0点时，显示为24:00:00
 * @param {*} long
 */
export function formatHMSCsvt(long) {
  if (long == null) {
    return null;
  }
  const mmt = moment(long);
  if (is0Clock(mmt)) {
    return '24:00:00';
  }
  return moment(long).format('HH:mm:ss');
}

const wkDays = ['日', '一', '二', '三', '四', '五', '六'];
const otherDays = ['法定工作日', '法定节假日'];
const weekDayPrefixs = ['周', '星期', '礼拜'];

function buildWeekDays(type) {
  const array = [];
  for (let i = 0; i < 7; i++) {
    array.push(`${weekDayPrefixs[type]}${wkDays[i]}`);
  }
  return array;
}

/**
 * 周几数组
 */
export const WeekDays0 = buildWeekDays(0);
/**
 * 星期几数组
 */
export const WeekDays1 = buildWeekDays(1);
/**
 * 礼拜几数组
 */
export const WeekDays2 = buildWeekDays(2);

// 0和7 都是星期日
export const WeekDays = [...WeekDays1, `${weekDayPrefixs[1]}${wkDays[0]}`, ...otherDays];

export function formatDay(long, type) {
  if (long == null) {
    return null;
  }
  return `${weekDayPrefixs[type || 0]}${wkDays[moment(long).day()]}`;
}

// 0和7 都是星期日
export function formatWeekDay(num, type) {
  if (num == null) {
    return null;
  }
  let useNum = +num;
  if (useNum === 0) {
    useNum = 7;
  }
  if (!useNum || useNum < 1) {
    return null;
  }
  const list = buildWeekDays(type || 0);
  return [...list, `${weekDayPrefixs[type || 0]}${wkDays[0]}`, ...otherDays][useNum] || '?';
}

/**
 * 解析连续的天
 * @param {*} wkds
 * @param {*} array
 */
export function formatWeekDaySeries(wkds, array) {
  if (!wkds) {
    return null;
  }
  const weekDays = Array.isArray(wkds) ? [...wkds] : wkds.split(','); // 复制
  const html = array || [];
  let end = 0;
  weekDays.some((wd, i) => {
    const num = typeof wd === 'string' ? wd.trim() : wd;
    if (i === weekDays.length - 1 || +num + 1 === +weekDays[i + 1]) {
      // 符合要求
      end = i;
      return false; // 继续找
    }
    return true;
  });
  if (html.length > 0) {
    html.push(', ');
  }
  if (end === 0) {
    html.push(`${formatWeekDay(weekDays[0])}`);
  } else {
    html.push(`${formatWeekDay(weekDays[0])}至${formatWeekDay(weekDays[end])}`);
  }
  weekDays.splice(0, end + 1);
  if (weekDays.length > 0) {
    formatWeekDaySeries(weekDays, html);
  }
  return html.join('');
}

export function formatGender(val) {
  if (val == null) {
    return null;
  }
  const { Genders } = PubUserModel;
  switch (val) {
    case 1:
    case '1':
    case 'MALE':
      return Genders.Male.value;
    case 2:
    case '2':
    case 'FEMALE':
      return Genders.Female.value;
    default:
      return '保密';
  }
}

export function formatAgeFrom(from, long, onlyNum) {
  if (long == null) {
    return null;
  }
  const age = moment(from == null ? undefined : from).diff(moment(long), 'years') || 0;
  return onlyNum ? age : `${age} 岁`;
}

export function formatAge(long, onlyNum) {
  return formatAgeFrom(Date.now(), long, onlyNum);
}

export function formatHomeTown(id) {
  if (id == null) {
    return '';
  }
  return (find(id) || {}).name || '';
}

export function formatEthnic(val) {
  if (val == null) {
    return null;
  }
  return (ethnicList.find(item => item.id === val) || {}).text || val;
}

export function formatExtField(field) {
  if (field == null) {
    return null;
  }
  const { ExtDataTypes } = ExtfieldModel;
  const { extDataType, dataShowValue, dataValue, extDataTypeValue } = field;
  if (dataValue == null) {
    return null;
  }
  if (dataShowValue != null) {
    return dataShowValue;
  }
  switch (extDataType) {
    // TODO 及联待实现
    case ExtDataTypes.Select.key:
      if (Array.isArray(extDataTypeValue)) {
        return dataValue
          .toString()
          .split(',')
          .map(key => {
            const found = extDataTypeValue.find(item => item.name === +key);
            if (found) {
              return found.value;
            }
            return key;
          })
          .join(', ');
      }
      return dataValue;
    case ExtDataTypes.Date.key:
      return formatDate(dataValue);
    case ExtDataTypes.HourAndMinute.key:
      return formatDateHM(dataValue);
    case ExtDataTypes.DateTime.key:
      return formatDateTime(dataValue);
    default:
      return dataValue;
  }
}

export function formatSubSeq(value) {
  const { SubSeqTypes } = DealModel;
  if (value == null) {
    return null;
  }

  return (Array.isArray(value) ? value : (value.toString() || '').split(','))
    .filter(key => key)
    .map(key => formatModel(SubSeqTypes, +key))
    .join('+');
}

export function formatSrvId(value) {
  return value > 0 ? '无线端' : 'PC端';
}

export function formatPayWay(dealInfo) {
  if (dealInfo == null || dealInfo.payInfo == null || dealInfo.payInfo.payList == null) {
    return '未支付';
  }
  return formatPayWayFromList(dealInfo.payInfo.payList.map(payItem => payItem.tradeWay));
}

export function formatPayWayFromList(payWayList) {
  if (Array.isArray(payWayList) && payWayList.length > 0) {
    const { PayWayTypes } = DealModel;
    return payWayList.map(payItem => formatModel(PayWayTypes, payItem)).join('+');
  }
  return null;
}

export function formatRelType(value) {
  return getValueByModelKey(RelTypes, value);
}

export function formatIDCardType(type) {
  const { IDCardTypes } = PubUserModel;
  return getValueByModelKey(IDCardTypes, type);
}

const imgCdnClipReg = /@!\w+/;

export function formatImageUrl(
  inputUrl,
  newSuffix,
  defaultUrl = 'https://image.ydmap.cn/default_file/default_load_img.jpg@!img_small_200X200_prew'
) {
  if (inputUrl == null || inputUrl.length === 0) {
    return defaultUrl;
  }
  const newUrl = inputUrl.replace(imgCdnClipReg, '');
  if (newSuffix) {
    return `${newUrl}@!${newSuffix}`;
  }
  return newUrl;
}

/**
 * 把比例格式化为百分比，0.2853=28.53%
 * @param {*} num
 */
export function formatPercent(num) {
  if (isNumber(num)) {
    if (num === 0) {
      return '0%';
    }
    return `${fixedMoney(encodeMoney(num))}%`;
  }
  return num;
}

const bulletChs = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
const bulletChDigits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const bulletEns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

/**
 * 考题编号格式化
 * @param {*} num 编号类型
 * @param {*} index 编号索引
 */
export function formatQuestionBullet(num, index) {
  if (num == null) {
    return bulletEns[index];
  }
  switch (num) {
    case 1:
      return bulletChs[index];
    case 2:
      return bulletChDigits[index];
    default:
      return bulletEns[index];
  }
}

export function coverItWithAsterisk(val) {
  if (val == null) {
    return null;
  }
  if (isMobile(val)) {
    return val.replace(/^(\d{3})\d{4}(\d+)/, '$1****$2');
  }
  if (isIDNumber(val)) {
    return val.replace(/^(.{6})\d+(.{4})$/, '$1****$2');
  }
  return val;
}

/**
 * 格式化座位 seatDataName
 * @param {*} item
 */
export function formatSeat(seat, separator = '/') {
  if (seat == null) {
    return null;
  }
  const { floorCategoryName, areaCategoryName, levelCategoryName, rowsName, seatValue, seatName } = seat;
  return [floorCategoryName, areaCategoryName, levelCategoryName, rowsName, seatValue ? `${seatValue}座` : seatName]
    .filter(Boolean)
    .join(separator);
}
