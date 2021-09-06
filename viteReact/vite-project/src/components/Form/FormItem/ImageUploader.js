import { forwardRef, useState } from 'react';
import { Icon, Upload } from 'antd';
import ImageViewModal from '@/components/Modal/ImageViewModal';
import { FileAccept, fileTransfer } from '@/utils/upload';

export default forwardRef(({ placeholder, disabled, ...props }, ref) => {
  const [previewFile, setPreviewFile] = useState();
  return (
    <span>
      <Upload
        {...props}
        fileList={fileTransfer(props.fileList)}
        disabled={disabled}
        listType="picture-card"
        accept={FileAccept.IMG}
        showUploadList={{
          showPreviewIcon: true,
          showRemoveIcon: !disabled,
        }}
        onPreview={({ url, thumbUrl, response: { fileKey }, name, originFileObj }) => {
          if (originFileObj) {
            const reader = new FileReader();
            reader.addEventListener('load', async e => {
              const { result } = e.target || e.srcElement;
              setPreviewFile({
                url: result,
                fileName: name,
                fileKey,
              });
            });
            reader.readAsDataURL(originFileObj); // 将binary转换成base64
            return;
          }
          setPreviewFile({
            url: url || thumbUrl,
            fileName: name,
            fileKey,
          });
        }}
        ref={ref}
      >
        {!disabled && (
          <div>
            <Icon type="plus" theme="outlined" style={{ fontSize: 32 }} />
            <div className="ant-upload-text">上传</div>
          </div>
        )}
      </Upload>
      {!disabled && (
        <span>
          {placeholder}
          &nbsp; 上传图片格式为：jpg, png, gif
        </span>
      )}
      <ImageViewModal
        file={previewFile}
        visible={previewFile != null}
        onVisibleChange={visible => {
          if (visible) {
            return;
          }
          setPreviewFile(null);
        }}
        // 暂时屏蔽
        canEdit={false}
        // onOk={this.handleImageEdit}
      />
    </span>
  );
});
