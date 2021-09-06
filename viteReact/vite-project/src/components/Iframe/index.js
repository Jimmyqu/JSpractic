import { useState } from 'react';

export default function ({ title, src }) {
  const [stateTitle, setStateTitle] = useState(title);
  if (!src) {
    return null;
  }
  return (
    <iframe
      ref={iframeDom => {
        if (iframeDom == null) {
          return;
        }
        // eslint-disable-next-line no-param-reassign, unicorn/prefer-add-event-listener
        iframeDom.onload = () => {
          // 添加样式
          const cssLink = document.createElement('link');
          cssLink.href = '/static/css/iframe.css';
          cssLink.rel = 'stylesheet';
          cssLink.type = 'text/css';
          iframeDom.contentDocument.head.appendChild(cssLink);

          // 设置高度
          if (iframeDom.contentDocument.body.innerHTML.trim()) {
            // eslint-disable-next-line unicorn/prefer-add-event-listener
            cssLink.onload = () => {
              setTimeout(() => {
                const height =
                  iframeDom.contentDocument.documentElement.clientHeight || iframeDom.contentDocument.body.clientHeight;
                iframeDom.setAttribute('height', `${height}px`);
              }, 0);
            };
          } else {
            iframeDom.setAttribute('height', 0);
          }

          // 从iframe取title设置到容器title
          const { title: iframeTitle } = iframeDom.contentDocument;
          if (iframeTitle) {
            setStateTitle(iframeTitle);
          } else {
            // eslint-disable-next-line no-param-reassign
            iframeDom.contentDocument.title = stateTitle;
          }
        };
      }}
      frameBorder={0}
      border={0}
      width="100%"
      title={stateTitle}
      src={src}
    />
  );
}
