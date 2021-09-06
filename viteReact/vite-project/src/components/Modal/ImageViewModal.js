import { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Button, message } from 'antd';
import Modal from '.';
import styles from './img-view.less';

@connect(({ loading }) => ({
  saving: loading.effects['global/updateFileStyle'],
}))
class ImageViewModal extends Component {
  state = {
    deg: 0,
    modalWidth: undefined,

    editMode: false,
  };

  componentDidMount() {
    this.timestamp = Date.now();
    this.imgOriginWidth = {};
    this.updateWidth();
  }

  componentDidUpdate() {
    this.updateWidth();
  }

  updateWidth = () => {
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }
    if (this.imgNode == null) {
      this.updateTimer = setTimeout(this.updateWidth, 100);
      return;
    }
    const { file } = this.props;
    const { url } = file || {};

    let width = this.imgOriginWidth[url];
    if (width == null) {
      const w = Math.max(this.imgNode.offsetWidth, this.imgNode.clientWidth);
      if (w === 0) {
        this.updateTimer = setTimeout(this.updateWidth, 100);
        return;
      }
      width = w + 24 * 2; // 24左右边距
      this.imgOriginWidth[url] = Math.max(width, 240); // 最小
    }
    const { modalWidth } = this.state;
    if (width !== modalWidth) {
      this.setState({
        modalWidth: width,
      });
    }
  };

  rotateDegress = () => {
    const { file } = this.props;
    const { url } = file || {};
    const { deg: stateDeg } = this.state;
    const deg = stateDeg + 90;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.addEventListener('load', async () => {
      const newDeg = deg % 360;
      const quadrant = (deg / 90) % 4; // 旋转象限
      const cutCoor = { sx: 0, sy: 0, ex: 0, ey: 0 }; // 裁剪坐标

      const imgW = image.width; // 图片宽度
      const imgH = image.height; // 图片高度
      const size = imgW > imgH ? imgW : imgH; // canvas初始大小

      canvas.width = size * 2;
      canvas.height = size * 2;
      switch (quadrant) {
        case 0:
          cutCoor.sx = size;
          cutCoor.sy = size;
          cutCoor.ex = size + imgW;
          cutCoor.ey = size + imgH;
          break;
        case 1:
          cutCoor.sx = size - imgH;
          cutCoor.sy = size;
          cutCoor.ex = size;
          cutCoor.ey = size + imgW;
          break;
        case 2:
          cutCoor.sx = size - imgW;
          cutCoor.sy = size - imgH;
          cutCoor.ex = size;
          cutCoor.ey = size;
          break;
        case 3:
          cutCoor.sx = size;
          cutCoor.sy = size - imgW;
          cutCoor.ex = size + imgH;
          cutCoor.ey = size + imgW;
          break;
        default:
      }
      ctx.translate(size, size);
      ctx.rotate((deg * Math.PI) / 180);
      ctx.drawImage(image, 0, 0);
      const imgData = ctx.getImageData(cutCoor.sx, cutCoor.sy, cutCoor.ex, cutCoor.ey);
      if (quadrant % 2 === 0) {
        canvas.width = imgW;
        canvas.height = imgH;
      } else {
        canvas.width = imgH;
        canvas.height = imgW;
      }
      ctx.putImageData(imgData, 0, 0);
      this.imgNode.src = canvas.toDataURL();
      this.setState({
        deg: newDeg,
      });
    });
    // 用另一个链接打开，因为之前的请求不允许跨域了

    // 如果url是跨域的，且在此之前已被非CORS方式加载过，且服务端也未在非CORS请求时响应Vary: Origin头：
    // 则此时会直接使用缓存的响应结果，导致浏览器跨域错误
    // fix：在服务端不做修改的前提下，使用新的url强迫重新以CORS加载，服务端响应需要的Access-Control-Allow-Origin
    image.src = `${url}?t=${this.timestamp}`;
  };

  handleEdit = () => {
    this.setState({
      editMode: true,
    });
  };

  handlePreviewVisibleChange = visible => {
    const { onVisibleChange } = this.props;
    if (onVisibleChange) {
      onVisibleChange(visible);
      this.setState(({ deg }) => ({ deg: visible ? deg : 0, editMode: false }));
    }
  };

  handleSave = arg => {
    const { onOk, file, dispatch } = this.props;
    const { fileKey } = file || {};
    const { deg } = this.state;
    const newDeg = deg % 360;
    if (newDeg === 0) {
      return;
    }
    return dispatch({
      type: 'global/updateFileStyle',
      payload: {
        fileKey,
        rotate: newDeg,
      },
    }).then(result => {
      if (result instanceof Error) {
        throw result;
      }
      this.handlePreviewVisibleChange(false);
      message.success('保存成功');
      if (onOk) {
        onOk(arg, fileKey, result);
      }
    });
  };

  openImgInNewTab = () => {
    const { file } = this.props;
    if (file?.url) {
      if (file.url.startsWith('data:')) {
        const img = new Image();
        img.src = file.url;
        // eslint-disable-next-line unicorn/prefer-add-event-listener
        img.onload = function () {
          const newWin = window.open('', '_blank');
          newWin.document.write(img.outerHTML);
          newWin.document.title = file.fileName;
          newWin.document.close();
        };
        return;
      }
      window.open(file?.url);
    }
  };

  render() {
    const { file, canEdit, saving, onVisibleChange, onOk, ...rest } = this.props;
    const { url, fileName, fileKey, useDefault, alt } = file || {};
    const { modalWidth, editMode } = this.state;

    const footer = [
      <Button key="origin" onClick={this.openImgInNewTab}>
        查看原图
      </Button>,
    ];
    if (editMode) {
      footer.push(
        <Button key="rotate" type="danger" onClick={this.rotateDegress}>
          旋转
        </Button>,
        <Button key="cancel" link="cancel" />,
        <Button key="ok" link="ok" />
      );
    } else if (canEdit && fileKey && !useDefault) {
      footer.push(
        <Button key="edit" onClick={this.handleEdit}>
          编辑
        </Button>
      );
    } else {
      footer.push(
        <Button key="cancel" link="cancel">
          关闭
        </Button>
      );
    }
    return (
      <Modal
        title={alt || fileName || '图片预览'}
        width={modalWidth}
        footer={footer}
        {...rest}
        onOk={this.handleSave}
        onVisibleChange={this.handlePreviewVisibleChange}
      >
        <div className="text-center">
          <img
            alt="previewImage"
            ref={node => {
              this.imgNode = node;
            }}
            src={url}
            className={classNames(styles.img)}
          />
        </div>
      </Modal>
    );
  }
}

export default ImageViewModal;
