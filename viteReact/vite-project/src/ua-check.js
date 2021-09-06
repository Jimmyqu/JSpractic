function domReadyCheck() {
  if (document.querySelector('#root').children.length > 0) {
    // eslint-disable-next-line unicorn/prefer-add-event-listener
    window.onerror = null;
    return;
  }
  setTimeout(domReadyCheck, 1000 * 1);
}

const sourcePathPrefix = '/static/js/main.';

function check() {
  // 本地没引入 UAParser， 只build环境有
  if (window.UAParser == null) {
    return;
  }
  const parser = window.UAParser();

  const {
    browser: { name: bName, major },
    os: { name: oName, version },
  } = parser;

  const url = `/browser-upgrade-tips.html?t=${Date.now()}`;
  if (
    // IE
    bName === 'IE' ||
    bName === 'IEMobile' ||
    // Chrome
    (bName === 'Chrome' && major < 65) ||
    // Firefox
    (bName === 'Firefox' && major < 60) ||
    // Android & Android Browser
    (oName === 'Android' && version.split('.')[0] < 8 && bName === 'Android Browser' && major < 8) ||
    // iOS
    (bName === 'Mobile Safari' && major < 12) ||
    // Safari
    (bName === 'Safari' && major < 12)
  ) {
    window.location.href = url;
    return;
  }
  // 使用 onerror 而不使用 addEventListener 是为了方便可能需要被覆盖掉
  // eslint-disable-next-line unicorn/prefer-add-event-listener
  window.onerror = function (message, source, lineno, colno, error) {
    const e = error || new window.SyntaxError(message);
    if (
      e instanceof window.SyntaxError &&
      (source.indexOf(`${window.location.protocol}//${window.location.host}${sourcePathPrefix}`) === 0 ||
        source.indexOf(sourcePathPrefix) === 0)
    ) {
      window.location.href = `${url}&q=${encodeURIComponent(message)}`;
    }
  };
  domReadyCheck();
}

check();
