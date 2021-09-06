import { formatMoney, formatAge, formatSeat, formatImageUrl } from '@/commons/lib/format';
import { DEFAULT_USER_AVATAR_PIC_PATH, isNumber } from '@/commons/lib/utils';
import { PaymentModel } from '@/commons/lib/models';

import styles from './utils.less';
// 为了避免循环依赖，此次重复神明一个DEFAULT_USER_AVATAR_PIC_FULLPATH
// import { DEFAULT_USER_AVATAR_PIC_FULLPATH } from './utils';
const DEFAULT_USER_AVATAR_PIC_FULLPATH = `${DEFAULT_USER_AVATAR_PIC_PATH}/200X200.jpg`;

export * from '@/commons/lib/format';

export function formatColorWrapper(fn = v => v) {
  // 第一个参数必须是值
  return (value, ...args) => {
    const fmtValue = fn(value, ...args);
    if (value == null || value === 0) {
      return <span className={styles.formatGray}>{fmtValue}</span>;
    }
    return fmtValue;
  };
}

export function formatMoneyLen2(value) {
  return formatMoney(value);
}

export function formatMoneyLen0(value) {
  return formatMoney(value, 0);
}

// 少数不格式化的行为
export function formatNothing(value) {
  return value;
}

export function formatFaceImgInTable(url, width) {
  return url ? (
    <img
      className="img-max"
      src={formatImageUrl(url, 'img_small_200X200_prew', DEFAULT_USER_AVATAR_PIC_FULLPATH)}
      style={{ width: isNumber(width) ? `${width}px` : width || '50px' }}
      alt="face"
    />
  ) : null;
}

export function formatPayPlatform(payPlatform) {
  const { PayPlatform } = PaymentModel;
  const key = isNumber(payPlatform) || payPlatform == null ? payPlatform : payPlatform.key;
  switch (key) {
    case PayPlatform.Mixed.key:
      return '微信/支付宝';
    case PayPlatform.Weixin.key:
      return PayPlatform.Weixin.value;
    case PayPlatform.Zfb.key:
      return PayPlatform.Zfb.value;
    default:
      return '?';
  }
}

export function formatStudyList(list) {
  return (list || []).map(({ pubStudyId, realName, idcard, mobile, birthday }, i) => (
    <div key={pubStudyId}>
      {i > 0 && <div>&nbsp;</div>}
      <div>姓名：{realName}</div>
      <div>手机号：{mobile}</div>
      <div>身份证号：{idcard}</div>
      <div>年龄：{formatAge(birthday)}</div>
    </div>
  ));
}

/**
 * 格式化座位数据
 * 如果 formatSeat 直接放到表格的column的render上会因为第二个参数影响格式化到正确的结果
 * @param {*} value
 */
export function formatSeatData(value) {
  return formatSeat(value);
}
