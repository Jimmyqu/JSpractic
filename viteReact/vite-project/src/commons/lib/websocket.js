import isPlainObject from 'lodash/isPlainObject';
import { isStartsWithProtocol } from './utils';

const MessageTypes = {
  ERROR_DATA: -1, // 消息异常
  KEEP_ALIEVE: 1, // 心跳
  PUSH_MESSAGE: 2, // cloud消息通知
  PUSH_PORTAL_TICKET_VERIFY: 3, // portal核验票务通知
  PUSH_SPORT_FULL_WARN: 4, // 体育场地满员警告
  REPLY: 100, // 回复确认消息专用
};

const timeout = 1000 * 5;

class MySocket {
  constructor(url, options) {
    this.isDeprecated = false;
    this.url = url;
    this.options = options;
    this.eventHub = new Map();
    // 不阻碍MySocket构建
    setTimeout(() => {
      this.reconnect();
    }, 0);
  }

  isActive() {
    return this.socket && this.socket.readyState === window.WebSocket.OPEN;
  }

  addListen(type, fn) {
    if (type == null || typeof fn !== 'function' || !Object.values(MessageTypes).includes(type)) {
      return;
    }
    let list = this.eventHub.get(type);
    if (list == null) {
      list = [];
    }
    list.push(fn);
    this.eventHub.set(type, list);
  }

  /**
   * 移除监听；不支持只传递type移除所有监听的效果，为的是避免不想干的被他人移除，所以各处自行管理好监听
   * @param {*} type 类型
   * @param {*} fn 事件函数，=== 匹配
   */
  removeListen(type, fn) {
    if (type == null || typeof fn !== 'function' || !Object.values(MessageTypes).includes(type)) {
      return;
    }
    const list = this.eventHub.get(type);
    if (list == null) {
      return;
    }
    const idx = list.indexOf(fn);
    if (idx < 0) {
      return;
    }
    const newList = [...list];
    newList.splice(idx, 1);
    this.eventHub.set(type, newList);
  }

  init(socket) {
    if (socket == null) {
      return;
    }
    // 重复执行
    if (this.socket === socket) {
      return;
    }
    if (this.checkDeprecated()) {
      return;
    }
    socket.addEventListener('open', e => {
      // eslint-disable-next-line no-console
      console.info('websocket: 已连接');
    });
    socket.addEventListener('error', e => {
      // eslint-disable-next-line no-console
      console.warn('websocket: 异常');
      this.close();
    });
    socket.addEventListener('close', e => {
      // eslint-disable-next-line no-console
      console.warn('websocket: 已关闭');
      if (this.isDeprecated) {
        return;
      }
      this.delayConnect(true);
    });
    socket.addEventListener('message', e => {
      // eslint-disable-next-line no-console
      console.info('websocket: 接收');
      let result;
      try {
        result = JSON.parse(e.data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('websocket: 解析失败');
        // eslint-disable-next-line no-console
        console.error(error);
        return;
      }
      if (result == null) {
        return;
      }
      const { code: type, data, id } = result;
      if (!(id && type)) {
        // eslint-disable-next-line no-console
        console.warn('websocket: 非法数据');
        return;
      }

      // 回复其他
      this.send({
        code: MessageTypes.REPLY,
        id,
      });

      if (!Object.values(MessageTypes).includes(type)) {
        // eslint-disable-next-line no-console
        console.warn('websocket: 未识别的数据类型 - ' + type);
        return;
      }

      const list = this.eventHub.get(type);
      if (list == null) {
        return;
      }
      for (const fn of list) {
        // 异步
        setTimeout(() => {
          fn(data);
        }, 0);
      }
    });
    this.socket = socket;
  }

  // 用于传输至服务器的数据。它必须是以下类型之一：
  // USVString
  // 文本字符串。字符串将以 UTF-8 格式添加到缓冲区，并且 bufferedAmount 将加上该字符串以 UTF-8 格式编码时的字节数的值。
  // ArrayBuffer
  // 您可以使用一有类型的数组对象发送底层二进制数据；其二进制数据内存将被缓存于缓冲区，bufferedAmount 将加上所需字节数的值。
  // Blob
  // Blob 类型将队列 blob 中的原始数据以二进制中传输。 bufferedAmount 将加上原始数据的字节数的值。
  // ArrayBufferView
  // 您可以以二进制帧的形式发送任何 JavaScript 类数组对象 ；其二进制数据内容将被队列于缓冲区中。值 bufferedAmount 将加上必要字节数的值。
  send(data) {
    if (this.checkDeprecated()) {
      return;
    }
    if (this.isActive()) {
      this.socket.send(isPlainObject(data) ? JSON.stringify(data) : data);
    }
  }

  close() {
    if (this.isActive()) {
      this.socket.close();
    }
  }

  delayConnect(retry) {
    // eslint-disable-next-line no-console
    console.info('websocket: 稍后重试...');
    setTimeout(() => {
      this.reconnect(retry);
    }, timeout);
  }

  reconnect(retry) {
    if (this.isActive() || this.checkDeprecated()) {
      return;
    }
    const { getSearch = () => null, beforeReconnect = () => true } = this.options || {};
    if (retry) {
      if (!beforeReconnect()) {
        // eslint-disable-next-line no-console
        console.info('websocket: 不满足条件，跳过');
        this.delayConnect(true);
        return;
      }
      // eslint-disable-next-line no-console
      console.info('websocket: 重新连接');
    }
    const search = getSearch();
    this.init(new window.WebSocket(search == null ? this.url : `${this.url}?${search}`));
  }

  checkDeprecated() {
    if (this.isDeprecated) {
      this.close();
      this.socket = null;
      return true;
    }
    return false;
  }
}

export function connectWS(url, options) {
  let wsUrl = url;
  if (wsUrl == null) {
    throw new Error('url can not be null');
  }
  if (isStartsWithProtocol(url)) {
    wsUrl = wsUrl.replace(/^(http|https|ws|wss):\/\//, '');
  } else if (url.startsWith('//')) {
    wsUrl = wsUrl.slice(2);
  } else if (url.startsWith('/')) {
    wsUrl = `${window.location.host}${url}`;
  }
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const socket = new MySocket(`${protocol}//${wsUrl}`, options);
  return {
    MessageTypes: { ...MessageTypes }, // Prevent being modified
    send(...args) {
      socket.send(...args);
    },
    close(...args) {
      socket.close(...args);
    },
    closeAndDeprecate(...args) {
      socket.isDeprecated = true;
      socket.eventHub.clear();
      socket.close(...args);
    },
    addListen(...args) {
      socket.addListen(...args);
    },
    removeListen(...args) {
      socket.removeListen(...args);
    },
  };
}
