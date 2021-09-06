import { isiOS } from './utils';

const store = {
  get(session, key) {
    try {
      return JSON.parse((session ? window.sessionStorage : window.localStorage).getItem(key));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error);
    }
  },
  put(session, key, value, reTry = false) {
    const st = session ? window.sessionStorage : window.localStorage;
    try {
      st.setItem(key, JSON.stringify(value));
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        try {
          this.clear(session); // 避免clear异常导致重新存储未执行
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log('store.js清理存储失败', [session, key, value, reTry], e.message);
        }
        if (reTry === true) {
          // 避免死循环异常
          // eslint-disable-next-line no-console
          console.log(`${key}:store reTry... return`);
          if (isiOS()) {
            window.alert('Store存储失败，如果您正在使用Safari隐私模式，请退出后重试');
          }
        } else {
          // 重新执行一次
          this.put(session, key, value, true);
        }
      }
      throw error;
    }
  },
  remove(session, key) {
    (session ? window.sessionStorage : window.localStorage).removeItem(key);
  },
  clear(session) {
    (session ? window.sessionStorage : window.localStorage).clear();
  },
  clearButIgnore(session, keys) {
    const list = keys || [];
    const cache = {};
    list.forEach(key => {
      const value = this.get(session, key);
      cache[key] = value;
    });
    this.clear(session);
    list.forEach(key => {
      this.put(session, key, cache[key]);
    });
  },
};

function newInstance(isSession) {
  return {
    get(key) {
      if (!process.browser) {
        return;
      }
      return store.get(isSession, key);
    },
    put(key, value) {
      if (!process.browser) {
        return;
      }
      // 问题描述：在iOS 15+，macOS Safari 14.2+中某种情况下portal，getItem token会获取不到最新setItem进去的
      // 在iOS 15+，macOS Safari 14.2+中，登陆后刷新token，setItem进去getItem使用一切正常，手动刷新后querySrvInfo刷新token，setItem进去，紧接着调用的接口getItem调用正常，停顿，再操作所发起的接口调用getItem是旧的，Web Inspector查看是旧的。
      // remove it first, for iOS 15+，macOS Safari 14.2+
      // https://bugs.webkit.org/show_bug.cgi?id=226814
      // 似乎已经在 https://trac.webkit.org/changeset/278651/webkit 中修复，在新的测试版本中验证后可以注释
      // 修复包含在
      // MAJOR_VERSION = 612;
      // MINOR_VERSION = 1;
      // TINY_VERSION = 18;
      // MICRO_VERSION = 0;
      // NANO_VERSION = 0;
      // from https://trac.webkit.org/browser/webkit/trunk/Source/WebCore/Configurations/Version.xcconfig?rev=278651#L23
      /** hack line */ store.remove(isSession, key); // 添加此行能使原来的代码重新正常工作，但问题可能不是出在JSStorage本身, 可能是JIT有关的问题并和调用次数和时机有关
      store.put(isSession, key, value);
    },
    remove(key) {
      if (!process.browser) {
        return;
      }
      store.remove(isSession, key);
    },
    clear() {
      if (!process.browser) {
        return;
      }
      store.clear(isSession);
    },
    // 除了xxx，其他清理掉
    clearButIgnore(keys) {
      if (!process.browser) {
        return;
      }
      store.clearButIgnore(isSession, keys);
    },
  };
}

export const appStore = newInstance(false);

export const sessionStore = newInstance(true);
