import { PureComponent } from 'react';
import { CDN_STATIC_HOST, isStartsWithProtocol } from '@/utils/utils';

const SuffixMapping = {
  ogg: 'audio/ogg',
  mp3: 'audio/mpeg',
};

const Source = ({ src }) => {
  if (src == null) {
    return null;
  }
  const urlStr = src.toLowerCase();
  const lastIndex = urlStr.lastIndexOf('.');
  // 不可能在第一个
  let type;
  if (lastIndex > 0) {
    // eslint-disable-next-line unicorn/prefer-string-slice
    type = urlStr.substring(lastIndex + 1, urlStr.length);
  }
  const useSrc = isStartsWithProtocol(src) || src.startsWith('//') ? src : `${CDN_STATIC_HOST}${src}`;
  return <source src={useSrc} type={SuffixMapping[type]} />;
};

class Audio extends PureComponent {
  play = () =>
    new Promise((resolve, reject) => {
      if (this.audio) {
        let promise;
        try {
          promise = this.audio.play();
        } catch {
          reject(new Error('播放失败'));
          return;
        }
        if (promise) {
          promise.then(resolve).catch(reject);
        }
        return;
      }
      reject(new Error('audio 不可用，无法播放'));
    });

  render() {
    const { children } = this.props;
    return (
      <audio
        className="hidden"
        ref={node => {
          this.audio = node;
        }}
      >
        {children}
        您的浏览器不支持HTML5 Audio音频元素。
      </audio>
    );
  }
}

Audio.Source = Source;

export default Audio;
