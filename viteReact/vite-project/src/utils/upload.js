import { uploadImgFile, uploadDocFile, uploadAudioFile, uploadPdfToPng } from '@/services/api';

export * from '@/commons/lib/upload';

export function fileMapper({ fileKey, fileName, url }) {
  const atIdx = url ? url.lastIndexOf('@') : -1;
  return {
    uid: fileKey, // ui组件需要
    name: fileName || fileKey,
    status: 'done',
    response: { fileKey }, // 方便统一获取默认已有数据和新上传数据的fileKey
    url: atIdx > 0 ? url.slice(0, Math.max(0, atIdx)) : url,
  };
}

// 服务器数据填充到组件
export function fileTransfer(list) {
  if (Array.isArray(list)) {
    const arr = list.filter(Boolean);
    if (arr.some(item => item?.fileKey)) {
      return list.map(fileMapper);
    }
    return arr;
  }
  return list;
}

// 组件填充到服务器fileKey
export function formFileMapper(value) {
  if (value == null) {
    return null;
  }
  if (Array.isArray(value)) {
    return value.map(item => (item.response ? item.response.fileKey : null));
  }
  if (value.response) {
    return value.response.fileKey;
  }
  return null;
}

const then = (data, { onSuccess, file }) => {
  onSuccess(data, file);
};

const error = (e, { onError }) => {
  onError(e);
};

export const formUploadOtherProps = {
  valuePropName: 'fileList',
  getValueFromEvent: e => {
    if (!e || !e.fileList) {
      return e;
    }
    const { fileList } = e;
    return fileList;
  },
};

const genCustomRequest = (type, { params, dispatch } = {}) => {
  if (type == null) {
    return null;
  }
  const { effect, req } = type;
  return obj => {
    const { file } = obj;
    const payload = { file, ...params };
    if (dispatch) {
      dispatch({
        type: effect,
        payload,
      })
        .then(data => {
          then(data, obj);
        })
        .catch(e => {
          error(e, obj);
        });
      return;
    }
    req(payload)
      .then(data => then(data, obj))
      .catch(e => error(e, obj));
  };
};

export function genUploadImgCustomRequest(p) {
  return genCustomRequest({ effect: 'global/uploadImgFile', uploadImgFile }, p);
}

export function genUploadDocCustomRequest(p) {
  return genCustomRequest({ effect: 'global/uploadDocFile', uploadDocFile }, p);
}

export function genUploadAudioCustomRequest(p) {
  return genCustomRequest({ effect: 'global/uploadAudioFile', uploadAudioFile }, p);
}

export function genUploadPdfToPngCustomRequest(p) {
  return genCustomRequest({ effect: 'global/uploadPdfToPng', uploadPdfToPng }, p);
}
