import Big from 'big.js';
// /**
//  * 可能使用到的数学运算相关逻辑，非直接使用运算符或者Math对象能够解决的
//  */
// Math.formatFloat = function(f, digit) {
//   const m = Math.pow(10, digit);
//   return parseInt(f * m, 10) / m;
// };

/**
 * 转换number
 * @param {string|number} num
 */
// function numberValid(num) {
//   const temp = +num;
//   // eslint-disable-next-line eqeqeq
//   if (temp == num) {
//     return temp;
//   }
//   if (Number.isNaN(temp)) {
//     return 0;
//   }
//   return temp;
// }

// function exec(method, arg1, arg2) {
//   const n1 = numberValid(arg1);
//   const n2 = numberValid(arg2);
//   const result = new Big(n1)[method](new Big(n2)).toString();
//   return Number(result);
// }

// export function add(numb1, numb2) {
//   return exec('plus', numb1, numb2);
// }

// export function sub(numb1, numb2) {
//   return exec('minus', numb1, numb2);
// }

// export function mul(numb1, numb2) {
//   return exec('times', numb1, numb2);
// }

// export function div(numb1, numb2) {
//   return exec('div', numb1, numb2);
// }

function isValid(val) {
  return Number.isFinite(val) || val instanceof Big;
}

function execBigJs(method, ...args) {
  let acc = args[0];
  // 改为普通循环，可以提前终止
  for (let idx = 1; idx < args.length; idx += 1) {
    const cur = args[idx];
    if (!(isValid(acc) && isValid(cur)) || (method === 'div' && cur === 0)) {
      return Number.NaN;
    }
    // 按顺序method操作
    acc = new Big(acc)[method](new Big(cur));
  }
  // 只最终做一次转换
  if (acc instanceof Big) {
    // If Big.strict is true an error will be thrown if toNumber is called on a Big number which cannot be converted to a primitive number without a loss of precision.
    return acc.toNumber();
  }
  return acc;
}

/**
 * 加法，只有一个值时直接返回
 * @param  {...any} args 多个数字
 * @returns 返回累加值
 */
export function add(...args) {
  return execBigJs('plus', ...args);
}

/**
 * 减法，只有一个值时直接返回
 * @param  {...any} args 多个数字
 * @returns 返回累减值
 */
export function sub(...args) {
  return execBigJs('minus', ...args);
}

/**
 * 乘法，只有一个值时直接返回
 * @param  {...any} args 多个数字
 * @returns 返回累乘值
 */
export function mul(...args) {
  return execBigJs('times', ...args);
}

/**
 * 除法，只有一个值时直接返回
 * @param  {...any} args 多个数字
 * @returns 返回累除值
 */
export function div(...args) {
  return execBigJs('div', ...args);
}
