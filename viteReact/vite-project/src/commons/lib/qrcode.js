import qr from 'qr.js';
import { isStartsWithProtocol } from './utils';

function draw(ctx, string, size, options) {
  const { originLeft = 0, originTop = 0, color } = options || {};
  const qrcode = qr(string);
  const cells = qrcode.modules;
  const tileW = size / cells.length;
  const tileH = size / cells.length;
  for (let r = 0; r < cells.length; r += 1) {
    const row = cells[r];
    for (let c = 0; c < row.length; c += 1) {
      ctx.fillStyle = row[c] ? color || '#000' : '#fff';
      const w = Math.ceil((c + 1) * tileW) - Math.floor(c * tileW);
      const h = Math.ceil((r + 1) * tileH) - Math.floor(r * tileH);
      ctx.fillRect(Math.round(c * tileW) + originLeft, Math.round(r * tileH) + originTop, w, h);
    }
  }
}

/**
 * 绘制二维码到Canvas上下文
 * @param {*} ctx canvas上下文
 * @param {*} string 字符数据
 * @param {*} size 尺寸
 * @param {*} originLeft 原始位置参考偏移left
 * @param {*} originTop 原始位置参考偏移top
 * @param {*} logoUrl 中间logo图片url
 */
export function drawQrCode(ctx, string, size, options) {
  const { logoUrl } = options || {};
  return new Promise((resolve, reject) => {
    if (!(ctx instanceof window.CanvasRenderingContext2D) || string == null || !Number.isFinite(size) || size <= 0) {
      reject(new Error('参数异常'));
      return;
    }
    const str = string.toString();
    if (str.length === 0) {
      reject(new Error('空数据'));
      return;
    }

    if (isStartsWithProtocol(logoUrl)) {
      const img = new Image();
      // img.setAttribute('crossOrigin', 'anonymous')
      img.crossOrigin = 'anonymous';
      // onload比src先配置
      img.addEventListener('load', function () {
        draw(ctx, string, size, options);
        const imgHeight = this.height;
        const imgWidth = this.width;
        const max = Math.max(imgHeight, imgWidth);
        // 填充尺寸只会出现一个大于0
        const heightFill = max - imgHeight; // 高度填充尺寸
        const widthFill = max - imgWidth; // 宽度填充尺寸

        const logoSize = size * 0.25;

        const zoom = logoSize / max;

        const imgOriginX = (size - logoSize) / 2;
        const imgOriginY = (size - logoSize) / 2;
        const logoBorderSize = 3;

        // 为logo绘制一条边框， 线条粗细是机遇线条内外同时延伸的
        ctx.moveTo(imgOriginX - logoBorderSize / 2, imgOriginY - logoBorderSize / 2);
        ctx.lineTo(imgOriginX + logoSize + logoBorderSize / 2, imgOriginY - logoBorderSize / 2);
        ctx.lineTo(imgOriginX + logoSize + logoBorderSize / 2, imgOriginY + logoSize + logoBorderSize / 2);
        ctx.lineTo(imgOriginX - logoBorderSize / 2, imgOriginY + logoSize + logoBorderSize / 2);
        ctx.lineTo(imgOriginX - logoBorderSize / 2, imgOriginY - logoBorderSize / 2);

        ctx.lineWidth = logoBorderSize;
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.stroke();

        ctx.drawImage(this, -widthFill / 2, -heightFill / 2, max, max, imgOriginX, imgOriginY, logoSize, logoSize);

        const heightFillSize = (heightFill / 2) * zoom;
        const widthFillSize = (widthFill / 2) * zoom;
        // 高度需要填充
        ctx.fillStyle = '#333';
        if (heightFillSize > 0) {
          ctx.fillRect(imgOriginX, imgOriginY, logoSize, heightFillSize + 1); // 微调
          ctx.fillRect(imgOriginX, imgOriginY + logoSize - heightFillSize, logoSize, heightFillSize + 1); // 微调
        }
        // 宽度需要填充
        if (widthFillSize > 0) {
          ctx.fillRect(imgOriginX, imgOriginY, widthFillSize + 1, logoSize); // 微调
          ctx.fillRect(imgOriginX + logoSize - widthFillSize, imgOriginY, widthFillSize + 1, logoSize); // 微调
        }
        resolve();
      });
      img.src = logoUrl;
      return;
    }
    draw(ctx, string, size, options);
    resolve();
  });
}
