function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (_date) {
  const date = new Date(_date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export default {
  formatNumber,
  formatTime
}

export function deepClone(source) {
  if (!source && typeof source !== 'object') {
      throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach((keys) => {
      if (source[keys] && typeof source[keys] === 'object') {
          targetObj[keys] = deepClone(source[keys])
      } else {
          targetObj[keys] = source[keys]
      }
  })
  return targetObj
}