import { CDN_IMG_HOST } from '@/utils/utils';
import Block from '../Block';
import styles from './index.less';

export default () => {
  return (
    <Block title="请在微信公众号中的登录后使用">
      <div className={styles.wxQrCode}>
        <div>该功能需在微信中运行，请关注该微信公众号后，点击右下角“管理登录”！</div>
        <img className="img-max" src={`${CDN_IMG_HOST}/srvInfo/ydmap-wx.jpg`} alt="ydmap qrcode img" />
      </div>
    </Block>
  );
};
