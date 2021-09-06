// 封装一些信息反馈交互
import { notification as noti, Modal } from 'antd';

export const notification = {
  error(message, description) {
    noti.error({
      message,
      description,
    });
  },
  warning(message, description) {
    noti.warning({
      message,
      description,
    });
  },
};

export const modal = {
  confirm(content, options = {}) {
    return Modal.confirm({
      title: '请确认',
      content,
      okText: '确定',
      cancelText: '取消',
      ...options,
    });
  },
};
