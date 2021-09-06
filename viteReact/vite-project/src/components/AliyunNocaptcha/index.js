import { message } from 'antd';
import { Component } from 'react';
import { asyncInjectScript, uuid } from '@/utils/utils';
import './index.less';

const appkey = 'FFFF0N0N0000000037B5';
const scene = 'nc_login';

export default class Aliyun extends Component {
  domId = uuid();

  componentDidMount() {
    this.init();
  }

  init = () => {
    const { onSuccess } = this.props;
    asyncInjectScript('https://g.alicdn.com/AWSC/AWSC/awsc.js', 'AWSC').then(AWSC => {
      // 实例化nc
      AWSC.use('nc', (state, module) => {
        // 初始化
        this.nc = module.init({
          // 应用类型标识。它和使用场景标识（scene字段）一起决定了滑动验证的业务场景与后端对应使用的策略模型。您可以在人机验证控制台的配置管理页签找到对应的appkey字段值，请务必正确填写。
          appkey,
          // 使用场景标识。它和应用类型标识（appkey字段）一起决定了滑动验证的业务场景与后端对应使用的策略模型。您可以在人机验证控制台的配置管理页签找到对应的scene值，请务必正确填写。
          scene,
          // 声明滑动验证需要渲染的目标ID。
          renderTo: this.domId,
          // 前端滑动验证通过时会触发该回调参数。您可以在该回调参数中将会话ID（sessionId）、签名串（sig）、请求唯一标识（token）字段记录下来，随业务请求一同发送至您的服务端调用验签。
          success: data => {
            this.nc.reset();
            onSuccess?.({
              scene,
              ...data,
            });
          },
          // 滑动验证失败时触发该回调参数。
          fail(failCode) {
            message.error(`fail: ${failCode}`);
          },
          // 验证码加载出现异常时触发该回调参数。
          error(errorCode) {
            message.error(`error: ${errorCode}`);
          },
        });
      });
    });
  };

  render() {
    return <div id={this.domId} />;
  }
}
